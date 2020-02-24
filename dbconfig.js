require('dotenv').config();
const mysql = require('promise-mysql');

var pool = async () => {
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
    await ensureSchema(pool);

    return pool;
};

const ensureSchema = async pool => {
    // Create users table
    await pool.query(`CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT,
        googleId VARCHAR(255) NOT NULL,
        email VARCHAR(255),
        PRIMARY KEY(id)
        );`);

    // Create dishes table
    await pool.query(
        `CREATE TABLE IF NOT EXISTS dishes (
        dishId INT NOT NULL AUTO_INCREMENT, 
        category VARCHAR(255),
        cookingTime VARCHAR(255),
        ingredients JSON,
        ingredientsInSteps JSON,
        lastMade VARCHAR(255),
        name VARCHAR(255), 
        notes VARCHAR(255),
        steps JSON,
        url VARCHAR(255),
        userId INT,
        PRIMARY KEY (dishId),
        FOREIGN KEY (userId) REFERENCES users(id));`,
    );

    await pool.query(`CREATE TABLE IF NOT EXISTS history (
        id INT NOT NULL AUTO_INCREMENT, 
        date DATE,
        dishId INT,
        PRIMARY KEY (id), 
        FOREIGN KEY (dishId) REFERENCES dishes(dishId));`);
};

module.exports.pool = pool;