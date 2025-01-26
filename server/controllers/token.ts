import type { H3Event } from 'h3'
import { UAParser } from 'ua-parser-js'
import { token as policies } from '../policies/token'

// return the token adding isCurrent and client
const tokenModel = (token: Token, userToken = '') => ({
  ...token,
  isCurrent: userToken === token.hash,
  client: new UAParser(token.agent).getResult(),
})

const index = async (_: unknown, event: H3Event) => {
  const { user: authed } = await requireUserSession(event)
  const tokens = await useDrizzle().query.tokens.findMany({
    where: () => eq(tables.tokens.userId, authed.id),
  })

  return metapi().render(tokens.map(t => tokenModel(t, authed.hash)))
}

const get = async ({ token }: { token: Token }, event: H3Event) => {
  const { user: authed } = await requireUserSession(event)
  authorize(policies.get, { authed, token })
  return metapi().render(tokenModel(token))
}

const remove = async ({ token }: { token: Token }, event: H3Event) => {
  const { user: authed } = await requireUserSession(event)
  authorize(policies.remove, { authed, token })
  await useDrizzle().delete(tables.tokens).where(and(eq(tables.tokens.id, token.id), eq(tables.tokens.userId, authed.id)))
  return metapi().success('token deleted')
}

export default {
  index,
  get,
  remove,
}
