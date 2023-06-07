const { Router } = require("express");

const PedidosController = require("../controllers/PedidosController");

const pedidosRoutes = Router();

const pedidosController = new PedidosController();

pedidosRoutes.post("/", pedidosController.create);
pedidosRoutes.get("/:numero", pedidosController.show);
pedidosRoutes.get("/", pedidosController.index);

module.exports = pedidosRoutes;