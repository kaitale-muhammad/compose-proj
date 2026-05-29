import { useEffect, useState } from 'react'
import axios from 'axios'

type User = {
  id: number
  username: string
  email: string
}

function App() {

  const API = 'http://localhost:3000/users'

  const [users, setUsers] = useState<User[]>([])
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)

  // ================= FETCH =================
  const fetchUsers = async () => {
    const res = await axios.get(API)
    setUsers(res.data)
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  // ================= SUBMIT (CREATE / UPDATE) =================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (editingId) {
      // UPDATE
      await axios.put(`${API}/${editingId}`, {
        username,
        email
      })

      setEditingId(null)

    } else {
      // CREATE
      await axios.post(API, {
        username,
        email
      })
    }

    setUsername('')
    setEmail('')
    fetchUsers()
  }

  // ================= DELETE =================
  const handleDelete = async (id: number) => {
    await axios.delete(`${API}/${id}`)
    fetchUsers()
  }

  // ================= EDIT =================
  const handleEdit = (user: User) => {
    setEditingId(user.id)
    setUsername(user.username)
    setEmail(user.email)
  }

  // ================= UI =================
  return (
    <div style={styles.container}>

      <div style={styles.card}>

        <h1 style={styles.title}>User Management</h1>

        {/* FORM */}
        <form onSubmit={handleSubmit} style={styles.form}>

          <input
            style={styles.input}
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            style={styles.input}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button style={styles.button} type="submit">
            {editingId ? 'Update User' : 'Add User'}
          </button>

        </form>

      </div>

      {/* TABLE */}
      <div style={styles.tableCard}>

        <table style={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>

                  <button
                    style={styles.editBtn}
                    onClick={() => handleEdit(user)}
                  >
                    Edit
                  </button>

                  <button
                    style={styles.deleteBtn}
                    onClick={() => handleDelete(user.id)}
                  >
                    Delete
                  </button>

                </td>
              </tr>
            ))}
          </tbody>

        </table>

      </div>

    </div>
  )
}

export default App

// ================= STYLES =================
const styles: any = {
  container: {
    fontFamily: 'Arial',
    background: '#f4f6f8',
    minHeight: '100vh',
    padding: '30px'
  },

  card: {
    background: 'white',
    padding: '20px',
    borderRadius: '10px',
    maxWidth: '500px',
    margin: '0 auto',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
  },

  title: {
    textAlign: 'center'
  },

  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },

  input: {
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '5px'
  },

  button: {
    padding: '10px',
    background: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  },

  tableCard: {
    marginTop: '30px',
    background: 'white',
    padding: '20px',
    borderRadius: '10px'
  },

  table: {
    width: '100%',
    borderCollapse: 'collapse'
  },

  editBtn: {
    marginRight: '10px',
    padding: '5px 10px',
    background: 'orange',
    border: 'none',
    color: 'white',
    cursor: 'pointer',
    borderRadius: '5px'
  },

  deleteBtn: {
    padding: '5px 10px',
    background: 'red',
    border: 'none',
    color: 'white',
    cursor: 'pointer',
    borderRadius: '5px'
  }
}