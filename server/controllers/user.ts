const logout = defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  await useDrizzle().delete(tables.tokens).where(and(eq(tables.tokens.userId, user.id), eq(tables.tokens.hash, user.hash)))
  await clearUserSession(event)
  return metapi().success('logged out')
})

export default {
  logout,
}
