const mysql = require('mysql2/promise');
const {logger} = require('./winston');
let pool;
// TODO: 본인의 DB 계정 입력
if(process.env.NODE_ENV == 'development')
{
    pool = mysql.createPool({
        host: 'database-1.c9v46leqnkb2.ap-northeast-2.rds.amazonaws.com',
        user: 'admin',
        port: '3306',
        password: 'Kershaw22!',
        database: 'airbnbDB-dev'
    });
}
else if(process.env.NODE_ENV == 'production')
{
    pool = mysql.createPool({
        host: 'database-1.c9v46leqnkb2.ap-northeast-2.rds.amazonaws.com',
        user: 'admin',
        port: '3306',
        password: 'Kershaw22!',
        database: 'airbnbDB-prod'
    });
}

module.exports = {
    pool: pool
};
