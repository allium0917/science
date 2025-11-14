import express from 'express';
import pool from './config/db.js';

const app = express();
app.use(express.json());

app.get('/test', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ time: result.rows[0].now });
  } catch (err) {
    res.status(500).send('DB Error');
  }
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});