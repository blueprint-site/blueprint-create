// src/routes/authRoutes.tsx
import { RouteObject } from 'react-router-dom';

import AuthPage from '@/pages/auth/Auth';
import AuthSuccess from '@/pages/auth/AuthSuccess';
import AuthError from '@/pages/auth/AuthError';

export const authRoutes: RouteObject[] = [
  { path: 'login', element: <AuthPage /> },
  { path: 'auth/success', element: <AuthSuccess /> },
  { path: 'auth/error', element: <AuthError message={'Error'} redirectTo={'/login'} /> },
];
