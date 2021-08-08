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
 * [POST] /users
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
 * [POST] /login
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
 * API No. 15
 * API Name : 회원 정보 이름수정 API
 * [PATCH] /users/name
 * body : name
 */
exports.patchUsersName = async function (req, res) {

    const userIdFromJWT = req.verifiedToken.userId;
    const name = req.body.name;

    if (!name) return res.send(errResponse(baseResponse.USER_NAME_EMPTY));

    const editUserInfo = await userService.editUser(name, userIdFromJWT);
    return res.send(editUserInfo);
};

/**
 * API No. 24
 * API Name : JWT 검증 API
 * [GET] /users-auth/:userId
 * path variable : userId
 */
 exports.checkJWT = async function (req, res) {
    // jwt - userId
    const userIdFromJWT = req.verifiedToken.userId;
    const userId = req.params.userId;

    if (userIdFromJWT != userId) return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    //console.log(userIdFromJWT);
    //console.log(userId);
    
    return res.send(response(baseResponse.TOKEN_VERIFICATION_SUCCESS));
};

/**
 * API No. 27
 * API Name : 페이스북 로그인 API
 * [GET] /login/facebook
 */
 exports.loginFacebook = async function (req, res) {
    const { accessToken } = req.body;
    try {
        let facebook_profile;
        try {
            facebook_profile = await axios.get('https://kapi.kakao.com/v2/user/me', {
                headers: {
                    Authorization: 'Bearer ' + accessToken,
                    'Content-Type': 'application/json',
                },
            });
        } catch (err) {
            logger.error(`Can't get kakao profile\n: ${JSON.stringify(err)}`);
            return res.send(errResponse(baseResponse.USER_COMMENT_EMPTY));
        }

        const email = kakao_profile.data.kakao_account.profile.nickname;
        const Id = kakao_profile.data.kakao_account.email;
        const IdRows = await userProvider.IdCheck(Id);
        // 이미 존재하는 이메일인 경우 = 회원가입 되어 있는 경우 -> 로그인 처리
        if (IdRows.length > 0) {
            const userInfoRows = await userProvider.accountCheck(Id);
            const token = await jwt.sign(
                {
                    userId: userInfoRows[0].userId,
                },
                secret_config.jwtsecret,
                {
                    expiresIn: '365d',
                    subject: 'userId',
                },
            );

            const result = { jwt: token, userId: userInfoRows[0].userId };
            return res.send(response(baseResponse.SUCCESS, result));
            // 그렇지 않은 경우 -> 회원가입 처리
        } else {
            const result = {
                Id: Id,
                email: email,
                loginStatus: 'K',
            };
            const signUpResponse = await userService.createSocialUser(
                Id,
                email,
                result.loginStatus,
            );
            return res.send(response(baseResponse.SUCCESS, result));
        }
    } catch (err) {
        logger.error(`App - logInKakao Query error\n: ${JSON.stringify(err)}`);
        return res.send(errResponse(baseResponse.USER_CONTENTS_EMPTY));
    }
};

