import TransactionsClient from "@/components/admin/transactions/TransactionsClient";
import { fetchTransactions } from "@/lib/actions/transaction-actions";

export default async function TransactionsPage() {
  const transactions = await fetchTransactions(1, 10);
  return <TransactionsClient initialData={transactions.data} hasMore={transactions.hasMore} limit={10} />;
}
