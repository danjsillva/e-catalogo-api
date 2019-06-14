"use strict";

const Database = use("Database");
const Hash = use("Hash");

const Usuario = use("App/Models/Usuario");

class UsuarioController {
  async fetch({ params, request, response, auth }) {
    let { busca, ativo } = request.get();

    let usuarios = await Usuario.query()
      .select()
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
      .orderBy("login", "asc")
      .fetch();

    return usuarios;
  }

  async read({ params, request, response, auth }) {
    let usuario = await Usuario.query()
      .select()
      .where("idusuario", params.id)
      .fetch();

    usuario.menus = await Database.from("usuario_menu")
      .where("usuario_idusuario", usuario.idusuario)
      .pluck("menu_idmenu");

    return usuario;
  }

  async create({ params, request, response, auth }) {
    try {
      let { menus, ...data } = request.all();
      let usuario = new Usuario();

      data.senha = await Hash.make(data.senha);
      data.ativo = 1;

      usuario.merge(data);
      await usuario.save();

      await this.saveMenusUsuario(usuario, menus);

      usuario.menus = await Database.from("usuario_menu")
        .where("usuario_idusuario", usuario.idusuario)
        .pluck("menu_idmenu");

      return usuario;
    } catch (error) {
      return response.status(555).json(error);
    }
  }

  async update({ params, request, response, auth }) {
    try {
      let data = request.all();
      let usuario = await Usuario.findOrFail(params.id);

      // verifica se alterou a senha e aplica o hash
      if (data.senha != usuario.senha) {
        data.senha = await Hash.make(data.senha);
      }

      usuario.merge(data);
      await usuario.save();

      return usuario;
    } catch (error) {
      return response.status(555).json(error);
    }
  }
}

module.exports = UsuarioController;
