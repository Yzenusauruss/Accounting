export default function FinancialPosition({ batches }) {
    // Only posted transactions
    const postedTxns = batches.flatMap(b =>
        b.posted ? b.transactions.map(t => ({ ...t, date: b.date })) : []
    );

    // Helper to calculate totals by account type
    const calculateTotals = (type, increaseOn = "debit") => {
        return postedTxns
            .filter(t => t.type === type)
            .reduce((acc, t) => {
                const key = t.account || "Unspecified";
                if (!acc[key]) acc[key] = 0;
                const value = increaseOn === "debit" ? (Number(t.debit || 0) - Number(t.credit || 0)) : (Number(t.credit || 0) - Number(t.debit || 0));
                acc[key] += value;
                return acc;
            }, {});
    };

    const assets = calculateTotals("Asset", "debit");
    const liabilities = calculateTotals("Liability", "credit");
    const equity = calculateTotals("Equity", "credit");

    const sum = obj => Object.values(obj).reduce((s, a) => s + a, 0);
    const totalAssets = sum(assets);
    const totalLiabilities = sum(liabilities);
    const totalEquity = sum(equity);

    return (
        <div className="p-4 space-y-6">
            <h1 className="text-2xl font-bold mb-4">Statement of Financial Position</h1>

            {/* Assets */}
            <h2 className="text-lg font-semibold mb-2">Assets</h2>
            <table className="min-w-full text-sm border-collapse border border-gray-300">
                <tbody>
                {Object.entries(assets).map(([acc, amt]) => (
                    <tr key={acc} className="border-t">
                        <td className="p-3 border">{acc}</td>
                        <td className="p-3 border text-right">{amt.toFixed(2)}</td>
                    </tr>
                ))}
                <tr className="font-bold border-t bg-gray-50">
                    <td className="p-3 border">Total Assets</td>
                    <td className="p-3 border text-right">{totalAssets.toFixed(2)}</td>
                </tr>
                </tbody>
            </table>

            {/* Liabilities and Equity */}
            <h2 className="text-lg font-semibold mb-2">Liabilities and Equity</h2>
            <table className="min-w-full text-sm border-collapse border border-gray-300">
                <tbody>
                {/* Liabilities */}
                {Object.entries(liabilities).map(([acc, amt]) => (
                    <tr key={acc} className="border-t">
                        <td className="p-3 border">{acc}</td>
                        <td className="p-3 border text-right">{amt.toFixed(2)}</td>
                    </tr>
                ))}
                <tr className="font-bold border-t bg-gray-50">
                    <td className="p-3 border">Total Liabilities</td>
                    <td className="p-3 border text-right">{totalLiabilities.toFixed(2)}</td>
                </tr>

                {/* Equity */}
                {Object.entries(equity).map(([acc, amt]) => (
                    <tr key={acc} className="border-t">
                        <td className="p-3 border">{acc}</td>
                        <td className="p-3 border text-right">{amt.toFixed(2)}</td>
                    </tr>
                ))}
                <tr className="font-bold border-t bg-gray-50">
                    <td className="p-3 border">Total Equity</td>
                    <td className="p-3 border text-right">{totalEquity.toFixed(2)}</td>
                </tr>
                </tbody>
            </table>

            {/* Total Liabilities and Equity */}
            <h2 className="text-lg font-semibold mb-2">Total Liabilities and Equity</h2>
            <table className="min-w-full text-sm border-collapse border border-gray-300">
                <tbody>
                <tr className="font-bold border-t bg-gray-100">
                    <td className="p-3 border">Total Liabilities and Equity</td>
                    <td className="p-3 border text-right">{(totalLiabilities + totalEquity).toFixed(2)}</td>
                </tr>
                </tbody>
            </table>
        </div>
    );
}
