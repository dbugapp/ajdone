import { googleHandler } from '../controllers/oauth'
import image from '../controllers/image'
import user from '../controllers/user'
import token from '../controllers/token'

const router = createRouter()

const binder = modelBinder({ drizzleFactory: useDrizzle,
  tables: {
    token: tables.tokens,
    user: tables.users,
  },
}, router)

router.get('/**', defineEventHandler(event => metapi().notFound(event)))

binder.apiResource ('/image', image)
router.get('/image/*', image.serve)

router.get('/oauth/google', googleHandler)
router.get('/logout', user.logout)

binder.apiResource<{ token: Token }>('/token', token)
export default useBase('/api', router.handler)
