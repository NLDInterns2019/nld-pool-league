const express = require("express");
const bodyParser = require("body-parser");
const _ = require("underscore");
const cors = require("cors");
const db = require("./db.js");

const PORT = process.env.PORT || 3000;
const app = express();

app.use(bodyParser.json());

app.use(cors());

app.get("/", (req, res) => {
  res.send("Nonlinear Pool Manager Backend");
});

app.get("/api/staff", (req, res) => {
  var where = {};

  db.staff.findAll({ where: where }).then(
    staffs => {
      res.json(staffs);
    },
    e => {
      res.status(400).send();
    }
  );
});

//POST
app.post("/api/staff", (req, res) => {
  var body = _.pick(req.body, "id", "name");

  db.staff.create(body).then(
    staff => {
      res.json(staff.toJSON());
    },
    e => {
      res.status(400).json(e);
    }
  );
});

//{force: true} to start with clean table
db.sequelize.sync({force: true}).then(function() {
  app.listen(PORT, () => {
    console.log("Express is listeing on port: " + PORT);
  });
});
