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

    let validated_token = await Hash.verify(token, reset_entry.token)
    
    if (validated_token && this._isTokenExpired(reset_entry)) {
      validated_token = false
    }

    // delete/invalidate token
    await reset_entry.delete()

    return validated_token
  }

  _isTokenExpired(reset_entry) {
    const MINUTE = 1000 * 60
    const expires_in_minutes = Config.get('auth.password_reset.expires_in_minutes')

    const expires_in_milliseconds = MINUTE * expires_in_minutes
    const token_valid_since = Date.now() - expires_in_milliseconds;

    return reset_entry.updated_at <= token_valid_since;
  }

  async _resetPassword (email, password) {
    const user = await User.query().where('email', email).firstOrFail()
    user.password = await Hash.make(password)

    return await user.save()
  }
}

module.exports = PasswordResetController
