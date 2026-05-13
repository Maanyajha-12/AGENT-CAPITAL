/**
 * frontend/src/services/web3-investment.ts
 * 
 * Real Web3 Investment Flow
 * Connects to user's wallet and sends actual transactions to AgentCapital.sol on 0G Galileo
 */

import { ethers, BrowserProvider, Contract } from 'ethers'

// Declare window.ethereum for TypeScript
declare global {
    interface Window {
        ethereum?: any;
    }
}

// ============================================================================
// Configuration
// ============================================================================

const CHAIN_ID = 16602  // 0G Galileo Testnet
const RPC_URL = 'https://evmrpc-testnet.0g.ai'

// Contract addresses (set these after deployment)
const AGENT_CAPITAL_ADDRESS = process.env.REACT_APP_AGENT_CAPITAL_ADDRESS ||
    '0x0000000000000000000000000000000000000000'

// Minimal ABI for AgentCapital.sol investment function
const AGENT_CAPITAL_ABI = [
    {
        "type": "function",
        "name": "investInAgent",
        "inputs": [
            { "name": "agentId", "type": "uint256" },
            { "name": "amount", "type": "uint256" }
        ],
        "outputs": [{ "name": "", "type": "bool" }],
        "stateMutability": "payable"
    },
    {
        "type": "function",
        "name": "getUserInvestment",
        "inputs": [
            { "name": "user", "type": "address" },
            { "name": "agentId", "type": "uint256" }
        ],
        "outputs": [{ "name": "", "type": "uint256" }],
        "stateMutability": "view"
    },
    {
        "type": "event",
        "name": "InvestmentReceived",
        "inputs": [
            { "name": "investor", "type": "address", "indexed": true },
            { "name": "agentId", "type": "uint256", "indexed": true },
            { "name": "amount", "type": "uint256", "indexed": false }
        ]
    }
]

// ============================================================================
// Types
// ============================================================================

export interface InvestmentResult {
    success: boolean
    txHash?: string
    amount?: string
    agentId?: number
    userAddress?: string
    blockNumber?: number
    error?: string
    explorerUrl?: string
}

export interface InvestmentStatus {
    isInvesting: boolean
    txHash?: string
    status: 'idle' | 'pending' | 'confirmed' | 'failed'
}

// ============================================================================
// Web3 Connection
// ============================================================================

/**
 * Get the user's browser provider (MetaMask, WalletConnect, etc)
 */
export async function getBrowserProvider(): Promise<BrowserProvider | null> {
    if (typeof window === 'undefined') return null
    if (!window.ethereum) {
        console.warn('[Web3] No web3 provider found. Install MetaMask.')
        return null
    }
    return new BrowserProvider(window.ethereum)
}

/**
 * Connect to user's wallet
 */
export async function connectWallet(): Promise<string | null> {
    try {
        const provider = await getBrowserProvider()
        if (!provider) return null

        const accounts = await window.ethereum!.request({
            method: 'eth_requestAccounts',
        })

        if (!accounts || accounts.length === 0) {
            console.warn('[Web3] No accounts returned')
            return null
        }

        return accounts[0]
    } catch (error) {
        console.error('[Web3] Connect wallet failed:', error)
        return null
    }
}

/**
 * Get the currently connected account
 */
export async function getConnectedAccount(): Promise<string | null> {
    try {
        const provider = await getBrowserProvider()
        if (!provider) return null

        const accounts = await provider.listAccounts()
        return accounts.length > 0 ? accounts[0].address : null
    } catch (error) {
        console.error('[Web3] Get account failed:', error)
        return null
    }
}

/**
 * Check if network is 0G Galileo testnet
 */
export async function isCorrectNetwork(): Promise<boolean> {
    try {
        const provider = await getBrowserProvider()
        if (!provider) return false

        const network = await provider.getNetwork()
        return Number(network.chainId) === CHAIN_ID
    } catch (error) {
        console.error('[Web3] Network check failed:', error)
        return false
    }
}

/**
 * Switch to 0G Galileo testnet
 */
export async function switchToOGNetwork(): Promise<boolean> {
    try {
        await window.ethereum!.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: `0x${CHAIN_ID.toString(16)}` }],
        })
        return true
    } catch (error: any) {
        if (error.code === 4902) {
            // Chain not added, try to add it
            try {
                await window.ethereum!.request({
                    method: 'wallet_addEthereumChain',
                    params: [
                        {
                            chainId: `0x${CHAIN_ID.toString(16)}`,
                            chainName: '0G Galileo Testnet',
                            rpcUrls: [RPC_URL],
                            nativeCurrency: {
                                name: '0G',
                                symbol: '0G',
                                decimals: 18,
                            },
                            blockExplorerUrls: ['https://chainscan-galileo.0g.ai'],
                        },
                    ],
                })
                return true
            } catch (addError) {
                console.error('[Web3] Add network failed:', addError)
                return false
            }
        }
        console.error('[Web3] Switch network failed:', error)
        return false
    }
}

// ============================================================================
// Investment
// ============================================================================

/**
 * Invest in an agent on AgentCapital contract
 * This is a REAL transaction that sends actual 0G tokens
 */
