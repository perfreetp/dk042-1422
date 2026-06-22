import type { RouteReview } from '@/types'
import { useAlertStore } from '@/stores'
import { ArrowUpDown, ChevronRight } from 'lucide-react'
import { useState } from 'react'

type SortKey = 'breachCount' | 'avgDurationMinutes' | 'maxDurationMinutes' | 'unclosedCount'

export default function RouteTable({ data }: { data: RouteReview[] }) {
  const [sortKey, setSortKey] = useState<SortKey>('breachCount')
  const [sortDesc, setSortDesc] = useState(true)
  const { getAlertsForRoute, setTimelineDrawerOpen } = useAlertStore()

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDesc(!sortDesc)
    } else {
      setSortKey(key)
      setSortDesc(true)
    }
  }

  const handleRowClick = (routeId: string) => {
    const routeAlerts = getAlertsForRoute(routeId)
      .filter((a) => a.status !== 'completed')
      .sort((a, b) => new Date(b.fenceOutTime).getTime() - new Date(a.fenceOutTime).getTime())
    if (routeAlerts.length > 0) {
      setTimelineDrawerOpen(true, routeAlerts[0].id)
    }
  }

  const sorted = [...data].sort((a, b) => {
    const av = a[sortKey]
    const bv = b[sortKey]
    return sortDesc ? bv - av : av - bv
  })

  const columns: { key: SortKey; label: string; align: string }[] = [
    { key: 'breachCount', label: '越界次数', align: 'text-center' },
    { key: 'avgDurationMinutes', label: '平均时长', align: 'text-center' },
    { key: 'maxDurationMinutes', label: '最长时长', align: 'text-center' },
    { key: 'unclosedCount', label: '未闭环', align: 'text-center' },
  ]

  const formatDuration = (row: RouteReview, key: 'avgDurationMinutes' | 'maxDurationMinutes') => {
    const v = row[key]
    return v > 0 ? `${v}分钟` : '-'
  }

  return (
    <div className="rounded-xl border border-surface-300/40 overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="bg-surface-100">
            <th className="text-left px-4 py-3 text-[11px] font-semibold text-slate-400 w-[200px]">线路</th>
            <th className="text-left px-4 py-3 text-[11px] font-semibold text-slate-400 w-[100px]">所属学校</th>
            {columns.map((col) => (
              <th key={col.key} className={`${col.align} px-4 py-3 text-[11px] font-semibold text-slate-400`}>
                <button onClick={() => handleSort(col.key)} className="inline-flex items-center gap-1 hover:text-slate-200 transition-colors">
                  {col.label}
                  <ArrowUpDown className={`w-3 h-3 ${sortKey === col.key ? 'text-brand-400' : 'text-slate-600'}`} />
                </button>
              </th>
            ))}
            <th className="text-left px-4 py-3 text-[11px] font-semibold text-slate-400">处置人</th>
            <th className="w-[30px]"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-surface-300/20">
          {sorted.length === 0 && (
            <tr>
              <td colSpan={8} className="px-4 py-8 text-center text-sm text-slate-500">
                暂无数据
              </td>
            </tr>
          )}
          {sorted.map((row) => {
            const hasUnclosed = row.unclosedCount > 0
            return (
              <tr
                key={row.routeId}
                onClick={hasUnclosed ? () => handleRowClick(row.routeId) : undefined}
                className={`group ${hasUnclosed ? 'cursor-pointer' : ''} hover:bg-surface-200/40 transition-colors`}
              >
                <td className="px-4 py-3">
                  <span className="text-sm font-medium text-slate-200">{row.routeName}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-xs text-slate-400">{row.schoolName}</span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className={`text-sm font-bold font-mono ${row.breachCount > 0 ? 'text-fence-breach' : 'text-slate-400'}`}>
                    {row.breachCount}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="text-xs font-mono text-slate-300">{formatDuration(row, 'avgDurationMinutes')}</span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="text-xs font-mono text-slate-300">{formatDuration(row, 'maxDurationMinutes')}</span>
                </td>
                <td className="px-4 py-3 text-center">
                  {row.unclosedCount > 0 ? (
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-fence-breach/15 text-fence-breach text-xs font-bold font-mono">
                      {row.unclosedCount}
                    </span>
                  ) : (
                    <span className="text-xs text-slate-600">0</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-1 flex-wrap">
                    {row.handlers.length === 0 ? (
                      <span className="text-[10px] text-slate-600">未指派</span>
                    ) : (
                      row.handlers.map((h, i) => (
                        <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-surface-200 text-slate-400">{h}</span>
                      ))
                    )}
                  </div>
                </td>
                <td className="px-2 py-3 w-[30px]">
                  {hasUnclosed && (
                    <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-400 transition-colors opacity-0 group-hover:opacity-100" />
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
