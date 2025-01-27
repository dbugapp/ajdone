export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  const rand = Math.random().toString(36).substring(2, 8).toUpperCase()
  throw new Error(`nitro error ${rand}`)
  return user
})
