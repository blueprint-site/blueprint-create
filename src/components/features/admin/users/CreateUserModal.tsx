import React, { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useCreateUser } from '@/api/appwrite/useUsers';
import type { CreateUserData } from '@/services/userManagement';
import { Eye, EyeOff } from 'lucide-react';

interface CreateUserModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const AVAILABLE_ROLES = [
  { id: 'admin', label: 'Admin' },
  { id: 'beta_tester', label: 'Beta Tester' },
  { id: 'premium', label: 'Premium' },
  { id: 'mvp', label: 'MVP' },
];

export const CreateUserModal: React.FC<CreateUserModalProps> = ({ isOpen, onOpenChange }) => {
  const { mutate: createUser, isPending } = useCreateUser();
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState<CreateUserData>({
    email: '',
    password: '',
    name: '',
    phone: '',
    labels: [],
    emailVerification: false,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof CreateUserData, string>>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof CreateUserData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (formData.phone && !/^\+?[1-9]\d{1,14}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Invalid phone number format (use international format, e.g., +1234567890)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    createUser(formData, {
      onSuccess: () => {
        // Reset form
        setFormData({
          email: '',
          password: '',
          name: '',
          phone: '',
          labels: [],
          emailVerification: false,
        });
        setErrors({});
        onOpenChange(false);
      },
    });
  };

  const handleRoleToggle = (role: string) => {
    setFormData((prev) => ({
      ...prev,
      labels: prev.labels?.includes(role)
        ? prev.labels.filter((r) => r !== role)
        : [...(prev.labels || []), role],
    }));
  };

  const handleInputChange = (
    field: keyof CreateUserData,
    value: string | boolean | string[] | undefined
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className='w-full overflow-y-auto sm:max-w-lg'>
        <form onSubmit={handleSubmit}>
          <SheetHeader>
            <SheetTitle>Create New User</SheetTitle>
            <SheetDescription>
              Create a new user account with specified roles and permissions.
            </SheetDescription>
          </SheetHeader>

          <div className='grid gap-4 py-4'>
            {/* Name Field */}
            <div className='grid gap-2'>
              <Label htmlFor='name'>Name *</Label>
              <Input
                id='name'
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder='John Doe'
                disabled={isPending}
              />
              {errors.name && <span className='text-destructive text-sm'>{errors.name}</span>}
            </div>

            {/* Email Field */}
            <div className='grid gap-2'>
              <Label htmlFor='email'>Email *</Label>
              <Input
                id='email'
                type='email'
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder='john@example.com'
                disabled={isPending}
              />
              {errors.email && <span className='text-destructive text-sm'>{errors.email}</span>}
            </div>

            {/* Password Field */}
            <div className='grid gap-2'>
              <Label htmlFor='password'>Password *</Label>
              <div className='relative'>
                <Input
                  id='password'
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder='Minimum 8 characters'
                  disabled={isPending}
                  className='pr-10'
                />
                <Button
                  type='button'
                  variant='ghost'
                  size='sm'
                  className='absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent'
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className='h-4 w-4' /> : <Eye className='h-4 w-4' />}
                </Button>
              </div>
              {errors.password && (
                <span className='text-destructive text-sm'>{errors.password}</span>
              )}
            </div>

            {/* Phone Field (Optional) */}
            <div className='grid gap-2'>
              <Label htmlFor='phone'>Phone (Optional)</Label>
              <Input
                id='phone'
                type='tel'
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder='+1234567890'
                disabled={isPending}
              />
              {errors.phone && <span className='text-destructive text-sm'>{errors.phone}</span>}
            </div>

            {/* Roles */}
            <div className='grid gap-2'>
              <Label>Roles</Label>
              <div className='space-y-2'>
                {AVAILABLE_ROLES.map((role) => (
                  <div key={role.id} className='flex items-center space-x-2'>
                    <Checkbox
                      id={role.id}
                      checked={formData.labels?.includes(role.id) || false}
                      onCheckedChange={() => handleRoleToggle(role.id)}
                      disabled={isPending}
                    />
                    <Label htmlFor={role.id} className='cursor-pointer text-sm font-normal'>
                      {role.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Email Verification */}
            <div className='flex items-center space-x-2'>
              <Checkbox
                id='emailVerification'
                checked={formData.emailVerification || false}
                onCheckedChange={(checked) => handleInputChange('emailVerification', checked)}
                disabled={isPending}
              />
              <Label htmlFor='emailVerification' className='cursor-pointer text-sm font-normal'>
                Email verified
              </Label>
            </div>
          </div>

          <SheetFooter className='mt-6'>
            <Button
              type='button'
              variant='outline'
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type='submit' disabled={isPending}>
              {isPending ? 'Creating...' : 'Create User'}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
};

CreateUserModal.displayName = 'CreateUserModal';
