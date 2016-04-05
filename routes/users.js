const express = require('express');
const router = express.Router();

/* GET users listing. */
router.get('/', (req, res) => {
  res.render('users', { title: 'Express' });
});

module.exports = router;
