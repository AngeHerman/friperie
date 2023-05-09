const express = require('express');
const multiparty = require('connect-multiparty');
const server = express();
server.use(express.urlencoded({ extended : false }));
server.use(express.json());
server.set('view engine','ejs');
const db = require("./database.js");
const session = require('express-session');
server.use(express.static('public'));
server.use(session({
	secret : "process.env.SESSION_SECRET",
	resave : false,
	saveUninitialized : true,
	cookie : { secure : false }
}));


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

function check_form_donnee(req){

	if (req.body.nom.length == 0 || req.body.prenom.length == 0 || 
		req.body.adresse.length == 0 || req.body.tel.length == 0 || req.body.email.length == 0){
		return false;
	}else{
		return true;
	}

}

async function check_dispo_produit(req){
	let prob = "Certains produit ne sont plus disponibles, les voicis ainsi que leur disponibilités ...";
	let ret = true;
	qte_taille = await db.getQteTailleProds();
	req.session.cart.forEach(async (p_cart) => {
		const ligne_produit = qte_taille.find(u => u.taille === p_cart.taille && u.id === p_cart.id);
		if (ligne_produit === undefined){
			ret = false;
			prob += ", " + p_cart.libelle + " : " + p_cart.taille + " : 0";
		}
		else if (ligne_produit.qte < p_cart.qte){
			ret = false;
			prob += ", " + p_cart.libelle + " : " + p_cart.taille + " : "+ ligne_produit.qte;
		}
	});

	return {
		probleme: prob,
		retour: ret
	};
}

function get_cart_total_qte(req){
    let total = 0;
    req.session.cart.forEach(produit => {
        total += produit.qte;
    });
    return total;
}

async function remplissage_commande(req){
	try {
		// On crée le client
		const query = "INSERT INTO client(nom,prenom,adresse,telephone,email) VALUES ($1, $2, $3, $4, $5)";
		const params = [req.body.nom,req.body.prenom, req.body.adresse, req.body.tel, req.body.email];
		let r1 = await db.queryDatabase(query,params);
	
		// On prend l'id du client
		let id_client = await db.get_last_idcli();
		// console.log("Client créé");
	
		//On crée la commande
		const query2 = "INSERT INTO commandes(adresse,mail,prix,valider) VALUES ($1, $2, $3, $4)";
		const params2 = [req.body.adresse,req.body.email, get_cart_total(req), 0];
		let r2 = await db.queryDatabase(query2,params2);
	
		// On prend l'id de la commande
		let id_comm = await db.get_last_idcomm();
		// console.log("Commande créé idclient "+id_client+" idcomm "+id_comm);
	
		//On lie le client à la commande
		const query3 = "INSERT INTO client_comm(id_cli, id_comm) VALUES ($1, $2)";
		const params3 = [id_client,id_comm];
		let r3 = await db.queryDatabase(query3,params3);
		// console.log("Client comm créé");
	
		//On lie les produits commandés à la commande 
		for(let i = 0; i < req.session.cart.length; i++)
		{
			// console.log("id "+ req.session.cart[i].id);
			// console.log("qte "+ req.session.cart[i].qte);
			// console.log("taille "+ req.session.cart[i].taille);
			const query4 = "INSERT INTO comm_prod(id_prod, id_comm, qte, taille) VALUES ($1, $2, $3, $4)";
			const params4 = [req.session.cart[i].id ,id_comm, req.session.cart[i].qte, req.session.cart[i].taille];
			let r4 = await db.queryDatabase(query4,params4);
		}
		// console.log("Comm produit créé");
	
		//On diminue la quantité de produits dans la base de données
		qte_taille = await db.getQteTailleProds();
		req.session.cart.forEach(async (p_cart) => {
			const ligne_produit = qte_taille.find(u => u.taille === p_cart.taille && u.id === p_cart.id);
			const nouvelle_qte = ligne_produit.qte - p_cart.qte;
			// console.log(nouvelle_qte);
	
			const query5 = "UPDATE taille_prod SET qte = $1 WHERE id_prod = $2 AND taille = $3";
			const params5 = [nouvelle_qte ,p_cart.id,p_cart.taille];
			let r5 = await db.queryDatabase(query5,params5);
		});
		// console.log("Update qte créé");
	
	} catch (error) {
		console.log("Erreur lors de la validation de la commande");
		
	}
	
}

server.get('/',async (req,res) =>{
    // db.hello("Toto");
    const produits = await db.getProduits();
	const categories = await db.getCategories();
	const scategories = await db.getSousCategories();
    if(!req.session.cart)
    {
        req.session.cart = [];
    }
    res.render('client/welcome.ejs',{
        message : 'Bienvenue dans la Friperie',
        produits : produits,
		filtre : '',
        cart : req.session.cart,
        total_cart : get_cart_total(req),
        qte_total_cart : get_cart_total_qte(req),
		categories : categories,
		scategories : scategories
    });
});


