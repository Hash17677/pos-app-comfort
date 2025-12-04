'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState, useEffect } from 'react';
import { Customer } from '@/db/schema';
import { Plus, Trash2 } from 'lucide-react';
interface InvoiceItem {
  id: string;
  itemname: string;
  qty: number;
  amount: number;
}

interface InvoiceFormProps {
  customers: Customer[];
  onSubmit: (data: {
    customerId: string;
    invoiceAmount: number;
    discountAmount: number;
    netAmount: number;
    items: InvoiceItem[];
  }) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

export default function InvoiceForm({
  customers,
  onSubmit,
  onCancel,
  isLoading,
}: InvoiceFormProps) {
  const [customerId, setCustomerId] = useState('');
  const [discountAmount, setDiscountAmount] = useState<number | ''>('');
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: crypto.randomUUID(), itemname: '', qty: 1, amount: 0 },
  ]);

  const calculateTotals = () => {
    const invoiceAmount = items.reduce((sum, item) => sum + item.qty * item.amount, 0);
    const discount = discountAmount === '' ? 0 : discountAmount;
    const netAmount = invoiceAmount - discount;
    return { invoiceAmount, netAmount };
  };

  const addItem = () => {
    setItems([...items, { id: crypto.randomUUID(), itemname: '', qty: 1, amount: 0 }]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: string | number) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { invoiceAmount, netAmount } = calculateTotals();
    const discount = discountAmount === '' ? 0 : discountAmount;
    
    await onSubmit({
      customerId,
      invoiceAmount,
      discountAmount: discount,
      netAmount,
      items,
    });
  };

  const { invoiceAmount, netAmount } = calculateTotals();

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Customer Selection */}
      <div className="space-y-2">
        <Label htmlFor="customer">Customer *</Label>
        <select
          id="customer"
          value={customerId}
          onChange={(e) => setCustomerId(e.target.value)}
          disabled={isLoading}
          required
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="">Select a customer</option>
          {customers.map((customer) => (
            <option key={customer.id} value={customer.id}>
              {customer.name} - {customer.mobileno}
            </option>
          ))}
        </select>
      </div>

      {/* Invoice Items */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Invoice Items *</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addItem}
            disabled={isLoading}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </div>

        <div className="space-y-3">
          {items.map((item, index) => (
            <div key={item.id} className="flex gap-2 items-start p-4 border rounded-lg">
              <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-3">
                <div className="md:col-span-2 space-y-2">
                  <Label className="text-xs">Item Name *</Label>
                  <Input
                    type="text"
                    placeholder="Enter item name"
                    value={item.itemname}
                    onChange={(e) => updateItem(item.id, 'itemname', e.target.value)}
                    disabled={isLoading}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Quantity *</Label>
                  <Input
                    type="number"
                    min="1"
                    placeholder="Qty"
                    value={item.qty}
                    onChange={(e) => updateItem(item.id, 'qty', parseInt(e.target.value) || 1)}
                    disabled={isLoading}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Amount *</Label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={item.amount}
                    onChange={(e) => updateItem(item.id, 'amount', parseFloat(e.target.value) || 0)}
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>
              {items.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeItem(item.id)}
                  disabled={isLoading}
                  className="mt-6"
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="bg-gray-50 p-4 rounded-lg space-y-3">
        <div className="flex justify-between items-center">
          <Label>Invoice Amount:</Label>
          <span className="font-semibold">Rs. {invoiceAmount.toFixed(2)}</span>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="discount">Discount Amount</Label>
          <Input
            id="discount"
            type="number"
            min="0"
            step="0.01"
            placeholder="0.00"
            value={discountAmount}
            onChange={(e) => setDiscountAmount(e.target.value === '' ? '' : parseFloat(e.target.value) || 0)}
            disabled={isLoading}
          />
        </div>

        <div className="flex justify-between items-center text-lg font-bold pt-2 border-t">
          <Label>Net Amount:</Label>
          <span className="text-blue-600">Rs. {netAmount.toFixed(2)}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <Button type="submit" disabled={isLoading} className="flex-1">
          {isLoading ? 'Creating Invoice...' : 'Create Invoice'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
