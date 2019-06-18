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
        .join("laboratorios", "laboratorios.id", "produtos.laboratorios_id")
        .where(function() {
          if (!!busca) {
            this.where("produtos.nome", "like", `%${busca}%`)
              .orWhere("produtos.ean", "like", `%${busca}%`)
              .orWhere("produtos.descricao", "like", `%${busca}%`);
          }
        })
        .orderBy("produtos.nome", "asc");

      for (const produto of produtos) {
        produto.laboratorio = await Database.connection(params.db)
          .table("laboratorios")
          .where("id", produto.laboratorios_id)
          .first();
        produto.categorias = await Database.connection(params.db)
          .table("categorias")
          .select("categorias.*")
          .join(
            "produtos_categorias",
            "produtos_categorias.categorias_id",
            "categorias.id"
          )
          .where("produtos_categorias.produtos_id", produto.id);
      }

      return produtos;
    } catch (error) {
      return response.status(555).json(error);
    }
  }

  async create({ params, request, response, auth }) {
    try {
      let { categorias, laboratorio, ...data } = request.all();
      let imagemProduto = request.file("imagem");

      let imagemNome = Date.now() + ".jpg";
      let imagemPath = params.db;

      await imagemProduto.move(Helpers.publicPath(imagemPath), {
        name: imagemNome,
        overwrite: true
      });

      data.url_imagem = `${imagemPath}/${imagemNome}`;

      await Database.connection(params.db)
        .table("produtos")
        .insert(data);

      for (const categoria of categorias) {
        await Database.connection(params.db)
          .table("produtos_categorias")
          .insert({
            produtos_id: produto.id,
            categorias_id: categoria.id
          });
      }

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
