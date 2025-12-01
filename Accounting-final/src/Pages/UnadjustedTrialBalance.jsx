export default function UnadjustedTrialBalance({ batches }) {
    // Only posted transactions
    const postedTxns = batches.flatMap(b =>
        b.posted ? b.transactions.map(t => ({ ...t, date: b.date })) : []
    );

    // Group by account
    const grouped = postedTxns.reduce((acc, t) => {
        const key = t.account || "Unspecified";
        if (!acc[key]) acc[key] = { account: key, type: t.type, debit: 0, credit: 0 };
        acc[key].debit += Number(t.debit || 0);
        acc[key].credit += Number(t.credit || 0);
        return acc;
    }, {});

    // Sorting order by type
    const order = { Asset: 1, Liability: 2, Equity: 3, Income: 4, Expense: 5 };

    const sortedAccounts = Object.values(grouped).sort(
        (a, b) => (order[a.type] || 99) - (order[b.type] || 99)
    );

    const totalDebit = sortedAccounts.reduce((s, a) => s + a.debit, 0);
    const totalCredit = sortedAccounts.reduce((s, a) => s + a.credit, 0);

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Unadjusted Trial Balance</h1>
            <table className="min-w-full text-sm border-collapse border border-gray-300">
                <thead className="bg-gray-100">
                <tr>
                    <th className="p-3 border">Account Title</th>
                    <th className="p-3 border text-right">Debit</th>
                    <th className="p-3 border text-right">Credit</th>
                </tr>
                </thead>
                <tbody>
                {sortedAccounts.map((a) => (
                    <tr key={a.account} className="border-t">
                        <td className="p-3 border">{a.account}</td>
                        <td className="p-3 border text-right">{a.debit > 0 ? a.debit.toFixed(2) : ""}</td>
                        <td className="p-3 border text-right">{a.credit > 0 ? a.credit.toFixed(2) : ""}</td>
                    </tr>
                ))}
                <tr className="font-bold bg-gray-50">
                    <td className="p-3 border text-center">Totals</td>
                    <td className="p-3 border text-right">{totalDebit.toFixed(2)}</td>
                    <td className="p-3 border text-right">{totalCredit.toFixed(2)}</td>
                </tr>
                </tbody>
            </table>
        </div>
    );
}
