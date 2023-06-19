const knex = require("../database");

class PedidosController {
  async index(request, response) {
    //pega paginacao da url
    const { per_page, page } = request.query;

    //payload da requisicao
    const { payload } = await getPedidosPagination({per_page, page})

    //retorna pedidos para resposta da requisicao
    return response.json(payload);
  }

  async show(request, response) {
    //resgata numero da rota
    const { numero } = request.params;

    //payload e status da requisicao
    const { status, payload } = await getPedido({numero});

    //retorna pedido para resposta da requisicao
    return response.status(status).send(payload);
  }

  async create(request, response) {
    //pega cliente do corpo
    const { cliente } = request.body;
    //gera numero
    const numero = getNumero();
    //cria um pedido e retorna o id da criacao para uma variavel
    const pedido_id = await knex("pedido")
      .returning('*')
      .insert({
        cliente,
        numero
      });
    //busca o registro criado  ocm o id da criacao
    const pedido = await knex("pedido").where({ id: pedido_id }).first();
    //retorna a criacao para a resposta da requisicao
    return response.json(pedido);
  }

  async filter(request, response) {
    //pega filtros da url
    const { produto } = request.query;
    //busca item do pedido
    const pedido_list = await knex("pedido")
    .where((qb) => {
      //filtro de produto
      if(produto){
        qb.where('item_pedido.produto', 'like', `%${produto}%`);
      }
    })
    .join("item_pedido", "pedido.numero", "item_pedido.numero");
    //retorna os itens do pedido para resposta da requisicao
    return response.json(pedido_list);
  }
}

//montei uma logica para fazer um numero
function getNumero() {
  const data = new Date(); // momento atual 
  const horas = data.getHours();
  const minutos = data.getMinutes();
  const segundos = data.getSeconds();
  return [horas, minutos, segundos].join('');
}

//logoca de busca de pedido
async function getPedido({ numero = 0 }) {
  //busca pedido com esse numero
  const pedido = await knex("pedido").where({ numero }).first();

  //payload da requisicao
  var payload = pedido;
  //status da requisicao
  var status = 200;

  //se nao encontrou nenhum pedido
  if (typeof payload === 'undefined') {
    //payload da resposta
    payload = {
      error: 'Not Found',
      message: 'Pedido não encontrado com esse número.'
    }
    //status da resposta
    status = 404;
  } 
  //retorna o status e o payload da requisicao
  return { status, payload };
}

//logica de pedidos com paginacao
async function getPedidosPagination({per_page = null, page = null}){
    //define o array de pedidos
    var pedidos = [];

    //se possui paginacao
    if (per_page && page) {
      //a menor pagina sempre sera a primeira
      if (page < 1) page = 1;
      //quanto pular para gerar ao primeiro registro da pagina
      var offset = (page - 1) * per_page;
      //busca todos os pedidos paginados
      pedidos = await knex("pedido").limit(per_page).offset(offset);
    } else {
      //busca todos os pedidos
      pedidos = await knex("pedido");
    }

    //payload da requisicao
    var payload = pedidos;

    //retorna os pedidos
    return {payload};
}

module.exports = PedidosController;