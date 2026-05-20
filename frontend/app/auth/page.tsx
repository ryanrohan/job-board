'use client';

import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { gql } from '@apollo/client/core';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';

const REGISTER = gql`
  mutation Register($email: String!, $password: String!, $role: String) {
    register(email: $email, password: $password, role: $role) {
      token
      user { id email role }
    }
  }
`;

const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user { id email role }
    }
  }
`;

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('APPLICANT');
  const [error, setError] = useState('');

  const { login } = useAuthStore();
  const router = useRouter();

  const [registerMutation] = useMutation(REGISTER);
  const [loginMutation] = useMutation(LOGIN);

  const handleSubmit = async () => {
    setError('');
    try {
      if (isLogin) {
        const { data } = await loginMutation({ variables: { email, password } });
        login((data as any).login.user, (data as any).login.token);
      } else {
        const { data } = await registerMutation({ variables: { email, password, role } });
        login((data as any).register.user, (data as any).register.token);
      }
      router.push('/');
    } catch (e: any) {
      setError(e.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6">
          {isLogin ? 'Log in' : 'Create account'}
        </h1>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <input
          className="w-full border rounded p-2 mb-3"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          className="w-full border rounded p-2 mb-3"
          placeholder="Password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        {!isLogin && (
          <select
            className="w-full border rounded p-2 mb-3"
            value={role}
            onChange={e => setRole(e.target.value)}
          >
            <option value="APPLICANT">Applicant</option>
            <option value="EMPLOYER">Employer</option>
          </select>
        )}

        <button
          className="w-full bg-blue-600 text-white py-2 rounded font-medium hover:bg-blue-700"
          onClick={handleSubmit}
        >
          {isLogin ? 'Log in' : 'Register'}
        </button>

        <p className="text-sm text-center mt-4 text-gray-500">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
          <span
            className="text-blue-600 cursor-pointer"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'Register' : 'Log in'}
          </span>
        </p>
      </div>
    </div>
  );
}