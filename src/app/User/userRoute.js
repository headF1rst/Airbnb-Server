module.exports = function(app){
    const user = require('./userController');
    var passport = require('passport');
    const jwtMiddleware = require('../../../config/jwtMiddleware');
    const session = require('express-session');
    const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
    const FacebookStrategy = require('passport-facebook').Strategy;


    app.use(session({ secret: 'SECRET_CODE', resave: true, saveUninitialized: false }));
    app.use(passport.initialize()); // passport 초기화
    app.use(passport.session()); // session 사용
    
    passport.use(
        'google',
        new GoogleStrategy(
            {
                clientID:
                    '645142724394-j3nnkvs6i4oq1nod7fjifnohprdo611j.apps.googleusercontent.com',
                clientSecret: 'CR6KP_IopffUMJltlvPqmLZL',
                callbackURL: '/auth/google/callback',
            },
            function (accessToken, refreshToken, profile, done) {
                result = {
                    accessToken: accessToken,
                    refreshToken: refreshToken,
                    profile: profile,
                };
                console.log('GoogleStrategy', result);
                return done();
            },
        ),
    );

    passport.use(
        'facebook',
        new FacebookStrategy(
            {
                clientID:
                    '2298951380242441',
                clientSecret: '03407ac5cb888c49afc17ce4c6e9c36a',
                callbackURL: '/auth/facebook/callback',
            },
            function (accessToken, refreshToken, profile, done) {
                result = {
                    accessToken: accessToken,
                    refreshToken: refreshToken,
                    profile: profile,
                };
                console.log('FacebookStrategy', result);
                return done();
            },
        ),
    );

    passport.serializeUser((user, done) => {
        done(null, user); // user객체가 deserializeUser로 전달됨.
    });
    passport.deserializeUser((user, done) => {
        done(null, user); // 여기의 user가 req.user가 됨
    });

    // 1. 유저 생성 (회원가입) API
    app.post('/users', user.postUsers);

    // 2. 로그인 하기 API 
    app.post('/login', user.login);

    // 15. 회원 이름수정 API 
    app.patch('/users/name', jwtMiddleware, user.patchUsersName)

    // 24. JWT 검증 API
    app.get('/users-auth/:userId', jwtMiddleware, user.checkJWT);
};
