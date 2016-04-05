const express = require('express');
const router = express.Router();
const DotDesign = require('../models/dotDesign');

router.get('/', (req, res) => {
  DotDesign.find((err, dotDesigns) => {
    const context = {
      dots: dotDesigns.map(dot => {
        return {
          name: dot.name,
          imageUrl: dot.imageUrl
        };
      })
    };
    res.render('dot', context);
  });
});

module.exports = router;
