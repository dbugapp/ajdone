export default defineEventHandler(async (event) => {
  event.doStuff()
  return { message: 'Hello, world!' }
})
