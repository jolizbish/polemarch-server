import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createPool, RowDataPacket } from 'mysql2/promise';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const pool = createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  connectionLimit: 10,
});

interface Manager extends RowDataPacket {
  id: number;
  name: string;
  email: string;
}

app.get('/api/users', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM users');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
});

app.get('/api/managers', async (req, res) => {
  try {
    const [rows] = await pool.query<Manager[]>(
      'SELECT * FROM users WHERE is_manager = TRUE'
    );
    const results = rows.map(({ first_name, last_name, id }) => ({
      name: `${first_name} ${last_name}`,
      id,
    }));

    res.json(results);
  } catch (error) {
    console.error('Error fetching managers:', error);
    res.status(500).json({ message: 'Error fetching managers' });
  }
});

// API endpoint to create a new user
app.post('/api/users', async (req, res) => {
  const {
    google_user_id,
    first_name,
    last_name,
    email,
    is_admin,
    is_active,
    is_manager,
    manager_id,
  } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO users (google_user_id, first_name, last_name, email, is_admin, is_manager, manager_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [
        google_user_id,
        first_name,
        last_name,
        email,
        is_admin,
        is_active,
        is_manager,
        manager_id,
      ]
    );
    res
      .status(201)
      .json({ message: 'User created successfully', userId: google_user_id });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Error creating user' });
  }
});

// API endpoint modify user admin status
app.patch('/api/users/:userId/admin', async (req, res) => {
  const { userId } = req.params;
  const { is_admin } = req.body;
  try {
    await pool.query('UPDATE users SET is_admin = ? WHERE id = ?', [
      is_admin,
      userId,
    ]);
    res.json({ message: 'User admin status updated successfully' });
  } catch (error) {
    console.error('Error updating user admin status:', error);
    res.status(500).json({ message: 'Error updating user admin status' });
  }
});

// API endpoint modify user active status
app.patch('/api/users/:userId/active', async (req, res) => {
  const { userId } = req.params;
  const { is_active } = req.body;
  try {
    await pool.query('UPDATE users SET is_active = ? WHERE id = ?', [
      is_active,
      userId,
    ]);
    res.json({ message: 'User active status updated successfully' });
  } catch (error) {
    console.error('Error updating user active status:', error);
    res.status(500).json({ message: 'Error updating user active status' });
  }
});

// API endpoint modify user manager status
app.patch('/api/users/:userId/management', async (req, res) => {
  const { userId } = req.params;
  const { is_manager } = req.body;
  try {
    await pool.query('UPDATE users SET is_manager = ? WHERE id = ?', [
      is_manager,
      userId,
    ]);
    res.json({ message: 'User management status updated successfully' });
  } catch (error) {
    console.error('Error updating user management status:', error);
    res.status(500).json({ message: 'Error updating user management status' });
  }
});

// API endpoint modify user manager's manager assignment
app.patch('/api/users/:userId/assign-manager', async (req, res) => {
  const { userId } = req.params;
  const { manager_id } = req.body;
  try {
    await pool.query('UPDATE users SET manager_id = ? WHERE id = ?', [
      manager_id,
      userId,
    ]);
    res.json({ message: "User's manager updated successfully" });
  } catch (error) {
    console.error("Error updating user's manager:", error);
    res.status(500).json({ message: "Error updating user's manager" });
  }
});

// API endpoint to get a user by their Google User ID
app.get('/api/users/:googleUserId', async (req, res) => {
  const { googleUserId } = req.params;
  try {
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE google_user_id = ?',
      [googleUserId]
    );
    if ((rows as any[]).length > 0) {
      res.json(rows[0]);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Error fetching user' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
