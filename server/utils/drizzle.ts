import { drizzle } from 'drizzle-orm/d1'

import * as schema from '../database/schema'
import type { MetapiResponse } from '#api-utils'

export { sql, eq, and, or, count, inArray, desc, asc } from 'drizzle-orm'

export const tables = schema

export function useDrizzle() {
  return drizzle(hubDatabase(), { schema, logger: false })
}

export type User = typeof schema.users.$inferSelect
export type Token = typeof schema.tokens.$inferSelect & {
  client: UAParser.IResult
  isCurrent: boolean
}
export type ApiResponse<T> = MetapiResponse<T>
