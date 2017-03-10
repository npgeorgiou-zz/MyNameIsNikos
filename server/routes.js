var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var http = require('http');
var path = require('path');

router.get('/nikos.papageorgiou', function (req, res) {
    res.sendFile(path.join(__baseDir + '/public/views/nikos.papageorgiou/page.html'))
});

router.get('/nikos.papageorgiou2', function (req, res) {
    res.sendFile(path.join(__baseDir + '/public/views/nikos.papageorgiou2/page.html'))
});

router.get('/alison.connelly', function (req, res) {
    res.sendFile(path.join(__baseDir + '/public/views/alison.connelly/page.html'))
});

module.exports = router;
