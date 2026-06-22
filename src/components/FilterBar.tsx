import { useBusStore } from '@/stores'
import { schools, routes } from '@/data/mockData'
import { Search, Filter } from 'lucide-react'
import type { BusStatus } from '@/types'

const statusTabs: { value: BusStatus | 'all'; label: string; color: string }[] = [
  { value: 'all', label: '全部', color: 'text-slate-300' },
  { value: 'normal', label: '正常', color: 'text-fence-normal' },
  { value: 'near_fence', label: '接近围栏', color: 'text-fence-near' },
  { value: 'breached', label: '已越界', color: 'text-fence-breach' },
]

export default function FilterBar() {
  const { filter, setFilter } = useBusStore()

  const filteredRoutes = routes.filter((r) => !filter.schoolId || r.schoolId === filter.schoolId)

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="搜索车牌号..."
            value={filter.plateNumber}
            onChange={(e) => setFilter({ plateNumber: e.target.value })}
            className="w-full h-9 pl-9 pr-3 rounded-lg bg-surface-200 border border-surface-300/60 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/30 transition-all"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-500" />
          <select
            value={filter.schoolId}
            onChange={(e) => setFilter({ schoolId: e.target.value, routeId: '' })}
            className="h-9 px-3 rounded-lg bg-surface-200 border border-surface-300/60 text-sm text-slate-200 focus:outline-none focus:border-brand-500 transition-all appearance-none cursor-pointer"
          >
            <option value="">全部学校</option>
            {schools.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>

          <select
            value={filter.routeId}
            onChange={(e) => setFilter({ routeId: e.target.value })}
            className="h-9 px-3 rounded-lg bg-surface-200 border border-surface-300/60 text-sm text-slate-200 focus:outline-none focus:border-brand-500 transition-all appearance-none cursor-pointer"
          >
            <option value="">全部线路</option>
            {filteredRoutes.map((r) => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {statusTabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilter({ status: tab.value })}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border
              ${filter.status === tab.value
                ? 'bg-surface-300/80 border-surface-400 text-white shadow-sm'
                : 'bg-transparent border-surface-300/40 text-slate-400 hover:border-surface-400 hover:text-slate-300'
              }`}
          >
            <span className={`inline-block w-1.5 h-1.5 rounded-full mr-1.5 ${
              tab.value === 'all' ? 'bg-slate-400' :
              tab.value === 'normal' ? 'bg-fence-normal' :
              tab.value === 'near_fence' ? 'bg-fence-near' : 'bg-fence-breach'
            }`} />
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  )
}
