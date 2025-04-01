// src/routes/gameRoutes.tsx
import { lazy } from 'react';
import type { RouteObject } from 'react-router';

const MinecraftTetris = lazy(
  () => import('@/components/features/games/tetris/MinecraftTetrisGame.tsx')
);
export const gameRoutes: RouteObject[] = [
  {
    path: 'games',
    children: [
      {
        path: 'tetris',
        element: <MinecraftTetris />,
      },
    ],
  },
];
