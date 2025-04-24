const pg = require('pg');
const express = require('express');
const app = express();
const { Client } = pg
const port = 3000;//the port you want to run the server on, will be referenced in url



 const client = new Client({
    user: 'postgres',//the username you use to login to postico
    password: 'shitbrick',//the password you use to login to postico
    host: 'localhost',
    port: 5432,//default port for postgres
    database: 'postgres'//the name of the database you want to connect to from postico
})

app.get('/api/employee', async (req, res) => {
    try {
      const result = await client.query('SELECT * FROM employee');
      res.json(result.rows); // Send the rows as a JSON response
      console.log(result.rows); // Log the rows to the console
    } catch (error) {
      console.error(error); // Log the error
      res.status(500).send('Error querying the database'); // Send a 500 error response
    }
  });


app.get('/api/departments', async (req, res) => {
    const result = await client.query('SELECT * FROM departments');
    res.json(result.rows);
    console.log(result.rows);
})





app.listen(port, async () => {
    await client.connect()//connect to the database
    console.log(`Example app listening on port ${port}`)
})