import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function DownloadPDF({ batches, children }) {
    const downloadPDF = () => {
        if (!batches || batches.length === 0) {
            alert("No batches to download.");
            return;
        }

        const doc = new jsPDF();

        // --- Journal Table ---
        const journalRows = [];
        batches.forEach((b) => {
            b.transactions.forEach((t) => {
                journalRows.push([
                    b.date,
                    t.account || "-",
                    t.desc || "-",
                    Number(t.debit || 0).toFixed(2),
                    Number(t.credit || 0).toFixed(2),
                    b.posted ? "Posted" : "Unposted",
                ]);
            });
        });

        autoTable(doc, {
            head: [["Date", "Account", "Description", "Debit", "Credit", "Status"]],
            body: journalRows,
            startY: 10,
            theme: "grid",
        });

        doc.addPage();

        // --- Ledger Table ---
        const posted = batches.flatMap((b) =>
            b.posted
                ? b.transactions.map((t) => ({ ...t, date: b.date }))
                : []
        );

        const grouped = posted.reduce((acc, t) => {
            const key = (t.account || "Unspecified").trim().toLowerCase();
            if (!acc[key]) acc[key] = { account: t.account || "Unspecified", txns: [] };
            acc[key].txns.push(t);
            return acc;
        }, {});

        Object.values(grouped).forEach((g) => {
            const ledgerRows = g.txns.map((t) => [
                t.date,
                Number(t.debit || 0).toFixed(2),
                Number(t.credit || 0).toFixed(2),
            ]);
            autoTable(doc, {
                head: [["Date", "Debit", "Credit"]],
                body: ledgerRows,
                startY: doc.lastAutoTable.finalY + 10 || 10,
                theme: "grid",
                didDrawPage: (data) => {
                    doc.text(`Ledger - ${g.account}`, 14, data.settings.margin.top - 5);
                },
            });
            doc.addPage();
        });

        doc.save("journal_ledger.pdf");
    };

    return <span onClick={downloadPDF}>{children}</span>;
}
