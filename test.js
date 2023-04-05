const db = require("./database.js");
const { Pool } = require('pg');
(async () => {
    pool = await db.run();
    // let client = await pool.connect();
    // const sql = "SELECT * FROM auteur WHERE Livre_ID = $1";
    // pool.query(sql, [id], (err, result) => {
    // // if (err) ...
    // res.render("edit", { model: result.rows[0] });

    const sql = "SELECT * FROM client";
    let res = await pool.query(sql);
    for(let r of res.rows) {
        console.log(r);
    }
    await pool.end();
})();
