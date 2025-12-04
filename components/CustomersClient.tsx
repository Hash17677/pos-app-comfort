'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import CustomerForm from '@/components/CustomerForm';
import { addCustomer, updateCustomer, getCustomers } from '@/app/actions/customers';
import { Customer } from '@/db/schema';
import { toast } from 'sonner';
import { Pencil, Plus, User } from 'lucide-react';

export default function CustomersClient({ initialCustomers }: { initialCustomers: Customer[] }) {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const refreshCustomers = async () => {
    const result = await getCustomers();
    if (result.success && result.data) {
      setCustomers(result.data);
    }
  };

  const handleAddCustomer = async (data: { name: string; email: string; mobileno: string }) => {
    setIsLoading(true);
    const result = await addCustomer(data);
    setIsLoading(false);

    if (result.success) {
      toast.success(result.message || 'Customer added successfully');
      setShowForm(false);
      await refreshCustomers();
    } else {
      toast.error(result.message || 'Failed to add customer');
    }
  };

  const handleUpdateCustomer = async (data: { name: string; email: string; mobileno: string }) => {
    if (!editingCustomer) return;

    setIsLoading(true);
    const result = await updateCustomer(editingCustomer.id, data);
    setIsLoading(false);

    if (result.success) {
      toast.success(result.message || 'Customer updated successfully');
      setEditingCustomer(null);
      setShowForm(false);
      await refreshCustomers();
    } else {
      toast.error(result.message || 'Failed to update customer');
    }
  };

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingCustomer(null);
  };

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Customers</h2>
          <p className="text-sm text-gray-600 mt-1">
            Manage your customer information
          </p>
        </div>
        {!showForm && (
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Customer
          </Button>
        )}
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {editingCustomer ? 'Edit Customer' : 'Add New Customer'}
          </h3>
          <CustomerForm
            initialData={editingCustomer ? {
              id: editingCustomer.id,
              name: editingCustomer.name,
              email: editingCustomer.email || '',
              mobileno: editingCustomer.mobileno
            } : undefined}
            onSubmit={editingCustomer ? handleUpdateCustomer : handleAddCustomer}
            onCancel={handleCancel}
            isLoading={isLoading}
          />
        </div>
      )}

      {/* Customers List */}
      <div className="bg-white rounded-lg border border-gray-200">
        {customers.length === 0 ? (
          <div className="p-12 text-center">
            <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No customers yet</h3>
            <p className="text-gray-600 mb-4">Get started by adding your first customer</p>
            {!showForm && (
              <Button onClick={() => setShowForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Customer
              </Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mobile
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {customers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{customer.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-600">{customer.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-600">{customer.mobileno}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(customer.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(customer)}
                        disabled={showForm}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
