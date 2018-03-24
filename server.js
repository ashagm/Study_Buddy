const express = require("express");
const bodyParser = require("body-parser");
const methodOverride = require('method-override');
const session = require('client-sessions');
const env = require('dotenv').config();

const PORT = process.env.PORT || 3000;

let models = require('./models')
models.sequelize.sync();

// Creating express app and configuring middleware needed for authentication
var app = express();

// Sets up the Express app to handle data parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

app.use(express.static("public"));

const exphbs = require("express-handlebars");
const handlebars  = require('handlebars');
var handlebarsIntl = require('handlebars-intl');
handlebarsIntl.registerWith(handlebars);


app.engine("handlebars", exphbs({
  defaultLayout: "main",
  helpers: {
    ifCond: function(x, y, options) {
      if(x == y) {
        return options.fn(this);
      }
      return options.inverse(this);
    }
  }
}));

app.set("view engine", "handlebars");

//session handler middleware
app.use(
	session({
  		cookieName: 'mySession', // cookie name dictates the key name added to the request object 
  		secret: 'thisisasecretkept', // should be a large unguessable string 
  		duration: 24 * 60 * 60 * 1000, // how long the session will stay valid in ms 
  		activeDuration: 1000 * 60 * 5 // if expiresIn < activeDuration, the session will be extended by activeDuration milliseconds 
	})
);

const apiRoutes = require("./routes/api-routes.js");
require("./routes/html-routes.js")(app);

app.use(apiRoutes);

models.sequelize.sync().then(function () {
	app.listen(PORT, function() {
  		console.log("App now listening at localhost:" + PORT);
	});
});


