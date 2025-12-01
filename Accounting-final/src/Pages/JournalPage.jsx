import { useState } from "react";
import { Plus, Trash2, Edit3, Upload } from "lucide-react";

const ACCOUNT_TYPES = ["Asset", "Liability", "Equity", "Income", "Expense"];

function uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

export default function Journalizing({ batches, setBatches, postAllBatches }) {
    const [showModal, setShowModal] = useState(false);
    const [batchDate, setBatchDate] = useState(new Date().toISOString().slice(0, 10));
    const [batchCount, setBatchCount] = useState(1);
    const [batchDesc, setBatchDesc] = useState("");
    const [currentTxns, setCurrentTxns] = useState([]);
    const [editingBatchId, setEditingBatchId] = useState(null);

    const openAdd = () => {
        setBatchDate(new Date().toISOString().slice(0, 10));
        setBatchCount(1);
        setBatchDesc("");
        setCurrentTxns([]);
        setEditingBatchId(null);
        setShowModal(true);
    };

    const initializeRows = () => {
        const rows = Array.from({ length: Number(batchCount) || 1 }).map(() => ({
            id: uid(),
            account: "",
            type: ACCOUNT_TYPES[0],
            debit: "0",
            credit: "0",
        }));
        setCurrentTxns(rows);
    };

    const updateTxnField = (txnId, key, value) => {
        setCurrentTxns((prev) =>
            prev.map((r) => {
                if (r.id !== txnId) return r;
                let next = { ...r, [key]: value };
                if (key === "debit") {
                    const d = Number(value || 0);
                    if (!isNaN(d) && d > 0) next.credit = "0";
                }
                if (key === "credit") {
                    const c = Number(value || 0);
                    if (!isNaN(c) && c > 0) next.debit = "0";
                }
                return next;
            })
        );
    };

    const deleteCurrentRow = (id) =>
        setCurrentTxns((prev) => prev.filter((r) => r.id !== id));

    const saveBatch = () => {
        if (currentTxns.length === 0)
            return alert("No transactions. Initialize rows first.");


        for (const t of currentTxns) {
            if (!String(t.account).trim())
                return alert("Every transaction requires an account title.");
            const d = Number(t.debit || 0);
            const c = Number(t.credit || 0);
            if ((d > 0 && c > 0) || (d === 0 && c === 0)) {
                return alert("Each transaction must have either Debit >0 or Credit >0 (not both or none).");
            }
        }

        const totalDebit = currentTxns.reduce((s, t) => s + Number(t.debit || 0), 0);
        const totalCredit = currentTxns.reduce((s, t) => s + Number(t.credit || 0), 0);
        if (totalDebit !== totalCredit)
            return alert("Total Debit and Credit must be equal and you must have at least two transactions!");

        const batch = {
            id: editingBatchId || uid(),
            date: batchDate,
            posted: false,
            description: batchDesc,
            transactions: currentTxns.map((t) => ({ ...t })),
        };

        if (editingBatchId) {
            setBatches((prev) =>
                prev.map((b) => (b.id === editingBatchId ? batch : b))
            );
            setEditingBatchId(null);
        } else {
            setBatches((prev) => [...prev, batch]);
        }

        setShowModal(false);
        setCurrentTxns([]);
    };

    const openEditBatch = (batch) => {
        setEditingBatchId(batch.id);
        setBatchDate(batch.date);
        setBatchDesc(batch.description || "");
        setCurrentTxns(batch.transactions.map((t) => ({ ...t })));
        setShowModal(true);
    };

    const deleteBatch = (batchId) => {
        if (!confirm("Delete this batch?")) return;
        setBatches((prev) => prev.filter((b) => b.id !== batchId));
    };

    const postBatch = (batchId) => {
        const batch = batches.find((b) => b.id === batchId);
        if (!batch) return;
        if (batch.posted) return alert("Batch already posted.");
        if (!confirm("Post this batch to Ledger?")) return;

        setBatches((prev) =>
            prev.map((b) => (b.id === batchId ? { ...b, posted: true } : b))
        );
        alert("Batch posted.");
    };

    let prevDate = null;

    return (
        <div className="h-screen flex flex-col p-4 bg-gray-50">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold flex items-center gap-3">Journalizing</h1>
                <div className="flex gap-3">
                    <button
                        onClick={openAdd}
                        className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                    >
                        <Plus size={14} /> Add Batch
                    </button>
                    <button
                        onClick={postAllBatches}
                        className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                        <Upload size={14} /> Post All
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded shadow overflow-auto flex-1">
                <table className="min-w-full text-sm border-collapse border border-gray-300">
                    <thead className="bg-gray-100 sticky top-0">
                    <tr>
                        <th className="p-3 border w-36">Date</th>
                        <th className="p-3 border">Account Titles</th>
                        <th className="p-3 border">Type</th>
                        <th className="p-3 border">Description</th>
                        <th className="p-3 border text-right">Debit</th>
                        <th className="p-3 border text-right">Credit</th>
                        <th className="p-3 border">Status</th>
                        <th className="p-3 border">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {batches.length === 0 && (
                        <tr>
                            <td colSpan="8" className="p-6 text-center text-gray-500">
                                No batches yet. Click "Add Batch".
                            </td>
                        </tr>
                    )}
                    {batches.map((b, idx) =>
                        b.transactions.map((t, txIdx) => {
                            const showDate = txIdx === 0 ? (b.date === prevDate ? "〃" : b.date) : "";
                            if (txIdx === 0) prevDate = b.date;
                            return (
                                <tr key={`${b.id}-${t.id}`} className={`${idx % 2 === 0 ? "bg-gray-50" : ""} border-t`}>
                                    <td className="p-3 border align-top">{showDate}</td>
                                    <td className="p-3 border align-top">{t.account || "-"}</td>
                                    <td className="p-3 border align-top">{t.type}</td>
                                    {txIdx === 0 && (
                                        <td className="p-3 border align-top break-words max-w-xs" rowSpan={b.transactions.length}>
                                            {b.description || "-"}
                                        </td>
                                    )}
                                    <td className="p-3 border text-right align-top">
                                        {Number(t.debit) > 0 ? Number(t.debit).toFixed(2) : ""}
                                    </td>
                                    <td className="p-3 border text-right align-top">
                                        {Number(t.credit) > 0 ? Number(t.credit).toFixed(2) : ""}
                                    </td>
                                    {txIdx === 0 && (
                                        <>
                                            <td className="p-3 border align-top" rowSpan={b.transactions.length}>
                                                {b.posted ? "Posted" : "Unposted"}
                                            </td>
                                            <td className="p-3 border align-top flex flex-col gap-1" rowSpan={b.transactions.length}>
                                                <button onClick={() => openEditBatch(b)} className="text-blue-600 hover:underline flex items-center gap-1"><Edit3 size={14} /> Edit</button>
                                                <button onClick={() => deleteBatch(b.id)} className="text-red-600 hover:underline flex items-center gap-1"><Trash2 size={14} /> Delete</button>
                                                <button onClick={() => postBatch(b.id)} className="text-green-700 hover:underline flex items-center gap-1"><Upload size={14} /> Post</button>
                                            </td>
                                        </>
                                    )}
                                </tr>
                            );
                        })
                    )}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-start justify-center p-6">
                    <div
                        className="absolute inset-0 bg-black/40"
                        onClick={() => {
                            setShowModal(false);
                            setCurrentTxns([]);
                            setEditingBatchId(null);
                        }}
                    />
                    <div className="relative w-full max-w-4xl bg-white rounded-lg shadow-lg p-6 z-10">
                        <h2 className="text-lg font-semibold mb-4">
                            {editingBatchId ? "Edit Batch" : "Create Batch"}
                        </h2>
                        {!currentTxns.length ? (
                            <div className="grid md:grid-cols-3 gap-3 items-end">
                                <div>
                                    <label className="block text-sm text-gray-600">Date</label>
                                    <input
                                        type="date"
                                        value={batchDate}
                                        onChange={(e) => setBatchDate(e.target.value)}
                                        className="mt-1 border p-2 rounded w-full"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-600">Number of transactions</label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={batchCount}
                                        onChange={(e) => setBatchCount(e.target.value)}
                                        className="mt-1 border p-2 rounded w-full"
                                    />
                                </div>
                                <div>
                                    <button
                                        onClick={initializeRows}
                                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                    >
                                        Initialize Rows
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="mb-4">
                                    <label className="block text-sm text-gray-600">Batch Description</label>
                                    <input
                                        type="text"
                                        value={batchDesc}
                                        onChange={(e) => setBatchDesc(e.target.value)}
                                        className="mt-1 border p-2 rounded w-full"
                                        placeholder="Enter description for this batch"
                                    />
                                </div>
                                <div className="overflow-x-auto max-h-72 mb-4">
                                    <table className="min-w-full text-sm border-collapse border border-gray-300">
                                        <thead className="bg-gray-100 sticky top-0">
                                        <tr>
                                            <th className="p-2 border">Account Title</th>
                                            <th className="p-2 border">Type</th>
                                            <th className="p-2 border">Debit</th>
                                            <th className="p-2 border">Credit</th>
                                            <th className="p-2 border">Actions</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {currentTxns.map((t) => (
                                            <tr key={t.id}>
                                                <td className="p-2 border">
                                                    <input
                                                        className="w-full p-1 border rounded"
                                                        value={t.account}
                                                        onChange={(e) => updateTxnField(t.id, "account", e.target.value)}
                                                    />
                                                </td>
                                                <td className="p-2 border">
                                                    <select
                                                        className="w-full p-1 border rounded"
                                                        value={t.type}
                                                        onChange={(e) => updateTxnField(t.id, "type", e.target.value)}
                                                    >
                                                        {ACCOUNT_TYPES.map((a) => (
                                                            <option key={a} value={a}>{a}</option>
                                                        ))}
                                                    </select>
                                                </td>
                                                <td className="p-2 border">
                                                    <input
                                                        className="w-full p-1 border rounded text-right"
                                                        value={t.debit === "0" ? "" : t.debit}
                                                        onChange={(e) => updateTxnField(t.id, "debit", e.target.value)}
                                                    />
                                                </td>
                                                <td className="p-2 border">
                                                    <input
                                                        className="w-full p-1 border rounded text-right"
                                                        value={t.credit === "0" ? "" : t.credit}
                                                        onChange={(e) => updateTxnField(t.id, "credit", e.target.value)}
                                                    />
                                                </td>
                                                <td className="p-2 border text-center">
                                                    <button
                                                        onClick={() => deleteCurrentRow(t.id)}
                                                        className="text-red-600 hover:underline"
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="text-sm text-gray-600">
                                        Batch totals — Debit:{" "}
                                        <strong>
                                            {currentTxns
                                                .reduce((s, r) => s + Number(r.debit || 0), 0)
                                                .toFixed(2)}
                                        </strong>{" "}
                                        | Credit:{" "}
                                        <strong>
                                            {currentTxns
                                                .reduce((s, r) => s + Number(r.credit || 0), 0)
                                                .toFixed(2)}
                                        </strong>
                                    </div>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={saveBatch}
                                            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                                        >
                                            {editingBatchId ? "Save Changes" : "Save Batch"}
                                        </button>
                                        <button
                                            onClick={() => {
                                                setShowModal(false);
                                                setCurrentTxns([]);
                                                setEditingBatchId(null);
                                            }}
                                            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
