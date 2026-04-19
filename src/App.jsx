import { useState } from "react";
import "./App.css";
import { calculateEstimateResult } from "./estimate";

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
    const [hasBathroomInstallations, setHasBathroomInstallations] = useState(false);

    const [userQuote, setUserQuote] = useState("");
    const [result, setResult] = useState(null);

    function calculateEstimate() {
        const estimate = calculateEstimateResult({
            section,
            sqm,
            quality,
            region,
            hasPrep,
            hasCabinets,
            hasCountertop,
            hasPainting,
            hasFloor,
            hasInstallations,
            hasSanitary,
            hasTiles,
            hasBathroomPainting,
            hasBathroomInstallations,
            userQuote,
        });

        if (estimate.error) {
            alert(estimate.error);
            return;
        }

        setResult(estimate);
    }

    return (
        <div className="container">
            <h1>Cost Check</h1>

            <p className="intro-text">
                Υπολόγισε ενδεικτικό κόστος ανακαίνισης για κουζίνα ή μπάνιο και
                σύγκρινε την προσφορά που πήρες.
            </p>

            <div className="card">
                <label className="field-label">Χώρος</label>
                <select value={section} onChange={(e) => setSection(e.target.value)}>
                    <option value="kitchen">Κουζίνα</option>
                    <option value="bathroom">Μπάνιο</option>
                </select>

                <label className="field-label">Τετραγωνικά (m²)</label>
                <input
                    type="number"
                    value={sqm}
                    onChange={(e) => setSqm(e.target.value)}
                    placeholder="π.χ. 12"
                />

                <label className="field-label">Ποιότητα</label>
                <select value={quality} onChange={(e) => setQuality(e.target.value)}>
                    <option value="standard">Standard</option>
                    <option value="premium">Premium</option>
                </select>

                <label className="field-label">Περιοχή</label>
                <select value={region} onChange={(e) => setRegion(e.target.value)}>
                    <option value="athens">Αθήνα</option>
                    <option value="thessaloniki">Θεσσαλονίκη</option>
                    <option value="other">Υπόλοιπη Ελλάδα</option>
                </select>

                <div className="options-group">
                    <label className="checkbox-row">
                        <span>Αποξήλωση & προετοιμασία</span>
                        <input
                            type="checkbox"
                            checked={hasPrep}
                            onChange={(e) => setHasPrep(e.target.checked)}
                        />
                    </label>

                    {section === "kitchen" && (
                        <>
                            <label className="checkbox-row">
                                <span>Νέα ντουλάπια</span>
                                <input
                                    type="checkbox"
                                    checked={hasCabinets}
                                    onChange={(e) => setHasCabinets(e.target.checked)}
                                />
                            </label>

                            <label className="checkbox-row">
                                <span>Νέος πάγκος</span>
                                <input
                                    type="checkbox"
                                    checked={hasCountertop}
                                    onChange={(e) => setHasCountertop(e.target.checked)}
                                />
                            </label>

                            <label className="checkbox-row">
                                <span>Βάψιμο</span>
                                <input
                                    type="checkbox"
                                    checked={hasPainting}
                                    onChange={(e) => setHasPainting(e.target.checked)}
                                />
                            </label>

                            <label className="checkbox-row">
                                <span>Νέο δάπεδο</span>
                                <input
                                    type="checkbox"
                                    checked={hasFloor}
                                    onChange={(e) => setHasFloor(e.target.checked)}
                                />
                            </label>

                            <label className="checkbox-row">
                                <span>Υδραυλικά & ηλεκτρολογικά</span>
                                <input
                                    type="checkbox"
                                    checked={hasInstallations}
                                    onChange={(e) => setHasInstallations(e.target.checked)}
                                />
                            </label>
                        </>
                    )}

                    {section === "bathroom" && (
                        <>
                            <label className="checkbox-row">
                                <span>Νέα είδη υγιεινής</span>
                                <input
                                    type="checkbox"
                                    checked={hasSanitary}
                                    onChange={(e) => setHasSanitary(e.target.checked)}
                                />
                            </label>

                            <label className="checkbox-row">
                                <span>Νέα πλακάκια (τοίχος + δάπεδο)</span>
                                <input
                                    type="checkbox"
                                    checked={hasTiles}
                                    onChange={(e) => setHasTiles(e.target.checked)}
                                />
                            </label>

                            <label className="checkbox-row">
                                <span>Βάψιμο</span>
                                <input
                                    type="checkbox"
                                    checked={hasBathroomPainting}
                                    onChange={(e) => setHasBathroomPainting(e.target.checked)}
                                />
                            </label>

                            <label className="checkbox-row">
                                <span>Υδραυλικά & ηλεκτρολογικά</span>
                                <input
                                    type="checkbox"
                                    checked={hasBathroomInstallations}
                                    onChange={(e) =>
                                        setHasBathroomInstallations(e.target.checked)
                                    }
                                />
                            </label>
                        </>
                    )}
                </div>

                <label className="field-label">
                    Προσφορά εργολάβου (€) - προαιρετικά
                </label>
                <input
                    type="number"
                    value={userQuote}
                    onChange={(e) => setUserQuote(e.target.value)}
                    placeholder="π.χ. 8500"
                />

                <button onClick={calculateEstimate}>Υπολογισμός</button>

                <p className="small-note">
                    Οι τελικές τιμές περιλαμβάνουν ΦΠΑ 24%.
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
                                {item.label}: {Math.round(item.low)}€ -{" "}
                                {Math.round(item.high)}€
                            </li>
                        ))}
                    </ul>

                    <p className="note">
                        ⚠️ Δεν περιλαμβάνονται συσκευές, άδειες, μηχανικός, στατικές
                        παρεμβάσεις και απρόβλεπτες ζημιές.
                    </p>
                </div>
            )}
        </div>
    );
}