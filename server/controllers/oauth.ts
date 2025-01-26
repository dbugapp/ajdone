import type { EventHandlerRequest, H3Event } from 'h3'
import type { GoogleUserInfo } from '~/types/auth'

export const googleHandler = defineOAuthGoogleEventHandler({
  async onSuccess(event: H3Event<EventHandlerRequest>, { user }: { user: GoogleUserInfo }) {
    const dbUser = await userSignIn(event, user, 'google')
    await setUserSession(event, { user: dbUser })
    return sendRedirect(event, '/')
  },
})
