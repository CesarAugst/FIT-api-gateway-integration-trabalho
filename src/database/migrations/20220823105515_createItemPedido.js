exports.up = knex => knex.schema.createTable("item_pedido", table => {
  table.increments("id").primary();
  table.integer("numero").references("numero").inTable("pedido");
  table.integer("indice").notNullable();
  table.text("sku").notNullable();
  table.text("produto").notNullable();
  table.float("preco", 14,2).notNullable();
  table.integer("quantidade").notNullable();
  table.timestamp("created_at").default(knex.fn.now());
  table.timestamp("updated_at").default(knex.fn.now());
});

exports.down = knex => knex.schema.dropTable("item_pedido");