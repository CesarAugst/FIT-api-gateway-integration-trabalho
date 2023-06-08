const knex = require("../database");

class ItemPedidosController {
  async create(request, response) {
    //pega pedido da url
    const { numero } = request.params;
    //pega propriedades do corpo
    const { produto, preco, quantidade } = request.body;
    //monta indice
    const indice = await getIndice(numero);
    //monta sku
    const sku = getSku();
    
    //cria um item do pedido pedido e retorna o id da criacao para uma variavel
    const item_pedido_id = await knex("item_pedido")
      .returning('*')
      .insert({
        numero,
        indice,
        sku,
        produto,
        preco,
        quantidade
      });
    //busca o registro criado  ocm o id da criacao
    const item_pedido = await knex("item_pedido").where({id: item_pedido_id}).first();
    //retorna a criacao para a resposta da requisicao
    return response.json(item_pedido);
  }

  async show(request, response) {
    //pega pedido e indice da url
    const { numero, indice } = request.params;
    //busca item do pedido
    const {status, payload} = await getItemPedido({ numero, indice });
    //retorna item do pedido para resposta da requisicao
    return response.status(status).send(payload);
  }

  async index(request, response) {
    //pega pedido da url
    const { numero } = request.params;
    //pega filtros da url
    const { produto } = request.query;
    //busca item do pedido
    const item_pedido_list = await knex("item_pedido")
    .where((qb) => {
      //filtro de pedido
      qb.where({numero});
      //filtro de produto
      if(produto){
        qb.where('item_pedido.produto', 'like', `%${produto}%`);
      }
    });
    //retorna os itens do pedido para resposta da requisicao
    return response.json(item_pedido_list);
  }
}

//montei uma logica para fazer o sku
function getSku(){
  const data = new Date(); // momento atual 
  const horas = data.getHours();
  const minutos = data.getMinutes();
  const segundos = data.getSeconds();
  const hhmmmss = [horas, minutos, segundos].join(':');

  return `SKU-${hhmmmss}`;
}

//montei uma logica para fazer o sku
async function getIndice(numero){
  //procura o ultimo indice inserido
  const last_indice = await knex("item_pedido")
    .where({ numero })
    .orderBy('indice', 'desc')
    .first()
    console.log(last_indice)
  //se nao houver nenhum
  if(typeof last_indice === 'undefined'){
    //retorna o primeiro
    return 1;
  }
  //retorna o ultimo indice + 1
  return last_indice.indice + 1
}

//logoca de busca de pedido
async function getItemPedido({ numero = 0, indice = 0 }) {
  //busca item do pedido
  const item_pedido = await knex("item_pedido").where({ numero, indice }).first();

  //payload da requisicao
  var payload = item_pedido;
  //status da requisicao
  var status = 200;

  //se nao encontrou nenhum pedido
  if (typeof payload === 'undefined') {
    //payload da resposta
    payload = {
      error: 'Not Found',
      message: 'Item do Pedido não encontrado com esse número / indice.'
    }
    //status da resposta
    status = 404;
  } 
  //retorna o status e o payload da requisicao
  return { status, payload };
}

module.exports = ItemPedidosController;