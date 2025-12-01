export default function IncomeStatement({ batches }) {
    // Only posted transactions
    const postedTxns = batches.flatMap(b =>
        b.posted ? b.transactions.map(t => ({ ...t, date: b.date })) : []
    );

    // Group by account for income & expense
    const grouped = postedTxns.reduce((acc, t) => {
        if (t.type !== "Income" && t.type !== "Expense") return acc;
        const key = t.account || "Unspecified";
        if (!acc[key]) acc[key] = { account: key, type: t.type, amount: 0 };
        const amt = t.type === "Income" ? Number(t.credit || 0) : Number(t.debit || 0);
        acc[key].amount += amt;
        return acc;
    }, {});

    const accounts = Object.values(grouped);

    const incomeAccounts = accounts.filter(a => a.type === "Income");
    const expenseAccounts = accounts.filter(a => a.type === "Expense");

    const totalIncome = incomeAccounts.reduce((s, a) => s + a.amount, 0);
    const totalExpenses = expenseAccounts.reduce((s, a) => s + a.amount, 0);
    const net = totalIncome - totalExpenses;
    const netLabel = net >= 0 ? "Net Income" : "Net Loss";

    return (
        <div className="p-4 space-y-6">
            <h1 className="text-2xl font-bold mb-4">Income Statement</h1>

            {/* Income Table */}
            <div>
                <h2 className="text-lg font-semibold mb-2">Income</h2>
                <table className="min-w-full text-sm border-collapse border border-gray-300">
                    <thead className="bg-gray-100">
                    <tr>
                        <th className="p-3 border">Account</th>
                        <th className="p-3 border text-right">Amount</th>
                    </tr>
                    </thead>
                    <tbody>
                    {incomeAccounts.map(a => (
                        <tr key={a.account} className="border-t">
                            <td className="p-3 border">{a.account}</td>
                            <td className="p-3 border text-right">{a.amount > 0 ? a.amount.toFixed(2) : ""}</td>
                        </tr>
                    ))}
                    <tr className="font-bold border-t bg-gray-50">
                        <td className="p-3 border">Total Income</td>
                        <td className="p-3 border text-right">{totalIncome.toFixed(2)}</td>
                    </tr>
                    </tbody>
                </table>
            </div>

            {/* Expense Table */}
            <div>
                <h2 className="text-lg font-semibold mb-2">Expenses</h2>
                <table className="min-w-full text-sm border-collapse border border-gray-300">
                    <thead className="bg-gray-100">
                    <tr>
                        <th className="p-3 border">Account</th>
                        <th className="p-3 border text-right">Amount</th>
                    </tr>
                    </thead>
                    <tbody>
                    {expenseAccounts.map(a => (
                        <tr key={a.account} className="border-t">
                            <td className="p-3 border">{a.account}</td>
                            <td className="p-3 border text-right">{a.amount > 0 ? a.amount.toFixed(2) : ""}</td>
                        </tr>
                    ))}
                    <tr className="font-bold border-t bg-gray-50">
                        <td className="p-3 border">Total Expenses</td>
                        <td className="p-3 border text-right">{totalExpenses.toFixed(2)}</td>
                    </tr>
                    </tbody>
                </table>
            </div>

            {/* Net Table */}
            <div>
                <h2 className="text-lg font-semibold mb-2">Net</h2>
                <table className="min-w-full text-sm border-collapse border border-gray-300">
                    <tbody>
                    <tr className="font-bold border-t bg-gray-100">
                        <td className="p-3 border">{netLabel}</td>
                        <td className="p-3 border text-right">{Math.abs(net).toFixed(2)}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}
