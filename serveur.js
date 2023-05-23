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

function estEntier(str) {
	return !isNaN(parseInt(str)) && Number.isInteger(parseFloat(str));
}

function check_form_produit(req){
	// console.log(req.files);
	// console.log("file size est "+req.files.file.size);
	// console.log("req.body.libelle.length est "+req.body.libelle.length);
	// console.log("req.body.categorie.length est "+req.body.categorie.length);
	// console.log("Number.isFinite(req.body.prix) est "+Number.isFinite( parseFloat(req.body.prix)));


	if (req.body.libelle.length == 0 || req.body.categorie.length == 0 || 
		!/^\d+(\.\d+)?$/.test(req.body.prix) || req.files.file.size == 0 ||
		!estEntier(req.body.XXS) || !estEntier(req.body.XS) || !estEntier(req.body.S) ||
		!estEntier(req.body.M) || !estEntier(req.body.L) || !estEntier(req.body.XL)
		|| !estEntier(req.body.XXL)
		){
		return false;
	}else{
		return true;
	}

}

function check_form_accessoire(req){

	if (req.body.libelle.length == 0 || !/^\d+(\.\d+)?$/.test(req.body.prix) ||
		req.files.file.size == 0){
		return false;
	}else{
		return true;
	}

}

function check_form_combinaisons(req){
	if (req.body.nom.length == 0 || !/^\d+(\.\d+)?$/.test(req.body.prix) ||
	req.body.categorie.length == 0 || req.body.produit1.length == 0  || 
	req.body.taille.length == 0){
		return false;
	}else{
		return true;
	}

}

function check_form_produit_sauf_img(req){

	if (req.body.libelle.length == 0 || req.body.categorie.length == 0 || 
		!Number.isFinite(parseFloat(req.body.prix)) ||
		!estEntier(req.body.XXS) || !estEntier(req.body.XS) || !estEntier(req.body.S) ||
		!estEntier(req.body.M) || !estEntier(req.body.L) || !estEntier(req.body.XL)
		|| !estEntier(req.body.XXL)){
		return false;
	}else{
		return true;
	}

}

