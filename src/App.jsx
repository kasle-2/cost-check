import { useState } from "react";

export default function App() {
    const [desc, setDesc] = useState("");
    const [qty, setQty] = useState("");
    const [unit, setUnit] = useState("");
    const [market, setMarket] = useState("");

    const [a, setA] = useState("");
    const [b, setB] = useState("");
    const [c, setC] = useState("");

    const [result, setResult] = useState("");

    function calculate() {
        const values = [Number(a), Number(b), Number(c)].filter(v => v > 0);

        if (values.length === 0) {
            setResult("Βάλε τουλάχιστον μία προσφορά");
            return;
        }

        const avg = values.reduce((sum, v) => sum + v, 0) / values.length;

        let text = `Μέση τιμή: ${avg.toFixed(2)}€\n\n`;

        values.forEach((v, i) => {
            const diff = ((v - avg) / avg) * 100;

            if (diff > 15) {
                text += `Προσφορά ${i + 1}: ΥΨΗΛΗ (+${diff.toFixed(1)}%)\n`;
            } else if (diff < -15) {
                text += `Προσφορά ${i + 1}: ΠΟΛΥ ΧΑΜΗΛΗ (${diff.toFixed(1)}%)\n`;
            } else {
                text += `Προσφορά ${i + 1}: OK (${diff.toFixed(1)}%)\n`;
            }
        });

        if (market) {
            const m = Number(market);
            const diffMarket = ((avg - m) / m) * 100;

            text += `\nΤιμή αγοράς: ${m.toFixed(2)}€\n`;

            if (diffMarket > 15) {
                text += `👉 ΠΑΝΩ από αγορά (+${diffMarket.toFixed(1)}%)`;
            } else if (diffMarket < -15) {
                text += `👉 ΚΑΤΩ από αγορά (${diffMarket.toFixed(1)}%)`;
            } else {
                text += `👉 ΚΟΝΤΑ στην αγορά`;
            }
        }

        setResult(text);
    }

    return (
        <div style={{
            minHeight: "100vh",
            background: "#f4f6f8",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontFamily: "Arial"
        }}>
            <div style={{
                background: "white",
                padding: "30px",
                borderRadius: "12px",
                width: "420px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.1)"
            }}>
                <h1 style={{ textAlign: "center" }}>Cost Check</h1>
                <p style={{ textAlign: "center", color: "#666" }}>
                    Αξιολόγηση προσφορών έργου
                </p>

                <input placeholder="Περιγραφή εργασίας"
                       value={desc} onChange={e => setDesc(e.target.value)}
                       style={inputStyle} />

                <input placeholder="Ποσότητα"
                       value={qty} onChange={e => setQty(e.target.value)}
                       style={inputStyle} />

                <input placeholder="Μονάδα (π.χ. m², kg)"
                       value={unit} onChange={e => setUnit(e.target.value)}
                       style={inputStyle} />

                <input placeholder="Τιμή αγοράς (προαιρετικό)"
                       value={market} onChange={e => setMarket(e.target.value)}
                       style={inputStyle} />

                <hr />

                <input placeholder="Προσφορά Α (€)"
                       value={a} onChange={e => setA(e.target.value)}
                       style={inputStyle} />

                <input placeholder="Προσφορά Β (€)"
                       value={b} onChange={e => setB(e.target.value)}
                       style={inputStyle} />

                <input placeholder="Προσφορά Γ (€)"
                       value={c} onChange={e => setC(e.target.value)}
                       style={inputStyle} />

                <button onClick={calculate} style={buttonStyle}>
                    Υπολογισμός
                </button>

                {result && (
                    <div style={{
                        marginTop: "20px",
                        background: "#eef2f7",
                        padding: "15px",
                        borderRadius: "8px"
                    }}>
                        <pre style={{ margin: 0 }}>{result}</pre>
                    </div>
                )}
            </div>
        </div>
    );
}

const inputStyle = {
    width: "100%",
    padding: "10px",
    marginTop: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc"
};

const buttonStyle = {
    width: "100%",
    padding: "12px",
    marginTop: "15px",
    borderRadius: "6px",
    border: "none",
    background: "#2563eb",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer"
};