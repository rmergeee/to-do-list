const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./db');
const { authenticateToken, JWT_SECRET } = require('./auth');

const app = express();
app.use(cors());
app.use(express.json());

const calculateQuadrantAndXP = (is_important, is_urgent) => {
  if (is_important && is_urgent) return { quadrant: 1, xp_reward: 30 };
  if (is_important && !is_urgent) return { quadrant: 2, xp_reward: 20 };
  if (!is_important && is_urgent) return { quadrant: 3, xp_reward: 10 };
  return { quadrant: 4, xp_reward: 5 };
};

// --- AUTHENTICATION ROUTES ---

app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const existing = await db.query('SELECT * FROM users WHERE username = $1', [username]);
    if (existing.rows.length > 0) return res.status(400).json({ error: 'Користувач вже існує' });

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const result = await db.query(
      'INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING id, username, total_xp, level',
      [username, hash]
    );
    res.status(201).json({ success: true, user: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const result = await db.query('SELECT * FROM users WHERE username = $1', [username]);
    if (result.rows.length === 0) return res.status(401).json({ error: 'Користувача не знайдено' });

    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) return res.status(401).json({ error: 'Неправильний пароль' });

    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ success: true, token, user: { id: user.id, username: user.username, total_xp: user.total_xp, level: user.level } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- PROTECTED ROUTES ---

app.post('/api/tasks', authenticateToken, async (req, res) => {
  try {
    const { title, is_important, is_urgent } = req.body;
    const { quadrant, xp_reward } = calculateQuadrantAndXP(is_important, is_urgent);
    const result = await db.query(
      `INSERT INTO tasks (user_id, title, is_important, is_urgent, quadrant, status, xp_reward) 
       VALUES ($1, $2, $3, $4, $5, 'active', $6) RETURNING *`,
      [req.user.id, title, is_important, is_urgent, quadrant, xp_reward]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.patch('/api/tasks/:id/complete', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Mark task as completed
    const taskResult = await db.query(
      `UPDATE tasks SET status = 'completed' WHERE id = $1 AND user_id = $2 AND status = 'active' RETURNING xp_reward`,
      [id, req.user.id]
    );

    if (taskResult.rowCount === 0) {
      return res.status(404).json({ error: 'Task not found or already completed.' });
    }
    const { xp_reward } = taskResult.rows[0];

    // 2. Update user profile
    const userResult = await db.query(
      `UPDATE users 
       SET total_xp = total_xp + $1, level = FLOOR((total_xp + $1) / 100) + 1 
       WHERE id = $2 RETURNING id, username, total_xp, level`,
      [xp_reward, req.user.id]
    );

    res.json({ success: true, xp_reward, user: userResult.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/tasks/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING *', [id, req.user.id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json({ success: true, task: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/dashboard', authenticateToken, async (req, res) => {
  try {
    const userResult = await db.query('SELECT id, username, total_xp, level FROM users WHERE id = $1', [req.user.id]);
    const tasksResult = await db.query('SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at DESC', [req.user.id]);
    res.json({
      user: userResult.rows[0],
      tasks: tasksResult.rows
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = app;

if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}
