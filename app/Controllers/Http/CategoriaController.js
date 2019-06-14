"use strict";

const Categoria = use("App/Models/Categoria");

class CategoriaController {
  async fetch({ params, request, response, auth }) {
    let { busca } = request.get();

    let categorias = await Categoria.query()
      .where(function() {
        if (!!busca) {
          this.where("nome", "like", `%${busca}%`);
        }
      })
      .orderBy("nome", "asc")
      .fetch();

    return categorias;
  }

  async create({ params, request, response, auth }) {
    try {
      let data = request.all();
      let categoria = new Categoria();

      categoria.merge(data);
      await categoria.save();

      return categoria;
    } catch (error) {
      return response.status(555).json(error);
    }
  }

  async remove({ params, request, response, auth }) {
    try {
      let categoria = await Categoria.find(params.id);

      await categoria.delete();

      return categoria;
    } catch (error) {
      return response.status(555).json(error);
    }
  }
}

module.exports = CategoriaController;
