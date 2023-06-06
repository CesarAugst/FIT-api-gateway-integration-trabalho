exports.up = knex => knex.schema.createTable("pedido", table => {
  table.increments("id").primary();
  table.integer("numero").unique();
  table.text("cliente").notNullable();
});

exports.down = knex => knex.schema.dropTable("pedido");