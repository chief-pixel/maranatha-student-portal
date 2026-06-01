import type { NextApiRequest, NextApiResponse } from 'next';
import { query } from '@/lib/db';
import { verifyAuth } from '@/lib/middleware';
import { NextRequest } from 'next/server';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
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
      const { subjectId } = req.query;

      // Get tasks for a subject
      const result = await query(
        `SELECT t.id, t.title, t.description, t.due_date, t.file_url, t.created_at
         FROM tasks t
         WHERE t.subject_id = $1
         ORDER BY t.due_date DESC`,
        [subjectId]
      );

      res.status(200).json({ tasks: result.rows });
    } else if (req.method === 'POST' && req.body.action === 'upload' && (auth.role === 'teacher' || auth.role === 'admin')) {
      // Teacher uploads a task
      const { subjectId, title, description, dueDate, fileUrl } = req.body;

      const result = await query(
        `INSERT INTO tasks (subject_id, teacher_id, title, description, due_date, file_url, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, NOW())
         RETURNING id, title, description, due_date, file_url`,
        [subjectId, auth.userId, title, description, dueDate, fileUrl]
      );

      res.status(201).json({ task: result.rows[0] });
    } else if (req.method === 'POST' && req.body.action === 'submit') {
      // Student submits a task
      const { taskId, submissionFileUrl } = req.body;

      const result = await query(
        `INSERT INTO submissions (task_id, student_id, submission_file_url, submitted_at)
         VALUES ($1, $2, $3, NOW())
         RETURNING id, submitted_at`,
        [taskId, auth.userId, submissionFileUrl]
      );

      res.status(201).json({ submission: result.rows[0] });
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Tasks error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
