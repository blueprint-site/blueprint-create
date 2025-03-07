import { useContext } from 'react';
import { LoggedUserContext } from './loggedUserContext';
import { LoggedUserContextType } from '@/types';

/**
 * @description A custom hook that provides access to the LoggedUserContext.
 *              It throws an error if used outside of a LoggedUserProvider.
 *
 * @returns {LoggedUserContextType} The context value containing user data and authentication functions.
 */
export const useLoggedUser = (): LoggedUserContextType => {
  const context = useContext(LoggedUserContext);
  if (!context) {
    throw new Error('useLoggedUser must be used within a LoggedUserProvider');
  }
  return context;
};
