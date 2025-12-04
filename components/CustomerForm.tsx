'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState, useEffect } from 'react';

interface CustomerFormProps {
  initialData?: {
    id?: string;
    name: string;
    email: string;
    mobileno: string;
  };
  onSubmit: (data: { name: string; email: string; mobileno: string }) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

export default function CustomerForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading,
}: CustomerFormProps) {
  const [name, setName] = useState(initialData?.name || '');
  const [email, setEmail] = useState(initialData?.email || '');
  const [mobileno, setMobileno] = useState(initialData?.mobileno || '');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setEmail(initialData.email);
      setMobileno(initialData.mobileno);
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({ name, email, mobileno });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Customer Name *</Label>
        <Input
          id="name"
          type="text"
          placeholder="Enter customer name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isLoading}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email (Optional)</Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="mobileno">Mobile Number *</Label>
        <Input
          id="mobileno"
          type="text"
          placeholder="Enter 10-digit mobile number"
          value={mobileno}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, '');
            if (value.length <= 10) {
              setMobileno(value);
            }
          }}
          disabled={isLoading}
          maxLength={10}
          required
        />
        <p className="text-xs text-gray-500">Enter exactly 10 digits</p>
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="submit" disabled={isLoading} className="flex-1">
          {isLoading ? 'Saving...' : initialData?.id ? 'Update Customer' : 'Add Customer'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
