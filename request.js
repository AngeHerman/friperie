const { Pool } = require('pg');
const db = require("./database.js");
const {Produit} = require("./produit.js");


async function getProduits(){
    const pool = db.getPool();
    let tab = [];
    let res =  await pool.query(
        "select * from produit"
    );
    for(let r of res.rows) {
        let p = new Produit(r.id_prod,r.libelle,r.nom_scat,r.img);
        tab.push(p);
    }
    return tab;
}




module.exports = {getProduits};