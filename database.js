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
console.log("avant");
(async() => {
	try {
		await pool.connect();
		console.log("apres");
	
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




function hello( n) {
    hehe("Maman");
    console.log("Hello tu viens d'envoyer "+n);
}
function hehe(n){
    console.log("HEHE "+n);
}

module.exports = {hello,getProduits};