import { DEMO_ACTIVITY, mockDelay } from "@/types/organization"
export const activityService = { list: () => mockDelay(DEMO_ACTIVITY) }
export default activityService
