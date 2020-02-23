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

const ensureSchema = async () => {
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
        name VARCHAR(255), 
        category VARCHAR(255),
        cookingTime VARCHAR(255),
        lastMade VARCHAR(255),
        userId INT,
        notes VARCHAR(255),
        url VARCHAR(255),
        PRIMARY KEY (dishId),
        FOREIGN KEY (userId) REFERENCES users(id));`,
    );

    await pool.query(`CREATE TABLE IF NOT EXISTS history (
        id INT NOT NULL AUTO_INCREMENT, 
        date DATE,
        dishId INT,
        PRIMARY KEY (id), 
        FOREIGN KEY (dishId) REFERENCES dishes(dishId));`);
    /*
    await pool.query(`CREATE TABLE IF NOT EXISTS dish_history (
        id INT NOT NULL AUTO_INCREMENT, 
        historyId INT,
        dishId INT,
        PRIMARY KEY (id),
        FOREIGN KEY (historyId) REFERENCES history(id),
FOREIGN KEY (dishId) REFERENCES dishes(dishId));`);*/
};

const init = async () => {
    try {
        pool = await createPool();
        //await ensureSchema();

        await getDish('1');
        //await createUser('abcd', 'zachdeluna@gmail.com');
        //addDish('abcd', 'Fajitas', '1');
        //updateDish(1, {name: 'Tacos'});
        //const dishes = await pool.query('SELECT * FROM dishes');
        //const dish = await getDish('1');
        //console.log('DISHES FROM: ' + dishes);
    } catch (error) {
        console.log('ERR: ' + error);
    }
};

init();

createUser = async (googleId, email) => {
    try {
        const sql = 'INSERT INTO users (googleId, email) VALUES (?, ?)';
        await pool.query(sql, [googleId, email]);
    } catch (error) {
        console.log(error);
    }
};

addDish = async (googleId, name, category) => {
    try {
        // Get the id associated with the googleId
        const userQuery = await pool.query(
            'SELECT id FROM users WHERE googleId=?',
            [googleId],
        );
        const userId = userQuery[0].id;
        const sql =
            'INSERT INTO dishes (userId, name, category) VALUES (?, ?, ?)';
        await pool.query(sql, [userId, name, category]);
    } catch (error) {
        console.log(error);
    }
};

getDish = async dishId => {
    try {
        const dishQuery = await pool.query(
            'SELECT * FROM dishes WHERE dishId=?',
            [dishId],
        );
        const historyQuery = await pool.query(
            'SELECT date FROM history WHERE dishId=? ORDER BY date',
            [dishId],
        );

        let history = [];
        for (let i = 0; i < historyQuery.length; i++) {
            history[i] = historyQuery[i];
        }

        dish = dishQuery[0];
        dish.history = history;
        dish.lastMade = history[0];
        return dish;
    } catch (error) {}
};

updateDish = async (dishId, updatedDishFields) => {
    try {
        // Get the dish object then assign new properties based on properties in updatedDishFields
        const dish = await getDish(dishId);
        for (let key in updatedDishFields) {
            dish[key] = updatedDishFields[key];
        }

        const sql =
            'UPDATE dishes SET category=?, cookingTime=?, lastMade=?, name=?, notes=?, url=? WHERE dishId=?';
        await pool.query(sql, [
            dish.category,
            dish.cookingTime,
            dish.lastMade,
            dish.name,
            dish.notes,
            dish.url,
        ]);
    } catch (error) {
        console.log(error);
    }
};