export async function investInAgent(
    agentId: number,
    amountInOG: number
): Promise<InvestmentResult> {
    try {
        // Step 1: Validate inputs
        if (agentId <= 0) {
            return { success: false, error: 'Invalid agent ID' }
        }
        if (amountInOG <= 0) {
            return { success: false, error: 'Invalid investment amount' }
        }

        // Step 2: Check network
        const isCorrect = await isCorrectNetwork()
        if (!isCorrect) {
            const switched = await switchToOGNetwork()
            if (!switched) {
                return { success: false, error: 'Please switch to 0G Galileo testnet' }
            }
        }

        // Step 3: Get provider and signer
        const provider = await getBrowserProvider()
        if (!provider) {
            return { success: false, error: 'Web3 provider not detected. Install MetaMask.' }
        }

        const signer = await provider.getSigner()
        const userAddress = await signer.getAddress()

        // Step 4: Create contract instance
        if (AGENT_CAPITAL_ADDRESS === '0x0000000000000000000000000000000000000000') {
            return {
                success: false,
                error: 'AgentCapital contract not configured. Please set REACT_APP_AGENT_CAPITAL_ADDRESS',
            }
        }

        const contract = new Contract(AGENT_CAPITAL_ADDRESS, AGENT_CAPITAL_ABI, signer)

        // Step 5: Prepare transaction
        const amountInWei = ethers.parseEther(amountInOG.toString())

        console.log(`[Web3] Investing ${amountInOG} 0G in agent #${agentId}`)
        console.log(`[Web3] Amount in wei: ${amountInWei}`)
        console.log(`[Web3] User: ${userAddress}`)

        // Step 6: Send transaction
        // IMPORTANT: This is a REAL transaction that requires user signature
        const tx = await contract.investInAgent(agentId, amountInWei, {
            value: amountInWei, // Send the 0G tokens
        })

        console.log(`[Web3] Transaction sent: ${tx.hash}`)

        // Step 7: Wait for confirmation
        const receipt = await tx.wait(1) // Wait 1 block confirmation

        console.log(`[Web3] Transaction confirmed in block ${receipt?.blockNumber}`)

        // Step 8: Return success
        return {
            success: true,
            txHash: tx.hash,
            amount: amountInOG.toString(),
            agentId,
            userAddress,
            blockNumber: receipt?.blockNumber,
            explorerUrl: `https://chainscan-galileo.0g.ai/tx/${tx.hash}`,
        }
    } catch (error: any) {
        console.error('[Web3] Investment failed:', error)

        // Handle specific error types
        if (error.code === 'INSUFFICIENT_FUNDS') {
            return {
                success: false,
                error: 'Insufficient 0G balance. Please get testnet 0G from faucet.',
            }
        }

        if (error.code === 'ACTION_REJECTED') {
            return {
                success: false,
                error: 'Transaction rejected by user',
            }
        }

        if (error.message?.includes('CALL_EXCEPTION')) {
            return {
                success: false,
                error: 'Contract call failed. Check contract address and ABI.',
            }
        }

        return {
            success: false,
            error: error.message || 'Investment failed. Please try again.',
        }
    }
}

/**
 * Get user's investment in an agent
 */
export async function getUserInvestment(
    userAddress: string,
    agentId: number
): Promise<string | null> {
    try {
        const provider = new BrowserProvider(window.ethereum!)
        const contract = new Contract(AGENT_CAPITAL_ADDRESS, AGENT_CAPITAL_ABI, provider)

        const amount = await contract.getUserInvestment(userAddress, agentId)
        return ethers.formatEther(amount)
    } catch (error) {
        console.error('[Web3] Get investment failed:', error)
        return null
    }
}

/**
 * Get wallet balance
 */
export async function getWalletBalance(address?: string): Promise<string | null> {
    try {
        const provider = new BrowserProvider(window.ethereum!)
        const signer = await provider.getSigner()
        const account = address || (await signer.getAddress())

        const balance = await provider.getBalance(account)
        return ethers.formatEther(balance)
    } catch (error) {
        console.error('[Web3] Get balance failed:', error)
        return null
    }
}

/**
 * Get explorer URL for a transaction
 */
export function getExplorerUrl(txHash: string): string {
    return `https://chainscan-galileo.0g.ai/tx/${txHash}`
}

// ============================================================================
// Demo mode (fallback if Web3 not available)
// ============================================================================

/**
 * When Web3 is not available, simulate for demo
 */
export function getDemoInvestmentSimulation(agentId: number, amountInOG: number): InvestmentResult {
    const fakeTxHash = `0x${Array(64)
        .fill(0)
        .map(() => Math.floor(Math.random() * 16).toString(16))
        .join('')}`

    return {
        success: true,
        txHash: fakeTxHash,
        amount: amountInOG.toString(),
        agentId,
        userAddress: '0x7a3f8B9d2c1E4F5a6D7e8F9a0B1c2D3e4F5a6D7e',
        blockNumber: Math.floor(Math.random() * 1000000) + 1800000,
        explorerUrl: `https://chainscan-galileo.0g.ai/tx/${fakeTxHash}`,
    }
}
