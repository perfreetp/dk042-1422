import type { School, Route, Bus, Alert, HandleLog } from '@/types'

export const schools: School[] = [
  { id: 's1', name: '阳光小学' },
  { id: 's2', name: '育才中学' },
  { id: 's3', name: '星星幼儿园' },
]

export const routes: Route[] = [
  {
    id: 'r1', name: '阳光小学-东线', schoolId: 's1',
    fencePoints: [{ x: 60, y: 40 }, { x: 180, y: 30 }, { x: 200, y: 120 }, { x: 140, y: 180 }, { x: 50, y: 150 }],
  },
  {
    id: 'r2', name: '阳光小学-西线', schoolId: 's1',
    fencePoints: [{ x: 40, y: 60 }, { x: 160, y: 50 }, { x: 180, y: 160 }, { x: 100, y: 190 }, { x: 30, y: 140 }],
  },
  {
    id: 'r3', name: '育才中学-1号线', schoolId: 's2',
    fencePoints: [{ x: 80, y: 30 }, { x: 220, y: 40 }, { x: 230, y: 140 }, { x: 150, y: 180 }, { x: 60, y: 130 }],
  },
  {
    id: 'r4', name: '育才中学-2号线', schoolId: 's2',
    fencePoints: [{ x: 50, y: 50 }, { x: 190, y: 40 }, { x: 210, y: 130 }, { x: 130, y: 170 }, { x: 40, y: 120 }],
  },
  {
    id: 'r5', name: '育才中学-3号线', schoolId: 's2',
    fencePoints: [{ x: 70, y: 35 }, { x: 200, y: 45 }, { x: 210, y: 150 }, { x: 120, y: 185 }, { x: 55, y: 130 }],
  },
  {
    id: 'r6', name: '星星幼儿园-A线', schoolId: 's3',
    fencePoints: [{ x: 90, y: 30 }, { x: 210, y: 35 }, { x: 220, y: 130 }, { x: 140, y: 175 }, { x: 70, y: 120 }],
  },
  {
    id: 'r7', name: '星星幼儿园-B线', schoolId: 's3',
    fencePoints: [{ x: 55, y: 45 }, { x: 175, y: 40 }, { x: 195, y: 140 }, { x: 110, y: 180 }, { x: 40, y: 125 }],
  },
  {
    id: 'r8', name: '星星幼儿园-C线', schoolId: 's3',
    fencePoints: [{ x: 65, y: 50 }, { x: 185, y: 35 }, { x: 205, y: 135 }, { x: 125, y: 175 }, { x: 50, y: 120 }],
  },
]

const now = new Date()
const fmt = (h: number, m: number) => {
  const d = new Date(now)
  d.setHours(h, m, 0, 0)
  return d.toLocaleString('zh-CN', { hour12: false })
}

