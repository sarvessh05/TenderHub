import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

// Connect to Supabase DB (PostgreSQL)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const signupUser = async (req: Request, res: Response) => {
  try {
    console.log('🪵 Raw Body:', req.body); // 👈 ADD THIS
    console.log('🧪 Headers:', req.headers); // 👈 ADD THIS
    
    const { name, email, password } = req.body;

    // 🔒 Check if email or password is missing
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    // 🔐 Hash the password with bcrypt
    const hashedPassword = await bcrypt.hash(password, 10); // 10 = salt rounds

    // 📦 Save to PostgreSQL
    const result = await pool.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, email',
      [name || null, email, hashedPassword]
    );

    const user = result.rows[0];

    // 🪙 Generate JWT token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string, {
      expiresIn: '7d',
    });

    return res.status(201).json({
      message: 'User created successfully',
      user: { id: user.id, name: user.name, email: user.email },
      token,
    });
  } catch (error: any) {
    console.error('Signup error:', error);

    if (error.code === '23505') {
      // Unique violation (email already exists)
      return res.status(409).json({ message: 'Email already registered.' });
    }

    return res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const userResult = await pool.query(
      'SELECT id, email, password FROM users WHERE email = $1',
      [email]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = userResult.rows[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET as string, {
      expiresIn: '24h',
    });

    res.status(200).json({
      message: 'Login successful',
      user: { id: user.id, email: user.email },
      token,
    });
  } catch (err) {
    console.error('❌ Login error:', err);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};