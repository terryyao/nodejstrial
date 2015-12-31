var dust = require('dustjs-linkedin'),
    path = require('path'),
    cons = require('consolidate'),
    helpers = require('dustjs-helpers'),
    i18n = require('i18next'),
    session = require('express-session'),
    auth_setup = require('./oauth_setup');

exports.setup = function(app, options) {
    var baseDir = options.baseDir;
    helpers.helpers.hashValue = function(chunk, context, bodies, params) {
        var obj = params.obj;
        var prop = params.prop;
        var value = obj[prop];
        if (!value) {
            console.error('hashValue: Could not get %s from properties', prop);
        }
        return chunk.write(obj[prop] && obj[prop].path);
    };

    /* @i18n helper */
    helpers.helpers.i18n = function(chunk, context, bodies, params) {
        var options, translation;
        options = params.options ? params.options : {};
        if (params.defaultValue) {
            options.defaultValue = params.defaultValue;
        }
        var _i18n = (context && context.get('i18n')) ? context.get('i18n') : i18n;
        translation = _i18n.t(params.t, options);
        return chunk.write(translation);
    };

    helpers.helpers.stringify = function(chunk, context, bodies, params) {
        var obj = params.obj;
        var jsonString = '';
        if (obj) {
            if (typeof obj === 'object') {
                jsonString = JSON.stringify(obj);
            } else {
                jsonString = obj;
            }
        }
        return chunk.write(jsonString);
    };

    /* @prejs preformatted json helper */
    helpers.filters.prejs = function(value) {
        return JSON.stringify(value, null, 4);
    };

    /*******************************************
     *          Internationalization           *
     *******************************************/
    i18n.init({
        fallbackLng: 'en',
        supportedLngs: ['en', 'de', 'es', 'fr', 'it', 'ja', 'ko', 'pt-br', 'zh-cn', 'zh-tw'],
        debug: false,
        useCookie: false,
        lowerCaseLng: true,
        load: 'current',
        resGetPath: 'locales/__lng__/__ns__-resources.json',
        ns: {
            namespaces: options.i18nNameSpaces || []
        }
    });
    i18n.registerAppHelper(app);

    app.set('views', path.join(baseDir, '/views'));

    app.engine('dust', cons.dust);
    app.set('view engine', 'dust');

    app.use(i18n.handle);

    app.use(session({secret: 'my key cat'}));

    auth_setup.setup(app, options);
}