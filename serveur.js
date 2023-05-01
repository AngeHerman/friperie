const express = require('express');
const server = express();
server.use(express.static('public'));
server.set('view engine','ejs');
server.use(express.urlencoded({extended: true}));
const db = require("./database.js");
<<<<<<< HEAD
const cat = require("./category.js");
=======
const body_parser = require('body-parser');
const session = require('express-session');
server.use(body_parser.urlencoded({ extended : false }));
server.use(body_parser.json());

server.use(session({
	secret : process.env.SESSION_SECRET,
	resave : false,
	saveUninitialized : true,
	cookie : { secure : false }
}));
>>>>>>> frontend



function get_cart_total(req){
    let total = 0.0;
    req.session.cart.forEach(produit => {
        total += (produit.prix * produit.qte);
    });
    return total;
}

function get_cart_total_qte(req){
    let total = 0;
    req.session.cart.forEach(produit => {
        total += produit.qte;
    });
    return total;
}

server.get('/',async (req,res) =>{
    db.hello("Toto");
    const produits = await db.getProduits();
    if(!req.session.cart)
    {
        req.session.cart = [];
    }
    res.render('client/welcome.ejs',{
<<<<<<< HEAD
        message : 'Bienvenue dans la Friterie',
        category : cat,
=======
        message : 'Bienvenue',
        produits : produits,
        cart : req.session.cart,
        total_cart : get_cart_total(req),
        qte_total_cart : get_cart_total_qte(req)
>>>>>>> frontend
    });
});

server.post('/add_cart', (req, res) => {

	const id = req.body.id;
	const libelle = req.body.libelle;
	const prix = req.body.prix;
	const qte = req.body.qte;
	const img = req.body.img;
	const taille = req.body.taille;


	let count = 0;
	for(let i = 0; i < req.session.cart.length; i++)
	{
		if(req.session.cart[i].id === parseInt(id))
		{
			req.session.cart[i].qte += parseInt(qte);
			count++;
		}

	}

	if(count === 0)
	{
		const cart_data = {
			id : parseInt(id),
			libelle : libelle,
			prix : parseFloat(prix),
            qte : parseInt(qte),
            img : img,
            taille : taille
		};

		req.session.cart.push(cart_data);
	}

	res.redirect("/");

});

server.post('/clear_cart', (req, res) => {

	res.redirect("/");

});

server.get('/remove_item', (req, res) => {

	const id =  parseInt(req.query.id);
    console.log("Arrivé et id est " +id);

	for(let i = 0; i < req.session.cart.length; i++)
	{
		if(req.session.cart[i].id === id)
		{
            console.log("suppression de " +id);
			req.session.cart.splice(i, 1);
		}
	}
	res.redirect("/");

});

server.use((req,res) => {
    // console.log("Entree dans abort");
    res.status(404).send("erreur");
    // console.log("Sortie de abort");

});

server.listen(8080);