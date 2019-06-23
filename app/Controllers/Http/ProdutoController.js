"use strict";

const Database = use("Database");
const Helpers = use("Helpers");

class ProdutoController {
  async fetch({ params, request, response, auth }) {
    try {
      let { busca, categoria, laboratorio } = request.get();

      let produtos = await Database.connection(params.db)
        .table("produtos")
        .select("produtos.*")
        .where(function() {
          if (!!busca) {
            this.where("produtos.nome", "like", `%${busca}%`)
              .orWhere("produtos.ean", "like", `%${busca}%`)
              .orWhere("produtos.descricao", "like", `%${busca}%`);
          }
        })
        .orderBy("produtos.nome", "asc");

      return produtos;
    } catch (error) {
      return response.status(555).json(error);
    }
  }

  async create({ params, request, response, auth }) {
    try {
      let data = request.all();
      let imagemProduto = request.file("imagem");

      let imagemNome = Date.now() + ".jpg";
      let imagemPath = params.db;

      await imagemProduto.move(Helpers.publicPath(imagemPath), {
        name: imagemNome,
        overwrite: true
      });

      data.imagem = imagemNome;

      await Database.connection(params.db)
        .table("produtos")
        .insert(data);

      return data;
    } catch (error) {
      return response.status(555).json(error);
    }
  }

  async remove({ params, request, response, auth }) {
    try {
      return await Database.connection(params.db)
        .table("produtos")
        .where("id", params.id)
        .delete();
    } catch (error) {
      return response.status(555).json(error);
    }
  }
}

module.exports = ProdutoController;
