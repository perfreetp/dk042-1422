import { useAlertStore } from '@/stores'
import StatCard from '@/components/StatCard'
import RouteTable from '@/components/RouteTable'
import UnclosedList from '@/components/UnclosedList'
import { AlertTriangle, Clock, AlertOctagon, Users } from 'lucide-react'
import type { RouteReview } from '@/types'

export default function Review() {
  const { alerts } = useAlertStore()

  const totalBreach = alerts.length
  const avgDuration = '10分钟'
  const unclosedCount = alerts.filter((a) => a.status !== 'completed').length
  const handlerCount = new Set(alerts.filter((a) => a.handlerName).map((a) => a.handlerName)).size

  const routeReviews: RouteReview[] = [
    { routeId: 'r1', routeName: '阳光小学-东线', schoolName: '阳光小学', breachCount: 0, avgDuration: '-', maxDuration: '-', handlers: [], unclosedCount: 0 },
    { routeId: 'r3', routeName: '育才中学-1号线', schoolName: '育才中学', breachCount: 2, avgDuration: '11.5分钟', maxDuration: '15分钟', handlers: ['李调度'], unclosedCount: 1 },
    { routeId: 'r2', routeName: '阳光小学-西线', schoolName: '阳光小学', breachCount: 1, avgDuration: '12分钟', maxDuration: '12分钟', handlers: ['张调度'], unclosedCount: 0 },
    { routeId: 'r5', routeName: '育才中学-3号线', schoolName: '育才中学', breachCount: 1, avgDuration: '5分钟', maxDuration: '5分钟', handlers: ['李调度'], unclosedCount: 0 },
    { routeId: 'r7', routeName: '星星幼儿园-B线', schoolName: '星星幼儿园', breachCount: 1, avgDuration: '21分钟', maxDuration: '21分钟', handlers: [], unclosedCount: 1 },
  ].filter((r) => r.breachCount > 0)

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <header className="shrink-0 px-8 pt-6 pb-4 border-b border-surface-300/30">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">事后复盘</h1>
            <p className="text-xs text-slate-500 mt-1">按线路统计越界数据，跟进未闭环事项</p>
          </div>
          <div className="text-xs text-slate-500 font-mono">
            {new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-8 py-6 space-y-8">
        <div className="grid grid-cols-4 gap-4">
          <StatCard
            icon={<AlertOctagon className="w-4 h-4 text-fence-breach" />}
            label="越界总次数"
            value={totalBreach}
            color="bg-fence-breach/15"
            delay={0}
          />
          <StatCard
            icon={<Clock className="w-4 h-4 text-fence-near" />}
            label="平均持续时长"
            value={avgDuration}
            color="bg-fence-near/15"
            delay={60}
          />
          <StatCard
            icon={<AlertTriangle className="w-4 h-4 text-fence-breach" />}
            label="未闭环事项"
            value={unclosedCount}
            sub="需跟进"
            color="bg-fence-breach/15"
            delay={120}
          />
          <StatCard
            icon={<Users className="w-4 h-4 text-brand-400" />}
            label="处置人数"
            value={handlerCount}
            sub="人"
            color="bg-brand-600/15"
            delay={180}
          />
        </div>

        <section>
          <h2 className="text-sm font-semibold text-slate-300 mb-4">线路越界统计</h2>
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
