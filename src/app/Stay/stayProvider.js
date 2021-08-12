const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const stayDao = require("./stayDao");

// Provider: Read 비즈니스 로직 처리

exports.findStayWithoutDate = async function (params2) 
{
    const connection = await pool.getConnection(async (conn) => conn);
    const searchResult = await stayDao.selectStayWithoutDate(connection, params2);
    console.log(searchResult[0].stayId);
    console.log(searchResult[0].superHost);
    console.log(searchResult[0].stayName);
    console.log(searchResult[1].stayName);
    console.log(searchResult[0].imageURL);
    console.log(searchResult[1].imageURL);
    
    connection.release();
  
    return searchResult;
};

exports.findStay = async function (params)
{
    const connection = await pool.getConnection(async (conn) => conn);
    const searchResult = await stayDao.selectStay(connection, params);
    //var imageComb = new Array();

    // for(var i = 0; ; i++)
    // {
    //     if(!searchResult[i].imageURL) break;
    //     imageComb[i] = searchResult[i].imageURL;
    //     console.log(imageComb[i]);
    //     console.log(searchResult[i].stayName);
    // }

    connection.release();
  
    return searchResult;
};

exports.findStayDetailWithoutDate = async function (params2) 
{
    const connection = await pool.getConnection(async (conn) => conn);
    const searchResult = await stayDao.selectStayDetailWithoutDate(connection, params2);
    connection.release();
  
    return searchResult;
};

exports.findStayDetail = async function (params)
{
    const connection = await pool.getConnection(async (conn) => conn);
    const searchResult = await stayDao.selectStayDetail(connection, params);
    connection.release();
  
    return searchResult;
};