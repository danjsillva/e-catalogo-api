"use strict";

const Database = use("Database");

class LaboratorioController {
  async fetch({ params, request, response, auth }) {
    let { busca } = request.get();

    return await Database.connection(params.db)
      .table("laboratorios")
      .where(function() {
        if (!!busca) {
          this.where("nome", "like", `%${busca}%`);
        }
      })
      .orderBy("nome", "asc");
  }

  async create({ params, request, response, auth }) {
    try {
      let data = request.all();

      return await Database.connection(params.db)
        .table("laboratorios")
        .insert(data);
    } catch (error) {
      return response.status(555).json(error);
    }
  }

  async remove({ params, request, response, auth }) {
    try {
      return await Database.connection(params.db)
        .table("laboratorios")
        .where("id", params.id)
        .delete();
    } catch (error) {
      return response.status(555).json(error);
    }
  }
}

module.exports = LaboratorioController;
