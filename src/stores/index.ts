import { create } from 'zustand'
import type { Bus, BusStatus, Alert, AlertReason, HandleLog, RouteReview, NotifyChannel, NotifyTarget, NotifyStatus, CallTarget } from '@/types'
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

function parseTimeToDate(timeStr: string): Date {
  return new Date(timeStr)
}

function computeDurationMinutes(alert: Alert, now: Date = new Date()): number {
  const start = parseTimeToDate(alert.fenceOutTime)
  let end: Date
  if (alert.status === 'completed' && alert.completeTime) {
    end = parseTimeToDate(alert.completeTime)
  } else {
    end = now
  }
  const diffMs = end.getTime() - start.getTime()
  const minutes = Math.max(1, Math.round(diffMs / 60000))
  return minutes
}

function sortByFenceOutTimeDesc(a: Alert, b: Alert): number {
  return parseTimeToDate(b.fenceOutTime).getTime() - parseTimeToDate(a.fenceOutTime).getTime()
}

const buildSupervisorName = (schoolId: string): string => {
  const map: Record<string, string> = { s1: '赵主任', s2: '王主任', s3: '陈主任' }
  return map[schoolId] || '安全主管'
}

function randSuccessFail(channel: NotifyChannel): NotifyStatus {
  if (channel === 'system') return 'success'
  return Math.random() > 0.12 ? 'success' : 'failed'
}

const getCallTargetLabel = (target: CallTarget, alert: Alert): string => {
  const map: Record<CallTarget, { name: string; phone: string; label: string }> = {
    driver: { name: alert.driverName, phone: alert.driverPhone, label: '司机' },
    attendant: { name: alert.attendantName, phone: alert.attendantPhone, label: '照管员' },
    supervisor: { name: alert.supervisorName, phone: '-', label: '安全主管' },
  }
  const t = map[target]
  return target === 'supervisor' ? `${t.label}${t.name}` : `${t.label}${t.name}（${t.phone}）`
}

const getNotifyTargetLabel = (tgt: NotifyTarget, alert: Alert): string => {
  if (tgt === 'driver') return `司机${alert.driverName}（${alert.driverPhone}）`
  if (tgt === 'supervisor') return `安全主管${alert.supervisorName}`
  return ''
}

interface AlertStore {
  alerts: Alert[]
  handleLogs: HandleLog[]
  selectedAlertId: string | null
  modalAlertId: string | null
  reasonModalOpen: boolean
  timelineDrawerOpen: boolean
  timelineAlertId: string | null
  durationTick: number
  setSelectedAlert: (id: string | null) => void
  setReasonModalOpen: (open: boolean, alertId?: string) => void
  setTimelineDrawerOpen: (open: boolean, alertId?: string) => void
  tickDuration: () => void
  getNextPendingAlert: () => Alert | undefined
  confirmReason: (alertId: string, reason: AlertReason, note: string) => void
  closeAndAdvance: () => void
  getAlertDurationMinutes: (alert: Alert) => number
  getAlertDurationText: (alert: Alert) => string
  sendNotification: (alertId: string, channel: NotifyChannel, notifyTarget: NotifyTarget) => Array<{ id: string; status: NotifyStatus; failReason?: string; notifyTarget: NotifyTarget }>
  resendNotification: (logId: string) => { id: string; status: NotifyStatus; failReason?: string; notifyTarget: NotifyTarget } | null
  getLastNotificationInfo: (alertId: string, channel: NotifyChannel, notifyTarget: NotifyTarget) => { hasSent: boolean; lastTime?: string; lastTarget?: string }
  addCallLog: (alertId: string, content: string, callTarget: CallTarget, duration?: string) => void
  addNoteLog: (alertId: string, content: string) => void
  completeAlert: (alertId: string) => void
  getHandleLogsForAlert: (alertId: string) => HandleLog[]
  computeRouteReviews: () => RouteReview[]
  getReviewStats: () => { totalBreach: number; avgDurationMinutes: number; unclosedCount: number; handlerCount: number }
  hasNotified: (alertId: string, channel: NotifyChannel, notifyTarget: NotifyTarget) => boolean
  getAlertsForRoute: (routeId: string) => Alert[]
}

