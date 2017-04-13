var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.locals.currentUrl = req.url
  res.render('index');
});

router.get('/route', function(req, res, next) {
  res.locals.title = 'Route'
  res.locals.currentUrl = req.url
  res.render('route');
});

router.get('/sigma', function (req, res, next) {
    res.render('partials/sigma')
});


module.exports = router