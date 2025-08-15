import { Person, Expense, Settlement } from '../types';

/**
 * Calculate total amounts paid and owed for each person
 */
export function calculatePersonTotals(people: Person[], expenses: Expense[]): Person[] {
  const totals = people.map(person => ({
    ...person,
    totalPaid: 0,
    totalOwes: 0
  }));

  expenses.forEach(expense => {
    // Add to paidBy person's totalPaid
    const payer = totals.find(p => p.id === expense.paidBy);
    if (payer) {
      payer.totalPaid += expense.amount;
    }

    // Add to each person's totalOwes based on splits
    Object.entries(expense.splits).forEach(([personId, amount]) => {
      const person = totals.find(p => p.id === personId);
      if (person) {
        person.totalOwes += amount;
      }
    });
  });

  return totals;
}

/**
 * Calculate who owes whom and how much (settlement optimization)
 */
export function calculateSettlements(people: Person[]): Settlement[] {
  // Calculate net balance for each person (positive = owed money, negative = owes money)
  const balances = people.map(person => ({
    id: person.id,
    name: person.name,
    balance: person.totalPaid - person.totalOwes
  }));

  // Separate creditors (positive balance) and debtors (negative balance)
  const creditors = balances.filter(b => b.balance > 0.01).sort((a, b) => b.balance - a.balance);
  const debtors = balances.filter(b => b.balance < -0.01).map(b => ({ ...b, balance: -b.balance })).sort((a, b) => b.balance - a.balance);

  const settlements: Settlement[] = [];

  // Match debtors with creditors to minimize number of transactions
  let creditorIndex = 0;
  let debtorIndex = 0;

  while (creditorIndex < creditors.length && debtorIndex < debtors.length) {
    const creditor = creditors[creditorIndex];
    const debtor = debtors[debtorIndex];

    const settlementAmount = Math.min(creditor.balance, debtor.balance);

    if (settlementAmount > 0.01) {
      settlements.push({
        from: debtor.name,
        to: creditor.name,
        amount: Math.round(settlementAmount * 100) / 100
      });
    }

    creditor.balance -= settlementAmount;
    debtor.balance -= settlementAmount;

    if (creditor.balance < 0.01) creditorIndex++;
    if (debtor.balance < 0.01) debtorIndex++;
  }

  return settlements;
}

/**
 * Validate expense form data
 */
export function validateExpense(
  description: string,
  amount: number,
  paidBy: string,
  splits: { [key: string]: number },
  people: Person[]
): string | null {
  if (!description.trim()) return 'Description is required';
  if (amount <= 0) return 'Amount must be greater than 0';
  if (!paidBy) return 'Please select who paid';

  const totalSplit = Object.values(splits).reduce((sum, amount) => sum + amount, 0);
  if (Math.abs(totalSplit - amount) > 0.01) {
    return `Split amounts (${totalSplit.toFixed(2)}) must equal the total amount (${amount.toFixed(2)})`;
  }

  return null;
}