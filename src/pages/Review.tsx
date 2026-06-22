import { useAlertStore } from '@/stores'
import StatCard from '@/components/StatCard'
import RouteTable from '@/components/RouteTable'
import UnclosedList from '@/components/UnclosedList'
import { AlertTriangle, Clock, AlertOctagon, Users, RefreshCw } from 'lucide-react'

export default function Review() {
  const { getReviewStats, computeRouteReviews } = useAlertStore()
  const stats = getReviewStats()
  const routeReviews = computeRouteReviews()

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <header className="shrink-0 px-8 pt-6 pb-4 border-b border-surface-300/30">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">事后复盘</h1>
            <p className="text-xs text-slate-500 mt-1">按线路统计越界数据，跟进未闭环事项 · 数据与处置实时同步</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-fence-normal/10 text-fence-normal text-[10px] font-medium">
              <RefreshCw className="w-2.5 h-2.5" />
              实时同步
            </span>
            <span className="text-xs text-slate-500 font-mono">
              {new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-8 py-6 space-y-8">
        <div className="grid grid-cols-4 gap-4">
          <StatCard
            icon={<AlertOctagon className="w-4 h-4 text-fence-breach" />}
            label="越界总次数"
            value={stats.totalBreach}
            color="bg-fence-breach/15"
            delay={0}
          />
          <StatCard
            icon={<Clock className="w-4 h-4 text-fence-near" />}
            label="平均持续时长"
            value={`${stats.avgDurationMinutes || 0}分钟`}
            color="bg-fence-near/15"
            delay={60}
          />
          <StatCard
            icon={<AlertTriangle className="w-4 h-4 text-fence-breach" />}
            label="未闭环事项"
            value={stats.unclosedCount}
            sub="需跟进"
            color="bg-fence-breach/15"
            delay={120}
          />
          <StatCard
            icon={<Users className="w-4 h-4 text-brand-400" />}
            label="处置人数"
            value={stats.handlerCount}
            sub="人"
            color="bg-brand-600/15"
            delay={180}
          />
        </div>

        <section>
          <h2 className="text-sm font-semibold text-slate-300 mb-4">线路越界统计（按处置动作实时计算）</h2>
          <RouteTable data={routeReviews} />
        </section>

        <section>
          <h2 className="text-sm font-semibold text-slate-300 mb-4">未闭环事项</h2>
          <UnclosedList />
        </section>
      </div>
    </div>
  )
}
