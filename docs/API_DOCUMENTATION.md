# 📡 AGENT CAPITAL — Backend API Documentation

> Complete reference for all REST API endpoints and WebSocket events.
> **Base URL**: `http://localhost:5000` (local) or your deployed backend URL.

---

## 🔑 Authentication

Currently the API is open for development/demo purposes. In production, add:
- API key in `Authorization: Bearer <key>` header
- Rate limiting per IP (100 req/min)

---

## 📊 Core Endpoints

### Health Check

```
GET /api/health
```

**Response** `200 OK`:
```json
{
  "status": "healthy",
  "timestamp": "2026-05-08T12:00:00.000Z",
  "uptime": 3600,
  "version": "1.0.0",
  "services": {
    "agents": "running",
    "storage": "connected",
    "compute": "connected"
  }
}
```

---

## 🤖 Deliberation

### Start a Deliberation

```
POST /api/deliberate
Content-Type: application/json

{
  "prompt": "ETH dropped 15%, USDC yield at 8%, update portfolio",
  "mode": "simulation"   // or "execution"
}
```

**Response** `200 OK`:
```json
{
  "session_id": "sess_abc123",
  "status": "processing",
  "created_at": "2026-05-08T12:00:00.000Z"
}
```

**Real-time updates** are delivered via WebSocket (see WebSocket section below).

### Get Session Details

```
GET /api/session/:id
```

**Response** `200 OK`:
```json
{
  "session_id": "sess_abc123",
  "status": "complete",
  "prompt": "ETH dropped 15%...",
  "plan": {
    "goal": "Rebalance portfolio...",
    "steps": [...],
    "feasibility_score": 87,
    "estimated_total_cost": 380,
    "timeline": "2 hours 15 minutes"
  },
  "evidence": {
    "claims_analyzed": 8,
    "claims_verified": 7,
    "confidence_overall": 0.89,
    "evidence": [...]
  },
  "verdict": {
    "feasibility": 88,
    "safety": 92,
    "legality": 95,
    "cost_efficiency": 82,
    "overall_score": 89.4,
    "decision": "APPROVE",
    "feedback": "..."
  },
  "verification": {
    "verified": true,
    "confidence": 91,
    "proof": "0x7a3f8b2c...",
    "teeVerified": true,
    "verificationSource": "0g-compute"
  },
  "execution": {
    "tx_hash": "0x4a2b7c8d...",
    "status": "simulated",
    "gas_used": 187432,
    "cost_usd": 0.42
  },
  "created_at": "2026-05-08T12:00:00.000Z",
  "completed_at": "2026-05-08T12:00:11.000Z"
}
```

### List All Sessions

```
GET /api/sessions
```

**Response** `200 OK`:
```json
{
  "sessions": [
    {
      "session_id": "sess_abc123",
      "prompt": "ETH dropped 15%...",
      "status": "complete",
      "decision": "APPROVE",
      "score": 89.4,
      "created_at": "2026-05-08T12:00:00.000Z"
    }
  ],
  "total": 47
}
```

---

## 🧬 Agents & System

### Get Agent Performance

```
GET /api/agents
```

**Response** `200 OK`:
```json
{
  "agents": [
    {
      "name": "planner",
      "status": "running",
      "executions": 47,
      "successes": 42,
      "success_rate": 0.894
    },
    {
      "name": "researcher",
      "status": "running",
      "executions": 47,
      "successes": 39,
      "success_rate": 0.830
    },
    {
      "name": "critic",
      "status": "running",
      "executions": 47,
      "successes": 44,
      "success_rate": 0.936
    },
    {
      "name": "executor",
      "status": "running",
      "executions": 47,
      "successes": 41,
      "success_rate": 0.872
    }
  ]
}
```

### Get System Statistics

```
GET /api/stats
```

**Response** `200 OK`:
```json
{
  "total_executions": 188,
  "total_successes": 167,
  "overall_success_rate": 0.888,
  "active_sessions": 3,
  "connected_clients": 12,
  "timestamp": "2026-05-08T12:00:00.000Z"
}
```

---

## 🎨 Gallery & Breeding

### Get All Gallery Agents

```
GET /api/gallery/agents
```

**Response** `200 OK`:
```json
{
  "agents": [
    {
      "tokenId": 1001,
      "sessionId": "sess_001",
      "generation": 0,
      "score": 87,
      "traits": {
        "reasoning": 88,
        "creativity": 72,
        "caution": 85,
        "speed": 79,
        "accuracy": 92,
        "adaptability": 76
      },
      "parents": [0, 0],
      "heritage": [],
      "decision": "APPROVE",
      "createdAt": "2026-05-05T12:00:00.000Z"
    }
  ]
}
```

### Breed Two Agents

