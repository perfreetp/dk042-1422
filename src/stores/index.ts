import { create } from 'zustand'
import type { Bus, BusStatus, Alert, AlertReason, HandleLog, RouteReview, NotifyChannel, NotifyTarget, NotifyStatus } from '@/types'
import { buses as initialBuses, alerts as initialAlerts, handleLogs as initialHandleLogs, schools, routes } from '@/data/mockData'

interface BusFilter {
  schoolId: string
  routeId: string
  plateNumber: string
  status: BusStatus | 'all'
}

interface BusStore {
  buses: Bus[]
  filter: BusFilter
  selectedBusId: string | null
  drawerOpen: boolean
  setFilter: (filter: Partial<BusFilter>) => void
  setSelectedBus: (id: string | null) => void
  setDrawerOpen: (open: boolean) => void
  getFilteredBuses: () => Bus[]
  getRouteRiskSummary: () => Array<{
    routeId: string
    routeName: string
    schoolId: string
    schoolName: string
    total: number
    normal: number
    near: number
    breached: number
  }>
}

export const useBusStore = create<BusStore>((set, get) => ({
  buses: initialBuses,
  filter: { schoolId: '', routeId: '', plateNumber: '', status: 'all' },
  selectedBusId: null,
  drawerOpen: false,
  setFilter: (partial) => set((s) => ({ filter: { ...s.filter, ...partial } })),
  setSelectedBus: (id) => set({ selectedBusId: id, drawerOpen: id !== null }),
  setDrawerOpen: (open) => set((s) => ({ drawerOpen: open, selectedBusId: open ? s.selectedBusId : null })),
  getFilteredBuses: () => {
    const { buses, filter } = get()
    return buses.filter((b) => {
      if (filter.schoolId && b.schoolId !== filter.schoolId) return false
      if (filter.routeId && b.routeId !== filter.routeId) return false
      if (filter.plateNumber && !b.plateNumber.includes(filter.plateNumber)) return false
      if (filter.status !== 'all' && b.status !== filter.status) return false
      return true
    })
  },
  getRouteRiskSummary: () => {
    const { buses } = get()
    return routes.map((r) => {
      const school = schools.find((s) => s.id === r.schoolId)!
      const routeBuses = buses.filter((b) => b.routeId === r.id)
      return {
        routeId: r.id,
        routeName: r.name,
        schoolId: r.schoolId,
        schoolName: school.name,
        total: routeBuses.length,
        normal: routeBuses.filter((b) => b.status === 'normal').length,
        near: routeBuses.filter((b) => b.status === 'near_fence').length,
        breached: routeBuses.filter((b) => b.status === 'breached').length,
      }
    })
  },
}))

const genId = () => 'h' + Date.now() + Math.random().toString(36).slice(2, 6)
const nowStr = () => new Date().toLocaleString('zh-CN', { hour12: false })
const fmtDuration = (m: number) => `${m}分钟`

interface AlertStore {
  alerts: Alert[]
  handleLogs: HandleLog[]
  selectedAlertId: string | null
  reasonModalOpen: boolean
  setSelectedAlert: (id: string | null) => void
  setReasonModalOpen: (open: boolean, alertId?: string) => void
  getNextPendingAlert: () => Alert | undefined
  confirmReason: (alertId: string, reason: AlertReason, note: string) => void
  closeAndAdvance: () => void
  sendNotification: (alertId: string, channel: NotifyChannel, notifyTarget: NotifyTarget) => Array<{ id: string; status: NotifyStatus; failReason?: string }>
  addCallLog: (alertId: string, content: string, duration?: string) => void
  addNoteLog: (alertId: string, content: string) => void
  completeAlert: (alertId: string) => void
  getHandleLogsForAlert: (alertId: string) => HandleLog[]
  computeRouteReviews: () => RouteReview[]
  getReviewStats: () => { totalBreach: number; avgDurationMinutes: number; unclosedCount: number; handlerCount: number }
  hasNotified: (alertId: string, channel: NotifyChannel, notifyTarget: NotifyTarget) => boolean
}

