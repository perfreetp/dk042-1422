export type BusStatus = 'normal' | 'near_fence' | 'breached'

export interface School {
  id: string
  name: string
}

export interface FencePoint {
  x: number
  y: number
}

export interface Route {
  id: string
  name: string
  schoolId: string
  fencePoints: FencePoint[]
}

export interface Bus {
  id: string
  plateNumber: string
  routeId: string
  schoolId: string
  status: BusStatus
  latitude: number
  longitude: number
  mapX: number
  mapY: number
  attendantName: string
  driverName: string
  driverPhone: string
  lastUpdateTime: string
  lastFenceInTime: string
  lastFenceOutTime: string
}

export type AlertStatus = 'pending' | 'processing' | 'completed'
export type AlertReason = '临时绕行' | '道路施工' | '司机误驶' | '异常停靠'

export interface Alert {
  id: string
  busId: string
  plateNumber: string
  routeName: string
  routeId: string
  schoolName: string
  schoolId: string
  type: 'breach'
  status: AlertStatus
  reason: AlertReason | ''
  note: string
  fenceOutTime: string
  duration: string
  durationMinutes: number
  handlerName: string
  handleTime: string
  completeTime: string
  driverPhone: string
  driverName: string
  attendantName: string
}

export type HandleLogType = 'notification' | 'call' | 'note'
export type NotifyChannel = 'sms' | 'system' | 'app'
export type NotifyStatus = 'success' | 'failed' | 'duplicate'
export type NotifyTarget = 'driver' | 'supervisor' | 'both'

export interface HandleLog {
  id: string
  alertId: string
  type: HandleLogType
  content: string
  operatorName: string
  operateTime: string
  target?: string
  channel?: NotifyChannel
  notifyTarget?: NotifyTarget
  notifyStatus?: NotifyStatus
  failReason?: string
  callDuration?: string
}

export interface RouteReview {
  routeId: string
  routeName: string
  schoolId: string
  schoolName: string
  breachCount: number
  totalDurationMinutes: number
  avgDurationMinutes: number
  maxDurationMinutes: number
  avgDuration: string
  maxDuration: string
  handlers: string[]
  unclosedCount: number
}
