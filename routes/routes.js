const DotDesign = require('../models/dotDesign');


module.exports = function(app) {

  app.get('/', (req, res) => {
    res.render('index', {
      title: 'dotons - wielkommen!'
    });
  });

  app.get('/designs', (req, res) => {
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
  
  app.get("/login", (req, res) => {
    res.render('login', {
      title: 'dotons - login!'
    });
  });
  
  app.post("/login", (req, res) => {
    console.log(req.body);
    res.render("login", {
      title: "dotons - loggalainen"
    });
  });
};
