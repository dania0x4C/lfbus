import express from "express";
var engines = require("consolidate");
const app = express();

app.engine("html", engines.mustache);
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

app.use("/public", express.static(__dirname + "/public"));
app.get("/", (_, res) => res.render("kakaoMap"));
app.get("/*", (_, res) => res.redirect("/"));

//Query string parameter????



const handleListen = () => console.log(`Listening on http://localhost:3000`);
app.listen(3000, handleListen);
