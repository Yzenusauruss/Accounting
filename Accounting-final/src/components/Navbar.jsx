import { useLocation } from "react-router-dom";

export default function Navbar() {
    const loc = useLocation();
    const titleMap = {
        "/": "Dashboard",
        "/journalizing": "Journalizing",
        "/ledger": "Ledger",
        "/history": "History",
    };
    const title = titleMap[loc.pathname] || "Accounting";

    return (
        <header className="h-14 bg-white shadow-sm flex items-center justify-between px-4 md:px-6">
            <div className="font-semibold text-gray-800">{title}</div>
            <div className="text-sm text-gray-500">User: Admin</div>
        </header>
    );
}
