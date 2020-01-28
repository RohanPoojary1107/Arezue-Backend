var express = require('express');
var router = express.Router();

var db = require('./queries');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// Temporarily get request for testing
router.get('/api/Users', db.getAllUsers);

// C of CRUD, create account for new members
router.post('/api/CreateAccount/jobseeker/:firebaseID&:Name&:Email', db.createJobseeker);

module.exports = router;
