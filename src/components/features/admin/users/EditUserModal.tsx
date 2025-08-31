import React, { useState, useEffect } from 'react';
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
import { Switch } from '@/components/ui/switch';
import { useUpdateUser, useUpdateUserStatus } from '@/api/appwrite/useUsers';
import type { AdminUser } from '@/api/appwrite/useUsers';
import type { UpdateUserData } from '@/services/userManagement';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface EditUserModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  user: AdminUser | null;
}

const AVAILABLE_ROLES = [
  { id: 'admin', label: 'Admin', variant: 'destructive' as const },
  { id: 'beta_tester', label: 'Beta Tester', variant: 'secondary' as const },
  { id: 'premium', label: 'Premium', variant: 'default' as const },
  { id: 'mvp', label: 'MVP', variant: 'outline' as const },
];

export const EditUserModal: React.FC<EditUserModalProps> = ({
  isOpen,
  onOpenChange,
  user,
}) => {
  const { mutate: updateUser, isPending: isUpdating } = useUpdateUser();
  const { mutate: updateStatus, isPending: isUpdatingStatus } = useUpdateUserStatus();
  
  const [formData, setFormData] = useState<UpdateUserData>({
    name: '',
    email: '',
    phone: '',
    labels: [],
    status: true,
    emailVerification: false,
    phoneVerification: false,
  });
  
  const [errors, setErrors] = useState<Partial<Record<keyof UpdateUserData, string>>>({});

  // Update form when user changes
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        labels: user.labels || [],
        status: user.status !== false,
        emailVerification: user.emailVerification || false,
        phoneVerification: user.phoneVerification || false,
      });
    }
  }, [user]);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof UpdateUserData, string>> = {};
    
    if (formData.name !== undefined && !formData.name.trim()) {
      newErrors.name = 'Name cannot be empty';
    }
    
    if (formData.email !== undefined && formData.email.trim()) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Invalid email format';
      }
    }
    
    if (formData.phone && !/^\+?[1-9]\d{1,14}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Invalid phone number format';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !validateForm()) {
      return;
    }
    
    // Only send changed fields
    const updates: UpdateUserData = {};
    
    if (formData.name !== user.name) updates.name = formData.name;
    if (formData.email !== user.email) updates.email = formData.email;
    if (formData.phone !== user.phone) updates.phone = formData.phone;
    if (JSON.stringify(formData.labels) !== JSON.stringify(user.labels)) {
      updates.labels = formData.labels;
    }
    if (formData.emailVerification !== user.emailVerification) {
      updates.emailVerification = formData.emailVerification;
    }
    if (formData.phoneVerification !== user.phoneVerification) {
      updates.phoneVerification = formData.phoneVerification;
    }
    
    // Handle status separately if changed
    if (formData.status !== user.status) {
      updateStatus({ userId: user.$id, status: formData.status || false });
    }
    
    // Only update if there are changes
    if (Object.keys(updates).length > 0) {
      updateUser(
        { userId: user.$id, updates },
        {
          onSuccess: () => {
            setErrors({});
            onOpenChange(false);
          },
        }
      );
    } else {
      onOpenChange(false);
    }
  };

  const handleRoleToggle = (role: string) => {
    setFormData(prev => ({
      ...prev,
      labels: prev.labels?.includes(role)
        ? prev.labels.filter(r => r !== role)
        : [...(prev.labels || []), role],
    }));
  };

  const handleInputChange = (field: keyof UpdateUserData, value: string | boolean | string[] | undefined) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  if (!user) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <SheetHeader>
            <SheetTitle>Edit User</SheetTitle>
            <SheetDescription>
              Update user information and manage roles.
            </SheetDescription>
          </SheetHeader>
          
          <div className="grid gap-4 py-4">
            {/* User ID (Read-only) */}
            <div className="grid gap-2">
              <Label>User ID</Label>
              <div className="flex items-center gap-2">
                <Input value={user.$id} disabled className="font-mono text-xs" />
                <Badge variant="outline">Read-only</Badge>
              </div>
            </div>
            
            <Separator />
            
            {/* Name Field */}
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="John Doe"
                disabled={isUpdating || isUpdatingStatus}
              />
              {errors.name && (
                <span className="text-sm text-destructive">{errors.name}</span>
              )}
            </div>
            
            {/* Email Field */}
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="john@example.com"
                disabled={isUpdating || isUpdatingStatus}
              />
              {errors.email && (
                <span className="text-sm text-destructive">{errors.email}</span>
              )}
            </div>
            
            {/* Phone Field */}
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="+1234567890"
                disabled={isUpdating || isUpdatingStatus}
              />
              {errors.phone && (
                <span className="text-sm text-destructive">{errors.phone}</span>
              )}
            </div>
            
            <Separator />
            
            {/* Account Status */}
            <div className="flex items-center justify-between">
              <div className="grid gap-1">
                <Label htmlFor="status">Account Status</Label>
                <span className="text-sm text-muted-foreground">
                  Enable or disable user access
                </span>
              </div>
              <Switch
                id="status"
                checked={formData.status}
                onCheckedChange={(checked) => handleInputChange('status', checked)}
                disabled={isUpdating || isUpdatingStatus}
              />
            </div>
            
            {/* Email Verification */}
            <div className="flex items-center justify-between">
              <div className="grid gap-1">
                <Label htmlFor="emailVerification">Email Verified</Label>
                <span className="text-sm text-muted-foreground">
                  Mark email as verified
                </span>
              </div>
              <Switch
                id="emailVerification"
                checked={formData.emailVerification}
                onCheckedChange={(checked) => 
                  handleInputChange('emailVerification', checked)
                }
                disabled={isUpdating || isUpdatingStatus}
              />
            </div>
            
            {/* Phone Verification */}
            <div className="flex items-center justify-between">
              <div className="grid gap-1">
                <Label htmlFor="phoneVerification">Phone Verified</Label>
                <span className="text-sm text-muted-foreground">
                  Mark phone as verified
                </span>
              </div>
              <Switch
                id="phoneVerification"
                checked={formData.phoneVerification}
                onCheckedChange={(checked) => 
                  handleInputChange('phoneVerification', checked)
                }
                disabled={isUpdating || isUpdatingStatus}
              />
            </div>
            
            <Separator />
            
            {/* Roles */}
            <div className="grid gap-2">
              <Label>Roles & Labels</Label>
              <div className="space-y-2">
                {AVAILABLE_ROLES.map((role) => (
                  <div key={role.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`edit-${role.id}`}
                        checked={formData.labels?.includes(role.id) || false}
                        onCheckedChange={() => handleRoleToggle(role.id)}
                        disabled={isUpdating || isUpdatingStatus}
                      />
                      <Label
                        htmlFor={`edit-${role.id}`}
                        className="text-sm font-normal cursor-pointer"
                      >
                        {role.label}
                      </Label>
                    </div>
                    {formData.labels?.includes(role.id) && (
                      <Badge variant={role.variant}>{role.label}</Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Account Dates (Read-only) */}
            <Separator />
            <div className="grid gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Created:</span>
                <span>{new Date(user.$createdAt).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last Updated:</span>
                <span>{new Date(user.$updatedAt).toLocaleString()}</span>
              </div>
              {user.accessedAt && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last Active:</span>
                  <span>{new Date(user.accessedAt).toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>
          
          <SheetFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isUpdating || isUpdatingStatus}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isUpdating || isUpdatingStatus}>
              {isUpdating || isUpdatingStatus ? 'Updating...' : 'Save Changes'}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
};

EditUserModal.displayName = 'EditUserModal';