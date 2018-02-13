'use strict'

class UpdateUser {
  get rules () {
    return {
      name: 'string|max:255',
      username: 'string|max:30|unique:users,username'
    }
  }
}

module.exports = UpdateUser
