import { useState } from "react";
import "./App.css";
import { costData } from "./costData";

export default function App() {
    const [section, setSection] = useState("kitchen");
    const [sqm, setSqm] = useState("");
    const [quality, setQuality] = useState("standard");
    const [region, setRegion] = useState("athens");

    // Κοινό
    const [hasPrep, setHasPrep] = useState(true);

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
    const [hasBathroomInstallations, setHasBathroomInstallations] =
        useState(false);

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
        const rf = costData.regionFactor[region] || 1;

        let low = 0;
        let high = 0;
        const breakdown = [];

        if (hasPrep) {
            const prepLow = area * 20 * qf;
            const prepHigh = area * 50 * qf;

            low += prepLow;
            high += prepHigh;

            breakdown.push({
                label: "Αποξήλωση & προετοιμασία",
                low: prepLow,
                high: prepHigh,
            });
        }

        if (section === "kitchen") {
            if (hasCabinets) {
                const cabinetsLow = quality === "premium" ? 7000 : 5000;
                const cabinetsHigh = quality === "premium" ? 14000 : 9000;

                low += cabinetsLow;
                high += cabinetsHigh;

                breakdown.push({
                    label: "Νέα ντουλάπια",
                    low: cabinetsLow,
                    high: cabinetsHigh,
                });
            }

            if (hasCountertop) {
                const countertopLow = quality === "premium" ? 5000 : 3500;
                const countertopHigh = quality === "premium" ? 10000 : 7000;

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
                const instLow = quality === "premium" ? 1500 : 1200;
                const instHigh = quality === "premium" ? 3500 : 2500;

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
                const sanitaryLow = quality === "premium" ? 3500 : 2200;
                const sanitaryHigh = quality === "premium" ? 7000 : 4500;

                low += sanitaryLow;
                high += sanitaryHigh;

                breakdown.push({
                    label: "Νέα είδη υγιεινής",
                    low: sanitaryLow,
                    high: sanitaryHigh,
                });
            }

            if (hasTiles) {
                const tilesLow = area * (quality === "premium" ? 90 : 55);
                const tilesHigh = area * (quality === "premium" ? 160 : 110);

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
                const bathInstLow = quality === "premium" ? 1800 : 1200;
                const bathInstHigh = quality === "premium" ? 4000 : 2800;

                low += bathInstLow;
                high += bathInstHigh;

                breakdown.push({
                    label: "Υδραυλικά & ηλεκτρολογικά",
                    low: bathInstLow,
                    high: bathInstHigh,
                });
            }
        }

        let daysLow = 3;
        let daysHigh = 7;

        if (section === "kitchen") {
            daysLow = 7;
            daysHigh = 15;

            if (hasCabinets && hasCountertop && hasFloor) {
                daysHigh = 20;
            }
        }

        if (section === "bathroom") {
            daysLow = 5;
            daysHigh = 12;

            if (hasTiles && hasSanitary && hasBathroomInstallations) {
                daysHigh = 18;
            }
        }

        low *= rf;
        high *= rf;

        const lowWithVat = low * 1.24;
        const highWithVat = high * 1.24;
        const avgWithVat = (lowWithVat + highWithVat) / 2;

        let comparisonMessage = "";
        let status = "";

        if (quote > 0 && avgWithVat > 0) {
            const percentage = Math.round(((quote - avgWithVat) / avgWithVat) * 100);

            if (quote < lowWithVat) {
                comparisonMessage = `Η προσφορά είναι ${Math.abs(
                    percentage
                )}% κάτω από τον μέσο όρο`;
                status = "cheap";
            } else if (quote > highWithVat) {
                comparisonMessage = `Η προσφορά είναι ${Math.abs(
                    percentage
                )}% πάνω από τον μέσο όρο`;
                status = "expensive";
            } else {
                comparisonMessage = `Η προσφορά είναι κοντά στον μέσο όρο (${percentage}%)`;
                status = "normal";
            }
        }

        setResult({
            low: Math.round(lowWithVat),
            high: Math.round(highWithVat),
            avg: Math.round(avgWithVat),
            avgPerSqmLow: Math.round(lowWithVat / area),
            avgPerSqmHigh: Math.round(highWithVat / area),
            breakdown,
            quote: quote > 0 ? quote : null,
            comparisonMessage,
            status,
            duration: `${daysLow} - ${daysHigh} ημέρες`,
            vatIncluded: true,
        });
    }

    return (
        <div className="container">
            <h1>Cost Check</h1>
            <p>
                Υπολόγισε ενδεικτικό κόστος ανακαίνισης για κουζίνα ή μπάνιο και
                σύγκρινε την προσφορά που πήρες.
            </p>

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
                    placeholder="π.χ. 12"
                />

                <label>Ποιότητα</label>
                <select value={quality} onChange={(e) => setQuality(e.target.value)}>
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
                        checked={hasPrep}
                        onChange={(e) => setHasPrep(e.target.checked)}
                    />
                    Αποξήλωση & προετοιμασία
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

                <label>Προσφορά εργολάβου (€) - προαιρετικά</label>
                <input
                    type="number"
                    value={userQuote}
                    onChange={(e) => setUserQuote(e.target.value)}
                    placeholder="π.χ. 8500"
                />

                <button onClick={calculateEstimate}>Υπολογισμός</button>

                <p
                    style={{
                        fontSize: "13px",
                        color: "#666",
                        marginTop: "10px",
                        lineHeight: "1.4",
                    }}
                >
                    Οι τελικές τιμές εμφανίζονται με ΦΠΑ 24%.
                </p>
            </div>

            {result && (
                <div className="result-card">
                    <h2>💰 Εκτιμώμενο κόστος</h2>

                    <p className="price">
                        {result.low.toLocaleString("el-GR")} € —{" "}
                        {result.high.toLocaleString("el-GR")} €
                    </p>

                    <p>Μέσο κόστος: {result.avg.toLocaleString("el-GR")} €</p>

                    <p>
                        €/m²: {result.avgPerSqmLow} - {result.avgPerSqmHigh}
                    </p>

                    <p>Εκτιμώμενη διάρκεια: {result.duration}</p>

                    {result.quote && (
                        <>
                            <p
                                style={{
                                    marginTop: "16px",
                                    fontWeight: "bold",
                                    color:
                                        result.status === "cheap"
                                            ? "green"
                                            : result.status === "expensive"
                                                ? "red"
                                                : "orange",
                                }}
                            >
                                {result.status === "cheap" && "🟢 Πιθανόν χαμηλή τιμή"}
                                {result.status === "normal" && "🟠 Λογική τιμή"}
                                {result.status === "expensive" && "🔴 Πιθανόν ακριβή"}
                            </p>

                            <p style={{ fontWeight: "bold" }}>
                                Προσφορά: {result.quote.toLocaleString("el-GR")} € →{" "}
                                {result.comparisonMessage}
                            </p>
                        </>
                    )}

                    <h3>Ανάλυση</h3>
                    <ul>
                        {result.breakdown.map((item, i) => (
                            <li key={i}>
                                {item.label}: {Math.round(item.low)}€ - {Math.round(item.high)}€
                            </li>
                        ))}
                    </ul>

                    <p
                        style={{
                            fontSize: "13px",
                            color: "#666",
                            marginTop: "12px",
                        }}
                    >
                        * Το συνολικό αποτέλεσμα υπολογίζεται με βάση την περιοχή και
                        περιλαμβάνει ΦΠΑ 24%.
                    </p>

                    <p className="note">
                        ⚠️ Δεν περιλαμβάνονται συσκευές, άδειες, μηχανικός, στατικές
                        παρεμβάσεις και απρόβλεπτες ζημιές.
                    </p>
                </div>
            )}
        </div>
    );
}