import { useEffect, useRef } from 'react'

interface Node {
  x: number; y: number; vx: number; vy: number
  r: number; color: string; pulse: number; pulseSpeed: number
}
interface Packet {
  fromNode: number; toNode: number
  t: number; speed: number; color: string
}

const COLORS = ['#4f8fff', '#8b5cf6', '#00d4ff', '#00e5a0', '#6366f1']

export default function NeuralBackground({ nodeCount = 40 }: { nodeCount?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    let animId: number

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Init nodes
    const nodes: Node[] = Array.from({ length: nodeCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 2.5 + 1.5,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: 0.015 + Math.random() * 0.025,
    }))

    // Active data packets on edges
    const packets: Packet[] = []
    const spawnPacket = () => {
      const from = Math.floor(Math.random() * nodes.length)
      let to = Math.floor(Math.random() * nodes.length)
      while (to === from) to = Math.floor(Math.random() * nodes.length)
      const dx = nodes[to].x - nodes[from].x
      const dy = nodes[to].y - nodes[from].y
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist < 280) {
        packets.push({ fromNode: from, toNode: to, t: 0, speed: 0.004 + Math.random() * 0.006, color: COLORS[Math.floor(Math.random() * COLORS.length)] })
      }
    }
    let packetTimer = 0

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Move nodes
      nodes.forEach(n => {
        n.x += n.vx; n.y += n.vy
        n.pulse += n.pulseSpeed
        if (n.x < 0 || n.x > canvas.width) n.vx *= -1
        if (n.y < 0 || n.y > canvas.height) n.vy *= -1
      })

      // Draw edges
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[j].x - nodes[i].x
          const dy = nodes[j].y - nodes[i].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 200) {
            const alpha = (1 - dist / 200) * 0.18
            ctx.beginPath()
            ctx.moveTo(nodes[i].x, nodes[i].y)
            ctx.lineTo(nodes[j].x, nodes[j].y)
            ctx.strokeStyle = `rgba(79, 143, 255, ${alpha})`
            ctx.lineWidth = 0.8
            ctx.stroke()
          }
        }
      }

      // Draw data packets
      packetTimer++
      if (packetTimer % 18 === 0) spawnPacket()

      for (let p = packets.length - 1; p >= 0; p--) {
        const pkt = packets[p]
        pkt.t += pkt.speed
        if (pkt.t >= 1) { packets.splice(p, 1); continue }
        const from = nodes[pkt.fromNode]; const to = nodes[pkt.toNode]
        const px = from.x + (to.x - from.x) * pkt.t
        const py = from.y + (to.y - from.y) * pkt.t
        // glow
        const grad = ctx.createRadialGradient(px, py, 0, px, py, 5)
        grad.addColorStop(0, pkt.color)
        grad.addColorStop(1, 'transparent')
        ctx.beginPath()
        ctx.arc(px, py, 5, 0, Math.PI * 2)
        ctx.fillStyle = grad
        ctx.globalAlpha = 0.7 * Math.sin(pkt.t * Math.PI)
        ctx.fill()
        ctx.globalAlpha = 1
      }

      // Draw nodes
      nodes.forEach(n => {
        const pr = n.r + Math.sin(n.pulse) * 1.2
        // outer glow
        const grd = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, pr * 5)
        grd.addColorStop(0, n.color + '55')
        grd.addColorStop(1, 'transparent')
        ctx.beginPath()
        ctx.arc(n.x, n.y, pr * 5, 0, Math.PI * 2)
        ctx.fillStyle = grd
        ctx.fill()
        // core
        ctx.beginPath()
        ctx.arc(n.x, n.y, pr, 0, Math.PI * 2)
        ctx.fillStyle = n.color
        ctx.globalAlpha = 0.85 + Math.sin(n.pulse) * 0.15
        ctx.fill()
        ctx.globalAlpha = 1
      })

      animId = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [nodeCount])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0, opacity: 0.55 }}
    />
  )
}
