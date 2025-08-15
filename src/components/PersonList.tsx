import React from 'react';
import { Users, Trash2, Circle } from 'lucide-react';
import { useExpense } from '../context/ExpenseContext';

export function PersonList() {
  const { removePerson, getUpdatedPeople, state } = useExpense();
  const people = getUpdatedPeople();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: state.currency,
    }).format(amount);
  };

  if (people.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center gap-2 mb-4">
          <Users className="h-5 w-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">People</h2>
        </div>
        <p className="text-gray-500 text-center py-8">No people added yet</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center gap-2 mb-4">
        <Users className="h-5 w-5 text-blue-600" />
        <h2 className="text-lg font-semibold text-gray-900">People ({people.length})</h2>
      </div>
      
      <div className="space-y-3">
        {people.map((person) => {
          const balance = person.totalPaid - person.totalOwes;
          const isCreditor = balance > 0.01;
          const isDebtor = balance < -0.01;
          
          return (
            <div
              key={person.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{person.name}</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <div className="flex items-center gap-1">
                    <Circle className="h-1.5 w-1.5 text-gray-800 dark:text-gray-200" fill="currentColor" />
                    Paid: {formatCurrency(person.totalPaid)}
                  </div>
                  <div className="flex items-center gap-1">
                    <Circle className="h-1.5 w-1.5 text-gray-800 dark:text-gray-200" fill="currentColor" />
                    Owes: {formatCurrency(person.totalOwes)}
                  </div>
                  <div className={`font-medium ${
                    isCreditor ? 'text-green-600' : isDebtor ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    Balance: {formatCurrency(Math.abs(balance))} {
                      isCreditor ? '(gets back)' : isDebtor ? '(owes)' : '(even)'
                    }
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => removePerson(person.id)}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                title="Remove person"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}