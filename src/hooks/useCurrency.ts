import { useState, useEffect } from 'react';
import { CurrencyRates } from '../types';

const API_KEY = 'demo'; // Use 'demo' for free tier, or get your own key from exchangerate-api.com
const BASE_URL = 'https://api.exchangerate-api.com/v4/latest';

/**
 * Custom hook for fetching and managing currency exchange rates
 */
export function useCurrency() {
  const [rates, setRates] = useState<CurrencyRates>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRates = async (baseCurrency: string = 'USD') => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${BASE_URL}/${baseCurrency}`);
      if (!response.ok) {
        throw new Error('Failed to fetch exchange rates');
      }
      
      const data = await response.json();
      setRates(data.rates);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch rates');
      console.error('Currency fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const convertAmount = (amount: number, fromCurrency: string, toCurrency: string): number => {
    if (fromCurrency === toCurrency) return amount;
    
    // Convert to USD first, then to target currency
    const usdAmount = fromCurrency === 'USD' ? amount : amount / (rates[fromCurrency] || 1);
    const convertedAmount = toCurrency === 'USD' ? usdAmount : usdAmount * (rates[toCurrency] || 1);
    
    return Math.round(convertedAmount * 100) / 100; // Round to 2 decimal places
  };

  useEffect(() => {
    fetchRates();
  }, []);

  return { rates, loading, error, fetchRates, convertAmount };
}