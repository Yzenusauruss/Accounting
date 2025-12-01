import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Dashboard from "./Pages/DashboardPage";
import Journalizing from "./Pages/JournalPage";
import Ledger from "./Pages/LedgerPage";
import UnadjustedTrialBalance from "./Pages/UnadjustedTrialBalance";
import IncomeStatement from "./Pages/IncomeStatement";
import FinancialPosition from "./Pages/FinancialPosition"; // <-- new page
import { useState } from "react";

export default function App() {
    const [batches, setBatches] = useState([]);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const addHistory = (action, details) => {
        console.log(`Action: ${action}, Details: ${details}`);
    };

    const postAllBatches = () => {
        const unposted = batches.filter((b) => !b.posted);
        if (unposted.length === 0) {
            alert("No unposted batches to post.");
            return;
        }
        if (!confirm(`Post ${unposted.length} unposted batch(es) to Ledger?`)) return;
        setBatches((prev) => prev.map((b) => ({ ...b, posted: true })));
        const accounts = Array.from(
            new Set(unposted.flatMap((b) => b.transactions.map((t) => (t.account || "").trim())).filter(Boolean))
        );
        addHistory("Post All", `Posted ${unposted.length} batch(es). Accounts: ${accounts.join(", ") || "-"}`);
        alert("Posted all unposted batches.");
    };

    return (
        <Router>
            <div className="flex h-screen bg-gray-100 text-gray-900 overflow-hidden">
                <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
                <div className="flex-1 flex flex-col">
                    <Navbar onToggleSidebar={() => setSidebarOpen((s) => !s)} />
                    <main className="flex-1 overflow-auto p-4 md:p-6">
                        <Routes>
                            <Route path="/" element={<Dashboard />} />
                            <Route
                                path="/journalizing"
                                element={
                                    <Journalizing
                                        batches={batches}
                                        setBatches={setBatches}
                                        addHistory={addHistory}
                                        postAllBatches={postAllBatches}
                                    />
                                }
                            />
                            <Route path="/ledger" element={<Ledger batches={batches} />} />
                            <Route path="/trial-balance" element={<UnadjustedTrialBalance batches={batches} />} />
                            <Route path="/income-statement" element={<IncomeStatement batches={batches} />} />
                            <Route path="/financial-position" element={<FinancialPosition batches={batches} />} /> {/* new route */}
                        </Routes>
                    </main>
                </div>
            </div>
        </Router>
    );

}
