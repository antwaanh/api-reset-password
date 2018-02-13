'use strict'

class PasswordResetUser {
  get rules () {
    return {
      token: 'required',
      email: 'required|email',
      password: 'required|confirmed|min:6'
    }
  }
}

module.exports = PasswordResetUser
