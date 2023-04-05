const { Pool } = require('pg');
require('dotenv').config();
console.log(process.env.PG_PASSWORD);
const vide = String("");
async function run(){
  const pool = new Pool({
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DATABASE,
    // ssl: true,
  });
  console.log("avant");
  try {
    await pool.connect();
    console.log("apres");

    const res = await pool.query('SELECT $1::text as connected', ['Connection to postgres successful!']);
    console.log(res.rows[0].connected);
    return pool;
    // await pool.end();
  } catch (error) {
    console.log(error);
    return null;
  }
}
// (async () => {
//   const pool = new pool({
//     host: process.env.PG_HOST,
//     port: process.env.PG_PORT,
//     user: process.env.PG_USER,
//     password: process.env.PG_PASSWORD,
//     database: process.env.PG_DATABASE,
//     // ssl: true,
//   });
//   console.log("avant");
//   try {
//     await pool.connect();
//     console.log("apres");

//     const res = await pool.query('SELECT $1::text as connected', ['Connection to postgres successful!']);
//     console.log(res.rows[0].connected);
//     await pool.end();
//   } catch (error) {
//     console.log(error);
//   }
  
// })();

function hello( n) {
    hehe("Maman");
    console.log("Hello tu viens d'envoyer "+n);
}
function hehe(n){
    console.log("HEHE "+n);
}

module.exports = {hello,run};