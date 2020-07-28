// Dependencies
var db = require("../models");
var passport = require("../config/passport");
// console.log(db);
// Routes
// =============================================================
module.exports = function (app) {

  // GET route for getting all of the menu
  app.get("/api/menu", function (req, res) {
    var query = {};
    // Here we add an "include" property to our options in our findAll query
    // We set the value to an array of the models we want to include in a left outer join
    // In this case, just db.Author

    db.menu.findAll({
      where: query,
      include: [db.categories]
    }).then(function (dbmenu) {
      res.json(dbmenu);
    });
  });

  // POST route for saving a new post
  app.post("/api/admin", function (req, res) {
    db.menu.create(req.body)
      .then(function (dbmenu) {
        res.json(dbmenu);
      })
      .catch(function (err) {
        console.log(err.message)
        res.sendStatus(500)
      });
  });

  // DELETE route for deleting menu
  app.delete("/api/admin/:id", function (req, res) {
    db.menu.destroy({
      where: {
        id: req.params.id
      }
    }).then(function (dbmenu) {
      res.json(dbmenu);
    })
      .catch(function (err) {
        console.log(err.message)
        res.sendStatus(500)
      });
  });

  // PUT route for updating menu
  app.put("/api/admin", function (req, res) {
    db.menu.update(
      req.body,
      {
        where: {
          id: req.body.id
        }
      }).then(function (dbmenu) {
        res.json(dbmenu);
      })
      .catch(function (err) {
        console.log(err.message)
        res.sendStatus(500)
      });
  });
   // Using the passport.authenticate middleware with our local strategy.
  // If the user has valid login credentials, send them to the members page.
  // Otherwise the user will be sent an error
  app.post("/api/login", passport.authenticate("local"), function(req, res) {
    res.json(req.user);
  });

  // Route for signing up a user. The user's password is automatically hashed and stored securely thanks to
  // how we configured our Sequelize User Model. If the user is created successfully, proceed to log the user in,
  // otherwise send back an error
  app.post("/api/signup", function(req, res) {
    db.User.create({
      email: req.body.email,
      password: req.body.password
    })
      .then(function() {
        res.redirect(307, "/api/login");
      })
      .catch(function(err) {
        res.status(401).json(err);
      });
  });

  // Route for logging user out
  app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
  });

  // Route for getting some data about our user to be used client side
  app.get("/api/user_data", function(req, res) {
    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({});
    } else {
      // Otherwise send back the user's email and id
      // Sending back a password, even a hashed password, isn't a good idea
      res.json({
        email: req.user.email,
        id: req.user.id
      });
    }
  });
};
