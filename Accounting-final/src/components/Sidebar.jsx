import { Link, useLocation } from "react-router-dom";
import {Home, Edit3, BookOpen, FileText, BarChart2, BarChart3} from "lucide-react";

export default function Sidebar() {
    const loc = useLocation();
    const items = [
        { label: "Dashboard", to: "/", icon: <Home size={16}/> },
        { label: "Journalizing", to: "/journalizing", icon: <Edit3 size={16}/> },
        { label: "Ledger", to: "/ledger", icon: <BookOpen size={16}/> },
        { label: "Unadjusted Trial Balance", to: "/trial-balance", icon: <FileText size={16}/> },
        { label: "Income Statement", to: "/income-statement", icon: <BarChart2 size={16}/> },
        { label: "Financial Position", to: "/financial-position", icon: <BarChart3 size={16}/> }, // New page
    ];

    return (
        <aside className="w-64 bg-white border-r hidden md:flex flex-col">
            <div className="p-4 text-xl font-bold border-b">Rubang Accounting</div>
            <nav className="p-4 flex-1">
                <ul className="space-y-2">
                    {items.map((it) => (
                        <li key={it.to}>
                            <Link
                                to={it.to}
                                className={`flex items-center gap-3 px-3 py-2 rounded ${loc.pathname === it.to ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"}`}
                            >
                                <span className="opacity-90">{it.icon}</span>
                                <span>{it.label}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
            <div className="p-4 border-t text-sm text-gray-500">Made by Lenard Rubang</div>
        </aside>
    );
}
