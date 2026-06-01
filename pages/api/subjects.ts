import type { NextApiRequest, NextApiResponse } from 'next';
import { query } from '@/lib/db';
import { verifyAuth } from '@/lib/middleware';
import { NextRequest } from 'next/server';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Create a NextRequest from NextApiRequest for middleware
  const nextReq = new NextRequest(new URL(`http://localhost${req.url}`), {
    method: req.method,
    headers: req.headers as any,
  });

  const auth = verifyAuth(nextReq);
  if (!auth) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    if (req.method === 'GET') {
      // Get subjects for the logged-in student
      const result = await query(
        `SELECT s.id, s.subject_name, s.subject_code, t.first_name, t.last_name
         FROM subjects s
         JOIN student_subjects ss ON s.id = ss.subject_id
         LEFT JOIN users t ON s.teacher_id = t.id
         WHERE ss.student_id = $1
         ORDER BY s.subject_name`,
        [auth.userId]
      );

      res.status(200).json({ subjects: result.rows });
    } else if (req.method === 'POST' && auth.role === 'teacher') {
      // Teacher creates a new subject
      const { subjectName, subjectCode } = req.body;

      const result = await query(
        `INSERT INTO subjects (subject_name, subject_code, teacher_id, created_at)
         VALUES ($1, $2, $3, NOW())
         RETURNING id, subject_name, subject_code`,
        [subjectName, subjectCode, auth.userId]
      );

      res.status(201).json({ subject: result.rows[0] });
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Subjects error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
