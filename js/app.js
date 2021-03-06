import express from 'express';
import path from 'path';
var app = express();
var PORT = 4000;
var dirname = path.resolve();
app.get('/', function (req, res) { return res.sendFile(dirname + "/public/index.html"); });
app.use(express.static(dirname + "/public"));
app.use('/js', express.static(dirname + "/js/public"));
app.listen(PORT, function () { return console.log("Server started on port " + PORT + "..."); });
