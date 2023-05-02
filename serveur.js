const express = require('express');
const server = express();
server.use(express.static('public'));
server.set('view engine','ejs');
server.use(express.urlencoded({extended: true}));
const db = require("./database.js");
const cat = require("./category.js");
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
    // db.hello("Toto");
    const produits = await db.getProduits();
    if(!req.session.cart)
    {
        req.session.cart = [];
    }
    res.render('client/welcome.ejs',{
        message : 'Bienvenue dans la Friperie',
        produits : produits,
        cart : req.session.cart,
        total_cart : get_cart_total(req),
        qte_total_cart : get_cart_total_qte(req)
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
		if((req.session.cart[i].id === parseInt(id)) && (req.session.cart[i].taille === taille))
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
	const taille = req.query.taille;

	
    console.log("Arrivé et id est " +id);

	for(let i = 0; i < req.session.cart.length; i++)
	{
		console.log("Arrivé et id est " +id+ "cart taille est "+req.session.cart[i].taille+ " taille a sup est "+taille);
		if((req.session.cart[i].id === id) && (req.session.cart[i].taille === taille))
		{
            console.log("suppression de " +id+" de taille "+taille);
			req.session.cart.splice(i, 1);
		}
	}
	res.redirect("/");

});

server.get("/gerant/produit", async (req, res) => {
    const produits = await db.getProduits();
	res.render('gerant/produit/welcome.ejs',{
        message : 'Bienvenue Gérant',
        produits : produits,
    });
});

server.get("/gerant/produit/edit/:id", async (req, res) => {
	const id = parseInt(req.params.id);
    const cat = await db.getCategories();
    const scat = await db.getSousCategories();
	const produit = await db.getProduit(id);
	res.render('gerant/produit/edit.ejs',{
        message : 'Modification de produit',
        produit : produit,
		cat : cat,
		scat : scat
    });
});

// POST /edit/5
server.post("/gerant/produit/edit/:id", async (req, res) => {
	const id = parseInt(req.params.id);
	const params = [req.body.libelle, parseFloat(req.body.prix), req.body.categorie, req.body.img, id];
	const query = "UPDATE produit SET libelle = $1, prix = $2, nom_scat = $3, img = $4  WHERE id_prod = $5";
	let r = await db.queryDatabase(query,params);
	res.redirect("/gerant/produit");
});

server.get("/gerant/produit/create", async (req, res) => {
	const cat = await db.getCategories();
    const scat = await db.getSousCategories();
	let p = new Object;
    p.categorie = "Jean";
    p.img = "";
	res.render('gerant/produit/edit.ejs',{
        message : 'Modification de produit',
        produit : produit,
		cat : cat,
		scat : scat
    });
});

server.post("/gerant/produit/create", async (req, res) => {
	const query = "INSERT INTO produit (libelle, qte,prix,img,nom_scat) VALUES ($1, $2, $3, $4, $5)";
	const params = [req.body.libelle,0 , parseFloat(req.body.prix), req.body.img, req.body.categorie];
	let r = await db.queryDatabase(query,params);
	res.redirect("/gerant/produit");


});

server.use((req,res) => {
    // console.log("Entree dans abort");
    res.status(404).send("erreur");
    // console.log("Sortie de abort");

});

server.listen(8080);