addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  return new Response('Hello from Abogado Wilson Website!', {
    headers: { 'content-type': 'text/plain' }
  })
}
