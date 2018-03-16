const express = require('express');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');

const PORT = process.env.PORT || 3000;

const db = require('./models');

const app = express();
app.use(express.static('public'));
app.use(express.static('public/assets/img'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

const routes = require("./controllers/study_controller.js");
app.use(routes);

let models = require('./models')
models.sequelize.sync();

db.sequelize.sync().then(function () {
	app.listen(PORT, function() {
  		console.log("App now listening at localhost:" + PORT);
	});
});


