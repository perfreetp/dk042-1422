import type { FencePoint } from '@/types'

interface FenceMapProps {
  fencePoints: FencePoint[]
  busX: number
  busY: number
  busStatus: string
}

export default function FenceMap({ fencePoints, busX, busY, busStatus }: FenceMapProps) {
  const points = fencePoints.map((p) => `${p.x},${p.y}`).join(' ')
  const isBreached = busStatus === 'breached'
  const isNear = busStatus === 'near_fence'

  const fenceStroke = isBreached ? '#ef4444' : isNear ? '#f59e0b' : '#22c55e'
  const fenceFill = isBreached ? 'rgba(239,68,68,0.06)' : isNear ? 'rgba(245,158,11,0.06)' : 'rgba(34,197,94,0.06)'

  return (
    <div className="w-full aspect-[4/3] rounded-lg bg-surface-100 border border-surface-300/50 overflow-hidden">
      <svg viewBox="0 0 280 220" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1e2130" strokeWidth="0.5" />
          </pattern>
          <radialGradient id="busGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={isBreached ? '#ef4444' : isNear ? '#f59e0b' : '#22c55e'} stopOpacity="0.3" />
            <stop offset="100%" stopColor={isBreached ? '#ef4444' : isNear ? '#f59e0b' : '#22c55e'} stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="280" height="220" fill="url(#grid)" />

        <polygon
          points={points}
          fill={fenceFill}
          stroke={fenceStroke}
          strokeWidth="2"
          strokeDasharray="8 4"
          className="transition-all duration-500"
        />

        <circle cx={busX} cy={busY} r="18" fill="url(#busGlow)" className="transition-all duration-500" />

        <circle cx={busX} cy={busY} r="5" fill={isBreached ? '#ef4444' : isNear ? '#f59e0b' : '#22c55e'} className="transition-all duration-500">
          <animate attributeName="r" values="5;7;5" dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="1;0.7;1" dur="2s" repeatCount="indefinite" />
        </circle>

        <circle cx={busX} cy={busY} r="10" fill="none" stroke={isBreached ? '#ef4444' : isNear ? '#f59e0b' : '#22c55e'} strokeWidth="1" opacity="0.4">
          <animate attributeName="r" values="10;16;10" dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.4;0;0.4" dur="2s" repeatCount="indefinite" />
        </circle>

        <text x="14" y="18" fill="#64748b" fontSize="9" fontFamily="JetBrains Mono, monospace">
          电子围栏边界
        </text>

        <circle cx="14" cy="32" r="4" fill={isBreached ? '#ef4444' : isNear ? '#f59e0b' : '#22c55e'} />
        <text x="22" y="35" fill="#94a3b8" fontSize="8" fontFamily="JetBrains Mono, monospace">
          当前位置
        </text>
      </svg>
    </div>
  )
}