function check_form_accessoire_sauf_img(req){

	if (req.body.libelle.length == 0 || !Number.isFinite(parseFloat(req.body.prix))){
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
	let prob = "Certains produit ne sont plus disponibles, les voici ainsi que leur disponibilités ...";
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

async function ajoutProdCombi(req){
	try {
		let id_combi = await db.get_last_idcombi();

		const produits = await db.getProduits();
		const query = "INSERT INTO produit_combi(id_prod,id_combi) values($1,$2)";
		if(req.body.produit1 != "None") {
			for(const p of produits){
				if(p.libelle == req.body.produit1){
					const params = [p.id, id_combi];
					let r1 = await db.queryDatabase(query,params);
				}
			}
		}
		if(req.body.produit2 != "None") {
			for(const p of produits){
				if(p.libelle == req.body.produit2){
					const params = [p.id, id_combi];
					let r1 = await db.queryDatabase(query,params);
				}
			}
		}
		if(req.body.produit3 != "None") {
			for(const p of produits){
				if(p.libelle == req.body.produit3){
					const params = [p.id, id_combi];
					let r1 = await db.queryDatabase(query,params);
				}
			}
		}
	}catch (error) {
		console.log("Erreur lors de ajout de produit de combinaison");
		
	}
}

async function update_des_produits_combinaison(req, id_combi){
	try {
		const produits = await db.getProduits();
		const remove_prod = "DELETE FROM produit_combi WHERE id_combi = $1";
		let r = await db.queryDatabase(remove_prod,[id_combi]);
		const insertquery = "INSERT INTO produit_combi (id_prod, id_combi) VALUES ($1, $2)";
		if(req.body.produit1 != "None") {
			for(const p of produits){
				if(p.libelle == req.body.produit1){
					const params = [p.id, id_combi];
					await db.queryDatabase(insertquery,params);
				}
			}
		}
		if(req.body.produit2 != "None") {
			for(const p of produits){
				if(p.libelle == req.body.produit2){
					const params = [p.id, id_combi];
					await db.queryDatabase(insertquery,params);
				}
			}
		}
		if(req.body.produit3 != "None") {
			for(const p of produits){
				if(p.libelle == req.body.produit3){
					const params = [p.id, id_combi];
					await db.queryDatabase(insertquery,params);			
				}
			}
		}
	} catch (error) {
		console.log("Erreur lors de update de taille");
		
	}
}

async function ajout_des_tailles(req){
	try {
		// On prend l'id du client
		let id_prod = await db.get_last_idprod();

		// On ajoute les tailles
		const query = "INSERT INTO taille_prod(taille,id_prod,qte) values('XXS',$1,$2)";
		const params = [id_prod, parseInt(req.body.XXS)];
		let r1 = await db.queryDatabase(query,params);

		const query2 = "INSERT INTO taille_prod(taille,id_prod,qte) values('XS',$1,$2)";
		const params2 = [id_prod, parseInt(req.body.XS)];
		let r2 = await db.queryDatabase(query2,params2);

		const query3 = "INSERT INTO taille_prod(taille,id_prod,qte) values('S',$1,$2)";
		const params3 = [id_prod, parseInt(req.body.S)];
		let r3 = await db.queryDatabase(query3,params3);

		const query4 = "INSERT INTO taille_prod(taille,id_prod,qte) values('M',$1,$2)";
		const params4 = [id_prod, parseInt(req.body.M)];
		let r4 = await db.queryDatabase(query4,params4);

		const query5 = "INSERT INTO taille_prod(taille,id_prod,qte) values('L',$1,$2)";
		const params5 = [id_prod, parseInt(req.body.L)];
		let r5 = await db.queryDatabase(query5,params5);

		const query6 = "INSERT INTO taille_prod(taille,id_prod,qte) values('XL',$1,$2)";
		const params6 = [id_prod, parseInt(req.body.XL)];
		let r6 = await db.queryDatabase(query6,params6);

		const query7 = "INSERT INTO taille_prod(taille,id_prod,qte) values('XXL',$1,$2)";
		const params7 = [id_prod, parseInt(req.body.XXL)];
		let r7 = await db.queryDatabase(query7,params7);
	} catch (error) {
		console.log("Erreur lors de ajout de taille");
		
	}
}

async function update_des_tailles(req, id_prod){
	try {
		// console.log("Arrivé update taille et xxs est "+req.body.XXS);
		// On ajoute les tailles
		const query = "UPDATE taille_prod set qte = $1 where taille = 'XXS' AND id_prod = $2";
		const params = [parseInt(req.body.XXS),id_prod];
		let r1 = await db.queryDatabase(query,params);

		const query2 = "UPDATE taille_prod set qte = $1 where taille = 'XS' AND id_prod = $2";
		const params2 = [parseInt(req.body.XS),id_prod];
		let r2 = await db.queryDatabase(query2,params2);

		const query3 = "UPDATE taille_prod set qte = $1 where taille = 'S' AND id_prod = $2";
		const params3 = [parseInt(req.body.S),id_prod];
		let r3 = await db.queryDatabase(query3,params3);

		const query4 = "UPDATE taille_prod set qte = $1 where taille = 'M' AND id_prod = $2";
		const params4 = [parseInt(req.body.M),id_prod];
		let r4 = await db.queryDatabase(query4,params4);

		const query5 = "UPDATE taille_prod set qte = $1 where taille = 'L' AND id_prod = $2";
		const params5 = [parseInt(req.body.L),id_prod];
		let r5 = await db.queryDatabase(query5,params5);

		const query6 = "UPDATE taille_prod set qte = $1 where taille = 'XL' AND id_prod = $2";
		const params6 = [parseInt(req.body.XL),id_prod];
		let r6 = await db.queryDatabase(query6,params6);

		const query7 = "UPDATE taille_prod set qte = $1 where taille = 'XXL' AND id_prod = $2";
		const params7 = [parseInt(req.body.XXL),id_prod];
		let r7 = await db.queryDatabase(query7,params7);
		// console.log("Dernier");

	} catch (error) {
		console.log("Erreur lors de update de taille");
		
	}
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
		combi : false,
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
		combi : false,
		filtre : tmp,
        cart : req.session.cart,
        total_cart : get_cart_total(req),
        qte_total_cart : get_cart_total_qte(req),
		categories : categories,
		scategories : scategories
    });
});

