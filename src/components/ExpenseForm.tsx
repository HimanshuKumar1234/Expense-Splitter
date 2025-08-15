import React, { useState } from 'react';
import { Receipt, Plus, AlertCircle } from 'lucide-react';
import { useExpense } from '../context/ExpenseContext';
import { validateExpense } from '../utils/calculations';

const categories = [
  'Food & Dining',
  'Transportation',
  'Shopping',
  'Entertainment',
  'Bills & Utilities',
  'Travel',
  'Healthcare',
  'Other'
];

export function ExpenseForm() {
  const { state, addExpense, getUpdatedPeople } = useExpense();
  const people = getUpdatedPeople();
  
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState('');
  const [category, setCategory] = useState('Other');
  const [splitType, setSplitType] = useState<'equal' | 'custom'>('equal');
  const [customSplits, setCustomSplits] = useState<{ [key: string]: string }>({});
  const [error, setError] = useState('');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: state.currency,
    }).format(amount);
  };

  // Calculate equal splits
  const calculateEqualSplits = () => {
    const numPeople = people.length;
    const totalAmount = parseFloat(amount) || 0;
    return numPeople > 0 ? totalAmount / numPeople : 0;
  };

  // Handle custom split changes
  const handleCustomSplitChange = (personId: string, value: string) => {
    setCustomSplits(prev => ({
      ...prev,
      [personId]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (people.length === 0) {
      setError('Please add at least one person first');
      return;
    }

    const expenseAmount = parseFloat(amount);
    let splits: { [key: string]: number } = {};

    if (splitType === 'equal') {
      const equalAmount = expenseAmount / people.length;
      people.forEach(person => {
        splits[person.id] = equalAmount;
      });
    } else {
      people.forEach(person => {
        const splitAmount = parseFloat(customSplits[person.id] || '0');
        splits[person.id] = splitAmount;
      });
    }

    const validationError = validateExpense(description, expenseAmount, paidBy, splits, people);
    
    if (validationError) {
      setError(validationError);
      return;
    }

    addExpense({
      description,
      amount: expenseAmount,
      paidBy,
      category,
      splitType,
      splits
    });

    // Reset form
    setDescription('');
    setAmount('');
    setPaidBy('');
    setCategory('Other');
    setSplitType('equal');
    setCustomSplits({});
    setError('');
  };

  if (people.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center gap-2 mb-4">
          <Receipt className="h-5 w-5 text-green-600" />
          <h2 className="text-lg font-semibold text-gray-900">Add Expense</h2>
        </div>
        <p className="text-gray-500 text-center py-8">Please add people first to create expenses</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center gap-2 mb-4">
        <Receipt className="h-5 w-5 text-green-600" />
        <h2 className="text-lg font-semibold text-gray-900">Add Expense</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., Dinner at restaurant"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount ({state.currency})
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Paid by
            </label>
            <select
              value={paidBy}
              onChange={(e) => setPaidBy(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
            >
              <option value="">Select person</option>
              {people.map(person => (
                <option key={person.id} value={person.id}>{person.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Split Type
          </label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="equal"
                checked={splitType === 'equal'}
                onChange={(e) => setSplitType(e.target.value as 'equal' | 'custom')}
                className="mr-2"
              />
              Equal Split
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="custom"
                checked={splitType === 'custom'}
                onChange={(e) => setSplitType(e.target.value as 'equal' | 'custom')}
                className="mr-2"
              />
              Custom Amounts
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Split Details
          </label>
          <div className="space-y-2">
            {people.map(person => (
              <div key={person.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                <span className="font-medium">{person.name}</span>
                {splitType === 'equal' ? (
                  <span className="text-gray-600">
                    {formatCurrency(calculateEqualSplits())}
                  </span>
                ) : (
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={customSplits[person.id] || ''}
                    onChange={(e) => handleCustomSplitChange(person.id, e.target.value)}
                    placeholder="0.00"
                    className="w-24 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                )}
              </div>
            ))}
            {splitType === 'custom' && (
              <div className="text-sm text-gray-600 pt-2">
                Total: {formatCurrency(Object.values(customSplits).reduce((sum, val) => sum + (parseFloat(val) || 0), 0))} / {formatCurrency(parseFloat(amount) || 0)}
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-1 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            {error}
          </div>
        )}
        
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors flex items-center justify-center gap-2 font-medium"
        >
          <Plus className="h-4 w-4" />
          Add Expense
        </button>
      </form>
    </div>
  );
}