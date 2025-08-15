import React, { useEffect } from 'react';
import { Globe, RefreshCw } from 'lucide-react';
import { useExpense } from '../context/ExpenseContext';
import { useCurrency } from '../hooks/useCurrency';

const currencies = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'Fr' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
];

export function CurrencyConverter() {
  const { state, updateCurrency, updateExchangeRates } = useExpense();
  const { rates, loading, error, fetchRates } = useCurrency();

  useEffect(() => {
    if (rates && Object.keys(rates).length > 0) {
      updateExchangeRates(rates);
    }
  }, [rates, updateExchangeRates]);

  const handleCurrencyChange = (newCurrency: string) => {
    updateCurrency(newCurrency);
    fetchRates(newCurrency); // Fetch rates with new base currency
  };

  const handleRefresh = () => {
    fetchRates(state.currency);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-indigo-600" />
          <h2 className="text-lg font-semibold text-gray-900">Currency</h2>
        </div>
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors disabled:opacity-50"
          title="Refresh exchange rates"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Display Currency
          </label>
          <select
            value={state.currency}
            onChange={(e) => handleCurrencyChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
          >
            {currencies.map(currency => (
              <option key={currency.code} value={currency.code}>
                {currency.symbol} {currency.name} ({currency.code})
              </option>
            ))}
          </select>
        </div>

        {error && (
          <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
            {error}
          </div>
        )}

        {loading && (
          <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
            Updating exchange rates...
          </div>
        )}

        {rates && Object.keys(rates).length > 0 && (
          <div className="text-xs text-gray-500">
            Exchange rates updated • Base: {state.currency}
          </div>
        )}
      </div>
    </div>
  );
}