import { useMemo, useState } from 'react'
import { useBusStore } from '@/stores'
import { schools } from '@/data/mockData'
import { X, ChevronRight } from 'lucide-react'

export default function RiskSummaryView() {
  const { getRouteRiskSummary, setFilter, filter } = useBusStore()
  const [expandedSchool, setExpandedSchool] = useState<string | null>(schools[0]?.id || null)
  const summary = getRouteRiskSummary()

  const bySchool = useMemo(() => {
    const map = new Map<string, typeof summary>()
    summary.forEach((r) => {
      if (!map.has(r.schoolId)) map.set(r.schoolId, [])
      map.get(r.schoolId)!.push(r)
    })
    return map
  }, [summary])

  const total = {
    total: summary.reduce((s, r) => s + r.total, 0),
    normal: summary.reduce((s, r) => s + r.normal, 0),
    near: summary.reduce((s, r) => s + r.near, 0),
    breached: summary.reduce((s, r) => s + r.breached, 0),
  }

  const hasActiveFilter = filter.schoolId !== '' || filter.routeId !== ''

  const handleSelectRoute = (schoolId: string, routeId: string) => {
    setFilter({ schoolId, routeId, plateNumber: '', status: 'all' })
  }

  const handleClearFilter = () => {
    setFilter({ schoolId: '', routeId: '', plateNumber: '', status: 'all' })
  }

  return (
    <div className="rounded-xl border border-surface-300/40 bg-surface-50/80 overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 border-b border-surface-300/30">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-slate-200">今日风险视图</h3>
          <span className="text-[10px] text-slate-500">按学校/线路汇总</span>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <StatPill label="全部" value={total.total} color="text-slate-300" dot="bg-slate-400" />
          <StatPill label="正常" value={total.normal} color="text-fence-normal" dot="bg-fence-normal" />
          <StatPill label="接近" value={total.near} color="text-fence-near" dot="bg-fence-near" />
          <StatPill label="越界" value={total.breached} color="text-fence-breach" dot="bg-fence-breach" />
          {hasActiveFilter && (
            <button
              onClick={handleClearFilter}
              className="flex items-center gap-1 px-2 py-1 rounded-md bg-brand-600/15 text-brand-400 text-[11px] font-medium hover:bg-brand-600/25 transition-colors"
            >
              <X className="w-2.5 h-2.5" />
              清除筛选
            </button>
          )}
        </div>
      </div>

      <div className="flex h-[240px]">
        <div className="w-[180px] shrink-0 border-r border-surface-300/30 overflow-y-auto">
          {schools.map((s) => {
            const schoolRoutes = bySchool.get(s.id) || []
            const schoolTotal = schoolRoutes.reduce((sum, r) => sum + r.total, 0)
            const schoolBreached = schoolRoutes.reduce((sum, r) => sum + r.breached, 0)
            const schoolNear = schoolRoutes.reduce((sum, r) => sum + r.near, 0)
            const isActive = expandedSchool === s.id
            const isFiltered = filter.schoolId === s.id
            return (
              <button
                key={s.id}
                onClick={() => setExpandedSchool(isActive ? null : s.id)}
                className={`w-full text-left px-4 py-2.5 flex items-center justify-between border-b border-surface-300/20 transition-colors
                  ${isActive ? 'bg-surface-200/60' : 'hover:bg-surface-100'}
                  ${isFiltered ? 'border-l-2 border-l-brand-500' : 'border-l-2 border-l-transparent'}
                `}
              >
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-slate-200 truncate">{s.name}</p>
                  <p className="text-[10px] text-slate-500 font-mono mt-0.5">{schoolTotal}辆</p>
                </div>
                <div className="flex items-center gap-1.5">
                  {schoolNear > 0 && (
                    <span className="w-2 h-2 rounded-full bg-fence-near" title={`接近围栏 ${schoolNear} 辆`} />
                  )}
                  {schoolBreached > 0 && (
                    <span className="w-2 h-2 rounded-full bg-fence-breach animate-pulse" title={`已越界 ${schoolBreached} 辆`} />
                  )}
                  <ChevronRight className={`w-3 h-3 text-slate-500 transition-transform ${isActive ? 'rotate-90' : ''}`} />
                </div>
              </button>
            )
          })}
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          {expandedSchool ? (
            <div className="grid grid-cols-2 gap-2">
              {(bySchool.get(expandedSchool) || []).map((r) => {
                const isFiltered = filter.routeId === r.routeId
                const hasRisk = r.near > 0 || r.breached > 0
                return (
                  <button
                    key={r.routeId}
                    onClick={() => handleSelectRoute(r.schoolId, r.routeId)}
                    className={`text-left p-3 rounded-lg border transition-all
                      ${isFiltered
                        ? 'border-brand-500 bg-brand-600/10'
                        : hasRisk
                        ? 'border-surface-300/50 bg-surface-100 hover:border-surface-400 hover:bg-surface-200'
                        : 'border-surface-300/30 bg-surface-100/40 hover:border-surface-400 hover:bg-surface-200'
                      }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-semibold text-slate-200 truncate">{r.routeName}</p>
                      <span className="text-[10px] font-mono text-slate-500">{r.total}辆</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {r.normal > 0 && <CountDot label="正常" count={r.normal} color="bg-fence-normal" textColor="text-fence-normal" />}
                      {r.near > 0 && <CountDot label="接近" count={r.near} color="bg-fence-near" textColor="text-fence-near" />}
                      {r.breached > 0 && <CountDot label="越界" count={r.breached} color="bg-fence-breach" textColor="text-fence-breach" pulse />}
                      {r.normal === 0 && r.near === 0 && r.breached === 0 && (
                        <span className="text-[10px] text-slate-600">暂无运行车辆</span>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-500">
              <p className="text-xs">点击左侧学校查看线路详情</p>
              <p className="text-[10px] text-slate-600 mt-1">点击线路可联动筛选下方车辆卡片</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function StatPill({ label, value, color, dot }: { label: string; value: number; color: string; dot: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      <span className="text-[10px] text-slate-500">{label}</span>
      <span className={`text-xs font-bold font-mono ${color}`}>{value}</span>
    </span>
  )
}

function CountDot({ label, count, color, textColor, pulse }: { label: string; count: number; color: string; textColor: string; pulse?: boolean }) {
  return (
    <div className="inline-flex items-center gap-1">
      <span className={`w-1.5 h-1.5 rounded-full ${color} ${pulse ? 'animate-pulse' : ''}`} />
      <span className={`text-[10px] font-mono ${textColor}`}>
        {count}{label}
      </span>
    </div>
  )
}
