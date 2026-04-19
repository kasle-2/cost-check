import { useState } from "react";
import "./App.css";
import { calculateEstimateResult } from "./estimate";

export default function App() {
    const [form, setForm] = useState({
        section: "kitchen",
        sqm: "",
        quality: "standard",
        region: "athens",

        hasPrep: true,

        hasCabinets: true,
        hasCountertop: true,
        hasPainting: false,
        hasFloor: false,
        hasInstallations: false,

        hasSanitary: true,
        hasTiles: true,
        hasBathroomPainting: false,
        hasBathroomInstallations: false,

        userQuote: "",
    });

    const [result, setResult] = useState(null);

    function updateField(name, value) {
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    function calculateEstimate() {
        const estimate = calculateEstimateResult(form);

        if (estimate.error) {
            alert(estimate.error);
            return;
        }

        setResult(estimate);
    }

    function getStatusStyles(status) {
        if (status === "cheap") {
            return {
                background: "#dcfce7",
                color: "#166534",
                text: "🟢 Χαμηλή τιμή",
            };
        }

        if (status === "expensive") {
            return {
                background: "#fee2e2",
                color: "#991b1b",
                text: "🔴 Ακριβή τιμή",
            };
        }

        return {
            background: "#fef3c7",
            color: "#92400e",
            text: "🟠 Λογική τιμή",
        };
    }

    const statusBox = getStatusStyles(result?.status);

    return (
        <div className="container">
            <h1>Cost Check</h1>

            <p className="intro-text">
                Δες σε 30'' αν η προσφορά που πήρες είναι λογική ή ακριβή.
            </p>

            <div className="card">
                <label className="field-label">Χώρος</label>
                <select
                    value={form.section}
                    onChange={(e) => updateField("section", e.target.value)}
                >
                    <option value="kitchen">Κουζίνα</option>
                    <option value="bathroom">Μπάνιο</option>
                </select>

                <label className="field-label">Τετραγωνικά (m²)</label>
                <input
                    type="number"
                    value={form.sqm}
                    onChange={(e) => updateField("sqm", e.target.value)}
                    placeholder="π.χ. 12"
                />

                <label className="field-label">Ποιότητα</label>
                <select
                    value={form.quality}
                    onChange={(e) => updateField("quality", e.target.value)}
                >
                    <option value="standard">Standard</option>
                    <option value="premium">Premium</option>
                </select>

                <label className="field-label">Περιοχή</label>
                <select
                    value={form.region}
                    onChange={(e) => updateField("region", e.target.value)}
                >
                    <option value="athens">Αθήνα</option>
                    <option value="thessaloniki">Θεσσαλονίκη</option>
                    <option value="other">Υπόλοιπη Ελλάδα</option>
                </select>

                <div className="options-group">
                    <label className="checkbox-row">
                        <span>Αποξήλωση & προετοιμασία</span>
                        <input
                            type="checkbox"
                            checked={form.hasPrep}
                            onChange={(e) => updateField("hasPrep", e.target.checked)}
                        />
                    </label>

                    {form.section === "kitchen" && (
                        <>
                            <label className="checkbox-row">
                                <span>Νέα ντουλάπια</span>
                                <input
                                    type="checkbox"
                                    checked={form.hasCabinets}
                                    onChange={(e) => updateField("hasCabinets", e.target.checked)}
                                />
                            </label>

                            <label className="checkbox-row">
                                <span>Νέος πάγκος</span>
                                <input
                                    type="checkbox"
                                    checked={form.hasCountertop}
                                    onChange={(e) =>
                                        updateField("hasCountertop", e.target.checked)
                                    }
                                />
                            </label>

                            <label className="checkbox-row">
                                <span>Βάψιμο</span>
                                <input
                                    type="checkbox"
                                    checked={form.hasPainting}
                                    onChange={(e) => updateField("hasPainting", e.target.checked)}
                                />
                            </label>

                            <label className="checkbox-row">
                                <span>Νέο δάπεδο</span>
                                <input
                                    type="checkbox"
                                    checked={form.hasFloor}
                                    onChange={(e) => updateField("hasFloor", e.target.checked)}
                                />
                            </label>

                            <label className="checkbox-row">
                                <span>Υδραυλικά & ηλεκτρολογικά</span>
                                <input
                                    type="checkbox"
                                    checked={form.hasInstallations}
                                    onChange={(e) =>
                                        updateField("hasInstallations", e.target.checked)
                                    }
                                />
                            </label>
                        </>
                    )}

                    {form.section === "bathroom" && (
                        <>
                            <label className="checkbox-row">
                                <span>Νέα είδη υγιεινής</span>
                                <input
                                    type="checkbox"
                                    checked={form.hasSanitary}
                                    onChange={(e) => updateField("hasSanitary", e.target.checked)}
                                />
                            </label>

                            <label className="checkbox-row">
                                <span>Νέα πλακάκια (τοίχος + δάπεδο)</span>
                                <input
                                    type="checkbox"
                                    checked={form.hasTiles}
                                    onChange={(e) => updateField("hasTiles", e.target.checked)}
                                />
                            </label>

                            <label className="checkbox-row">
                                <span>Βάψιμο</span>
                                <input
                                    type="checkbox"
                                    checked={form.hasBathroomPainting}
                                    onChange={(e) =>
                                        updateField("hasBathroomPainting", e.target.checked)
                                    }
                                />
                            </label>

                            <label className="checkbox-row">
                                <span>Υδραυλικά & ηλεκτρολογικά</span>
                                <input
                                    type="checkbox"
                                    checked={form.hasBathroomInstallations}
                                    onChange={(e) =>
                                        updateField("hasBathroomInstallations", e.target.checked)
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
                    value={form.userQuote}
                    onChange={(e) => updateField("userQuote", e.target.value)}
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

                    <p
                        style={{
                            fontSize: "18px",
                            fontWeight: "bold",
                            marginBottom: "8px",
                            color: "#111827",
                        }}
                    >
                        Εκτίμηση αγοράς: {result.low.toLocaleString("el-GR")} € -{" "}
                        {result.high.toLocaleString("el-GR")} €
                    </p>

                    <p
                        style={{
                            color: "#6b7280",
                            marginTop: "0",
                            marginBottom: "16px",
                        }}
                    >
                        Συνήθης τιμή: περίπου {result.avg.toLocaleString("el-GR")} €
                    </p>

                    <p>Εκτιμώμενη διάρκεια: {result.duration}</p>

                    {result.quote && (
                        <>
                            <div
                                style={{
                                    marginTop: "16px",
                                    padding: "12px",
                                    borderRadius: "10px",
                                    fontWeight: "bold",
                                    background: statusBox.background,
                                    color: statusBox.color,
                                }}
                            >
                                {statusBox.text}
                            </div>

                            <p style={{ fontWeight: "bold", marginTop: "12px" }}>
                                Προσφορά: {result.quote.toLocaleString("el-GR")} € →{" "}
                                {result.comparisonMessage}
                            </p>
                        </>
                    )}

                    <h3>Ανάλυση κόστους</h3>
                    <ul>
                        {result.breakdown.map((item, i) => (
                            <li key={i}>
                                {item.label}: {Math.round(item.low)}€ -{" "}
                                {Math.round(item.high)}€
                            </li>
                        ))}
                    </ul>

                    <p className="note">
                        ⚠️ Οι τιμές είναι ενδεικτικές και βασίζονται σε μέσες τιμές
                        αγοράς. Δεν αποτελούν δεσμευτική προσφορά.
                    </p>

                    <p className="note">
                        Δεν περιλαμβάνονται συσκευές, άδειες, μηχανικός, στατικές
                        παρεμβάσεις και απρόβλεπτες ζημιές.
                    </p>
                </div>
            )}
        </div>
    );
}