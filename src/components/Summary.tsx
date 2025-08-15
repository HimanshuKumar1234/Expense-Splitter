import React from 'react';
import { Calculator, ArrowRight, CheckCircle } from 'lucide-react';
import { useExpense } from '../context/ExpenseContext';
import { calculateSettlements } from '../utils/calculations';

export function Summary() {
  const { state, getUpdatedPeople } = useExpense();
  const people = getUpdatedPeople();
  const settlements = calculateSettlements(people);
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: state.currency,
    }).format(amount);
  };

  const totalExpenses = state.expenses.reduce((sum, expense) => sum + expense.amount, 0);

  if (people.length === 0 || state.expenses.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center gap-2 mb-4">
          <Calculator className="h-5 w-5 text-purple-600" />
          <h2 className="text-lg font-semibold text-gray-900">Summary</h2>
        </div>
        <p className="text-gray-500 text-center py-8">
          Add people and expenses to see the summary
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center gap-2 mb-6">
        <Calculator className="h-5 w-5 text-purple-600" />
        <h2 className="text-lg font-semibold text-gray-900">Summary</h2>
      </div>

      {/* Total Overview */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-purple-600">
              {formatCurrency(totalExpenses)}
            </div>
            <div className="text-sm text-gray-600">Total Expenses</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">
              {people.length}
            </div>
            <div className="text-sm text-gray-600">People</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">
              {state.expenses.length}
            </div>
            <div className="text-sm text-gray-600">Expenses</div>
          </div>
        </div>
      </div>

      {/* Individual Balances */}
      <div className="mb-6">
        <h3 className="text-md font-semibold text-gray-900 mb-3">Individual Balances</h3>
        <div className="space-y-2">
          {people.map(person => {
            const balance = person.totalPaid - person.totalOwes;
            const isCreditor = balance > 0.01;
            const isDebtor = balance < -0.01;
            const isEven = Math.abs(balance) <= 0.01;
            
            return (
              <div key={person.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">{person.name}</span>
                <div className="text-right">
                  <div className={`font-semibold ${
                    isCreditor ? 'text-green-600' : isDebtor ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {isEven ? 'Even' : formatCurrency(Math.abs(balance))}
                  </div>
                  <div className="text-xs text-gray-500">
                    {isCreditor ? 'gets back' : isDebtor ? 'owes' : 'settled'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Settlement Suggestions */}
      <div>
        <h3 className="text-md font-semibold text-gray-900 mb-3">
          Settlement Suggestions
        </h3>
        {settlements.length === 0 ? (
          <div className="flex items-center gap-2 text-green-600 bg-green-50 p-4 rounded-lg">
            <CheckCircle className="h-5 w-5" />
            <span className="font-medium">All settled! Everyone is even.</span>
          </div>
        ) : (
          <div className="space-y-3">
            {settlements.map((settlement, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">{settlement.from}</span>
                    <ArrowRight className="h-4 w-4 text-gray-400" />
                    <span className="font-medium text-gray-900">{settlement.to}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {settlement.from} owes {settlement.to}
                  </div>
                </div>
                <div className="text-lg font-semibold text-orange-600">
                  {formatCurrency(settlement.amount)}
                </div>
              </div>
            ))}
            <div className="text-xs text-gray-500 mt-2">
              💡 These settlements minimize the number of transactions needed
            </div>
          </div>
        )}
      </div>
    </div>
  );
}