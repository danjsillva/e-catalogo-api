"use strict";

const Database = use("Database");
const Hash = use("Hash");

/**
 * Resourceful controller for interacting with auth
 */
class AuthController {
  /**
   * Do user authentication.
   */
  async auth({ params, request, response, auth }) {
    let { login, senha } = await request.all();

    let usuario = await Database.connection(params.db)
      .table("usuarios")
      .where("login", login)
      .first();

    if (!!usuario && (await Hash.verify(senha, usuario.senha))) {
      return await auth.generate(usuario);
    }

    return response.status(401).json({ error: "Credentials not found" });
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
