require('dotenv').config();
const mysql = require('promise-mysql');

let pool;

const createPool = async () => {
    console.log('CREATE POOL');
    let pool = await mysql.createPool({
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        //socketPath: `/cloudsql/${process.env.CLOUD_SQL_CONNECTION_NAME}`,
        // If connecting via TCP, enter the IP and port instead
        host: 'localhost',
        port: 3306,

        // 'connectionLimit' is the maximum number of connections the pool is allowed
        // to keep at once.
        connectionLimit: 5,
        // [END cloud_sql_mysql_mysql_limit]

        // [START cloud_sql_mysql_mysql_timeout]
        // 'connectTimeout' is the maximum number of milliseconds before a timeout
        // occurs during the initial connection to the database.
        connectTimeout: 10000, // 10 seconds
        // 'acquireTimeout' is the maximum number of milliseconds to wait when
        // checking out a connection from the pool before a timeout error occurs.
        acquireTimeout: 10000, // 10 seconds
        // 'waitForConnections' determines the pool's action when no connections are
        // free. If true, the request will queued and a connection will be presented
        // when ready. If false, the pool will call back with an error.
        waitForConnections: true, // Default: true
        // 'queueLimit' is the maximum number of requests for connections the pool
        // will queue at once before returning an error. If 0, there is no limit.
        queueLimit: 0, // Default: 0
    });
    return pool;
};

const testQuery = async () => {
    try {
        pool = await createPool();
        console.log(pool);

        const dishes = await pool.query('SELECT * FROM dishes');
        console.log('DISHES FROM: ' + dishes);
    } catch (error) {
        console.log('ERR: ' + error);
    }
};

testQuery();
