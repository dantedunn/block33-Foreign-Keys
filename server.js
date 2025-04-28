const pg = require('pg')
const express = require('express')
const app = express()
const { Client } = pg
const port = 3000 //the port you want to run the server on, will be referenced in url
app.use(express.json()) //middleware to parse json data

const client = new Client({
  user: 'postgres', //the username you use to login to postico
  password: 'shitbrick', //the password you use to login to postico
  host: 'localhost',
  port: 5432, //default port for postgres
  database: 'postgres' //the name of the database you want to connect to from postico
})

app.get('/api/employee', async (req, res) => {
  try {
    const result = await client.query('SELECT * FROM employee')
    res.json(result.rows) // Send the rows as a JSON response
    console.log(result.rows) // Log the rows to the console
  } catch (error) {
    console.error(error) // Log the error
    res.status(500).send('Error querying the database') // Send a 500 error response
  }
})

app.get('/api/departments', async (req, res) => {
  const result = await client.query('SELECT * FROM departments')
  res.json(result.rows)
  console.log(result.rows)
})

app.post('/api/employee', async (req, res) => {
  const { name, created_at, updated_at, department_id } = req.body
  const result = await client.query(
    'INSERT INTO employee ( name, created_at, updated_at,department_id) VALUES ($1, $2, $3, $4)',
    [name, created_at, updated_at, department_id]
  )
  res.json(result.rows)
  console.log(result.rows)
})

app.delete('/api/employee/:id', async (req, res) => {
  const { id } = req.params
  await client.query('DELETE FROM employee WHERE id = $1', [id])
  res.json('success')
})

app.put('/api/employee/:id', async (req, res) => {
  const { name, created_at, updated_at, department_id } = req.body
  const { id } = req.params

  try {
    const result = await client.query(
      `UPDATE employee 
         SET name = $1, created_at = $2, updated_at = $3, department_id = $4 
         WHERE id = $5 
         RETURNING *`,
      [name, created_at, updated_at, department_id, id]
    )

    if (result.rowCount === 0) {
      return res.status(404).send('Employee not found')
    }

    res.json(result.rows[0])
    console.log(result.rows[0])
  } catch (error) {
    console.error(error)
    res.status(500).send('Error updating employee')
  }
})

app.listen(port, async () => {
  await client.connect() //connect to the database
  console.log(`Example app listening on port ${port}`)
})
