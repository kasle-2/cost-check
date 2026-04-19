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

        const breakdown = [];

        breakdown.push({
            label: "Βασικές εργασίες",
            low,
            high,
        });

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
            const bathroomLow =
                quality === "premium" ? 5000 : quality === "basic" ? 2500 : 3500;
            const bathroomHigh =
                quality === "premium" ? 10000 : quality === "basic" ? 5000 : 7000;

            low += bathroomLow;
            high += bathroomHigh;

            breakdown.push({
                label: "Μπάνιο",
                low: bathroomLow,
                high: bathroomHigh,
            });
        }

        const avg = (low + high) / 2;

        let comparisonMessage = "";
        if (quote > 0) {
            if (quote < low) {
                comparisonMessage = "Η προσφορά σου είναι κάτω από το εκτιμώμενο εύρος.";
            } else if (quote > high) {
                comparisonMessage = "Η προσφορά σου είναι πάνω από το εκτιμώμενο εύρος.";
            } else {
                comparisonMessage = "Η προσφορά σου είναι μέσα στο εκτιμώμενο εύρος.";
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
            <p className="subtitle">Υπολογισμός ενδεικτικού κόστους ανακαίνισης</p>

            <div className="card">
                <label>Τετραγωνικά (m²)</label>
                <input
                    type="number"
                    placeholder="π.χ. 85"
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

                <label>Επίπεδο ποιότητας</label>
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

                <div className="checkbox-group">
                    <label className="checkbox-label">
                        <input
                            type="checkbox"
                            checked={hasKitchen}
                            onChange={(e) => setHasKitchen(e.target.checked)}
                        />
                        Νέα κουζίνα
                    </label>

                    <label className="checkbox-label">
                        <input
                            type="checkbox"
                            checked={hasBathroom}
                            onChange={(e) => setHasBathroom(e.target.checked)}
                        />
                        Ανακαίνιση μπάνιου
                    </label>
                </div>

                <label>Προσφορά που πήρες (προαιρετικό)</label>
                <input
                    type="number"
                    placeholder="π.χ. 32000"
                    value={userQuote}
                    onChange={(e) => setUserQuote(e.target.value)}
                />

                <button onClick={calculateEstimate}>Υπολογισμός</button>
            </div>

            {result && (
                <div className="result-card">
                    <h2>Αποτέλεσμα</h2>

                    <p className="price-range">
                        {result.low.toLocaleString("el-GR")} € —{" "}
                        {result.high.toLocaleString("el-GR")} €
                    </p>

                    <p>Μέσο εκτιμώμενο κόστος: {result.avg.toLocaleString("el-GR")} €</p>
                    <p>
                        Ενδεικτικό εύρος ανά m²: {result.avgPerSqmLow}€ -{" "}
                        {result.avgPerSqmHigh}€/m²
                    </p>

                    <h3>Breakdown</h3>
                    <ul>
                        {result.breakdown.map((item, index) => (
                            <li key={index}>
                                <strong>{item.label}</strong>:{" "}
                                {Math.round(item.low).toLocaleString("el-GR")} € -{" "}
                                {Math.round(item.high).toLocaleString("el-GR")} €
                            </li>
                        ))}
                    </ul>

                    {result.quote && (
                        <div className="quote-box">
                            <h3>Σύγκριση με προσφορά</h3>
                            <p>Η δική σου προσφορά: {result.quote.toLocaleString("el-GR")} €</p>
                            <p><strong>{result.comparisonMessage}</strong></p>
                        </div>
                    )}

                    <p className="note">
                        Η εκτίμηση είναι ενδεικτική και δεν αποτελεί τελική τεχνική ή οικονομική προσφορά.
                    </p>
                </div>
            )}
        </div>
    );
}