const express = require("express");
const bodyParser = require("body-parser");
const session = require('express-session');

const PORT = process.env.PORT || 3000;
// using sequelize to create tables in the database
const db = require('./models');

// Creating express app and configuring middleware needed for authentication
var app = express();
// Sets up the Express app to handle data parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

app.use(express.static("public"));

// Set Handlebars.
const exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

require("./routes/api-routes.js")(app);
require("./routes/html-routes.js")(app);

db.sequelize.sync().then(function () {
	app.listen(PORT, function() {
  		console.log("App now listening at localhost:" + PORT);
	});
});