export const buses: Bus[] = [
  { id: 'b1', plateNumber: '京A·12345', routeId: 'r1', schoolId: 's1', status: 'normal', latitude: 39.9142, longitude: 116.4074, mapX: 120, mapY: 100, attendantName: '张丽华', driverName: '王建国', driverPhone: '138****1001', lastUpdateTime: fmt(7, 30), lastFenceInTime: fmt(7, 15), lastFenceOutTime: '-' },
  { id: 'b2', plateNumber: '京A·12346', routeId: 'r1', schoolId: 's1', status: 'normal', latitude: 39.9165, longitude: 116.4102, mapX: 130, mapY: 90, attendantName: '李秀英', driverName: '赵明远', driverPhone: '138****1002', lastUpdateTime: fmt(7, 28), lastFenceInTime: fmt(7, 12), lastFenceOutTime: '-' },
  { id: 'b3', plateNumber: '京A·22001', routeId: 'r2', schoolId: 's1', status: 'near_fence', latitude: 39.9088, longitude: 116.3974, mapX: 170, mapY: 55, attendantName: '陈美玲', driverName: '刘志强', driverPhone: '138****2001', lastUpdateTime: fmt(7, 32), lastFenceInTime: fmt(7, 10), lastFenceOutTime: '-' },
  { id: 'b4', plateNumber: '京A·22002', routeId: 'r2', schoolId: 's1', status: 'normal', latitude: 39.9110, longitude: 116.4012, mapX: 100, mapY: 110, attendantName: '周晓燕', driverName: '孙国庆', driverPhone: '138****2002', lastUpdateTime: fmt(7, 26), lastFenceInTime: fmt(7, 8), lastFenceOutTime: '-' },
  { id: 'b5', plateNumber: '京B·33001', routeId: 'r3', schoolId: 's2', status: 'breached', latitude: 39.9200, longitude: 116.4150, mapX: 240, mapY: 80, attendantName: '吴红梅', driverName: '郑伟', driverPhone: '139****3001', lastUpdateTime: fmt(7, 35), lastFenceInTime: fmt(6, 55), lastFenceOutTime: fmt(7, 20) },
  { id: 'b6', plateNumber: '京B·33002', routeId: 'r3', schoolId: 's2', status: 'normal', latitude: 39.9130, longitude: 116.4088, mapX: 140, mapY: 95, attendantName: '杨秀兰', driverName: '马天宇', driverPhone: '139****3002', lastUpdateTime: fmt(7, 29), lastFenceInTime: fmt(7, 5), lastFenceOutTime: '-' },
  { id: 'b7', plateNumber: '京B·44001', routeId: 'r4', schoolId: 's2', status: 'normal', latitude: 39.9095, longitude: 116.3998, mapX: 110, mapY: 105, attendantName: '黄丽娟', driverName: '林志远', driverPhone: '139****4001', lastUpdateTime: fmt(7, 27), lastFenceInTime: fmt(7, 0), lastFenceOutTime: '-' },
  { id: 'b8', plateNumber: '京B·44002', routeId: 'r4', schoolId: 's2', status: 'normal', latitude: 39.9120, longitude: 116.4050, mapX: 130, mapY: 88, attendantName: '徐玉兰', driverName: '郭建华', driverPhone: '139****4002', lastUpdateTime: fmt(7, 31), lastFenceInTime: fmt(7, 3), lastFenceOutTime: '-' },
  { id: 'b9', plateNumber: '京B·55001', routeId: 'r5', schoolId: 's2', status: 'normal', latitude: 39.9108, longitude: 116.4030, mapX: 125, mapY: 98, attendantName: '孙桂芳', driverName: '何军', driverPhone: '139****5001', lastUpdateTime: fmt(7, 33), lastFenceInTime: fmt(7, 8), lastFenceOutTime: '-' },
  { id: 'b10', plateNumber: '京B·55002', routeId: 'r5', schoolId: 's2', status: 'near_fence', latitude: 39.9180, longitude: 116.4125, mapX: 205, mapY: 50, attendantName: '朱淑芬', driverName: '罗勇', driverPhone: '139****5002', lastUpdateTime: fmt(7, 34), lastFenceInTime: fmt(7, 2), lastFenceOutTime: '-' },
  { id: 'b11', plateNumber: '京C·66001', routeId: 'r6', schoolId: 's3', status: 'normal', latitude: 39.9150, longitude: 116.4090, mapX: 135, mapY: 92, attendantName: '马秀珍', driverName: '谢国栋', driverPhone: '137****6001', lastUpdateTime: fmt(7, 25), lastFenceInTime: fmt(7, 5), lastFenceOutTime: '-' },
  { id: 'b12', plateNumber: '京C·66002', routeId: 'r6', schoolId: 's3', status: 'normal', latitude: 39.9135, longitude: 116.4060, mapX: 150, mapY: 100, attendantName: '高凤英', driverName: '韩磊', driverPhone: '137****6002', lastUpdateTime: fmt(7, 22), lastFenceInTime: fmt(7, 0), lastFenceOutTime: '-' },
  { id: 'b13', plateNumber: '京C·77001', routeId: 'r7', schoolId: 's3', status: 'breached', latitude: 39.9220, longitude: 116.4180, mapX: 10, mapY: 90, attendantName: '林翠花', driverName: '唐明', driverPhone: '137****7001', lastUpdateTime: fmt(7, 36), lastFenceInTime: fmt(6, 50), lastFenceOutTime: fmt(7, 15) },
  { id: 'b14', plateNumber: '京C·77002', routeId: 'r7', schoolId: 's3', status: 'normal', latitude: 39.9115, longitude: 116.4040, mapX: 115, mapY: 108, attendantName: '郑玉兰', driverName: '冯国庆', driverPhone: '137****7002', lastUpdateTime: fmt(7, 20), lastFenceInTime: fmt(6, 55), lastFenceOutTime: '-' },
  { id: 'b15', plateNumber: '京C·88001', routeId: 'r8', schoolId: 's3', status: 'normal', latitude: 39.9145, longitude: 116.4080, mapX: 128, mapY: 95, attendantName: '曹丽萍', driverName: '彭志强', driverPhone: '136****8001', lastUpdateTime: fmt(7, 24), lastFenceInTime: fmt(7, 10), lastFenceOutTime: '-' },
  { id: 'b16', plateNumber: '京C·88002', routeId: 'r8', schoolId: 's3', status: 'normal', latitude: 39.9128, longitude: 116.4055, mapX: 138, mapY: 102, attendantName: '袁秀华', driverName: '蒋伟', driverPhone: '136****8002', lastUpdateTime: fmt(7, 21), lastFenceInTime: fmt(7, 6), lastFenceOutTime: '-' },
]

