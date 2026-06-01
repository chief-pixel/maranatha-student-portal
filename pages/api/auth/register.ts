import type { NextApiRequest, NextApiResponse } from 'next';
import { query } from '@/lib/db';
import { hashPassword, generateToken } from '@/lib/auth';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { studentId, email, password, firstName, lastName, role = 'student' } = req.body;

    if (!studentId || !email || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check if user exists
    const existingUser = await query('SELECT id FROM users WHERE student_id = $1', [
      studentId,
    ]);

    if (existingUser.rows.length > 0) {
      return res.status(409).json({ message: 'Student ID already exists' });
    }

    const hashedPassword = await hashPassword(password);
    const result = await query(
      `INSERT INTO users (student_id, email, password_hash, first_name, last_name, role, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())
       RETURNING id, student_id, email, role`,
      [studentId, email, hashedPassword, firstName, lastName, role]
    );

    const user = result.rows[0];
    const token = generateToken(user.id, user.role);

    res.status(201).json({
      message: 'User registered successfully',
      user,
      token,
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
