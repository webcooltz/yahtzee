const express = require('express');
const router = express.Router();

router.use('/dice', require('./dice'));
router.use('/players', require('./players'));

router.get('/', function(req, res) {
  res.send('welcome to yahtzee :)');
});

router.get('*', (req, res) => {
  res.send('404: oops, bad request!');
});

module.exports = router;