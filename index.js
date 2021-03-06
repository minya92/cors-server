#!/usr/bin/env node
const express = require('express');
const request = require('request');
const chalk = require('chalk');

let errorStyle = chalk.bold.red;
let app = express();

function addCORS(res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, OPTIONS, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    return res;
}

function pipeError(error, response) {
    console.log(errorStyle("Error: " + error.message));

    if(error.code == 'ENOTFOUND') {
        response.status(404);
    } else {
        response.status(400);
    }

    response.send(error.message);
}

app.use('/', function (req, res) {
    let url = req.url.substring(1, req.url.length);
    req
        .on('error', pipeError)
        .pipe(request({
            url: url,
            strictSSL: false,
        }).on("error", error => pipeError(error, res)))
        .pipe(addCORS(res));
});

let port = (process.argv[2] || 3015);
console.log(chalk.blue('Starting server on port ') + chalk.green(port) + chalk.blue('...'));
app.listen(port);