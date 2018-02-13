'use strict'

const Env = use('Env')
const Hash = use('Hash')
const Mail = use('Mail')
const crypto = use('crypto')
const User = use('App/Models/User')
const PasswordReset = use('App/Models/PasswordReset')

class ForgotPasswordController {
  async sendResetLinkEmail ({ request, response }) {
    const { email } = request.all()
    const user = await User.query().where('email', email).firstOrFail()

    this._sendResetLink(email)
    response.ok({ message: 'Password Reset Email Sent' })
  }

  async _sendResetLink (email) {
    const reset_token = await this.storeResetToken(email)

    if (reset_token.length) {
      const app_url = Env.get('APP_URL')
      await Mail.send(
        'emails.password-reset',
        { reset_token, app_url },
        message => {
          message.subject('Password Reset')
          message.from('myapp@example.com')
          message.to(email)
        }
      )
    }
  }

  async storeResetToken (email) {
    const random_str = crypto.randomBytes(20).toString('hex')
    const token = await Hash.make(random_str)

    const reset_token = await PasswordReset.findOrCreate({ email })

    reset_token.merge({ token })
    await reset_token.save()

    return random_str
  }
}

module.exports = ForgotPasswordController
