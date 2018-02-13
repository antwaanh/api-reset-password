'use strict'

class ForgotPasswordUser {
  get rules () {
    return {
      email: 'required|email'
    }
  }
}

module.exports = ForgotPasswordUser
