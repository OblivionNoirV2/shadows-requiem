
import express, { Express, Request, Response } from 'express';
import mysql from 'mysql2';
import * as dotenv from 'dotenv';
dotenv.config();
const app: Express = express();
const port = 5000;

app.get('/', (req: Request, res: Response) => {
    res.send('Express + TypeScript Server');
});

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

console.log(process.env)
console.log(process.env.user);
console.log(process.env.password);
const con = mysql.createConnection({
    host: 'localhost',
    user: process.env.user,
    password: process.env.password,

});

con.connect(function (err: Error | null) {
    if (err) throw err;
    console.log("Connected!");
})

