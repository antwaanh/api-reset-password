'use strict'

class AuthenticateUser {
  get rules () {
    return {
      email: 'required|email',
      password: 'required'
    }
  }
}

module.exports = AuthenticateUser
