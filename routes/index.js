exports.login = function(req, res) {
    var variables = {};
    res.render('login', variables);
}

exports.home = function(req, res) {
    var variables = {user: req.user};
    res.render('index', variables);
}