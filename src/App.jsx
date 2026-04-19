import { useState } from "react";
import "./App.css";

export default function App() {
    const [sqm, setSqm] = useState("");
    const [propertyType, setPropertyType] = useState("apartment");
    const [renovationType, setRenovationType] = useState("partial");
    const [quality, setQuality] = useState("standard");
    const [region, setRegion] = useState("athens");
    const [hasKitchen, setHasKitchen] = useState(true);
    const [hasBathroom, setHasBathroom] = useState(true);
    const [userQuote, setUserQuote] = useState("");
    const [result, setResult] = useState(null);

    function calculateEstimate() {
        const area = Number(sqm);
        const quote = Number(userQuote);

        if (!area || area <= 0) {
            alert("Βάλε σωστά τετραγωνικά.");
            return;
        }

        const renovationBase = {
            light: { low: 120, high: 220 },
            partial: { low: 250, high: 450 },
            full: { low: 450, high: 800 },
        };

        const qualityFactor = {
            basic: 0.9,
            standard: 1,
            premium: 1.25,
        };

        const regionFactor = {
            athens: 1.1,
            thessaloniki: 1.05,
            other: 0.95,
        };

        const propertyFactor = {
            apartment: 1,
            office: 1.1,
            shop: 1.15,
        };

        const base = renovationBase[renovationType];
        const qf = qualityFactor[quality];
        const rf = regionFactor[region];
        const pf = propertyFactor[propertyType];

        let low = area * base.low * qf * rf * pf;
        let high = area * base.high * qf * rf * pf;

        const breakdown = [
            {
                label: "Βασικές εργασίες",
                low,
                high,
            },
        ];

        if (hasKitchen) {
            const kitchenLow =
                quality === "premium" ? 7000 : quality === "basic" ? 3000 : 5000;
            const kitchenHigh =
                quality === "premium" ? 14000 : quality === "basic" ? 6000 : 9000;

            low += kitchenLow;
            high += kitchenHigh;

            breakdown.push({
                label: "Κουζίνα",
                low: kitchenLow,
                high: kitchenHigh,
            });
        }

        if (hasBathroom) {
            const bathLow =
                quality === "premium" ? 5000 : quality === "basic" ? 2500 : 3500;
            const bathHigh =
                quality === "premium" ? 10000 : quality === "basic" ? 5000 : 7000;

            low += bathLow;
            high += bathHigh;

            breakdown.push({
                label: "Μπάνιο",
                low: bathLow,
                high: bathHigh,
            });
        }

        const avg = (low + high) / 2;

        let comparisonMessage = "";
        if (quote > 0) {
            if (quote < low) {
                comparisonMessage = "Η προσφορά είναι χαμηλότερη από το εύρος.";
            } else if (quote > high) {
                comparisonMessage = "Η προσφορά είναι υψηλότερη από το εύρος.";
            } else {
                comparisonMessage = "Η προσφορά είναι μέσα στο εύρος.";
            }
        }

        setResult({
            low: Math.round(low),
            high: Math.round(high),
            avg: Math.round(avg),
            avgPerSqmLow: Math.round(low / area),
            avgPerSqmHigh: Math.round(high / area),
            breakdown,
            quote: quote > 0 ? quote : null,
            comparisonMessage,
        });
    }

    return (
        <div className="container">
            <h1>Cost Check</h1>
            <p>Υπολογισμός κόστους ανακαίνισης</p>

            <div className="card">
                <label>Τετραγωνικά (m²)</label>
                <input
                    type="number"
                    value={sqm}
                    onChange={(e) => setSqm(e.target.value)}
                />

                <label>Τύπος ακινήτου</label>
                <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                >
                    <option value="apartment">Διαμέρισμα</option>
                    <option value="office">Γραφείο</option>
                    <option value="shop">Κατάστημα</option>
                </select>

                <label>Είδος ανακαίνισης</label>
                <select
                    value={renovationType}
                    onChange={(e) => setRenovationType(e.target.value)}
                >
                    <option value="light">Ελαφριά</option>
                    <option value="partial">Μερική</option>
                    <option value="full">Πλήρης</option>
                </select>

                <label>Ποιότητα</label>
                <select value={quality} onChange={(e) => setQuality(e.target.value)}>
                    <option value="basic">Basic</option>
                    <option value="standard">Standard</option>
                    <option value="premium">Premium</option>
                </select>

                <label>Περιοχή</label>
                <select value={region} onChange={(e) => setRegion(e.target.value)}>
                    <option value="athens">Αθήνα</option>
                    <option value="thessaloniki">Θεσσαλονίκη</option>
                    <option value="other">Υπόλοιπη Ελλάδα</option>
                </select>

                <label>
                    <input
                        type="checkbox"
                        checked={hasKitchen}
                        onChange={(e) => setHasKitchen(e.target.checked)}
                    />
                    Κουζίνα
                </label>

                <label>
                    <input
                        type="checkbox"
                        checked={hasBathroom}
                        onChange={(e) => setHasBathroom(e.target.checked)}
                    />
                    Μπάνιο
                </label>

                <label>Προσφορά (προαιρετικά)</label>
                <input
                    type="number"
                    value={userQuote}
                    onChange={(e) => setUserQuote(e.target.value)}
                />

                <button onClick={calculateEstimate}>Υπολογισμός</button>
            </div>

            {result && (
                <div className="result-card">
                    <h2>Αποτέλεσμα</h2>

                    <p>
                        {result.low.toLocaleString("el-GR")} € -{" "}
                        {result.high.toLocaleString("el-GR")} €
                    </p>

                    <p>
                        €/m²: {result.avgPerSqmLow} - {result.avgPerSqmHigh}
                    </p>

                    <h3>Ανάλυση</h3>
                    <ul>
                        {result.breakdown.map((item, i) => (
                            <li key={i}>
                                {item.label}: {Math.round(item.low)}€ -{" "}
                                {Math.round(item.high)}€
                            </li>
                        ))}
                    </ul>

                    {result.quote && (
                        <p>
                            Προσφορά: {result.quote}€ → {result.comparisonMessage}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}