const { Router } = require("express");

const pedidoRouter = require("./pedidos.routes");

const routes = Router();

routes.use("/api/v1/pedido", pedidoRouter);

module.exports = routes;