'use strict'

const Hash = use('Hash')
const User = use('App/Models/User')
const PasswordReset = use('App/Models/PasswordReset')

class PasswordResetController {
  async reset ({ request, response }) {
    const { token, email, password } = request.all()
    const verified_token = await this._verifyToken(email, token)

    if (verified_token) {
      await this._resetPassword(email, password)
    } else {
      response.status(406).send({ message: 'Token has expired' })
    }

    response.ok({ message: 'Password updated successfully' })
  }

  async show ({ params, view }) {
    const { token } = params
    return view.render('password_reset.show', { token })
  }

  async _getUser (email) {
    return await User.query().where('email', email).firstOrFail()
  }

  async _verifyToken (email, token) {
    const reset_entry = await PasswordReset.query()
      .where('email', email)
      .first()

    const validated_token = await Hash.verify(token, reset_entry.token)

    // delete/invalidate token
    await reset_entry.delete()

    return validated_token
  }

  async _resetPassword (email, password) {
    const user = await User.query().where('email', email).firstOrFail()
    user.password = await Hash.make(password)

    return await user.save()
  }
}

module.exports = PasswordResetController
