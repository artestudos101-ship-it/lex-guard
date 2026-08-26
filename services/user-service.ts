import { DEMO_USERS, mockDelay } from "@/types/organization"
export const userService = { list: () => mockDelay(DEMO_USERS), invite: (email: string) => mockDelay({ email, status: "invited" as const }) }
export default userService