```
POST /api/breeding/breed
Content-Type: application/json

{
  "parent1_id": 1001,
  "parent2_id": 1002
}
```

**Response** `200 OK`:
```json
{
  "success": true,
  "offspring": {
    "tokenId": 2001,
    "generation": 1,
    "score": 85,
    "traits": {
      "reasoning": 85,
      "creativity": 81,
      "caution": 77,
      "speed": 82,
      "accuracy": 85,
      "adaptability": 82
    },
    "parents": [1001, 1002]
  }
}
```

### Preview Offspring Traits

```
GET /api/breeding/predict/:parent1Id/:parent2Id
```

### Get Breeding History

```
GET /api/breeding/history
```

---

## ⚔️ Arena

### Run Tournament

```
POST /api/arena/tournament
Content-Type: application/json

{
  "participants": [1001, 1002, 1003, 1004],
  "rounds": 3
}
```

### Custom Tournament

```
POST /api/arena/custom-tournament
Content-Type: application/json

{
  "prompt": "Optimize a DeFi yield strategy",
  "participants": [1001, 1002, 1003, 1004]
}
```

### Get Leaderboard

```
GET /api/arena/leaderboard
```

### Get Arena History

```
GET /api/arena/history
```

### Get Arena Stats

```
GET /api/arena/stats
```

---

## 🌐 Cross-Chain

### Get Bridge Status

```
GET /api/cross-chain/status
```

### Get Supported Chains

```
GET /api/cross-chain/chains
```

**Response** `200 OK`:
```json
{
  "chains": [
    { "id": 1, "name": "Ethereum", "agents": 4, "status": "active" },
    { "id": 137, "name": "Polygon", "agents": 4, "status": "active" },
    { "id": 16602, "name": "0G Chain", "agents": 4, "status": "active" }
  ]
}
```

### Send Cross-Chain Message

```
POST /api/cross-chain/send
Content-Type: application/json

{
  "source_chain": 1,
  "dest_chain": 16602,
  "agent_id": 1001,
  "action": "score_sync",
  "data": { "score": 87.3 }
}
```

### Get Global Leaderboard

```
GET /api/cross-chain/leaderboard
```

---

## 🧠 Proof-of-Intelligence

### Run PoI Consensus Round

```
POST /api/poi/run
Content-Type: application/json

{
  "prompt": "Should we increase the staking reward rate?",
  "agents": [1001, 1002, 1003, 1004]
}
```

### Get PoI History

```
GET /api/poi/history
```

### Get PoI Stats

```
GET /api/poi/stats
```

---

## 💾 0G Storage

### Read from KV Store

```
GET /api/0g/kv/:key
```

### Write to KV Store

```
POST /api/0g/kv/:key
Content-Type: application/json

{
  "value": { "portfolio": {...} }
}
```

### Read from Log Store

```
GET /api/0g/log/:name
```

### Append to Log Store

```
POST /api/0g/log/:name
Content-Type: application/json

{
  "entry": {
    "type": "trade_executed",
    "agentId": 1001,
    "profit": 2500,
    "timestamp": "2026-05-08T12:00:00.000Z"
  }
}
```

---

## 🔌 WebSocket Events

Connect to `ws://localhost:5000` (or your backend URL).

### Events Emitted by Server

| Event | Payload | Description |
|-------|---------|-------------|
| `connection` | `{ status, timestamp }` | Connection established |
| `agent_started` | `{ agent, event, timestamp }` | Agent begins processing |
| `agent_update` | `{ agent, event, data }` | Agent completes with result |
| `deliberation_complete` | `{ session_id, result }` | Full pipeline complete |
| `deliberation_error` | `{ error }` | Pipeline error |

### Example WebSocket Flow

```javascript
const ws = new WebSocket('ws://localhost:5000')

ws.onmessage = (event) => {
  const msg = JSON.parse(event.data)
  
  switch (msg.type) {
    case 'agent_started':
      console.log(`${msg.agent} started processing`)
      break
    case 'agent_update':
      console.log(`${msg.agent} complete:`, msg.data)
      break
    case 'deliberation_complete':
      console.log('Full result:', msg.result)
      break
  }
}
```

---

## ⚠️ Error Responses

All errors follow this format:
```json
{
  "error": "Human-readable error message",
  "code": "ERROR_CODE",
  "status": 400
}
```

| Status | Meaning |
|--------|---------|
| 400 | Bad Request — Invalid parameters |
| 404 | Not Found — Resource doesn't exist |
| 429 | Rate Limited — Too many requests |
| 500 | Internal Error — Server-side failure |

---

<div align="center">

**AGENT CAPITAL** — API v1.0  
Powered by [0G Network](https://0g.ai) · Built with Express.js + WebSocket

</div>
