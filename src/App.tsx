import React from 'react';
import { Calculator, RotateCcw, AlertTriangle } from 'lucide-react';
import { ExpenseProvider, useExpense } from './context/ExpenseContext';
import { PersonForm } from './components/PersonForm';
import { PersonList } from './components/PersonList';
import { ExpenseForm } from './components/ExpenseForm';
import { ExpenseList } from './components/ExpenseList';
import { Summary } from './components/Summary';
import { CurrencyConverter } from './components/CurrencyConverter';

function AppContent() {
  const { resetAll, state } = useExpense();

  const handleReset = () => {
    if (window.confirm('Are you sure you want to clear all data? This cannot be undone.')) {
      resetAll();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Calculator className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Expense Splitter</h1>
                <p className="text-sm text-gray-600">Split bills fairly and easily</p>
              </div>
            </div>
            
            {(state.people.length > 0 || state.expenses.length > 0) && (
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
              >
                <RotateCcw className="h-4 w-4" />
                <span className="hidden sm:inline">Reset All</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        {(state.people.length > 0 || state.expenses.length > 0) && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
              <div className="text-2xl font-bold text-blue-600">{state.people.length}</div>
              <div className="text-sm text-gray-600">People</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
              <div className="text-2xl font-bold text-green-600">{state.expenses.length}</div>
              <div className="text-sm text-gray-600">Expenses</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
              <div className="text-2xl font-bold text-purple-600">
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: state.currency,
                }).format(state.expenses.reduce((sum, exp) => sum + exp.amount, 0))}
              </div>
              <div className="text-sm text-gray-600">Total</div>
            </div>
          </div>
        )}

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Forms */}
          <div className="space-y-6">
            <PersonForm />
            <CurrencyConverter />
            {state.people.length === 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div className="text-sm text-yellow-800">
                    <p className="font-medium mb-1">Getting Started</p>
                    <p>Add people first, then you can start adding expenses to split between them.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Middle Column - Lists */}
          <div className="space-y-6">
            <PersonList />
            <ExpenseForm />
          </div>

          {/* Right Column - Summary and History */}
          <div className="space-y-6">
            <Summary />
            <ExpenseList />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p className="text-sm">
              Built with React, TypeScript, and Tailwind CSS
            </p>
            <p className="text-xs mt-2">
              Data is stored locally in your browser and never sent to external servers
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <ExpenseProvider>
      <AppContent />
    </ExpenseProvider>
  );
}

export default App;