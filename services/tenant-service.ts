import { DEMO_TENANT, mockDelay } from "@/types/organization"
export const tenantService = { getCurrent: () => mockDelay(DEMO_TENANT) }
export default tenantService
