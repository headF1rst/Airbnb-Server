const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const secret_config = require("../../../config/secret");
const stayProvider = require("./stayProvider");
const stayDao = require("./stayDao");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {connect} = require("http2");

exports.postStay = async function (userIdFromJWT, params) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const postRoomResult = await stayDao.postRoom(connection, userIdFromJWT, params);
        connection.release();

        return response(baseResponse.SUCCESS);
    } catch (err) {
        logger.error(`App - Posting Room Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}

exports.editStayStatus = async function (stayId, userIdFromJWT) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);

        try {
            connection.beginTransaction(); // 트랜잭션 적용 시작
            const stayResult = await stayDao.patchStayStatus(connection, stayId, userIdFromJWT);
            const b = await stayDao.editBookingStatusTS(
                connection,
                stayId
            );
            await connection.commit(); // 커밋
            connection.release(); // conn 회수
            connection.release();
            
            return response(baseResponse.SUCCESS);
        } catch (err) {
            await connection.rollback(); // 롤백
            connection.release(); // conn 회수
            return errResponse(baseResponse.DB_ERROR);
        }
    } catch (err) {
        logger.error(`App - Deleting Stay error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}

exports.editStayType = async function (stayType, stayId, userIdFromJWT) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const postRoomResult = await stayDao.patchStayType(connection, stayType, stayId, userIdFromJWT);
        connection.release();

        return response(baseResponse.SUCCESS);
    } catch (err) {
        logger.error(`App - editing Room Info error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}

exports.postWishStay = async function (stayId, basketId) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const postWishListResult = await stayDao.postWishRoom(connection, stayId, basketId);
        connection.release();

        return response(baseResponse.SUCCESS);
    } catch (err) {
        logger.error(`App - Posting Wish-Room Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}

exports.patchWishStay = async function (wishId) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const patchWishListResult = await stayDao.patchWishRoom(connection, wishId);
        connection.release();

        return response(baseResponse.SUCCESS);
    } catch (err) {
        logger.error(`App - Patching Wish-Room Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}

exports.postWishBasket = async function (userIdFromJWT, name) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const postBasketResult = await stayDao.postBasket(connection, userIdFromJWT, name);
        connection.release();

        return response(baseResponse.SUCCESS);
    } catch (err) {
        logger.error(`App - Posting Basket Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}

exports.patchWishBasket = async function (basketId) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);

        try {
            connection.beginTransaction(); // 트랜잭션 적용 시작
            const a = await stayDao.patchBasket(connection, basketId);
            const b = await stayDao.patchAllWishRoom(
                connection,
                basketId
            );
            await connection.commit(); // 커밋
            connection.release(); // conn 회수
            connection.release();
            
            return response(baseResponse.SUCCESS);
        } catch (err) {
            await connection.rollback(); // 롤백
            connection.release(); // conn 회수
            return errResponse(baseResponse.DB_ERROR);
        }
    } catch (err) {
        logger.error(`App - Patching Basket Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}

exports.patchBookedStatus = async function (bookId) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const patchBookedResult = await stayDao.editBookingStatus(connection, bookId);
        connection.release();

        return response(baseResponse.SUCCESS);
    } catch (err) {
        logger.error(`App - Patching Booked Room Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}

exports.patchGuestBookStatus = async function (bookId, userIdFromJWT) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const patchBookedResult = await stayDao.editGuestBookingStatus(connection, bookId, userIdFromJWT);
        connection.release();

        return response(baseResponse.SUCCESS);
    } catch (err) {
        logger.error(`App - Patching Booked Room Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}

exports.patchHostCmmt = async function (cmmt, stayId, userIdFromJWT) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const patchCmmtResult = await stayDao.editHostCmmt(connection, cmmt, stayId, userIdFromJWT);
        connection.release();

        return response(baseResponse.SUCCESS);
    } catch (err) {
        logger.error(`App - Patching Booked Room Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}