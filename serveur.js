const express = require('express');
const server = express();
server.use(express.static('public'));
server.set('view engine','ejs');
server.use(express.urlencoded({extended: true}));
const db = require("./database.js");
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
    db.hello("Toto");
    const produits = await db.getProduits();
	const categories = await db.getCategories();
	const scategories = await db.getSousCategories();
    if(!req.session.cart)
    {
        req.session.cart = [];
    }
    res.render('client/welcome.ejs',{
        message : 'Bienvenue',
        produits : produits,
		filtre : '',
        cart : req.session.cart,
        total_cart : get_cart_total(req),
        qte_total_cart : get_cart_total_qte(req),
		categories : categories,
		scategories : scategories
    });
});

server.get('/Jean',async (req,res) =>{
    db.hello("Toto");
    const produits = await db.getProduits();
	const categories = await db.getCategories();
	const scategories = await db.getSousCategories();
    if(!req.session.cart)
    {
        req.session.cart = [];
    }
    res.render('client/welcome.ejs',{
        message : 'Bienvenue',
        produits : produits,
		filtre : 'Jean',
        cart : req.session.cart,
        total_cart : get_cart_total(req),
        qte_total_cart : get_cart_total_qte(req),
		categories : categories,
		scategories : scategories
    });
});

server.get('/Jogging',async (req,res) =>{
    db.hello("Toto");
    const produits = await db.getProduits();
	const categories = await db.getCategories();
	const scategories = await db.getSousCategories();
    if(!req.session.cart)
    {
        req.session.cart = [];
    }
    res.render('client/welcome.ejs',{
        message : 'Bienvenue',
        produits : produits,
		filtre : 'Jogging',
        cart : req.session.cart,
        total_cart : get_cart_total(req),
        qte_total_cart : get_cart_total_qte(req),
		categories : categories,
		scategories : scategories
    });
});

server.get('/Veste',async (req,res) =>{
    db.hello("Toto");
    const produits = await db.getProduits();
	const categories = await db.getCategories();
	const scategories = await db.getSousCategories();
    if(!req.session.cart)
    {
        req.session.cart = [];
    }
    res.render('client/welcome.ejs',{
        message : 'Bienvenue',
        produits : produits,
		filtre : 'Veste',
        cart : req.session.cart,
        total_cart : get_cart_total(req),
        qte_total_cart : get_cart_total_qte(req),
		categories : categories,
		scategories : scategories
    });
});

server.get('/Pull',async (req,res) =>{
    db.hello("Toto");
    const produits = await db.getProduits();
	const categories = await db.getCategories();
	const scategories = await db.getSousCategories();
    if(!req.session.cart)
    {
        req.session.cart = [];
    }
    res.render('client/welcome.ejs',{
        message : 'Bienvenue',
        produits : produits,
		filtre : 'Pull',
        cart : req.session.cart,
        total_cart : get_cart_total(req),
        qte_total_cart : get_cart_total_qte(req),
		categories : categories,
		scategories : scategories
    });
});

server.get('/T_shirt',async (req,res) =>{
    db.hello("Toto");
    const produits = await db.getProduits();
	const categories = await db.getCategories();
	const scategories = await db.getSousCategories();
    if(!req.session.cart)
    {
        req.session.cart = [];
    }
    res.render('client/welcome.ejs',{
        message : 'Bienvenue',
        produits : produits,
		filtre : 'T_shirt',
        cart : req.session.cart,
        total_cart : get_cart_total(req),
        qte_total_cart : get_cart_total_qte(req),
		categories : categories,
		scategories : scategories
    });
});

server.get('/Manteau',async (req,res) =>{
    db.hello("Toto");
    const produits = await db.getProduits();
	const categories = await db.getCategories();
	const scategories = await db.getSousCategories();
    if(!req.session.cart)
    {
        req.session.cart = [];
    }
    res.render('client/welcome.ejs',{
        message : 'Bienvenue',
        produits : produits,
		filtre : 'Manteau',
        cart : req.session.cart,
        total_cart : get_cart_total(req),
        qte_total_cart : get_cart_total_qte(req),
		categories : categories,
		scategories : scategories
    });
});

server.get('/Costume',async (req,res) =>{
    db.hello("Toto");
    const produits = await db.getProduits();
	const categories = await db.getCategories();
	const scategories = await db.getSousCategories();
    if(!req.session.cart)
    {
        req.session.cart = [];
    }
    res.render('client/welcome.ejs',{
        message : 'Bienvenue',
        produits : produits,
		filtre : 'Costume',
        cart : req.session.cart,
        total_cart : get_cart_total(req),
        qte_total_cart : get_cart_total_qte(req),
		categories : categories,
		scategories : scategories
    });
});

server.get('/Short_de_sport',async (req,res) =>{
    db.hello("Toto");
    const produits = await db.getProduits();
	const categories = await db.getCategories();
	const scategories = await db.getSousCategories();
    if(!req.session.cart)
    {
        req.session.cart = [];
    }
    res.render('client/welcome.ejs',{
        message : 'Bienvenue',
        produits : produits,
		filtre : 'Short de sport',
        cart : req.session.cart,
        total_cart : get_cart_total(req),
        qte_total_cart : get_cart_total_qte(req),
		categories : categories,
		scategories : scategories
    });
});

server.get('/Sac_à_main',async (req,res) =>{
    db.hello("Toto");
    const produits = await db.getProduits();
	const categories = await db.getCategories();
	const scategories = await db.getSousCategories();
    if(!req.session.cart)
    {
        req.session.cart = [];
    }
    res.render('client/welcome.ejs',{
        message : 'Bienvenue',
        produits : produits,
		filtre : 'Sac à main',
        cart : req.session.cart,
        total_cart : get_cart_total(req),
        qte_total_cart : get_cart_total_qte(req),
		categories : categories,
		scategories : scategories
    });
});

server.get('/Jupe_courte',async (req,res) =>{
    db.hello("Toto");
    const produits = await db.getProduits();
	const categories = await db.getCategories();
	const scategories = await db.getSousCategories();
    if(!req.session.cart)
    {
        req.session.cart = [];
    }
    res.render('client/welcome.ejs',{
        message : 'Bienvenue',
        produits : produits,
		filtre : 'Jupe courte',
        cart : req.session.cart,
        total_cart : get_cart_total(req),
        qte_total_cart : get_cart_total_qte(req),
		categories : categories,
		scategories : scategories
    });
});

server.get('/Jupe_longue',async (req,res) =>{
    db.hello("Toto");
    const produits = await db.getProduits();
	const categories = await db.getCategories();
	const scategories = await db.getSousCategories();
    if(!req.session.cart)
    {
        req.session.cart = [];
    }
    res.render('client/welcome.ejs',{
        message : 'Bienvenue',
        produits : produits,
		filtre : 'Jupe longue',
        cart : req.session.cart,
        total_cart : get_cart_total(req),
        qte_total_cart : get_cart_total_qte(req),
		categories : categories,
		scategories : scategories
    });
});

server.get('/Robe_courte',async (req,res) =>{
    db.hello("Toto");
    const produits = await db.getProduits();
	const categories = await db.getCategories();
	const scategories = await db.getSousCategories();
    if(!req.session.cart)
    {
        req.session.cart = [];
    }
    res.render('client/welcome.ejs',{
        message : 'Bienvenue',
        produits : produits,
		filtre : 'Robe courte',
        cart : req.session.cart,
        total_cart : get_cart_total(req),
        qte_total_cart : get_cart_total_qte(req),
		categories : categories,
		scategories : scategories
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