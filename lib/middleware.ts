import { verifyToken } from './auth';
import { NextRequest } from 'next/server';

export function getTokenFromRequest(req: NextRequest): string | null {
  const authHeader = req.headers.get('authorization');
  if (!authHeader) return null;
  
  const parts = authHeader.split(' ');
  return parts.length === 2 ? parts[1] : null;
}

export function verifyAuth(req: NextRequest) {
  const token = getTokenFromRequest(req);
  if (!token) return null;
  
  return verifyToken(token);
}
