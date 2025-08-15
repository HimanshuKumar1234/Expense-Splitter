export interface Person {
  id: string;
  name: string;
  totalPaid: number;
  totalOwes: number;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  paidBy: string;
  splitType: 'equal' | 'custom';
  splits: { [personId: string]: number };
  date: string;
  category: string;
}

export interface Settlement {
  from: string;
  to: string;
  amount: number;
}

export interface ExpenseState {
  people: Person[];
  expenses: Expense[];
  currency: string;
  exchangeRates: { [key: string]: number };
}

export interface CurrencyRates {
  [key: string]: number;
}