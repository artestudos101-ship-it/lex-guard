import { DEMO_TEAMS, mockDelay } from "@/types/organization"
export const teamService = { list: () => mockDelay(DEMO_TEAMS), get: (id: string) => mockDelay(DEMO_TEAMS.find((team) => team.id === id) ?? DEMO_TEAMS[0]) }
export default teamService
