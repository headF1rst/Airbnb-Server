module.exports = function(app){
    const user = require('./userController');
    var passport = require('passport');
    const jwtMiddleware = require('../../../config/jwtMiddleware');
    const session = require('express-session');
    const KakaoStrategy = require('passport-kakao').Strategy;
    var bcrypt = require('bcrypt');
    var secret_config = require('../../../config/kakao.json');

    app.use(session({ secret: 'SECRET_CODE', resave: true, saveUninitialized: false }));

    app.use(passport.initialize()); // passport 초기화
    app.use(passport.session()); // session 사용
    
    passport.use(
        'kakao-login',
        new KakaoStrategy(
            {
                clientID: secret_config.clientID,
                clientSecret: secret_config.clientSecret,
                callbackURL: secret_config.callbackURL,
            },
            function (accessToken, refreshToken, profile, done) {
                result = {
                    accessToken: accessToken,
                    refreshToken: refreshToken,
                    profile: profile,
                };
                console.log('KakaoStrategy', result);
                return done;
            },
        ),
    );

    passport.serializeUser((user, done) => {
        done(null, user); /*로그인 성공시 사용자 정보를 Session에 저장한다*/
    });
    passport.deserializeUser((user, done) => {
        done(null, user); /*인증 후, 페이지 접근시 마다 사용자 정보를 Session에서 읽어옴.*/
    });

    // kakao 로그인
    app.post('/auth/login/kakao', user.loginKakao);
    // kakao 로그인 연동 콜백
    app.get('/auth/kakao/callback', passport.authenticate('kakao-login', { failureRedirect: '/auth', successRedirect: '/' }));

    // 1. 유저 생성 (회원가입) API
    app.post('/users', user.postUsers);

    // 2. 로그인 하기 API 
    app.post('/login', user.login);

    // 4. JWT 검증 API
    app.get('/users-auth/:userId', jwtMiddleware, user.checkJWT);

    // 13. 회원 이름수정 API 
    app.patch('/users/name', jwtMiddleware, user.patchUsersName);

    // 14. 회원 성별수정 API
    app.patch('/users/sex', jwtMiddleware, user.patchUserSex);

    // 15. 회원 생년월일수정 API
    app.patch('/users/birth', jwtMiddleware, user.patchUserBirth);

    // 16. 회원 이메일수정 API
    app.patch('/users/email', jwtMiddleware, user.patchUserEmail);

    // 17. 회원 핸드폰 번호수정 API
    app.patch('/users/phone-num/:phoneId', jwtMiddleware, user.patchUserPhone);

    // 18. 회원 탈퇴 API
    app.patch('/users/status', jwtMiddleware, user.patchUserStatus);

    // 19. 리뷰 등록 API 
    app.post('/reviews/:stayId', jwtMiddleware, user.postReview);

    // 27. 회원 전화번호 삭제 API
    app.patch('/users/phone-num/:phoneId/status', jwtMiddleware, user.patchPhoneStatus);
};
