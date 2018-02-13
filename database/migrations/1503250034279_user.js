'use strict'

const Schema = use('Schema')

class UserSchema extends Schema {
  up () {
    this.create('users', table => {
      table.increments()
      table.string('name', 255)
      table.string('username', 80).notNullable().unique()
      table.string('email', 255).notNullable().unique()
      table.string('password', 60).notNullable()
      table.timestamps()
      table.dateTime('deleted_at')
    })
  }

  down () {
    this.drop('users')
  }
}

module.exports = UserSchema
