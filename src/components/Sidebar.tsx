import { NavLink, useLocation } from 'react-router-dom'
import { Bus, AlertTriangle, BarChart3, Shield } from 'lucide-react'

const navItems = [
  { to: '/', label: '运行监控', icon: Bus },
  { to: '/alerts', label: '预警处置', icon: AlertTriangle },
  { to: '/review', label: '事后复盘', icon: BarChart3 },
]

export default function Sidebar() {
  const location = useLocation()

  return (
    <aside className="w-[220px] h-full bg-surface-100 border-r border-surface-300/50 flex flex-col shrink-0">
      <div className="h-16 flex items-center gap-3 px-5 border-b border-surface-300/50">
        <div className="w-9 h-9 rounded-lg bg-brand-600 flex items-center justify-center">
          <Shield className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-sm font-bold text-white leading-tight">校车预警</h1>
          <p className="text-[10px] text-slate-500 leading-tight">工作台</p>
        </div>
      </div>

      <nav className="flex-1 py-4 px-3 space-y-1">
        {navItems.map(({ to, label, icon: Icon }) => {
          const isActive = location.pathname === to
          return (
            <NavLink
              key={to}
              to={to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                ${isActive
                  ? 'bg-brand-600/15 text-brand-400'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-surface-200'
                }`}
            >
              <Icon className={`w-[18px] h-[18px] ${isActive ? 'text-brand-400' : ''}`} />
              {label}
              {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-400" />}
            </NavLink>
          )
        })}
      </nav>

      <div className="p-4 border-t border-surface-300/50">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-surface-300 flex items-center justify-center text-xs font-bold text-slate-300">
            调
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-slate-300 truncate">当前调度员</p>
            <p className="text-[10px] text-slate-500">在线值班中</p>
          </div>
          <div className="ml-auto w-2 h-2 rounded-full bg-fence-normal" />
        </div>
      </div>
    </aside>
  )
}
