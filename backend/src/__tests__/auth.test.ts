import { hashPassword, comparePassword, signToken, verifyToken } from '../auth';

describe('Auth utilities', () => {
  describe('hashPassword / comparePassword', () => {
    it('hashes a password and verifies it correctly', async () => {
      const password = 'mypassword123';
      const hash = await hashPassword(password);

      expect(hash).not.toBe(password);
      const match = await comparePassword(password, hash);
      expect(match).toBe(true);
    });

    it('returns false for wrong password', async () => {
      const hash = await hashPassword('correctpassword');
      const match = await comparePassword('wrongpassword', hash);
      expect(match).toBe(false);
    });
  });

  describe('signToken / verifyToken', () => {
    it('signs a token and verifies it correctly', () => {
      const token = signToken(1, 'EMPLOYER');
      const decoded = verifyToken(token);

      expect(decoded.userId).toBe(1);
      expect(decoded.role).toBe('EMPLOYER');
    });

    it('throws an error for invalid token', () => {
      expect(() => verifyToken('invalidtoken')).toThrow();
    });
  });
});
