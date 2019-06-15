"use strict";

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use("Route");
const Helpers = use("Helpers");

Route.get("/", () => {
  return { greeting: "Welcome to E-catalogo API" };
});

Route.post("/auth", "AuthController.auth");
Route.get("/auth", "AuthController.check");

Route.get("/usuarios", "UsuarioController.fetch");
Route.post("/usuarios", "UsuarioController.create");
Route.put("/usuarios/:id", "UsuarioController.update");
Route.delete("/usuarios/:id", "UsuarioController.remove");

Route.get("/produtos", "ProdutoController.fetch");
Route.post("/produtos", "ProdutoController.create").middleware("auth");
Route.delete("/produtos/:id", "ProdutoController.remove").middleware("auth");

Route.get("/laboratorios", "LaboratorioController.fetch");
Route.post("/laboratorios", "LaboratorioController.create").middleware("auth");
Route.delete("/laboratorios/:id", "LaboratorioController.remove").middleware(
  "auth"
);

Route.get("/categorias", "CategoriaController.fetch");
Route.post("/categorias", "CategoriaController.create").middleware("auth");
Route.delete("/categorias/:id", "CategoriaController.remove").middleware(
  "auth"
);

Route.get("/public/:path/:nome", async function({ response, params }) {
  response.download(Helpers.publicPath(`${params.path}/${params.nome}`));
});
