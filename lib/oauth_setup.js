var QQStrategy = require('passport-qq').Strategy,
    crypto = require('crypto'),
    passport = require('passport');

var QQ_APP_ID = process.env.QQ_APP_ID
var QQ_APP_KEY = process.env.QQ_APP_KEY

var callbackHostName = process.env.LOCALNAME || 'terrynodejs.mybluemix.net'

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

passport.use(new QQStrategy({
        clientID: QQ_APP_ID,
        clientSecret: QQ_APP_KEY,
        callbackURL: 'http://'+ callbackHostName + '/auth/qq/callback'
    },
    function(accessToken, refreshToken, profile, done) {
        // asynchronous verification, for effect...
        process.nextTick(function () {
            return done(null, profile);
        });
    }
));

exports.setup = function(app, options) {

    app.use(passport.initialize());
    app.use(passport.session());
    // GET /auth/qq
    // QQ登录认证时 `state` 为必填参数
    // 系client端的状态值，用于第三方应用防止CSRF攻击，成功授权后回调时会原样带回
    app.get('/auth/qq', function (req, res, next) {
        req.session = req.session || {};
        req.session.authState = crypto.createHash('sha1')
            .update(-(new Date()) + '')
            .digest('hex');
        passport.authenticate('qq', {
            state: req.session.authState
        })(req, res, next);
    });

    // GET /auth/qq/callback
    // 通过比较认证返回的`state`状态值与服务器端`session`中的`state`状态值
    // 决定是否继续本次授权
    app.get('/auth/qq/callback', function (req, res, next) {
            console.log('session authState: ' +  req.session.authState);
            console.log('request query state: ' +  req.query.state);
            if(req.session && req.session.authState
                && req.session.authState === req.query.state) {
                passport
                    .authenticate('qq', {
                        failureRedirect: '/'
                    })(req, res, next);
            } else {
                return next(new Error('Auth State Mismatch'));
            }
        },
        function(req, res) {
            res.redirect('/');
        });
};

