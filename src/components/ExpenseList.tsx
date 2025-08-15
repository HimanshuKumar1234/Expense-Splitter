import React from 'react';
import { Receipt, Trash2, Calendar } from 'lucide-react';
import { useExpense } from '../context/ExpenseContext';

export function ExpenseList() {
  const { state, removeExpense, getUpdatedPeople } = useExpense();
  const people = getUpdatedPeople();
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: state.currency,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPersonName = (personId: string) => {
    const person = people.find(p => p.id === personId);
    return person ? person.name : 'Unknown';
  };

  if (state.expenses.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center gap-2 mb-4">
          <Receipt className="h-5 w-5 text-green-600" />
          <h2 className="text-lg font-semibold text-gray-900">Recent Expenses</h2>
        </div>
        <p className="text-gray-500 text-center py-8">No expenses added yet</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Receipt className="h-5 w-5 text-green-600" />
          <h2 className="text-lg font-semibold text-gray-900">
            Recent Expenses ({state.expenses.length})
          </h2>
        </div>
        <div className="text-sm text-gray-600">
          Total: {formatCurrency(state.expenses.reduce((sum, exp) => sum + exp.amount, 0))}
        </div>
      </div>
      
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {state.expenses
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .map((expense) => (
            <div
              key={expense.id}
              className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{expense.description}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                      {expense.category}
                    </span>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(expense.date)}
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-lg font-semibold text-gray-900">
                    {formatCurrency(expense.amount)}
                  </div>
                  <div className="text-sm text-gray-600">
                    Paid by {getPersonName(expense.paidBy)}
                  </div>
                </div>
              </div>
              
              <div className="border-t pt-3 mt-3">
                <div className="text-sm text-gray-600 mb-2">
                  Split ({expense.splitType === 'equal' ? 'Equal' : 'Custom'}):
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {Object.entries(expense.splits).map(([personId, amount]) => (
                    <div key={personId} className="flex justify-between items-center text-sm">
                      <span>{getPersonName(personId)}</span>
                      <span className="font-medium">{formatCurrency(amount)}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <button
                onClick={() => removeExpense(expense.id)}
                className="mt-3 flex items-center gap-1 text-red-600 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded text-sm transition-colors"
              >
                <Trash2 className="h-3 w-3" />
                Remove
              </button>
            </div>
          ))}
      </div>
    </div>
  );
}