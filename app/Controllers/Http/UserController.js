'use strict'

const User = use('App/Models/User')

class UserController {
  async store ({ request, response }) {
    let user = await User.create(request.all())

    response.created(user)
  }

  async show ({ response, params }) {
    let user = await User.find(params.id)

    response.success(user)
  }

  async update ({ request, response, params }) {
    let user = await User.find(params.id)

    user.merge(request.all())
    await user.save()

    response.updated(user)
  }

  async destroy ({ response, params }) {
    let user = await User.find(params.id)

    user.merge({ deleted_at: new Date() })
    await user.save()

    response.deleted(user)
  }
}

module.exports = UserController
