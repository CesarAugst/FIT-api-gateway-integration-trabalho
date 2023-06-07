const { Router } = require("express");

const PedidosController = require("../controllers/PedidosController");
const ItemPedidosController = require("../controllers/ItemPedidosController");

const pedidosRoutes = Router();

const pedidosController = new PedidosController();
const itemPedidosController = new ItemPedidosController();

pedidosRoutes.post("/", pedidosController.create);
pedidosRoutes.get("/:numero", pedidosController.show);
pedidosRoutes.get("/", pedidosController.index);

pedidosRoutes.post("/:numero/item", itemPedidosController.create);
pedidosRoutes.get("/:numero/item/:indice", itemPedidosController.show);
pedidosRoutes.get("/:numero/item", itemPedidosController.index);
pedidosRoutes.get("/item", itemPedidosController.index);

module.exports = pedidosRoutes;