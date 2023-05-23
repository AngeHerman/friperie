const express = require('express');
const multiparty = require('connect-multiparty');

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.set('view engine','ejs');
const session = require('express-session');
app.use(express.static('public'));
app.use(session({
	secret : "process.env.SESSION_SECRET",
	resave : false,
	saveUninitialized : true,
	cookie : { secure : false }
}));
const db = require("./database.js");
const cat = require("./category.js");
const body_parser = require('body-parser');

app.use(multiparty({uploadDir: 'public/img'}));

app.get('/', (req, res) => {
	res.render("index.ejs");
});

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



app.post('/add_cart', (req, res) => {

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

app.post('/clear_cart', (req, res) => {
	req.session.cart = [];
	res.redirect("/");
});

app.get('/remove_item', (req, res) => {

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

app.get("/gerant/produit", async (req, res) => {
    const produits = await db.getProduits();
	res.render('gerant/produit/welcome.ejs',{
        message : 'Bienvenue Gérant',
        produits : produits,
    });
});

app.get("/gerant/produit/edit/:id", async (req, res) => {
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
app.post("/gerant/produit/edit/:id", async (req, res) => {
	const id = parseInt(req.params.id);
	const params = [req.body.libelle, parseFloat(req.body.prix), req.body.categorie, req.body.img, id];
	const query = "UPDATE produit SET libelle = $1, prix = $2, nom_scat = $3, img = $4  WHERE id_prod = $5";
	let r = await db.queryDatabase(query,params);
	res.redirect("/gerant/produit");
});

app.get("/gerant/produit/create", async (req, res) => {
	const cat = await db.getCategories();
    const scat = await db.getSousCategories();
	let p = new Object;
    p.categorie = "Jean";
    p.img = "";
	res.render('gerant/produit/create.ejs',{
        message : 'Ajout de produit',
        produit : p,
		cat : cat,
		scat : scat
    });
});


app.post('/envoi', async (req, res) => {
  const file = req.files.file;
  console.log(file.name); // "image.jpg"
  console.log(file.path); // "public/uploads/image.jpg"
  console.log(req.body.prix); // "public/uploads/image.jpg"

  // Save the file to a database or file system
  res.send('File uploaded successfully');
});

app.get("/gerant/produit/delete/:id", async (req, res) => {
	const id = parseInt(req.params.id);
	const query = "DELETE FROM produit WHERE id_prod = $1";
	const params = [id];
	let r = await db.queryDatabase(query,params);
	console.log(r);
	res.redirect("/gerant/produit");
});

app.use((req,res) => {
    // console.log("Entree dans abort");
    res.status(404).send("erreur");
    // console.log("Sortie de abort");

});

app.listen(3000, () => {
  console.log('app started on port 3000');
});