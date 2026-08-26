import { DEMO_NOTIFICATIONS, mockDelay } from "@/types/organization"
export const notificationService = { list: () => mockDelay(DEMO_NOTIFICATIONS), unreadCount: () => mockDelay(DEMO_NOTIFICATIONS.filter((item) => !item.read).length) }
export default notificationService
