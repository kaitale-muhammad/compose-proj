const express = require('express')
const mysql = require('mysql2')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(express.json())

const db = mysql.createConnection({
    host: 'mysql',
    user: 'root',
    password: 'root123',
    database: 'crud_db'
})

function connectDB() {

    db.connect((err) => {

        if (err) {

            console.log('MySQL not ready, retrying...')
            setTimeout(connectDB, 5000)

        } else {

            console.log('MySQL Connected')

        }

    })

}

connectDB()

//add user
app.post('/users', (req, res) => {

    const { username, email } = req.body

    const sql = 'INSERT INTO users (username, email) VALUES (?, ?)'

    db.query(sql, [username, email], (err, result) => {

        if (err) {

            console.log(err)
            res.status(500).send('Database Error')

        } else {

            res.send('User Added')

        }

    })

})


//fetch users
app.get('/users', (req, res) => {
  db.query('SELECT * FROM users', (err, result) => {
    if (err) {
      res.status(500).json(err)
    } else {
      res.json(result)
    }
  })
})


// delete user
app.delete('/users/:id', (req, res) => {
  const id = req.params.id
  db.query('DELETE FROM users WHERE id=?', [id], (err) => {
    if (err) return res.status(500).send(err)
    res.send('Deleted')
  })
})



// edit

app.put('/users/:id', (req, res) => {
  const id = req.params.id
  const { username, email } = req.body

  db.query(
    'UPDATE users SET username=?, email=? WHERE id=?',
    [username, email, id],
    (err) => {
      if (err) return res.status(500).send(err)
      res.send('Updated')
    }
  )
})

app.listen(3000, () => {
    console.log('Server running on port 3000')
})