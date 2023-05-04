const express = require('express');
const multiparty = require('connect-multiparty');
const server = express();
server.use(express.urlencoded({ extended : false }));
server.use(express.json());
server.set('view engine','ejs');
const session = require('express-session');
server.use(express.static('public'));
server.use(session({
	secret : "process.env.SESSION_SECRET",
	resave : false,
	saveUninitialized : true,
	cookie : { secure : false }
}));
const db = require("./database.js");
const cat = require("./category.js");
const body_parser = require('body-parser');


server.use(multiparty({uploadDir: 'public/img'}));

function get_cart_total(req){
    let total = 0.0;
    req.session.cart.forEach(produit => {
        total += (produit.prix * produit.qte);
    });
    return total;
}

function check_form_produit(req){
	// console.log(req.files);
	// console.log("file size est "+req.files.file.size);
	// console.log("req.body.libelle.length est "+req.body.libelle.length);
	// console.log("req.body.categorie.length est "+req.body.categorie.length);
	// console.log("Number.isFinite(req.body.prix) est "+Number.isFinite( parseFloat(req.body.prix)));


	if (req.body.libelle.length == 0 || req.body.categorie.length == 0 || 
		!Number.isFinite(parseFloat(req.body.prix)) || req.files.file.size == 0){
		return false;
	}else{
		return true;
	}

}

function check_form_produit_sauf_img(req){

	if (req.body.libelle.length == 0 || req.body.categorie.length == 0 || 
		!Number.isFinite(parseFloat(req.body.prix))){
		return false;
	}else{
		return true;
	}

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
	req.session.cart = [];
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
		error : 0
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
		error : 0,
		scat : scat
    });
});


server.post("/gerant/produit/edit/:id", async (req, res) => {
	const file = req.files.file;
	let filename = file.path.substring(11);

	if(check_form_produit_sauf_img(req)){
		if(req.files.file.size == 0){
			filename = req.body.filename;
		}
		const id = parseInt(req.params.id);
		const params = [req.body.libelle, parseFloat(req.body.prix), req.body.categorie, filename, id];
		const query = "UPDATE produit SET libelle = $1, prix = $2, nom_scat = $3, img = $4  WHERE id_prod = $5";
		let r = await db.queryDatabase(query,params);
		res.redirect("/gerant/produit");

	}else{
		const cat = await db.getCategories();
		const scat = await db.getSousCategories();
		const produit = await db.getProduit(parseInt(req.params.id));
		res.render('gerant/produit/edit.ejs',{
			message : 'Formulaire incorrect',
			produit : produit,
			cat : cat,
			error : 1,
			scat : scat
		});
	}
	
});

server.get("/gerant/produit/create", async (req, res) => {
	const cat = await db.getCategories();
    const scat = await db.getSousCategories();
	let p = new Object;
    p.categorie = "Jean";
    p.img = "";
	res.render('gerant/produit/create.ejs',{
        message : 'Ajout de produit',
        produit : p,
		cat : cat,
		error : 0,
		scat : scat
    });
});

server.post("/gerant/produit/create", async (req, res) => {
	const file = req.files.file;
	// console.log(file.name);
	let filename = file.path.substring(11);
	// console.log(filename);
	// console.log(check_form_produit(req));
	if(check_form_produit(req)){
		const query = "INSERT INTO produit (libelle, qte,prix,img,nom_scat) VALUES ($1, $2, $3, $4, $5)";
		const params = [req.body.libelle,0 , parseFloat(req.body.prix), filename, req.body.categorie];
		let r = await db.queryDatabase(query,params);
		res.redirect("/gerant/produit");

	}else{
		console.log("Arrivé dans problème "+ req.files.file.name);

		const cat = await db.getCategories();
		const scat = await db.getSousCategories();
		let p = new Object;
		p.categorie = req.body.categorie;
		p.img = req.files.file.name;
		p.prix = req.body.prix;
		p.libelle = req.body.libelle;
		res.render('gerant/produit/create.ejs',{
			message : 'Formulaire Incorrect',
			produit : p,
			error : 1,
			cat : cat,
			scat : scat
		});
		// res.redirect('back');
	}
	
});

server.get("/gerant/produit/delete/:id", async (req, res) => {
	const id = parseInt(req.params.id);
	const query = "DELETE FROM produit WHERE id_prod = $1";
	const params = [id];
	let r = await db.queryDatabase(query,params);
	console.log(r);
	res.redirect("/gerant/produit");
});

server.use((req,res) => {
    // console.log("Entree dans abort");
    res.status(404).send("erreur");
    // console.log("Sortie de abort");

});

server.listen(8080);