server.get('/Combinaisons',async (req,res) =>{
    // db.hello("Toto");
    const produits = await db.getProduits();
	const cat_combi = await db.getCatCombinaisons();
	const prod_combi = await db.getProdCombinaisons();
	const combinaisons = await db.getCombinaisons();
    if(!req.session.cart)
    {
        req.session.cart = [];
    }
    res.render('client/welcome.ejs',{
		slideshow : 0,
        message : 'Les combinaisons',
        produits : produits,
		filtre : '',
		combi : true,
        cart : req.session.cart,
        total_cart : get_cart_total(req),
        qte_total_cart : get_cart_total_qte(req),
		categories : cat_combi,
		combinaisons : combinaisons,
		prod_combi : prod_combi
    });
});

server.get('/Combinaisons/rech_cat_combi/:cat',async (req,res) =>{
    // db.hello("Toto");
	const cat = req.params.cat;
    const produits = await db.getProduits();
	const cat_combi = await db.getCatCombinaisons();
	const prod_combi = await db.getProdCombinaisons();
	const combinaisons = await db.getCombinaisonsCat(cat);
    if(!req.session.cart)
    {
        req.session.cart = [];
    }
    res.render('client/welcome.ejs',{
		slideshow : 0,
        message : 'Les combinaisons',
        produits : produits,
		filtre : cat,
		combi : true,
        cart : req.session.cart,
        total_cart : get_cart_total(req),
        qte_total_cart : get_cart_total_qte(req),
		categories : cat_combi,
		combinaisons : combinaisons,
		prod_combi : prod_combi
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
		combi : false,
		acc : false,
		error : 0
    });
});

server.get("/gerant/accessoires", async (req, res) => {
    const produits = await db.getAccessoires();
	res.render('gerant/produit/welcome.ejs',{
        message : 'Bienvenue Gérant',
        produits : produits,
		combi : false,
		acc : true,
		error : 0
    });
});

