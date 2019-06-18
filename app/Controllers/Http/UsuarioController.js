"use strict";

const Database = use("Database");
const Hash = use("Hash");

class UsuarioController {
  async fetch({ params, request, response, auth }) {
    let { busca, ativo } = request.get();

    return await Database.connection(params.db)
      .table("usuarios")
      .where(function() {
        if (!!busca) {
          this.where("login", "like", `%${busca}%`).orWhere(
            "email",
            "like",
            `%${busca}%`
          );
        }
      })
      .where(function() {
        if (!!ativo) {
          this.where("ativo", ativo);
        }
      })
      .orderBy("login", "asc");
  }

  async create({ params, request, response, auth }) {
    try {
      let data = request.all();

      data.senha = await Hash.make(data.senha);
      data.ativo = 1;

      return await Database.connection(params.db)
        .table("usuarios")
        .insert(data);
    } catch (error) {
      return response.status(555).json(error);
    }
  }

  async update({ params, request, response, auth }) {
    try {
      let data = request.all();
      let usuario = await Database.connection(params.db)
        .table("usuarios")
        .where("id", params.id)
        .first();

      // verifica se alterou a senha e aplica o hash
      if (data.senha != usuario.senha) {
        data.senha = await Hash.make(data.senha);
      }

      return await Database.connection(params.db)
        .table("usuarios")
        .where("id", params.id)
        .update(data);
    } catch (error) {
      return response.status(555).json(error);
    }
  }
}

module.exports = UsuarioController;
