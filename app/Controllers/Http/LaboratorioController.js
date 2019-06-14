"use strict";

const Laboratorio = use("App/Models/Laboratorio");

class LaboratorioController {
  async fetch({ params, request, response, auth }) {
    let { busca } = request.get();

    let laboratorios = await Laboratorio.query()
      .where(function() {
        if (!!busca) {
          this.where("nome", "like", `%${busca}%`);
        }
      })
      .orderBy("nome", "asc")
      .fetch();

    return laboratorios;
  }

  async create({ params, request, response, auth }) {
    try {
      let data = request.all();
      let laboratorio = new Laboratorio();

      laboratorio.merge(data);
      await laboratorio.save();

      return laboratorio;
    } catch (error) {
      return response.status(555).json(error);
    }
  }

  async remove({ params, request, response, auth }) {
    try {
      let laboratorio = await Laboratorio.find(params.id);

      await laboratorio.delete();

      return laboratorio;
    } catch (error) {
      return response.status(555).json(error);
    }
  }
}

module.exports = LaboratorioController;
