"use strict";

const Database = use("Database");
const Helpers = use("Helpers");

const Produto = use("App/Models/Produto");
const Laboratorio = use("App/Models/Laboratorio");
const Categoria = use("App/Models/Categoria");

class ProdutoController {
  async fetch({ params, request, response, auth }) {
    let { busca, categoria, laboratorio } = request.get();

    let produtos = await Produto.query()
      .select("produtos.*")
      .join("laboratorios", "laboratorios.id", "produtos.laboratorios_id")
      .where(function() {
        if (!!busca) {
          this.where("produtos.nome", "like", `%${busca}%`)
            .orWhere("produtos.ean", "like", `%${busca}%`)
            .orWhere("produtos.descricao", "like", `%${busca}%`);
        }
      })
      .orderBy("produtos.nome", "asc")
      .fetch();

    for (const produto of produtos.rows) {
      produto.laboratorio = await Laboratorio.find(produto.laboratorios_id);
      produto.categorias = await Categoria.query()
        .join(
          "produtos_categorias",
          "produtos_categorias.categorias_id",
          "categorias.id"
        )
        .where("produtos_categorias.produtos_id", produto.id)
        .fetch();
    }
    return produtos;
  }

  async read({ params, request, response, auth }) {
    let produto;

    return produto;
  }

  async create({ params, request, response, auth }) {
    try {
      let usuario = await auth.getUser();

      let { categorias, ...data } = request.all();
      let imagemProduto = request.file("imagem");

      let imagemNome = Date.now() + ".jpg";
      let imagemPath = usuario.login;

      let produto = new Produto();

      await imagemProduto.move(Helpers.publicPath(imagemPath), {
        name: imagemNome,
        overwrite: true
      });

      data.url_imagem = `public/${imagemPath}/${imagemNome}`;

      produto.merge(data);
      await produto.save();

      for (const categoria of categorias) {
        await Database.from("produtos_categorias").insert({
          produtos_id: produto.id,
          categorias_id: categoria.id
        });
      }

      return produto;
    } catch (error) {
      return response.status(555).json(error);
    }
  }

  async remove({ params, request, response, auth }) {
    try {
      let produto = await Produto.find(params.id);

      await produto.delete();

      return produto;
    } catch (error) {
      return response.status(555).json(error);
    }
  }
}

module.exports = ProdutoController;
