import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Person, Expense, ExpenseState } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { calculatePersonTotals } from '../utils/calculations';

interface ExpenseContextType {
  state: ExpenseState;
  addPerson: (name: string) => void;
  removePerson: (id: string) => void;
  addExpense: (expense: Omit<Expense, 'id' | 'date'>) => void;
  removeExpense: (id: string) => void;
  updateCurrency: (currency: string) => void;
  updateExchangeRates: (rates: { [key: string]: number }) => void;
  resetAll: () => void;
  getUpdatedPeople: () => Person[];
}

type Action =
  | { type: 'ADD_PERSON'; payload: string }
  | { type: 'REMOVE_PERSON'; payload: string }
  | { type: 'ADD_EXPENSE'; payload: Omit<Expense, 'id' | 'date'> }
  | { type: 'REMOVE_EXPENSE'; payload: string }
  | { type: 'UPDATE_CURRENCY'; payload: string }
  | { type: 'UPDATE_EXCHANGE_RATES'; payload: { [key: string]: number } }
  | { type: 'RESET_ALL' }
  | { type: 'LOAD_STATE'; payload: ExpenseState };

const initialState: ExpenseState = {
  people: [],
  expenses: [],
  currency: 'USD',
  exchangeRates: {}
};

function expenseReducer(state: ExpenseState, action: Action): ExpenseState {
  switch (action.type) {
    case 'ADD_PERSON':
      const newPerson: Person = {
        id: Date.now().toString(),
        name: action.payload,
        totalPaid: 0,
        totalOwes: 0
      };
      return {
        ...state,
        people: [...state.people, newPerson]
      };

    case 'REMOVE_PERSON':
      return {
        ...state,
        people: state.people.filter(person => person.id !== action.payload),
        expenses: state.expenses.filter(expense => 
          expense.paidBy !== action.payload && 
          !expense.splits[action.payload]
        )
      };

    case 'ADD_EXPENSE':
      const newExpense: Expense = {
        ...action.payload,
        id: Date.now().toString(),
        date: new Date().toISOString()
      };
      return {
        ...state,
        expenses: [...state.expenses, newExpense]
      };

    case 'REMOVE_EXPENSE':
      return {
        ...state,
        expenses: state.expenses.filter(expense => expense.id !== action.payload)
      };

    case 'UPDATE_CURRENCY':
      return {
        ...state,
        currency: action.payload
      };

    case 'UPDATE_EXCHANGE_RATES':
      return {
        ...state,
        exchangeRates: action.payload
      };

    case 'RESET_ALL':
      return initialState;

    case 'LOAD_STATE':
      return action.payload;

    default:
      return state;
  }
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export function ExpenseProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(expenseReducer, initialState);
  const [, setStoredState] = useLocalStorage('expenseData', initialState);

  // Load data from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('expenseData');
    if (stored) {
      try {
        const parsedData = JSON.parse(stored);
        dispatch({ type: 'LOAD_STATE', payload: parsedData });
      } catch (error) {
        console.error('Error loading stored data:', error);
      }
    }
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    setStoredState(state);
  }, [state, setStoredState]);

  const addPerson = (name: string) => {
    dispatch({ type: 'ADD_PERSON', payload: name });
  };

  const removePerson = (id: string) => {
    dispatch({ type: 'REMOVE_PERSON', payload: id });
  };

  const addExpense = (expense: Omit<Expense, 'id' | 'date'>) => {
    dispatch({ type: 'ADD_EXPENSE', payload: expense });
  };

  const removeExpense = (id: string) => {
    dispatch({ type: 'REMOVE_EXPENSE', payload: id });
  };

  const updateCurrency = (currency: string) => {
    dispatch({ type: 'UPDATE_CURRENCY', payload: currency });
  };

  const updateExchangeRates = (rates: { [key: string]: number }) => {
    dispatch({ type: 'UPDATE_EXCHANGE_RATES', payload: rates });
  };

  const resetAll = () => {
    dispatch({ type: 'RESET_ALL' });
    localStorage.removeItem('expenseData');
  };

  const getUpdatedPeople = (): Person[] => {
    return calculatePersonTotals(state.people, state.expenses);
  };

  const value: ExpenseContextType = {
    state,
    addPerson,
    removePerson,
    addExpense,
    removeExpense,
    updateCurrency,
    updateExchangeRates,
    resetAll,
    getUpdatedPeople
  };

  return (
    <ExpenseContext.Provider value={value}>
      {children}
    </ExpenseContext.Provider>
  );
}

export function useExpense() {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error('useExpense must be used within an ExpenseProvider');
  }
  return context;
}