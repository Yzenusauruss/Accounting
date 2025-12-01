export default function Ledger({ batches }) {
    const posted = batches.flatMap((b) =>
        b.posted ? b.transactions.map((t) => ({ ...t, date: b.date })) : []
    );

    const grouped = posted.reduce((acc, t) => {
        const key = (t.account || "Unspecified").trim().toLowerCase();
        if (!acc[key]) acc[key] = { account: t.account || "Unspecified", txns: [] };
        acc[key].txns.push(t);
        return acc;
    }, {});

    const groups = Object.values(grouped);
    const sum = (arr, k) => arr.reduce((s, x) => s + Number(x[k] || 0), 0);

    return (
        <div className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Ledger</h1>
                <div className="text-sm text-gray-600">Accounts: {groups.length}</div>
            </div>

            <div className="flex-1 overflow-auto space-y-6 pr-2">
                {groups.length === 0 && <div className="text-gray-500">No posted transactions yet.</div>}
                {groups.map((g, idx) => {
                    const totalDebit = sum(g.txns, "debit");
                    const totalCredit = sum(g.txns, "credit");
                    const diff = totalDebit - totalCredit;

                    return (
                        <section key={idx} className="bg-white rounded shadow">
                            <div className="px-4 py-3 border-b flex items-center justify-between">
                                <h2 className="text-lg font-medium">{g.account}</h2>
                                <div className="text-sm text-gray-600">Transactions: {g.txns.length}</div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full text-sm">
                                    <thead className="bg-gray-100">
                                    <tr>
                                        <th className="p-2 border">Date</th>
                                        <th className="p-2 border text-right">Debit</th>
                                        <th className="p-2 border text-right">Credit</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {g.txns.map((t) => (
                                        <tr key={t.id} className="hover:bg-gray-50">
                                            <td className="p-2 border w-36">{t.date}</td>
                                            <td className="p-2 border text-right">{Number(t.debit || 0).toFixed(2)}</td>
                                            <td className="p-2 border text-right">{Number(t.credit || 0).toFixed(2)}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                    <tfoot className="bg-gray-50 font-medium">
                                    <tr>
                                        <td className="p-3 border text-right">Totals:</td>
                                        <td className="p-3 border text-right">{totalDebit.toFixed(2)}</td>
                                        <td className="p-3 border text-right">{totalCredit.toFixed(2)}</td>
                                    </tr>
                                    <tr>
                                        <td className="p-3 border text-right">
                                            {diff >= 0 ? "Difference (Debit - Credit):" : "Difference (Credit - Debit):"}
                                        </td>
                                        <td className="p-3 border text-right" colSpan={2}>
                                                <span className={diff >= 0 ? "text-green-600" : "text-red-600"}>
                                                    {Math.abs(diff.toFixed(2))}
                                                </span>
                                        </td>
                                    </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </section>
                    );
                })}
            </div>
        </div>
    );
}
