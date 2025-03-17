import { OAuthProvidersType } from '@/types';

export const OAuthProviders: OAuthProvidersType[] = [
  {
    id: 'email',
    name: 'Email',
    icon: 'Gmail',
    color: 'cacaca',
  },
  {
    id: 'google',
    name: 'Google',
    icon: 'Google',
    color: '#4285F4', // Google RED
  },
  {
    id: 'discord',
    name: 'Discord',
    icon: 'Discord',
    color: '#5865F2', // Discord Blurple
  },
  {
    id: 'github',
    name: 'Github',
    icon: 'Github',
    color: '#181717', // Github Dark Gray (near black)
  },
];