export const alerts: Alert[] = [
  {
    id: 'a1', busId: 'b5', plateNumber: '京B·33001', routeName: '育才中学-1号线', routeId: 'r3', schoolName: '育才中学', schoolId: 's2',
    type: 'breach', status: 'pending', reason: '', note: '',
    fenceOutTime: fmt(7, 20), duration: '15分钟', durationMinutes: 15,
    handlerName: '', handleTime: '', completeTime: '',
    driverPhone: '139****3001', driverName: '郑伟', attendantName: '吴红梅',
  },
  {
    id: 'a2', busId: 'b13', plateNumber: '京C·77001', routeName: '星星幼儿园-B线', routeId: 'r7', schoolName: '星星幼儿园', schoolId: 's3',
    type: 'breach', status: 'pending', reason: '', note: '',
    fenceOutTime: fmt(7, 15), duration: '21分钟', durationMinutes: 21,
    handlerName: '', handleTime: '', completeTime: '',
    driverPhone: '137****7001', driverName: '唐明', attendantName: '林翠花',
  },
  {
    id: 'a3', busId: 'b5', plateNumber: '京B·33001', routeName: '育才中学-1号线', routeId: 'r3', schoolName: '育才中学', schoolId: 's2',
    type: 'breach', status: 'processing', reason: '临时绕行', note: '前方路口封闭，绕行至建设路',
    fenceOutTime: fmt(7, 5), duration: '8分钟', durationMinutes: 8,
    handlerName: '李调度', handleTime: fmt(7, 12), completeTime: '',
    driverPhone: '139****3001', driverName: '郑伟', attendantName: '吴红梅',
  },
  {
    id: 'a4', busId: 'b3', plateNumber: '京A·22001', routeName: '阳光小学-西线', routeId: 'r2', schoolName: '阳光小学', schoolId: 's1',
    type: 'breach', status: 'completed', reason: '道路施工', note: '西三环辅路施工，经调度确认绕行',
    fenceOutTime: fmt(6, 40), duration: '12分钟', durationMinutes: 12,
    handlerName: '张调度', handleTime: fmt(6, 48), completeTime: fmt(6, 52),
    driverPhone: '138****2001', driverName: '刘志强', attendantName: '陈美玲',
  },
  {
    id: 'a5', busId: 'b10', plateNumber: '京B·55002', routeName: '育才中学-3号线', routeId: 'r5', schoolName: '育才中学', schoolId: 's2',
    type: 'breach', status: 'completed', reason: '司机误驶', note: '新司机不熟悉路线，已电话纠正',
    fenceOutTime: fmt(7, 0), duration: '5分钟', durationMinutes: 5,
    handlerName: '李调度', handleTime: fmt(7, 4), completeTime: fmt(7, 6),
    driverPhone: '139****5002', driverName: '罗勇', attendantName: '朱淑芬',
  },
]

export const handleLogs: HandleLog[] = [
  { id: 'h1', alertId: 'a3', type: 'notification', content: '短信已发送给司机郑伟（139****3001）', operatorName: '李调度', operateTime: fmt(7, 12), target: '司机郑伟', channel: 'sms', notifyTarget: 'driver', notifyStatus: 'success' },
  { id: 'h2', alertId: 'a3', type: 'notification', content: '系统通知已推送至安全主管王主任', operatorName: '李调度', operateTime: fmt(7, 12), target: '安全主管王主任', channel: 'system', notifyTarget: 'supervisor', notifyStatus: 'success' },
  { id: 'h3', alertId: 'a3', type: 'call', content: '与司机郑伟通话确认：前方路口封闭，已绕行至建设路，预计5分钟后回到规定路线', operatorName: '李调度', operateTime: fmt(7, 14), target: '郑伟', callDuration: '1分22秒' },
  { id: 'h4', alertId: 'a4', type: 'notification', content: '短信已发送给司机刘志强（138****2001）', operatorName: '张调度', operateTime: fmt(6, 48), target: '司机刘志强', channel: 'sms', notifyTarget: 'driver', notifyStatus: 'success' },
  { id: 'h5', alertId: 'a4', type: 'notification', content: '系统通知已推送至安全主管赵主任', operatorName: '张调度', operateTime: fmt(6, 48), target: '安全主管赵主任', channel: 'system', notifyTarget: 'supervisor', notifyStatus: 'success' },
  { id: 'h6', alertId: 'a4', type: 'call', content: '与司机刘志强通话确认：西三环辅路施工绕行，目前已在回程途中', operatorName: '张调度', operateTime: fmt(6, 50), target: '刘志强', callDuration: '58秒' },
  { id: 'h7', alertId: 'a4', type: 'note', content: '车辆已于06:52返回围栏范围内，预警关闭', operatorName: '张调度', operateTime: fmt(6, 52) },
  { id: 'h8', alertId: 'a5', type: 'notification', content: '短信已发送给司机罗勇（139****5002）', operatorName: '李调度', operateTime: fmt(7, 4), target: '司机罗勇', channel: 'sms', notifyTarget: 'driver', notifyStatus: 'success' },
  { id: 'h9', alertId: 'a5', type: 'notification', content: '系统通知已推送至安全主管陈主任', operatorName: '李调度', operateTime: fmt(7, 4), target: '安全主管陈主任', channel: 'system', notifyTarget: 'supervisor', notifyStatus: 'success' },
  { id: 'h10', alertId: 'a5', type: 'call', content: '与司机罗勇通话确认：新路线不熟悉导致误驶，已纠正方向', operatorName: '李调度', operateTime: fmt(7, 5), target: '罗勇', callDuration: '45秒' },
  { id: 'h11', alertId: 'a5', type: 'note', content: '车辆已于07:06返回围栏范围内，预警关闭', operatorName: '李调度', operateTime: fmt(7, 6) },
]
