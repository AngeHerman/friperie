const express = require('express');
const server = express();
server.use(express.static('public'));
server.set('view engine','ejs');
server.use(express.urlencoded({extended: true}));
const db = require("./database.js");
const request = require("./request.js");





server.get('/',(req,res) =>{
    db.hello("Toto");
    let produits = request.getProduits();
    res.render('client/welcome.ejs',{
        message : 'Bienvenue',
        produits : produits
    });

});



server.use((req,res) => {
    // console.log("Entree dans abort");
    res.status(404).send("erreur");
    // console.log("Sortie de abort");

});

server.listen(8080);