server.get("/gerant/combinaisons", async (req, res) => {
	const produits = await db.getProduits();
    const combinaisons = await db.getCombinaisons();
	const prod_combi = await db.getProdCombinaisons();
	res.render('gerant/produit/welcome.ejs',{
        message : 'Bienvenue Gérant',
		combinaisons : combinaisons,
        produits : produits,
		prod_combi : prod_combi,
		combi : true,
		acc : false,
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
		combi : false,
		acc : false,
		error : 0,
		scat : scat,
		taille : await db.get_qte_produit(id)
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
		let r2 = await update_des_tailles(req,id);
		res.redirect("/gerant/produit");

	}else{
		const cat = await db.getCategories();
		const scat = await db.getSousCategories();
		const produit = await db.getProduit(parseInt(req.params.id));
		res.render('gerant/produit/edit.ejs',{
			message : 'Formulaire incorrect',
			produit : produit,
			combi : false,
			acc : true,
			cat : cat,
			error : 1,
			scat : scat,
			taille : [req.body.XXS,req.body.XS,req.body.S,req.body.M,req.body.L,req.body.XL,req.body.XXL]

		});
	}
	
});

server.get("/gerant/accessoires/edit/:id", async (req, res) => {
	const id = parseInt(req.params.id);
	const produit = await db.getAccessoire(id);
	res.render('gerant/produit/edit.ejs',{
        message : "Modification d'accessoire",
        produit : produit,
		combi : false,
		acc : true,
		error : 0,
		qte : await db.get_qte_accessoire(id)
    });
});

server.post("/gerant/accessoires/edit/:id", async (req, res) => {
	const file = req.files.file;
	let filename = file.path.substring(11);

	if(check_form_accessoire_sauf_img(req)){
		if(req.files.file.size == 0){
			filename = req.body.filename;
		}
		const id = parseInt(req.params.id);
		const params = [req.body.libelle, parseFloat(req.body.prix), filename, parseInt(req.body.qte),id];
		const query = "UPDATE accessoire SET nom = $1, prix = $2, img = $3, qte = $4 WHERE id_acc = $5";
		let r = await db.queryDatabase(query,params);
		res.redirect("/gerant/accessoires");
	}else{
		const produit = await db.getAccessoire(parseInt(req.params.id));
		res.render('gerant/produit/edit.ejs',{
			message : 'Formulaire incorrect',
			combi : false,
			acc : true,
			produit : produit,
			error : 1,
			qte : [req.body.qte]
		});
	}
	
});

server.get("/gerant/combinaisons/edit/:id", async (req, res) => {
	const id = parseInt(req.params.id);
	const prod_combi = await db.getProdCombinaisons();
	const produit = await db.getCombinaison(id);
	const produits = await db.getProduits();
	const cat = await db.getCatCombinaisons();
	const taille = await db.getTaille();
	let p = new Object;
	p.id = produit.id;
	p.nom = produit.nom;
	p.categorie = produit.categorie;
	p.prix = produit.prix;
	let tab = await db.getTabProdCombi(id);
	p.libelle = tab;
	p.taille = produit.taille;
	res.render('gerant/produit/edit.ejs',{
        message : "Modification de combinaison",
        produit : p,
		list_produits : produits,
		prod_combi : prod_combi,
		combi : true,
		acc : false,
		cat : cat,
		list_taille : taille,
		error : 0
    });
});

server.post("/gerant/combinaisons/edit/:id", async (req, res) => {
	if(check_form_combinaisons(req)){
		const id = parseInt(req.params.id);
		const params = [req.body.nom, req.body.categorie ,parseFloat(req.body.prix), req.body.taille,id];
		const query = "UPDATE combinaison SET nom = $1, nom_cat_combi = $2, prix = $3, taille = $4 WHERE id_combi = $5";
		let r = await db.queryDatabase(query,params);
		let r2 = await update_des_produits_combinaison(req,id);
		res.redirect("/gerant/combinaisons");
	}else{
		const id = parseInt(req.params.id);
		const produit = await db.getCombinaison(id);
		const produits = await db.getProduits();
		const cat = await db.getCatCombinaisons();
		const prod_combi = await db.getProdCombinaisons();
		const taille = await db.getTaille();
		let p = new Object;
		p.id = produit.id;
		p.nom = produit.nom;
		p.categorie = produit.categorie;
		p.prix = produit.prix;
		let tab = await db.getTabProdCombi(id);
		p.libelle = tab;
		p.taille = produit.taille;
		res.render('gerant/produit/edit.ejs',{
			message : 'Formulaire incorrect',
			combi : true,
			list_produits : produits,
			prod_combi : prod_combi,
			list_taille : taille,
			cat : cat,
			acc : false,
			produit : p,
			error : 1
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
		combi : false,
		acc : false,
		cat : cat,
		error : 0,
		scat : scat,
		taille : [0,0,0,0,0,0,0]
    });
});

server.get("/gerant/accessoires/create", async (req, res) => {
	let p = new Object;
    p.img = "";
	res.render('gerant/produit/create.ejs',{
        message : "Ajout d'accessoire",
        produit : p,
		combi : false,
		acc : true,
		error : 0,
		qte : [0]
    });
});

server.get("/gerant/combinaisons/create", async (req, res) => {
	const cat = await db.getCatCombinaisons();
	const produits = await db.getProduits();
	const combinaisons = await db.getCombinaisons();
	const taille = await db.getTaille();
	let p = new Object;
    p.categorie = "Homme";
	p.libelle = ["None","None","None"];
	p.taille = "XXS";
	res.render('gerant/produit/create.ejs',{
        message : 'Ajout de combinaison',
        produit : p,
		combi :true,
		acc : false,
		cat : cat,
		combinaisons : combinaisons,
		error : 0,
		list_produits : produits,
		list_taille : taille
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
		let r2 = await ajout_des_tailles(req);
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
			combi : false,
			acc : false,
			cat : cat,
			scat : scat,
			taille : [req.body.XXS,req.body.XS,req.body.S,req.body.M,req.body.L,req.body.XL,req.body.XXL]
		});
		// res.redirect('back');
	}
});

server.post("/gerant/accessoires/create", async (req, res) => {
	const file = req.files.file;
	// console.log(file.name);
	let filename = file.path.substring(11);
	// console.log(filename);
	// console.log(check_form_produit(req));
	if(check_form_accessoire(req)){
		const query = "INSERT INTO accessoire (nom,prix,img,qte) VALUES ($1, $2, $3, $4)";
		const params = [req.body.libelle , parseFloat(req.body.prix), filename , parseInt(req.body.qte)];
		let r = await db.queryDatabase(query,params);
		res.redirect("/gerant/accessoires");

	}else{
		console.log("Arrivé dans problème "+ req.files.file.name);
		let p = new Object;
		p.img = req.files.file.name;
		p.prix = req.body.prix;
		p.libelle = req.body.libelle;
		res.render('gerant/produit/create.ejs',{
			message : 'Formulaire Incorrect',
			produit : p,
			combi : false,
			acc : true,
			error : 1,
			qte : [req.body.qte]
		});
		// res.redirect('back');
	}
});

server.post("/gerant/combinaisons/create", async (req, res) => {
	if(check_form_combinaisons(req)){
		const query = "INSERT INTO combinaison (nom,nom_cat_combi,prix,taille) VALUES ($1, $2, $3, $4)";
		const params = [req.body.nom , req.body.categorie, parseFloat(req.body.prix), req.body.taille];
		let r = await db.queryDatabase(query,params);
		let r2 = await ajoutProdCombi(req);
		res.redirect("/gerant/combinaisons");
	}else{
		console.log("Arrivé dans problème ");
		const cat = await db.getCatCombinaisons();
		const produits = await db.getProduits();
		const combinaisons = await db.getCombinaisons();
		const taille = await db.getTaille();
		let p = new Object;
		p.nom = req.body.nom;
		p.categorie = req.body.categorie;
		p.prix = req.body.prix;
		p.taille = req.body.taille;
		p.libelle = [req.body.produit1,req.body.produit2,req.body.produit3]
		res.render('gerant/produit/create.ejs',{
			message : 'Formulaire Incorrect',
			produit : p,
			error : 1,
			combi : true,
			acc : false,
			cat : cat,
			combinaisons : combinaisons,
			list_produits : produits,
			list_taille : taille,
			taille : [req.body.taille]
		});
		// res.redirect('back');
	}
});

server.get("/gerant/produit/delete/:id", async (req, res) => {
	const id = parseInt(req.params.id);
	const query = "DELETE FROM produit WHERE id_prod = $1";
	const params = [id];
	let r = await db.queryDatabase(query,params);
	res.redirect("/gerant/produit");
});

server.get("/gerant/accessoires/delete/:id", async (req, res) => {
	const id = parseInt(req.params.id);
	const query = "DELETE FROM accessoire WHERE id_acc = $1";
	const params = [id];
	let r = await db.queryDatabase(query,params);
	res.redirect("/gerant/accessoires");
});

server.get("/gerant/combinaisons/delete/:id", async (req, res) => {
	const id = parseInt(req.params.id);
	const query = "DELETE FROM combinaison WHERE id_combi = $1";
	const params = [id];
	let r = await db.queryDatabase(query,params);
	res.redirect("/gerant/combinaisons");
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