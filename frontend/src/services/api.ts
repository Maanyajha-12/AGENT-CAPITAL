// API Service Layer — Agent Capital Frontend ↔ Backend Integration

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const WS_URL   = import.meta.env.VITE_WS_URL  || 'ws://localhost:3001';

// ── HTTP helper ─────────────────────────────────────────────────────────────
async function request<T>(path: string, opts?: RequestInit): Promise<T> {
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      headers: { 'Content-Type': 'application/json', ...opts?.headers },
      ...opts,
    });
    if (!res.ok) throw new Error(`API ${res.status}: ${res.statusText}`);
    return res.json();
  } catch (err) {
    console.warn(`[API] ${path} failed — using demo data`);
    throw err;
  }
}

// ── Agent endpoints ──────────────────────────────────────────────────────────
export const AgentsAPI = {
  list: ()               => request<any[]>('/api/agents'),
  get:  (id: string)     => request<any>(`/api/agents/${id}`),
  leaderboard: (sort = 'apy') => request<any[]>(`/api/leaderboard?sort=${sort}`),
  strategies: ()         => request<any[]>('/api/strategies'),
};

// ── Portfolio endpoints ──────────────────────────────────────────────────────
export const PortfolioAPI = {
  get:    (wallet: string) => request<any>(`/api/portfolio/${wallet}`),
  invest: (agentId: string, amount: number, wallet: string) =>
    request<any>('/api/portfolio/invest', {
      method: 'POST',
      body: JSON.stringify({ agentId, amount, wallet }),
    }),
  withdraw: (agentId: string, amount: number, wallet: string) =>
    request<any>('/api/portfolio/withdraw', {
      method: 'POST',
      body: JSON.stringify({ agentId, amount, wallet }),
    }),
};

// ── Breeding endpoints ───────────────────────────────────────────────────────
export const BreedingAPI = {
  breed: (parent1Id: string, parent2Id: string, wallet: string) =>
    request<any>('/api/breed', {
      method: 'POST',
      body: JSON.stringify({ parent1Id, parent2Id, wallet }),
    }),
  history: (wallet: string) => request<any[]>(`/api/breed/history/${wallet}`),
};

// ── Proof verification ───────────────────────────────────────────────────────
export const ProofAPI = {
  verify: (hash: string)    => request<any>(`/api/proofs/${hash}`),
  list:   (agentId: string) => request<any[]>(`/api/proofs/agent/${agentId}`),
};

// ── Analytics ────────────────────────────────────────────────────────────────
export const AnalyticsAPI = {
  platform: () => request<any>('/api/analytics/platform'),
  tvl:      () => request<any[]>('/api/analytics/tvl'),
  revenue:  () => request<any[]>('/api/analytics/revenue'),
};

// ── WebSocket live feed ──────────────────────────────────────────────────────
export class LiveFeedSocket {
  private ws: WebSocket | null = null;
  private listeners: Map<string, Set<(data: any) => void>> = new Map();
  private reconnectDelay = 1000;
  private shouldReconnect = true;

  connect() {
    try {
      this.ws = new WebSocket(`${WS_URL}/ws`);

      this.ws.onopen = () => {
        console.log('[WS] Connected to live feed');
        this.reconnectDelay = 1000;
        this.emit('connected', {});
      };

      this.ws.onmessage = (event) => {
        try {
          const { type, payload } = JSON.parse(event.data);
          this.emit(type, payload);
          this.emit('*', { type, payload });
        } catch {}
      };

      this.ws.onclose = () => {
        console.log('[WS] Disconnected');
        this.emit('disconnected', {});
        if (this.shouldReconnect) {
          setTimeout(() => this.connect(), this.reconnectDelay);
          this.reconnectDelay = Math.min(this.reconnectDelay * 2, 30000);
        }
      };

      this.ws.onerror = () => {
        console.warn('[WS] Connection failed — operating in demo mode');
        this.emit('error', { demo: true });
      };
    } catch {
      console.warn('[WS] WebSocket unavailable — demo mode');
    }
  }

  on(event: string, cb: (data: any) => void): () => void {
    if (!this.listeners.has(event)) this.listeners.set(event, new Set());
    this.listeners.get(event)!.add(cb);
    return () => this.listeners.get(event)?.delete(cb);
  }

  private emit(event: string, data: any) {
    this.listeners.get(event)?.forEach(cb => cb(data));
  }

  disconnect() {
    this.shouldReconnect = false;
    this.ws?.close();
  }
}

export const liveFeed = new LiveFeedSocket();

// ── React hook: use API with fallback demo data ──────────────────────────────
import { useState, useEffect } from 'react';

export function useAPI<T>(fetcher: () => Promise<T>, fallback: T, deps: any[] = []) {
  const [data, setData]       = useState<T>(fallback);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetcher()
      .then(d => { setData(d); setError(null); })
      .catch(e => { setError(e.message); /* fallback stays */ })
      .finally(() => setLoading(false));
  }, deps);

  return { data, loading, error };
}

// ── Wallet helpers ───────────────────────────────────────────────────────────
export function truncateAddress(addr: string) {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export async function connectMetaMask(): Promise<string | null> {
  if (typeof window === 'undefined' || !(window as any).ethereum) {
    console.warn('MetaMask not installed');
    return null;
  }
  try {
    const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
    return accounts[0] || null;
  } catch {
    return null;
  }
}

export async function switchTo0GChain() {
  if (!(window as any).ethereum) return;
  try {
    await (window as any).ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [{
        chainId: '0x40D8',          // 16600
        chainName: '0G Galileo Testnet',
        nativeCurrency: { name: '0G', symbol: 'OG', decimals: 18 },
        rpcUrls: ['https://evmrpc-testnet.0g.ai'],
        blockExplorerUrls: ['https://chainscan-galileo.0g.ai'],
      }],
    });
  } catch {}
}
