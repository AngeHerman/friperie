const express = require('express');
const server = express();
server.use(express.static('public'));
server.set('view engine','ejs');
server.use(express.urlencoded({extended: true}));
const db = require("./database.js");




server.get('/',(req,res) =>{
    db.hello("Toto");
    res.render('client/welcome.ejs',{
        message : 'Bienvenue',
    });

});



server.use((req,res) => {
    // console.log("Entree dans abort");
    res.status(404).send("erreur");
    // console.log("Sortie de abort");

});

server.listen(8080);