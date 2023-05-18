const mysql = require('mysql');

const con = mysql.createConnection({
    host: "localhost",
    user: process.env.mySQLusername,
    password: process.env.mySQLpassword,

});

con.connect(function (err: Error | null) {
    if (err) throw err;
    console.log("Connected!");
})

export default {};