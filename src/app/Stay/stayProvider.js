const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const stayDao = require("./stayDao");

// Provider: Read 비즈니스 로직 처리

exports.findStayWithoutDate = async function (params2) 
{
    const connection = await pool.getConnection(async (conn) => conn);
    const searchResult = await stayDao.selectStayWithoutDate(connection, params2);
    connection.release();
  
    return searchResult;
};

exports.findStay = async function (params)
{
    const connection = await pool.getConnection(async (conn) => conn);
    const searchResult = await stayDao.selectStay(connection, params);
    connection.release();
  
    return searchResult;
};