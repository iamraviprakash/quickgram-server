import { SQLDataSource } from 'datasource-sql';

const KNEX_CONFIG = {
  client: 'pg',
  connection: {
    host: 'db.xomlwtxqaxdceotwqzlk.supabase.co',
    port: 5432,
    user: process.env.DB_USER_NAME,
    password: process.env.DB_PASSWORD,
    database: 'postgres',
  },
};

class DataSource extends SQLDataSource {
  getDbInstance() {
    return this.knex;
  }
}

const dataSource = new DataSource(KNEX_CONFIG);

export default dataSource.getDbInstance();