function buildSupervisorName(schoolId: string): string {
  const map: Record<string, string> = { s1: '赵主任', s2: '王主任', s3: '陈主任' }
  return map[schoolId] || '安全主管'
}

function randSuccessFail(channel: NotifyChannel): NotifyStatus {
  if (channel === 'system') return 'success'
  return Math.random() > 0.12 ? 'success' : 'failed'
}

export const useAlertStore = create<AlertStore>((set, get) => ({
  alerts: initialAlerts,
  handleLogs: initialHandleLogs,
  selectedAlertId: null,
  reasonModalOpen: false,

  setSelectedAlert: (id) => set({ selectedAlertId: id }),

  setReasonModalOpen: (open, alertId) =>
    set((s) => {
      if (open && alertId) return { reasonModalOpen: true, selectedAlertId: alertId }
      if (open) {
        const next = s.alerts.find((a) => a.status === 'pending')
        if (next) return { reasonModalOpen: true, selectedAlertId: next.id }
        return { reasonModalOpen: false }
      }
      return { reasonModalOpen: false }
    }),

  getNextPendingAlert: () => {
    return get().alerts
      .filter((a) => a.status === 'pending')
      .sort((a, b) => a.fenceOutTime.localeCompare(b.fenceOutTime))[0]
  },

  confirmReason: (alertId, reason, note) => {
    const t = nowStr()
    const next = get().alerts
      .filter((a) => a.status === 'pending' && a.id !== alertId)
      .sort((a, b) => a.fenceOutTime.localeCompare(b.fenceOutTime))[0]
    set((s) => ({
      alerts: s.alerts.map((a) =>
        a.id === alertId ? { ...a, status: 'processing' as const, reason, note, handlerName: '当前调度员', handleTime: t } : a
      ),
      reasonModalOpen: !!next,
      selectedAlertId: next ? next.id : alertId,
    }))
  },

  closeAndAdvance: () => {
    const { alerts, selectedAlertId } = get()
    const next = alerts
      .filter((a) => a.status === 'pending' && a.id !== selectedAlertId)
      .sort((a, b) => a.fenceOutTime.localeCompare(b.fenceOutTime))[0]
    set({ reasonModalOpen: !!next, selectedAlertId: next ? next.id : selectedAlertId })
  },

  hasNotified: (alertId, channel, notifyTarget) => {
    return get().handleLogs.some(
      (l) =>
        l.alertId === alertId &&
        l.type === 'notification' &&
        l.channel === channel &&
        l.notifyTarget === notifyTarget &&
        l.notifyStatus === 'success'
    )
  },

  sendNotification: (alertId, channel, notifyTarget) => {
    const alert = get().alerts.find((a) => a.id === alertId)
    if (!alert) return []
    const results: Array<{ id: string; status: NotifyStatus; failReason?: string; notifyTarget: NotifyTarget }> = []
    const { hasNotified } = get()
    const targets: NotifyTarget[] = notifyTarget === 'both' ? ['driver', 'supervisor'] : [notifyTarget]

    targets.forEach((tgt) => {
      const alreadySent = hasNotified(alertId, channel, tgt)
      const id = genId()
      const t = nowStr()
      let status: NotifyStatus = alreadySent ? 'duplicate' : randSuccessFail(channel)
      const supervisor = buildSupervisorName(alert.schoolId)
      const targetLabel = tgt === 'driver' ? `司机${alert.driverName}（${alert.driverPhone}）` : `安全主管${supervisor}`
      const channelLabel = channel === 'sms' ? '短信' : channel === 'app' ? 'APP推送' : '系统通知'
      let content: string
      let failReason: string | undefined

      if (status === 'duplicate') {
        content = `[重复发送] ${channelLabel}已发送过给${targetLabel}，不再重复发送`
      } else if (status === 'failed') {
        failReason = channel === 'sms' ? '运营商网关超时' : '设备离线'
        content = `[发送失败] ${channelLabel}发送给${targetLabel}失败（${failReason}），请稍后重试或电话联系`
      } else {
        content = `${channelLabel}已发送给${targetLabel}`
      }

      const log: HandleLog = {
        id,
        alertId,
        type: 'notification',
        content,
        operatorName: '当前调度员',
        operateTime: t,
        target: targetLabel,
        channel,
        notifyTarget: tgt,
        notifyStatus: status,
        failReason,
      }
      set((s) => ({ handleLogs: [...s.handleLogs, log] }))
      results.push({ id, status, failReason, notifyTarget: tgt })
    })

    return results
  },

  addCallLog: (alertId, content, duration) => {
    const alert = get().alerts.find((a) => a.id === alertId)
    if (!alert) return
    const log: HandleLog = {
      id: genId(),
      alertId,
      type: 'call',
      content,
      operatorName: '当前调度员',
      operateTime: nowStr(),
      target: alert.driverName,
      callDuration: duration,
    }
    set((s) => ({ handleLogs: [...s.handleLogs, log] }))
  },

  addNoteLog: (alertId, content) =>
    set((s) => ({
      handleLogs: [
        ...s.handleLogs,
        { id: genId(), alertId, type: 'note' as const, content, operatorName: '当前调度员', operateTime: nowStr() },
      ],
    })),

  completeAlert: (alertId) => {
    const t = nowStr()
    set((s) => ({
      alerts: s.alerts.map((a) => (a.id === alertId ? { ...a, status: 'completed' as const, completeTime: t } : a)),
      handleLogs: [
        ...s.handleLogs,
        { id: genId(), alertId, type: 'note' as const, content: '预警已闭环，车辆返回围栏范围内', operatorName: '当前调度员', operateTime: t },
      ],
    }))
  },

  getHandleLogsForAlert: (alertId) => get().handleLogs.filter((l) => l.alertId === alertId),

  getReviewStats: () => {
    const { alerts } = get()
    const totalBreach = alerts.length
    const completedOrProcessing = alerts.filter((a) => a.durationMinutes > 0)
    const avgDurationMinutes =
      completedOrProcessing.length > 0
        ? Math.round(completedOrProcessing.reduce((s, a) => s + a.durationMinutes, 0) / completedOrProcessing.length)
        : 0
    const unclosedCount = alerts.filter((a) => a.status !== 'completed').length
    const handlerCount = new Set(alerts.filter((a) => a.handlerName).map((a) => a.handlerName)).size
    return { totalBreach, avgDurationMinutes, unclosedCount, handlerCount }
  },

  computeRouteReviews: () => {
    const { alerts } = get()
    const byRoute = new Map<string, Alert[]>()
    alerts.forEach((a) => {
      if (!byRoute.has(a.routeId)) byRoute.set(a.routeId, [])
      byRoute.get(a.routeId)!.push(a)
    })
    const list: RouteReview[] = []
    byRoute.forEach((listA, routeId) => {
      const route = routes.find((r) => r.id === routeId)
      const school = schools.find((s) => s.id === listA[0].schoolId)
      if (!route || !school) return
      const durations = listA.map((a) => a.durationMinutes).filter((m) => m > 0)
      const totalDurationMinutes = durations.reduce((s, m) => s + m, 0)
      const avgDurationMinutes = durations.length ? Math.round(totalDurationMinutes / durations.length) : 0
      const maxDurationMinutes = durations.length ? Math.max(...durations) : 0
      const handlers = Array.from(new Set(listA.map((a) => a.handlerName).filter(Boolean)))
      const unclosedCount = listA.filter((a) => a.status !== 'completed').length
      list.push({
        routeId,
        routeName: route.name,
        schoolId: school.id,
        schoolName: school.name,
        breachCount: listA.length,
        totalDurationMinutes,
        avgDurationMinutes,
        maxDurationMinutes,
        avgDuration: avgDurationMinutes ? fmtDuration(avgDurationMinutes) : '-',
        maxDuration: maxDurationMinutes ? fmtDuration(maxDurationMinutes) : '-',
        handlers,
        unclosedCount,
      })
    })
    return list.sort((a, b) => b.breachCount - a.breachCount)
  },
}))
