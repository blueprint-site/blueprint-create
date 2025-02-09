// addonsContext.ts
import { createContext } from 'react';
import { Addon } from '@/types';

type AddonsContextType = {
  addons: Addon[];
  loadMore: () => void;
  loading: boolean;
  hasMoreData: boolean;
  totalAddons: number;
  totalValidAddons: number;
};

const AddonsContext = createContext<AddonsContextType | undefined>(undefined);

export default AddonsContext;