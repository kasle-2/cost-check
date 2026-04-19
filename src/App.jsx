import { useState } from "react";
import "./App.css";
import { costData } from "./costData";

export default function App() {
    const [section, setSection] = useState("kitchen");
    const [sqm, setSqm] = useState("");
    const [quality, setQuality] = useState("standard");

    const [hasBaseWorks, setHasBaseWorks] = useState(true);

    // Kitchen
    const [hasCabinets, setHasCabinets] = useState(true);
    const [hasCountertop, setHasCountertop] = useState(true);
    const [hasPainting, setHasPainting] = useState(false);
    const [hasFloor, setHasFloor] = useState(false);
    const [hasInstallations, setHasInstallations] = useState(false);

    // Bathroom
    const [hasSanitary, setHasSanitary] = useState(true);
    const [hasTiles, setHasTiles] = useState(true);
    const [hasBathroomPainting, setHasBathroomPainting] = useState(false);
    const [hasBathroomFloor, setHasBathroomFloor] = useState(false);
    const [hasBathroomInstallations, setHasBathroomInstallations] = useState(false);

    const [userQuote, setUserQuote] = useState("");
    const [result, setResult] = useState(null);

    function calculateEstimate() {
        const area = Number(sqm);
        const quote = Number(userQuote);

        if (!area || area <= 0) {
            alert(
                section === "kitchen"
                    ? "Βάλε σωστά τετραγωνικά κουζίνας."
                    : "Βάλε σωστά τετραγωνικά μπάνιου."
            );
            return;
        }

        const qf = costData.qualityFactor[quality] || 1;

        let low = 0;
        let high = 0;
        const breakdown = [];

        if (hasBaseWorks) {
            const baseLow = area * 80 * qf;
            const baseHigh = area * 180 * qf;

            low += baseLow;
            high += baseHigh;

            breakdown.push({
                label: "Βασικές εργασίες",
                low: baseLow,
                high: baseHigh,
            });
        }

        if (section === "kitchen") {
            if (hasCabinets) {
                const cabinetsLow = (quality === "premium" ? 7000 : 5000) * qf;
                const cabinetsHigh = (quality === "premium" ? 14000 : 9000) * qf;

                low += cabinetsLow;
                high += cabinetsHigh;

                breakdown.push({
                    label: "Νέα ντουλάπια",
                    low: cabinetsLow,
                    high: cabinetsHigh,
                });
            }

            if (hasCountertop) {
                const countertopLow = (quality === "premium" ? 5000 : 3500) * qf;
                const countertopHigh = (quality === "premium" ? 10000 : 7000) * qf;

                low += countertopLow;
                high += countertopHigh;

                breakdown.push({
                    label: "Νέος πάγκος",
                    low: countertopLow,
                    high: countertopHigh,
                });
            }

            if (hasPainting) {
                const paintLow = area * 10 * qf;
                const paintHigh = area * 20 * qf;

                low += paintLow;
                high += paintHigh;

                breakdown.push({
                    label: "Βάψιμο",
                    low: paintLow,
                    high: paintHigh,
                });
            }

            if (hasFloor) {
                const floorLow = area * 30 * qf;
                const floorHigh = area * 80 * qf;

                low += floorLow;
                high += floorHigh;

                breakdown.push({
                    label: "Νέο δάπεδο",
                    low: floorLow,
                    high: floorHigh,
                });
            }

            if (hasInstallations) {
                const instLow = (quality === "premium" ? 1500 : 1200) * qf;
                const instHigh = (quality === "premium" ? 3500 : 2500) * qf;

                low += instLow;
                high += instHigh;

                breakdown.push({
                    label: "Υδραυλικά & ηλεκτρολογικά",
                    low: instLow,
                    high: instHigh,
                });
            }
        }

        if (section === "bathroom") {
            if (hasSanitary) {
                const sanitaryLow = (quality === "premium" ? 3500 : 2200) * qf;
                const sanitaryHigh = (quality === "premium" ? 7000 : 4500) * qf;

                low += sanitaryLow;
                high += sanitaryHigh;

                breakdown.push({
                    label: "Νέα είδη υγιεινής",
                    low: sanitaryLow,
                    high: sanitaryHigh,
                });
            }

            if (hasTiles) {
                const tilesLow = area * (quality === "premium" ? 90 : 55) * qf;
                const tilesHigh = area * (quality === "premium" ? 160 : 110) * qf;

                low += tilesLow;
                high += tilesHigh;

                breakdown.push({
                    label: "Νέα πλακάκια",
                    low: tilesLow,
                    high: tilesHigh,
                });
            }

            if (hasBathroomPainting) {
                const bathPaintLow = area * 12 * qf;
                const bathPaintHigh = area * 25 * qf;

                low += bathPaintLow;
                high += bathPaintHigh;

                breakdown.push({
                    label: "Βάψιμο",
                    low: bathPaintLow,
                    high: bathPaintHigh,
                });
            }

            if (hasBathroomFloor) {
                const bathFloorLow = area * 35 * qf;
                const bathFloorHigh = area * 90 * qf;

                low += bathFloorLow;
                high += bathFloorHigh;

                breakdown.push({
                    label: "Νέο δάπεδο",
                    low: bathFloorLow,
                    high: bathFloorHigh,
                });
            }

            if (hasBathroomInstallations) {
                const bathInstLow = (quality === "premium" ? 1800 : 1200) * qf;
                const bathInstHigh = (quality === "premium" ? 4000 : 2800) * qf;

                low += bathInstLow;
                high += bathInstHigh;

                breakdown.push({
                    label: "Υδραυλικά & ηλεκτρολογικά",
                    low: bathInstLow,
                    high: bathInstHigh,
                });
            }
        }

        const avg = (low + high) / 2;

        let comparisonMessage = "";

        if (quote > 0 && avg > 0) {
            const percentage = Math.round(((quote - avg) / avg) * 100);

            if (quote < low) {
                comparisonMessage = `Η προσφορά είναι ${Math.abs(percentage)}% κάτω από τον μέσο όρο`;
            } else if (quote > high) {
                comparisonMessage = `Η προσφορά είναι ${Math.abs(percentage)}% πάνω από τον μέσο όρο`;
            } else {
                comparisonMessage = `Η προσφορά είναι κοντά στον μέσο όρο (${percentage}%)`;
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

            <div className="card">
                <label>Ενότητα</label>
                <select value={section} onChange={(e) => setSection(e.target.value)}>
                    <option value="kitchen">Κουζίνα</option>
                    <option value="bathroom">Μπάνιο</option>
                </select>

                <label>Τετραγωνικά (m²)</label>
                <input
                    type="number"
                    value={sqm}
                    onChange={(e) => setSqm(e.target.value)}
                />

                <label>Ποιότητα</label>
                <select value={quality} onChange={(e) => setQuality(e.target.value)}>
                    <option value="standard">Standard</option>
                    <option value="premium">Premium</option>
                </select>

                <label>
                    <input
                        type="checkbox"
                        checked={hasBaseWorks}
                        onChange={(e) => setHasBaseWorks(e.target.checked)}
                    />
                    Βασικές εργασίες
                </label>
                {section === "kitchen" && (
                    <>
                        <label>
                            <input
                                type="checkbox"
                                checked={hasCabinets}
                                onChange={(e) => setHasCabinets(e.target.checked)}
                            />
                            Νέα ντουλάπια
                        </label>

                        <label>
                            <input
                                type="checkbox"
                                checked={hasCountertop}
                                onChange={(e) => setHasCountertop(e.target.checked)}
                            />
                            Νέος πάγκος
                        </label>

                        <label>
                            <input
                                type="checkbox"
                                checked={hasPainting}
                                onChange={(e) => setHasPainting(e.target.checked)}
                            />
                            Βάψιμο
                        </label>

                        <label>
                            <input
                                type="checkbox"
                                checked={hasFloor}
                                onChange={(e) => setHasFloor(e.target.checked)}
                            />
                            Νέο δάπεδο
                        </label>

                        <label>
                            <input
                                type="checkbox"
                                checked={hasInstallations}
                                onChange={(e) => setHasInstallations(e.target.checked)}
                            />
                            Υδραυλικά & ηλεκτρολογικά
                        </label>
                    </>
                )}

                {section === "bathroom" && (
                    <>
                        <label>
                            <input
                                type="checkbox"
                                checked={hasSanitary}
                                onChange={(e) => setHasSanitary(e.target.checked)}
                            />
                            Νέα είδη υγιεινής
                        </label>

                        <label>
                            <input
                                type="checkbox"
                                checked={hasTiles}
                                onChange={(e) => setHasTiles(e.target.checked)}
                            />
                            Νέα πλακάκια
                        </label>

                        <label>
                            <input
                                type="checkbox"
                                checked={hasBathroomPainting}
                                onChange={(e) => setHasBathroomPainting(e.target.checked)}
                            />
                            Βάψιμο
                        </label>

                        <label>
                            <input
                                type="checkbox"
                                checked={hasBathroomFloor}
                                onChange={(e) => setHasBathroomFloor(e.target.checked)}
                            />
                            Νέο δάπεδο
                        </label>

                        <label>
                            <input
                                type="checkbox"
                                checked={hasBathroomInstallations}
                                onChange={(e) => setHasBathroomInstallations(e.target.checked)}
                            />
                            Υδραυλικά & ηλεκτρολογικά
                        </label>
                    </>
                )}

                <button onClick={calculateEstimate}>Υπολογισμός</button>
            </div>

            {result && (
                <div className="result-card">
                    <h2>💰 Εκτιμώμενο κόστος</h2>

                    <p className="price">
                        {result.low.toLocaleString("el-GR")} € —{" "}
                        {result.high.toLocaleString("el-GR")} €
                    </p>

                    <ul>
                        {result.breakdown.map((item, i) => (
                            <li key={i}>
                                {item.label}: {Math.round(item.low)}€ -{" "}
                                {Math.round(item.high)}€
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}