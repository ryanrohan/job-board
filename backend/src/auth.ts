import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey123';

export const hashPassword = (password: string) => {
  return bcrypt.hash(password, 10);
};

export const comparePassword = (password: string, hash: string) => {
  return bcrypt.compare(password, hash);
};

export const signToken = (userId: number, role: string) => {
  return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: '7d' });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET) as { userId: number; role: string };
};