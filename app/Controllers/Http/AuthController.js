'use strict'

class AuthController {
  async authorize ({ request, response, auth }) {
    const { email, password } = request.all()

    const token = await auth.attempt(email, password)

    response.ok(token)
  }
}

module.exports = AuthController
