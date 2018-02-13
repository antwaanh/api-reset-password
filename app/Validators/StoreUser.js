'use strict'

class StoreUser {
  get rules () {
    return {
      name: 'required|string|max:255',
      username: 'string|max:30|unique:users,username',
      email: 'required|email|unique:users,email',
      password: 'required'
    }
  }
}

module.exports = StoreUser
