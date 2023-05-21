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
        // await pool.connect();
        const values = params;
        const result = await pool.query(query, values);
        return result.rows;
    } catch (err) {
        console.error(err);
        return null;
    }
    // finally {
    //     await pool.end();
    // }
}

async function getProduit(id){

    const sql = "SELECT * FROM produit WHERE id_prod = $1";
    let rows = await queryDatabase(sql,[id]);
    if(!rows){
        return null;
    }
    // console.log(rows);
    let p = new Object;
    p.id = rows[0].id_prod;
    p.libelle = rows[0].libelle;
    p.prix = rows[0].prix;
    p.categorie = rows[0].nom_scat;
    p.img = rows[0].img;
    return p;
}

async function getAccessoires(){
    let tab = [];
    let res =  await pool.query(
        "select * from accessoire"
    );
    for(let r of res.rows) {
        let p = new Object;
        p.idacc = r.id_acc;
        p.nom = r.nom;
        p.prix = r.prix;
        tab.push(p);
    }
    return tab;
}

async function getAccessoire(id){

    const sql = "SELECT * FROM accessoire WHERE id_acc = $1";
    let rows = await queryDatabase(sql,[id]);
    if(!rows){
        return null;
    }
    // console.log(rows);
    let p = new Object;
    p.id = rows[0].id_acc;
    p.nom = rows[0].nom;
    p.prix = rows[0].prix;
    p.img = rows[0].img;
    p.qte = rows[0].qte;
    return p;
}

async function getCombinaison(id){

    const sql = "SELECT * FROM combinaison WHERE id_combi = $1";
    let rows = await queryDatabase(sql,[id]);
    if(!rows){
        return null;
    }
    // console.log(rows);
    let p = new Object;
    p.id = rows[0].id_combi;
    p.nom = rows[0].nom;
    p.categorie = rows[0].nom_cat_combi;
    p.prix = rows[0].prix;
    p.taille = rows[0].taille;
    return p;
}

async function getTabProdCombi(id){
    let tab = [];
    const sql = "SELECT * FROM produit_combi WHERE id_combi = $1";
    let rows = await queryDatabase(sql,[id]);
    if(!rows){
        return null;
    }
    for(let r of rows) {
        const produits = "SELECT * FROM produit WHERE id_prod = $1";
        let rowsProd = await queryDatabase(produits,[r.id_prod]); 
        if(!rowsProd){
            return null;
        }
        let p = rowsProd[0].libelle;
        tab.push(p);
    }
    while(tab.length<3){
        tab.push("None");
    }
    return tab;
}


async function getCatCombinaisons(){

    let tab = [];
    let res =  await pool.query(
        "select * from cat_combi"
    );
    for(let r of res.rows) {
        let p = new Object;
        p.nom = r.nom_cat_combi;
        tab.push(p);
    }
    return tab;
}

async function getCombinaisons(){

    let tab = [];
    let res =  await pool.query(
        "select * from combinaison"
    );
    for(let r of res.rows) {
        let p = new Object;
        p.idcombi = r.id_combi;
        p.nom = r.nom;
        p.nom_cat_combi = r.nom_cat_combi;
        p.prix = r.prix;
        p.qte = r.qte;
        p.taille = r.taille;
        tab.push(p);
    }
    return tab;
}

async function getProdCombinaisons(){

    let tab = [];
    let res =  await pool.query(
        "select * from produit_combi"
    );
    for(let r of res.rows) {
        let p = new Object;
        p.idprod = r.id_prod;
        p.idcombi = r.id_combi;
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

    let res =  await pool.query(
        "select MAX(id_cli) as id from client"
    );
    return parseInt( res.rows[0].id);
}

async function get_last_idcomm(){

    let res =  await pool.query(
        "select MAX(id_comm) as id from commandes"
    );
    return parseInt( res.rows[0].id);
}

async function getTaille(){

    let tab = [];
    let res =  await pool.query(
        "select * FROM taille"
    );
    for(let r of res.rows) {
        let p = new Object;
        p.taille = r.taille;
        tab.push(p);
    }
    return tab;
}

async function get_last_idprod(){

    let res =  await pool.query(
        "select MAX(id_prod) as id from produit"
    );
    return parseInt( res.rows[0].id);
}

async function get_last_idcombi(){

    let res =  await pool.query(
        "select MAX(id_combi) as id from combinaison"
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

async function get_qte_produit(id_prod){
    let tab = [0,0,0,0,0,0,0];
    const query = "select * from taille_prod where id_prod = $1"
    let rows = await queryDatabase(query,[id_prod]);
    if(!rows){
        return null;
    }
    for(let r of rows) {
        if(r.taille === "XXS"){
            tab[0] = r.qte;
        }else if(r.taille === "XS"){
            tab[1] = r.qte;
        }else if(r.taille === "S"){
            tab[2] = r.qte;
        }else if(r.taille === "M"){
            tab[3] = r.qte;
        }else if(r.taille === "L"){
            tab[4] = r.qte;
        }else if(r.taille === "XL"){
            tab[5] = r.qte;
        }else if(r.taille === "XXL"){
            tab[6] = r.qte;
        }
    }
    return tab;
}

async function get_qte_accessoire(idacc){
    let tab = [0];
    const query = "select * from accessoire where id_acc = $1"
    let rows = await queryDatabase(query,[idacc]);
    if(!rows){
        return null;
    }
    for(let r of rows) {
        tab[0] = r.qte;
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

module.exports = {hello, getProduits, getCategories, getSousCategories, getProduit,
    getCombinaisons, getCatCombinaisons, getProdCombinaisons, queryDatabase, 
    getQteTailleProds, get_last_idcli, get_last_idcomm, get_comm_non_valider, 
    get_comm_valider, get_produits_comm, get_qte_produit, getAccessoires, getAccessoire, 
    get_qte_accessoire, getTaille, get_last_idcombi, get_last_idprod, getCombinaison,
    getTabProdCombi};
