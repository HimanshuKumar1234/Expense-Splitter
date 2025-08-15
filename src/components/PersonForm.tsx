import React, { useState } from 'react';
import { User, Plus, AlertCircle } from 'lucide-react';
import { useExpense } from '../context/ExpenseContext';

export function PersonForm() {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const { addPerson, state } = useExpense();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('Name is required');
      return;
    }

    if (state.people.some(person => person.name.toLowerCase() === name.trim().toLowerCase())) {
      setError('Person already exists');
      return;
    }

    addPerson(name.trim());
    setName('');
    setError('');
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center gap-2 mb-4">
        <User className="h-5 w-5 text-blue-600" />
        <h2 className="text-lg font-semibold text-gray-900">Add Person</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter person's name"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          />
          {error && (
            <div className="mt-2 flex items-center gap-1 text-red-600 text-sm">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}
        </div>
        
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Person
        </button>
      </form>
    </div>
  );
}