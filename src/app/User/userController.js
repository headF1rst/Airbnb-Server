const jwtMiddleware = require("../../../config/jwtMiddleware");
const userProvider = require("../../app/User/userProvider");
const userService = require("../../app/User/userService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");
const regexEmail = require("regex-email");
const {emit} = require("nodemon");

/**
 * API No. 1
 * API Name : 유저 생성 (회원가입) API
 * [POST] /app/signin
 */
exports.postUsers = async function (req, res) {

    /**
     * Body: email, password, nickname
     */
    const {name, birth, email, password} = req.body;

    // 빈 값 체크
    if (!email) return res.send(response(baseResponse.SIGNUP_EMAIL_EMPTY));

    // 길이 체크
    if (email.length > 30) return res.send(response(baseResponse.SIGNUP_EMAIL_LENGTH));

    // 형식 체크 (by 정규표현식)
    if (!regexEmail.test(email)) return res.send(response(baseResponse.SIGNUP_EMAIL_ERROR_TYPE));

    // 비밀번호 비었는지 체크
    if (!password) return res.send(response(baseResponse.SIGNUP_PASSWORD_EMPTY));

    // 비밀번호 8자리 이상 체크
    if(password.length < 8) return res.send(response(baseResponse.SIGNUP_PASSWORD_LENGTH));

    // 비밀번호 숫자 or 기호 포함
    if((password.search((/(?=.*[!@#$%^&*])/)) < 0) && (password.search(/[0-9]/) < 0)) return res.send(response(baseResponse.SIGNUP_PASSWORD_NUMORCHAR));

    // 비밀번호에 이름 및 메일주소 포함X
    if(password.includes(name)) return res.send(response(baseResponse.SINUP_PASSWORD_HAS_USERNAME));

    var part = email.split("@");
    if(password.includes(part[0])) return res.send(response(baseResponse.SINUP_PASSWORD_HAS_USERNAME));
    console.log(part[0]);
    // 이름 비었는지 체크
    if (!name) return res.send(response(baseResponse.SIGNUP_NAME_EMPTY));
    
    // 생년월일 비었는지 체크
    if(!birth) return res.send(response(baseResponse.SIGNUP_BIRTH_EMPTY));

    // 생년월일 yyyy/mm/dd, over 18 validation check
    var regexBirth = /^([0-9]{4}[-/]?((0[13-9]|1[012])[-/]?(0[1-9]|[12][0-9]|30)|(0[13578]|1[02])[-/]?31|02[-/]?(0[1-9]|1[0-9]|2[0-8]))|([0-9]{2}(([2468][048]|[02468][48])|[13579][26])|([13579][26]|[02468][048]|0[0-9]|1[0-6])00)[-/]?02[-/]?29)$/;

    if(regexBirth.test(birth))
    {
        var parts = birth.split("/");
        var dtDOB = new Date(parts[1] + "/" + parts[2] + "/" + parts[0]);
        var dtCurrent = new Date();
        if(dtCurrent.getFullYear() - dtDOB.getFullYear() < 18) return res.send(response(baseResponse.INVALID_AGE));
        if(dtCurrent.getFullYear() - dtDOB.getFullYear() == 18)
        {
            if(dtCurrent.getMonth() < dtDOB.getMonth()) return res.send(response(baseResponse.INVALID_AGE));
            if(dtCurrent.getMonth() == dtDOB.getMonth())
            {
                if(dtCurrent.getDate() < dtDOB.getDate()) return res.send(response(baseResponse.INVALID_AGE));
            }
        }
    }
    if(!regexBirth.test(birth))
    {
        return res.send(response(baseResponse.DOB_FORMAT_ERR));
    }

    const signUpResponse = await userService.createUser(name, birth, email, password);
    return res.send(signUpResponse);
};

/**
 * API No. 2
 * API Name : 로그인 API
 * [POST] /app/login
 * body : email, passsword
 */
exports.login = async function (req, res) {

    const {email, password} = req.body;

    if (!email) return res.send(errResponse(baseResponse.SIGNIN_EMAIL_EMPTY));
    if (!password) return res.send(errResponse(baseResponse.SIGNIN_PASSWORD_EMPTY));

    const signInResponse = await userService.postSignIn(email, password);

    return res.send(signInResponse);
};


/**
 * API No. 3
 * API Name : 회원 정보 수정 API + JWT + Validation
 * [PATCH] /app/users/:userId
 * path variable : userId
 * body : nickname
 */
exports.patchUsers = async function (req, res) {

    // jwt - userId, path variable :userId

    const userIdFromJWT = req.verifiedToken.userId

    const userId = req.params.userId;
    const nickname = req.body.nickname;

    if (userIdFromJWT != userId) {
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    } else {
        if (!nickname) return res.send(errResponse(baseResponse.USER_NICKNAME_EMPTY));

        const editUserInfo = await userService.editUser(userId, nickname)
        return res.send(editUserInfo);
    }
};











/** JWT 토큰 검증 API
 * [GET] /app/auto-login
 */
exports.check = async function (req, res) {
    const userIdResult = req.verifiedToken.userId;
    console.log(userIdResult);
    return res.send(response(baseResponse.TOKEN_VERIFICATION_SUCCESS));
};
