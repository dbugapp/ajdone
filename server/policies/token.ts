function get({ authed, token }: { authed: User, token: Token }) {
  return authed.id === token.userId
}

function remove({ authed, token }: { authed: User, token: Token }) {
  return authed.id === token.userId
}

export const token = {
  get,
  remove,
}
