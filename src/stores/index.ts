import { create } from 'zustand'
import type { Bus, BusStatus, Alert, AlertReason, HandleLog } from '@/types'
import { buses as initialBuses, alerts as initialAlerts, handleLogs as initialHandleLogs } from '@/data/mockData'

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
}))

interface AlertStore {
  alerts: Alert[]
  handleLogs: HandleLog[]
  selectedAlertId: string | null
  reasonModalOpen: boolean
  setSelectedAlert: (id: string | null) => void
  setReasonModalOpen: (open: boolean) => void
  confirmReason: (alertId: string, reason: AlertReason, note: string) => void
  addNotificationLog: (alertId: string) => void
  addCallLog: (alertId: string, content: string) => void
  addNoteLog: (alertId: string, content: string) => void
  completeAlert: (alertId: string) => void
  getHandleLogsForAlert: (alertId: string) => HandleLog[]
}

const genId = () => 'h' + Date.now() + Math.random().toString(36).slice(2, 6)

export const useAlertStore = create<AlertStore>((set, get) => ({
  alerts: initialAlerts,
  handleLogs: initialHandleLogs,
  selectedAlertId: null,
  reasonModalOpen: false,
  setSelectedAlert: (id) => set({ selectedAlertId: id }),
  setReasonModalOpen: (open) => set({ reasonModalOpen: open }),
  confirmReason: (alertId, reason, note) =>
    set((s) => ({
      alerts: s.alerts.map((a) =>
        a.id === alertId ? { ...a, status: 'processing' as const, reason, note, handlerName: '当前调度员', handleTime: new Date().toLocaleString('zh-CN', { hour12: false }) } : a
      ),
      reasonModalOpen: false,
    })),
  addNotificationLog: (alertId) =>
    set((s) => {
      const alert = s.alerts.find((a) => a.id === alertId)
      if (!alert) return s
      const log: HandleLog = {
        id: genId(),
        alertId,
        type: 'notification',
        content: `已通知司机${alert.driverName}（${alert.driverPhone}）和安全主管`,
        operatorName: '当前调度员',
        operateTime: new Date().toLocaleString('zh-CN', { hour12: false }),
        target: '司机+安全主管',
      }
      return { handleLogs: [...s.handleLogs, log] }
    }),
  addCallLog: (alertId, content) =>
    set((s) => {
      const alert = s.alerts.find((a) => a.id === alertId)
      if (!alert) return s
      const log: HandleLog = {
        id: genId(),
        alertId,
        type: 'call',
        content,
        operatorName: '当前调度员',
        operateTime: new Date().toLocaleString('zh-CN', { hour12: false }),
        target: alert.driverName,
      }
      return { handleLogs: [...s.handleLogs, log] }
    }),
  addNoteLog: (alertId, content) =>
    set((s) => ({
      handleLogs: [
        ...s.handleLogs,
        { id: genId(), alertId, type: 'note' as const, content, operatorName: '当前调度员', operateTime: new Date().toLocaleString('zh-CN', { hour12: false }) },
      ],
    })),
  completeAlert: (alertId) =>
    set((s) => ({
      alerts: s.alerts.map((a) => (a.id === alertId ? { ...a, status: 'completed' as const } : a)),
    })),
  getHandleLogsForAlert: (alertId) => get().handleLogs.filter((l) => l.alertId === alertId),
}))