server.get("/rech_cat/:scat", async (req, res) => {
    const scat = req.params.scat;
    const tmp = scat.replace(/_/g,' ');
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
		filtre : tmp,
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

server.post("clear_cart", (req, res) => {
	req.session.cart = [];
	res.redirect("/");
});

server.get('/remove_item', (req, res) => {

	const id =  parseInt(req.query.id);
	const taille = req.query.taille;

	
    // console.log("Arrivé et id est " +id);

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

server.get("/gerant", (req, res) => {
	res.redirect("/gerant/produit");
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
		const query = "INSERT INTO produit (libelle,prix,img,nom_scat) VALUES ($1, $2, $3, $4)";
		const params = [req.body.libelle , parseFloat(req.body.prix), filename, req.body.categorie];
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

server.get("/valider_panier", async (req, res) => {
	res.render('client/saisir_donnee.ejs',{
		message : 'Saisissez les données de livraison',
		nom : "",
		error : 0,
		prenom : "",
		adresse : "",
		tel : "",
		email : "",
		cart : req.session.cart,
        total_cart : get_cart_total(req),
        qte_total_cart : get_cart_total_qte(req)
	});
});

// server.post("/commander", async (req, res) => {

// 	if(check_form_donnee(req)){
// 		const result = await check_dispo_produit(req);
// 		if(!result.retour){
// 			res.render('client/saisir_donnee.ejs',{
// 				message : result.probleme,
// 				nom : req.body.nom,
// 				error : 1,
// 				prenom : req.body.prenom,
// 				adresse : req.body.adresse,
// 				tel : req.body.tel,
// 				email : req.body.email,
// 				cart : req.session.cart,
// 				total_cart : get_cart_total(req),
// 				qte_total_cart : get_cart_total_qte(req)
// 			});
// 		}
// 		remplissage_commande(req);
// 		res.redirect("/clear_cart");

// 	}else{

// 		res.render('client/saisir_donnee.ejs',{
// 			message : 'Formulaire incorrect',
// 			nom : req.body.nom,
// 			error : 1,
// 			prenom : req.body.prenom,
// 			adresse : req.body.adresse,
// 			tel : req.body.tel,
// 			email : req.body.email,
// 			cart : req.session.cart,
// 			total_cart : get_cart_total(req),
// 			qte_total_cart : get_cart_total_qte(req)
// 		});
// 	}
	
// });

server.post("/commander", async (req, res) => {
	let message = "";
	let error = 0;
	let nom = req.body.nom;
	let prenom = req.body.prenom;
	let adresse = req.body.adresse;
	let tel = req.body.tel;
	let email = req.body.email;
	let cart = req.session.cart;
	let total_cart = get_cart_total(req);
	let qte_total_cart = get_cart_total_qte(req);

	if (check_form_donnee(req)) {
		const result = await check_dispo_produit(req);
		if (!result.retour) {
			message = result.probleme;
			error = 1;
		} else {
			await remplissage_commande(req);
			req.session.cart = [];
			res.redirect("/");
			return;
		}
	} else {
		message = "Formulaire incorrect";
		error = 1;
	}

	res.render("client/saisir_donnee.ejs", {
		message,
		error,
		nom,
		prenom,
		adresse,
		tel,
		email,
		cart,
		total_cart,
		qte_total_cart,
	});
});

server.get("/gerant/comm_non_valide", async (req, res) => {
	const comm = await db.get_comm_non_valider();
	res.render("gerant/commande/comm_non_valide.ejs",{
		message : 'Voici les commandes pas encore validées',
		comm : comm,
		error : 0,
	});
});

server.get("/gerant/comm_valide", async (req, res) => {
	const comm = await db.get_comm_valider();
	res.render("gerant/commande/comm_valide.ejs",{
		message : 'Voici les commandes déja validées (livrées)',
		comm : comm,
		error : 0,

	});
});

server.get("/gerant/comm/show/:id_comm", async (req, res) => {
	const id_comm = parseInt(req.params.id_comm);
	const produits = await db.get_produits_comm(id_comm);
	res.render("gerant/commande/show.ejs",{
		message : 'Voici les détails de la commande',
		produits : produits,
		error : 0,

	});
});

server.get("/gerant/comm/valider/:id_comm", async (req, res) => {
	const id_comm = parseInt(req.params.id_comm);
	try {
		const params = [id_comm];
		const query = "UPDATE commandes SET valider = 1  WHERE id_comm = $1";
		let r = await db.queryDatabase(query,params);
		res.redirect("/gerant/comm_non_valide");
	} catch (error) {
		console.log("Erreur lors de la validation de la commande");
	}
});

server.use((req,res) => {
    // console.log("Entree dans abort");
    res.status(404).send("<h1>erreur veillez contacter l'administrateur<h1>");
    // console.log("Sortie de abort");

});

server.listen(8080);