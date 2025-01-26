import type { H3Event } from 'h3'
import { useDrizzle, eq, tables } from './drizzle'
import type { User as AuthUser } from '#auth-utils'
import type { GithubUserInfo, GoogleUserInfo, TokenLocation, UserInfo } from '~/types/auth'

export const userFromEmail = async (email: string) =>
  await useDrizzle().query.users.findFirst({ where: eq(tables.users.email, email) })

const userGetCoordinate = (event?: H3Event): { lat: number, lon: number } => {
  if (event?.node.req.headers['Cloudfront-Viewer-Latitude'] && event?.node.req.headers['Cloudfront-Viewer-Longitude'])
    return {
      lat: parseFloat(event.node.req.headers['Cloudfront-Viewer-Latitude'] as string),
      lon: parseFloat(event.node.req.headers['Cloudfront-Viewer-Longitude'] as string),
    }

  if (event?.node.req.headers['cf-iplatitude'] && event?.node.req.headers['cf-iplongitude'])
    return {
      lat: parseFloat(event.node.req.headers['cf-iplatitude'] as string),
      lon: parseFloat(event.node.req.headers['cf-iplongitude'] as string),
    }

  return {
    lat: 30.2423,
    lon: -97.7672,
  }
}

export const userCreateSession = async (provider: string, user: AuthUser, event?: H3Event): Promise<AuthUser> => {
  const coordinate = userGetCoordinate(event)

  const location: TokenLocation = {
    city: event?.node.req.headers['Cloudfront-Viewer-City'] as string
      || event?.node.req.headers['cf-ipcity'] as string
      || 'Austin',
    region: event?.node.req.headers['Cloudfront-Viewer-Region-Name'] as string
      || event?.node.req.headers['cf-region-code'] as string
      || 'TX',
    country: event?.node.req.headers['Cloudfront-Viewer-Country'] as string
      || event?.node.req.headers['cf-ipcountry'] as string
      || 'US',
    timezone: event?.node.req.headers['Cloudfront-Viewer-Timezone'] as string
      || event?.node.req.headers['cf-timezone'] as string
      || 'America/Chicago',
  }

  const cfg = useRuntimeConfig(event)

  const tokenValues = {
    userId: user.id,
    hash: `${cfg.public.prefix}_${hashGenerate(64)}`,
    source: `oauth:${provider}`,
    ip: event?.node.req.headers['x-forwarded-for'] as string || '127.0.0.1',
    agent: event?.node.req.headers['user-agent'] as string || 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36',
    location: location,
    coordinate,
  }
  const token = await useDrizzle().insert(tables.tokens).values(tokenValues).returning()

  user.hash = token[0].hash
  return user
}

const storeAvatar = async (avatar: string) => {
  const { imageHash, imageFile } = await hashFromUrl(avatar)
  await hubBlob().put(imageHash, imageFile, {
    addRandomSuffix: false,
    prefix: 'images',
  })
  return imageHash
}

export const userCreate = async (info: UserInfo, provider: string, oauthPayload: GoogleUserInfo | GithubUserInfo, event?: H3Event): Promise<User> => {
  const existing = await useDrizzle().query.users.findFirst({
    where: eq(tables.users.email, info.email),
  })

  const [user] = existing
    ? await useDrizzle().update(tables.users)
      .set({ name: info.name })
      .where(eq(tables.users.id, existing.id))
      .returning()
    : await useDrizzle().insert(tables.users)
      .values({
        email: info.email,
        name: info.name,
        avatar: info.avatar ? `${useRuntimeConfig(event).public.url}/api/image/${await storeAvatar(info.avatar)}` : null,
      })
      .returning()

  if (!user) createError('Failed to create user')

  await useDrizzle().insert(tables.providers).values({
    userId: user?.id,
    name: provider,
    avatar: info.avatar,
    payload: oauthPayload,
  }).onConflictDoNothing().returning()

  return userCreateSession(provider, user as unknown as AuthUser, event)
}

export const userSignIn = async (event: H3Event, oauthPayload: GoogleUserInfo | GithubUserInfo, provider: string): Promise<AuthUser> => {
  let userPayload: GithubUserInfo | GoogleUserInfo = oauthPayload
  userPayload = oauthPayload as GithubUserInfo
  const info: UserInfo = { email: '', name: '', avatar: '' }

  if (provider === 'google') {
    userPayload = oauthPayload as GoogleUserInfo
    info.email = userPayload.email
    info.name = userPayload.name
    info.avatar = userPayload.picture
  }

  if (provider === 'github') {
    userPayload = oauthPayload as GithubUserInfo
    info.email = userPayload.email
    info.name = userPayload.name
    info.avatar = userPayload.avatar_url
  }
  return await userCreate(info, provider, oauthPayload, event)
}
