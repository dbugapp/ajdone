import type { H3Event } from 'h3'

const create = async (_: unknown, event: H3Event) => {
  const form = await readFormData(event)
  const file = form.get('file') as File

  if (!file || !file.size) {
    return metapi().error(event, 'No file provided')
  }

  const hash = await hashFromFile(file)

  await hubBlob().put(hash, file, {
    addRandomSuffix: false,
    prefix: 'images',
  })

  return metapi().success('Image uploaded', { hash: hash })
}

const serve = defineEventHandler(async (event) => {
  // TODO: sanitize hash
  const hash = getRouterParam(event, '_0')
  try {
    return await hubBlob().serve(event, `images/${hash}`)
  }
  catch (_e) {
    return metapi().error(event, 'image not found', 204)
  }
})

export default {
  create,
  serve,
}
