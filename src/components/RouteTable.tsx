import type { RouteReview } from '@/types'
import { ArrowUpDown } from 'lucide-react'
import { useState } from 'react'

type SortKey = 'breachCount' | 'avgDuration' | 'maxDuration' | 'unclosedCount'

export default function RouteTable({ data }: { data: RouteReview[] }) {
  const [sortKey, setSortKey] = useState<SortKey>('breachCount')
  const [sortDesc, setSortDesc] = useState(true)

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDesc(!sortDesc)
    } else {
      setSortKey(key)
      setSortDesc(true)
    }
  }

  const sorted = [...data].sort((a, b) => {
    const av = a[sortKey]
    const bv = b[sortKey]
    if (typeof av === 'number' && typeof bv === 'number') {
      return sortDesc ? bv - av : av - bv
    }
    return 0
  })

  const columns: { key: SortKey; label: string; align: string }[] = [
    { key: 'breachCount', label: '越界次数', align: 'text-center' },
    { key: 'avgDuration', label: '平均时长', align: 'text-center' },
    { key: 'maxDuration', label: '最长时长', align: 'text-center' },
    { key: 'unclosedCount', label: '未闭环', align: 'text-center' },
  ]

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
          </tr>
        </thead>
        <tbody className="divide-y divide-surface-300/20">
          {sorted.map((row) => (
            <tr key={row.routeId} className="hover:bg-surface-200/40 transition-colors">
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
                <span className="text-xs font-mono text-slate-300">{row.avgDuration}</span>
              </td>
              <td className="px-4 py-3 text-center">
                <span className="text-xs font-mono text-slate-300">{row.maxDuration}</span>
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
                  {row.handlers.map((h, i) => (
                    <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-surface-200 text-slate-400">{h}</span>
                  ))}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
