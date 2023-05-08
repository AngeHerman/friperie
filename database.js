const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
	host: process.env.PG_HOST,
	port: process.env.PG_PORT,
	user: process.env.PG_USER,
	password: process.env.PG_PASSWORD,
	database: process.env.PG_DATABASE,
	// ssl: true,
});
// console.log("avant");
(async() => {
	try {
		await pool.connect();
		// console.log("apres");
	
		const res = await pool.query('SELECT $1::text as connected', ['Connection to postgres successful!']);
		console.log(res.rows[0].connected);
		// console.log(pool);
		// await pool.end();
	} catch (error) {
		console.log(error);
	}
})();

async function getProduits(){

    let tab = [];
    let res =  await pool.query(
        "select * from produit"
    );
    for(let r of res.rows) {
        let p = new Object;
        p.id = r.id_prod;
        p.libelle = r.libelle;
        p.prix = r.prix;
        p.categorie = r.nom_scat;
        p.img = r.img;
        // let p = new Produit(r.id_prod,r.libelle,r.nom_scat,r.img);
        tab.push(p);
    }
    return tab;
}

async function getCategories(){
    let tab = [];
    let res =  await pool.query(
        "select * from cat_prod"
    );
    for(let r of res.rows) {
        let p = new Object;
        p.nom = r.nom_cat;
        tab.push(p);
    }
    return tab;
}

async function getSousCategories(){
    let tab = [];
    let res =  await pool.query(
        "select * from scat_prod"
    );
    for(let r of res.rows) {
        let p = new Object;
        p.snom = r.nom_scat;
        p.nom = r.nom_cat; 
        tab.push(p);
    }
    return tab;
}

async function queryDatabase(query, params) {
    try {
        await pool.connect();
        const values = params;
        const result = await pool.query(query, values);
        return result.rows;
    } catch (err) {
        console.error(err);
        return null;
    }
    //  finally {
    //     await pool.end();
    // }
}

async function getProduit(id){

    const sql = "SELECT * FROM produit WHERE id_prod = $1";
    let rows = await queryDatabase(sql,[id]);
    if(!rows){
        return null;
    }
    console.log(rows);
    let p = new Object;
    p.id = rows[0].id_prod;
    p.libelle = rows[0].libelle;
    p.prix = rows[0].prix;
    p.categorie = rows[0].nom_scat;
    p.img = rows[0].img;
    return p;
}

async function getCategories(){

    let tab = [];
    let res =  await pool.query(
        "select * from cat_prod"
    );
    for(let r of res.rows) {
        let p = new Object;
        p.nom = r.nom_cat;
        tab.push(p);
    }
    return tab;
}

async function getQteTailleProds(){

    let tab = [];
    let res =  await pool.query(
        "select * FROM taille_prod"
    );
    for(let r of res.rows) {
        let p = new Object;
        p.taille = r.taille;
        p.id = r.id_prod;
        p.qte = r.qte;
        tab.push(p);
    }
    return tab;
}

async function get_last_idcli(){

    let tab = [];
    let res =  await pool.query(
        "select MAX(id_cli) as id from client"
    );
    return parseInt( res.rows[0].id);
}

async function get_last_idcomm(){

    let tab = [];
    let res =  await pool.query(
        "select MAX(id_comm) as id from commandes"
    );
    return parseInt( res.rows[0].id);
}

async function get_comm_non_valider(){

    let tab = [];
    let res =  await pool.query(
        "select * FROM commandes where valider = 0"
    );
    for(let r of res.rows) {
        let p = new Object;
        p.id = r.id_comm;
        p.adresse = r.adresse;
        p.mail = r.mail;
        p.prix = r.prix;
        tab.push(p);
    }
    return tab;
}

async function get_comm_valider(){

    let tab = [];
    let res =  await pool.query(
        "select * FROM commandes where valider = 1"
    );
    for(let r of res.rows) {
        let p = new Object;
        p.id = r.id_comm;
        p.adresse = r.adresse;
        p.mail = r.mail;
        p.prix = r.prix;
        tab.push(p);
    }
    return tab;
}

async function get_produits_comm(id_comm){
    let tab = [];
    const query = "select * from produit natural join comm_prod where id_comm = $1"
    let rows = await queryDatabase(query,[id_comm]);
    if(!rows){
        return null;
    }
    for(let r of rows) {
        let p = new Object;
        p.img = r.img;
        p.libelle = r.libelle;
        p.qte = r.qte;
        p.taille = r.taille;
        p.prix = r.prix;
        tab.push(p);
    }
    return tab;
}


function hello( n) {
    hehe("Monsieur, Madame");
    console.log("Hello tu viens d'envoyer "+n);
}
function hehe(n){
    console.log("Bienvenu "+n);
}

module.exports = {hello,getProduits,getCategories,getSousCategories,getProduit,queryDatabase,getQteTailleProds,get_last_idcli,
get_last_idcomm,get_comm_non_valider,get_comm_valider,get_produits_comm};
