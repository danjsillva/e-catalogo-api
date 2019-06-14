"use strict";

const Database = use("Database");

const Usuario = use("App/Models/Usuario");

/**
 * Resourceful controller for interacting with auth
 */
class AuthController {
  /**
   * Do user authentication.
   */
  async auth({ request, response, auth }) {
    let { login, senha } = await request.all();

    return await auth.attempt(login, senha);
  }

  /**
   * Get logged user.
   */
  async check({ request, response, auth }) {
    // let token = await auth.getAuthHeader()
    let user = await auth.getUser();

    return user;
  }
}

module.exports = AuthController;
