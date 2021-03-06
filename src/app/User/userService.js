const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const secret_config = require("../../../config/secret");
const userProvider = require("./userProvider");
const userDao = require("./userDao");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {connect} = require("http2");

// Service: Create, Update, Delete 비즈니스 로직 처리

exports.createUser = async function (name, birth, email, password) {
    try {
        // 이메일 중복 확인
        const emailRows = await userProvider.emailCheck(email);
        if (emailRows.length > 0)
            return errResponse(baseResponse.SIGNUP_REDUNDANT_EMAIL);

        // 비밀번호 암호화
        const hashedPassword = await crypto
            .createHash("sha512")
            .update(password)
            .digest("hex");

        const insertUserInfoParams = [name, birth, email, hashedPassword];

        const connection = await pool.getConnection(async (conn) => conn);

        const userIdResult = await userDao.insertUserInfo(connection, insertUserInfoParams);
        console.log(`추가된 회원 : ${userIdResult[0].insertId}`)
        connection.release();
        return response(baseResponse.SUCCESS);


    } catch (err) {
        logger.error(`App - createUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

exports.postSignIn = async function (email, password) {
    try {
        // 이메일 여부 확인
        const emailRows = await userProvider.emailCheck(email);
        if (emailRows.length < 1) return errResponse(baseResponse.SIGNIN_EMAIL_WRONG);

        const selectEmail = emailRows[0].email

        // 비밀번호 확인
        const hashedPassword = await crypto
            .createHash("sha512")
            .update(password)
            .digest("hex");
        const selectUserPasswordParams = [selectEmail, hashedPassword];
        const passwordRows = await userProvider.passwordCheck(selectUserPasswordParams);
        
        //console.log(passwordRows[0].password);
        //console.log(hashedPassword);
        if (passwordRows[0].password !== hashedPassword) {
            return errResponse(baseResponse.SIGNIN_PASSWORD_WRONG);
        }

        // 계정 상태 확인
        const userInfoRows = await userProvider.accountCheck(email);

        if (userInfoRows[0].status === "INACTIVE") {
            return errResponse(baseResponse.SIGNIN_INACTIVE_ACCOUNT);
        } else if (userInfoRows[0].status === "DELETED") {
            return errResponse(baseResponse.SIGNIN_WITHDRAWAL_ACCOUNT);
        }

        console.log(userInfoRows[0].name); // DB의 유저 이름
        //토큰 생성 Service
        let token = await jwt.sign(
            {
                userId: userInfoRows[0].userId,
            }, // 토큰의 내용(payload)
            secret_config.jwtsecret, // 비밀키
            {
                expiresIn: "365d",
                subject: "userInfo",
            } // 유효 기간 365일
        );
        
        return response(baseResponse.SUCCESS, {'jwt': token, 'userId': userInfoRows[0].userId, 'name':userInfoRows[0].name, 'email': email, 'birth':userInfoRows[0].birth, 'sex' : userInfoRows[0].sex});

    } catch (err) {
        logger.error(`App - postSignIn Service error\n: ${err.message} \n${JSON.stringify(err)}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

exports.editUser = async function (name, userIdFromJWT) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const editUserResult = await userDao.updateUserInfo(connection, name, userIdFromJWT)
        connection.release();

        return response(baseResponse.SUCCESS);
    } catch (err) {
        logger.error(`App - editUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}

exports.editUserSex = async function (sex, userIdFromJWT) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const editUserResult = await userDao.updateUserSex(connection, sex, userIdFromJWT)
        connection.release();

        return response(baseResponse.SUCCESS);
    } catch (err) {
        logger.error(`App - editUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}

exports.editUserBirth = async function (birth, userIdFromJWT) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const editUserResult = await userDao.updateUserBirth(connection, birth, userIdFromJWT)
        connection.release();

        return response(baseResponse.SUCCESS);
    } catch (err) {
        logger.error(`App - editUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}

exports.editUserEmail = async function (email, userIdFromJWT) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const editUserResult = await userDao.updateUserEmail(connection, email, userIdFromJWT)
        connection.release();

        return response(baseResponse.SUCCESS);
    } catch (err) {
        logger.error(`App - editUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}

exports.editUserPhone = async function (phone, userIdFromJWT, phoneId) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const editUserResult = await userDao.updateUserPhone(connection, phone, userIdFromJWT, phoneId);
        connection.release();

        return response(baseResponse.SUCCESS);
    } catch (err) {
        logger.error(`App - editUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}

exports.editUserStatus = async function (userIdFromJWT) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const check = await userDao.checkUserStatus(connection,userIdFromJWT);
        if(check.status == 'Deleted') return res.send(errResponse(baseResponse.USER_DELETED));
        const editUserResult = await userDao.updateUserStatus(connection,userIdFromJWT);

        connection.release();

        return response(baseResponse.SUCCESS);
    } catch (err) {
        logger.error(`App - editUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}

exports.editPhoneStatus = async function (userIdFromJWT, phoneId) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const editUserResult = await userDao.updatePhoneStatus(connection, userIdFromJWT, phoneId);
        connection.release();

        return response(baseResponse.SUCCESS);
    } catch (err) {
        logger.error(`App - editUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}

exports.postReview = async function (params) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const postResult = await userDao.postRating(connection, params);
        connection.release();

        return response(baseResponse.SUCCESS);
    } catch (err) {
        logger.error(`App - Posting Review Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}

//카카오 소셜 회원 가입
exports.postSocialUser = async function (name, email) {
    try {
        // email 중복 확인
        const emailRows = await userProvider.emailCheck(email);
        if (emailRows.length > 0) return errResponse(baseResponse.SIGNUP_REDUNDANT_EMAIL);

        const insertSocialUserInfoParams = [name, email];
        console.log(1);

        const connection = await pool.getConnection(async (conn) => conn);

        const userIdResult = await userDao.insertSocialUserInfo(
            connection,
            insertSocialUserInfoParams,
        );
        const userInfoRows = await userProvider.accountCheck(email);
        if (userInfoRows[0].status === 'INACTIVE') {
            return errResponse(baseResponse.SIGNIN_INACTIVE_ACCOUNT);
        } else if (userInfoRows[0].status === 'DELETED') {
            return errResponse(baseResponse.SIGNIN_WITHDRAWAL_ACCOUNT);
        }
        console.log(`추가된 회원 : ${userIdResult[0].insertId}`);
        connection.release();
        return response(baseResponse.SUCCESS);
    } catch (err) {
        logger.error(`App - createUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};