export const useAlertStore = create<AlertStore>((set, get) => ({
  alerts: initialAlerts,
  handleLogs: initialHandleLogs,
  selectedAlertId: null,
  modalAlertId: null,
  reasonModalOpen: false,
  timelineDrawerOpen: false,
  timelineAlertId: null,
  durationTick: 0,

  tickDuration: () => set((s) => ({ durationTick: s.durationTick + 1 })),

  setSelectedAlert: (id) => set({ selectedAlertId: id }),

  setReasonModalOpen: (open, alertId) =>
    set((s) => {
      if (open && alertId) return { reasonModalOpen: true, modalAlertId: alertId, selectedAlertId: alertId }
      if (open) {
        const next = get().getNextPendingAlert()
        if (next) return { reasonModalOpen: true, modalAlertId: next.id, selectedAlertId: next.id }
        return { reasonModalOpen: false, modalAlertId: null }
      }
      return { reasonModalOpen: false, modalAlertId: null }
    }),

  setTimelineDrawerOpen: (open, alertId) =>
    set((s) => {
      if (open && alertId) return { timelineDrawerOpen: true, timelineAlertId: alertId }
      return { timelineDrawerOpen: false, timelineAlertId: null }
    }),

  getNextPendingAlert: () => {
    return get().alerts
      .filter((a) => a.status === 'pending')
      .sort(sortByFenceOutTimeDesc)[0]
  },

  confirmReason: (alertId, reason, note) => {
    const t = nowStr()
    const next = get().alerts
      .filter((a) => a.status === 'pending' && a.id !== alertId)
      .sort(sortByFenceOutTimeDesc)[0]
    set((s) => ({
      alerts: s.alerts.map((a) =>
        a.id === alertId ? { ...a, status: 'processing' as const, reason, note, handlerName: '当前调度员', handleTime: t } : a
      ),
      reasonModalOpen: !!next,
      modalAlertId: next ? next.id : null,
      selectedAlertId: alertId,
    }))
  },

  closeAndAdvance: () => {
    const { alerts, modalAlertId } = get()
    const next = alerts
      .filter((a) => a.status === 'pending' && a.id !== modalAlertId)
      .sort(sortByFenceOutTimeDesc)[0]
    set({
      reasonModalOpen: !!next,
      modalAlertId: next ? next.id : null,
      selectedAlertId: next ? next.id : modalAlertId,
    })
  },

  getAlertDurationMinutes: (alert) => {
    get().durationTick
    return computeDurationMinutes(alert)
  },

  getAlertDurationText: (alert) => {
    get().durationTick
    const m = computeDurationMinutes(alert)
    return fmtDuration(m)
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

  getLastNotificationInfo: (alertId, channel, notifyTarget) => {
    const last = [...get().handleLogs]
      .filter(
        (l) =>
          l.alertId === alertId &&
          l.type === 'notification' &&
          l.channel === channel &&
          l.notifyTarget === notifyTarget &&
          l.notifyStatus === 'success'
      )
      .sort((a, b) => parseTimeToDate(b.operateTime).getTime() - parseTimeToDate(a.operateTime).getTime())[0]
    if (!last) return { hasSent: false }
    return { hasSent: true, lastTime: last.operateTime, lastTarget: last.target }
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
      const targetLabel = getNotifyTargetLabel(tgt, alert)
      const channelLabel = channel === 'sms' ? '短信' : channel === 'app' ? 'APP推送' : '系统通知'
      let content: string
      let failReason: string | undefined

      if (status === 'duplicate') {
        const lastInfo = get().getLastNotificationInfo(alertId, channel, tgt)
        content = `[重复发送] ${channelLabel}已发送过给${targetLabel}（上次发送：${lastInfo.lastTime || '未知时间'}），不再重复发送`
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

  resendNotification: (logId) => {
    const log = get().handleLogs.find((l) => l.id === logId)
    if (!log || log.type !== 'notification' || !log.channel || !log.notifyTarget) return null
    const alert = get().alerts.find((a) => a.id === log.alertId)
    if (!alert) return null

    const id = genId()
    const t = nowStr()
    const status = randSuccessFail(log.channel)
    const targetLabel = getNotifyTargetLabel(log.notifyTarget, alert)
    const channelLabel = log.channel === 'sms' ? '短信' : log.channel === 'app' ? 'APP推送' : '系统通知'
    let content: string
    let failReason: string | undefined

    if (status === 'failed') {
      failReason = log.channel === 'sms' ? '运营商网关超时' : '设备离线'
      content = `[重发失败] ${channelLabel}重发给${targetLabel}失败（${failReason}），原发送时间：${log.operateTime}`
    } else {
      content = `[重发成功] ${channelLabel}已重发给${targetLabel}，原发送时间：${log.operateTime}`
    }

    const newLog: HandleLog = {
      id,
      alertId: log.alertId,
      type: 'notification',
      content,
      operatorName: '当前调度员',
      operateTime: t,
      target: targetLabel,
      channel: log.channel,
      notifyTarget: log.notifyTarget,
      notifyStatus: status,
      failReason,
      originalLogId: logId,
    }
    set((s) => ({ handleLogs: [...s.handleLogs, newLog] }))
    return { id, status, failReason, notifyTarget: log.notifyTarget }
  },

  addCallLog: (alertId, content, callTarget, duration) => {
    const alert = get().alerts.find((a) => a.id === alertId)
    if (!alert) return
    const targetLabel = getCallTargetLabel(callTarget, alert)
    const callTargetLabel = callTarget === 'driver' ? '司机' : callTarget === 'attendant' ? '照管员' : '安全主管'
    const personName = callTarget === 'driver' ? alert.driverName : callTarget === 'attendant' ? alert.attendantName : alert.supervisorName
    const log: HandleLog = {
      id: genId(),
      alertId,
      type: 'call',
      content: `与${callTargetLabel}${personName}通话：${content}`,
      operatorName: '当前调度员',
      operateTime: nowStr(),
      target: targetLabel,
      callDuration: duration,
      callTarget,
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

  getAlertsForRoute: (routeId) => get().alerts.filter((a) => a.routeId === routeId),

  getReviewStats: () => {
    const { alerts, getAlertDurationMinutes } = get()
    const totalBreach = alerts.length
    const durations = alerts.map((a) => getAlertDurationMinutes(a)).filter((m) => m > 0)
    const avgDurationMinutes = durations.length > 0 ? Math.round(durations.reduce((s, m) => s + m, 0) / durations.length) : 0
    const unclosedCount = alerts.filter((a) => a.status !== 'completed').length
    const handlerCount = new Set(alerts.filter((a) => a.handlerName).map((a) => a.handlerName)).size
    return { totalBreach, avgDurationMinutes, unclosedCount, handlerCount }
  },

  computeRouteReviews: () => {
    const { alerts, getAlertDurationMinutes } = get()
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
      const durations = listA.map((a) => getAlertDurationMinutes(a)).filter((m) => m > 0)
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

setInterval(() => {
  useAlertStore.getState().tickDuration()
}, 10000)
