const express = require("express");
const BodyParser = require("body-parser");
const morgan = require("morgan");
const config = require("config");
const cors = require("cors");
const port = config.get("port");

const db = require("./model/database");

const app = express();
app.use(cors());
app.use(BodyParser.urlencoded({extended: false}));
app.use(BodyParser.json());
app.use(morgan("tiny"));

app.use("/ping", (req, res) => {
    res.send("pong")
});

app.use("/v1", require("./router"));

db.sequelize.sync({
    force: false
})
    .then(() => {
        console.log("Connect with database oki");
        app.listen(port, (err) => {
            if (!err) console.log("Server running on ", port);
        });
    })
    .catch(err => {
        console.log(err.message)
    });

