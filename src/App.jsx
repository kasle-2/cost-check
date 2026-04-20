import { useState } from "react";
import "./App.css";
import { calculateEstimateResult } from "./estimate";

function TermsSection() {
    return (
        <div className="terms-box">
            <h3>Όροι χρήσης</h3>

            <p>
                Το εργαλείο παρέχει ενδεικτικές εκτιμήσεις κόστους ανακαίνισης
                για ενημερωτικούς σκοπούς.
            </p>

            <p>
                Οι υπολογισμοί βασίζονται σε γενικές παραδοχές και μέσες τιμές
                αγοράς και δεν αποτελούν δεσμευτική οικονομική ή τεχνική προσφορά.
            </p>

            <p>
                Η τελική τιμή εξαρτάται από το έργο, τα υλικά, την περιοχή και
                τον ανάδοχο.
            </p>

            <p>
                Το εργαλείο δεν αντικαθιστά επαγγελματική εκτίμηση μηχανικού ή
                εργολάβου.
            </p>
        </div>
    );
}

export default function App() {
    const [form, setForm] = useState({
        section: "kitchen",
        sqm: "",
        region: "athens",

        hasPrep: true,

        hasCabinets: true,
        cabinetMaterial: "melamine",

        hasCountertop: true,
        countertopMaterial: "laminate",

        hasPainting: false,

        hasFloor: false,
        floorMaterial: "tile",

        hasInstallations: false,

        hasSanitary: true,
        sanitaryQuality: "standard",
        sanitaryType: "shower",

        hasBathroomPainting: false,
        hasBathroomInstallations: false,

        quote1: "",
        quote2: "",
        quote3: "",
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

    function copyResults() {
        if (!result) return;

        const quotesText =
            result.quoteComparisons?.length > 0
                ? result.quoteComparisons
                    .map(
                        (item) =>
                            `Προσφορά ${item.index}: ${item.quote.toLocaleString(
                                "el-GR"
                            )}€ - ${item.comparisonMessage}`
                    )
                    .join("\n")
                : "Δεν έχουν δοθεί προσφορές.";

        const text = `
Εκτίμηση ανακαίνισης

Χώρος: ${form.section === "kitchen" ? "Κουζίνα" : "Μπάνιο"}
Τετραγωνικά: ${form.sqm} m²
Περιοχή: ${
            form.region === "athens"
                ? "Αθήνα"
                : form.region === "thessaloniki"
                    ? "Θεσσαλονίκη"
                    : "Υπόλοιπη Ελλάδα"
        }

Εκτιμώμενο εύρος: ${result.low.toLocaleString("el-GR")}€ - ${result.high.toLocaleString("el-GR")}€
Μέσο κόστος: ${result.avg.toLocaleString("el-GR")}€
Διάρκεια: ${result.duration}

Σύγκριση προσφορών:
${quotesText}

${result.bestQuoteMessage || ""}
        `.trim();

        navigator.clipboard.writeText(text);
        alert("Αντιγράφηκε στο clipboard!");
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
                                    onChange={(e) =>
                                        updateField("hasCabinets", e.target.checked)
                                    }
                                />
                            </label>

                            {form.hasCabinets && (
                                <>
                                    <label className="field-label">Υλικό ντουλαπιών</label>
                                    <select
                                        value={form.cabinetMaterial}
                                        onChange={(e) =>
                                            updateField("cabinetMaterial", e.target.value)
                                        }
                                    >
                                        <option value="melamine">Μελαμίνη</option>
                                        <option value="mdf">MDF</option>
                                        <option value="lacquer">Λάκα</option>
                                    </select>
                                </>
                            )}

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

                            {form.hasCountertop && (
                                <>
                                    <label className="field-label">Υλικό πάγκου</label>
                                    <select
                                        value={form.countertopMaterial}
                                        onChange={(e) =>
                                            updateField("countertopMaterial", e.target.value)
                                        }
                                    >
                                        <option value="laminate">Laminate</option>
                                        <option value="quartz">Quartz</option>
                                        <option value="granite">Granite</option>
                                        <option value="corian">Corian</option>
                                    </select>
                                </>
                            )}

                            <label className="checkbox-row">
                                <span>Βάψιμο</span>
                                <input
                                    type="checkbox"
                                    checked={form.hasPainting}
                                    onChange={(e) =>
                                        updateField("hasPainting", e.target.checked)
                                    }
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

                            {form.hasFloor && (
                                <>
                                    <label className="field-label">Υλικό δαπέδου</label>
                                    <select
                                        value={form.floorMaterial}
                                        onChange={(e) =>
                                            updateField("floorMaterial", e.target.value)
                                        }
                                    >
                                        <option value="tile">Πλακάκι</option>
                                        <option value="marble">Μάρμαρο</option>
                                        <option value="wood">Ξύλο / Laminate</option>
                                        <option value="vinyl">Βινυλικό</option>
                                    </select>
                                </>
                            )}

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
                                    onChange={(e) =>
                                        updateField("hasSanitary", e.target.checked)
                                    }
                                />
                            </label>

                            {form.hasSanitary && (
                                <>
                                    <label className="field-label">
                                        Ποιότητα ειδών υγιεινής
                                    </label>
                                    <select
                                        value={form.sanitaryQuality}
                                        onChange={(e) =>
                                            updateField("sanitaryQuality", e.target.value)
                                        }
                                    >
                                        <option value="standard">Standard</option>
                                        <option value="premium">Premium</option>
                                    </select>

                                    <label className="field-label">Τύπος</label>
                                    <select
                                        value={form.sanitaryType}
                                        onChange={(e) =>
                                            updateField("sanitaryType", e.target.value)
                                        }
                                    >
                                        <option value="shower">Ντουζιέρα</option>
                                        <option value="bathtub">Μπανιέρα</option>
                                    </select>
                                </>
                            )}

                            <label className="checkbox-row">
                                <span>Νέο δάπεδο</span>
                                <input
                                    type="checkbox"
                                    checked={form.hasFloor}
                                    onChange={(e) => updateField("hasFloor", e.target.checked)}
                                />
                            </label>

                            {form.hasFloor && (
                                <>
                                    <label className="field-label">Υλικό δαπέδου</label>
                                    <select
                                        value={form.floorMaterial}
                                        onChange={(e) =>
                                            updateField("floorMaterial", e.target.value)
                                        }
                                    >
                                        <option value="tile">Πλακάκι</option>
                                        <option value="marble">Μάρμαρο</option>
                                        <option value="vinyl">Βινυλικό</option>
                                    </select>
                                </>
                            )}

                            <label className="checkbox-row">
                                <span>Βάψιμο</span>
                                <input
                                    type="checkbox"
                                    checked={form.hasBathroomPainting}
                                    onChange={(e) =>
                                        updateField(
                                            "hasBathroomPainting",
                                            e.target.checked
                                        )
                                    }
                                />
                            </label>

                            <label className="checkbox-row">
                                <span>Υδραυλικά & ηλεκτρολογικά</span>
                                <input
                                    type="checkbox"
                                    checked={form.hasBathroomInstallations}
                                    onChange={(e) =>
                                        updateField(
                                            "hasBathroomInstallations",
                                            e.target.checked
                                        )
                                    }
                                />
                            </label>
                        </>
                    )}
                </div>

                <label className="field-label">Προσφορά 1 (€) - προαιρετικά</label>
                <input
                    type="number"
                    value={form.quote1}
                    onChange={(e) => updateField("quote1", e.target.value)}
                    placeholder="π.χ. 8500"
                />

                <label className="field-label">Προσφορά 2 (€) - προαιρετικά</label>
                <input
                    type="number"
                    value={form.quote2}
                    onChange={(e) => updateField("quote2", e.target.value)}
                    placeholder="π.χ. 9200"
                />

                <label className="field-label">Προσφορά 3 (€) - προαιρετικά</label>
                <input
                    type="number"
                    value={form.quote3}
                    onChange={(e) => updateField("quote3", e.target.value)}
                    placeholder="π.χ. 7800"
                />

                <button onClick={calculateEstimate}>Υπολογισμός</button>

                <p className="small-note">
                    Οι τιμές περιλαμβάνουν υλικά, εργασία και ΦΠΑ 24%.
                </p>
            </div>

            {result && (
                <div className="result-card">
                    {result.warning && (
                        <div
                            style={{
                                background: "#fef3c7",
                                color: "#92400e",
                                padding: "10px",
                                borderRadius: "8px",
                                marginBottom: "12px",
                                fontWeight: "bold",
                            }}
                        >
                            ⚠️ {result.warning}
                        </div>
                    )}

                    <h2>💰 Εκτιμώμενο κόστος</h2>

                    <p className="price">
                        {result.low.toLocaleString("el-GR")} € —{" "}
                        {result.high.toLocaleString("el-GR")} €
                    </p>

                    <p>Μέσο κόστος: {result.avg.toLocaleString("el-GR")} €</p>
                    <p>Εκτιμώμενη διάρκεια: {result.duration}</p>

                    <h3>Γιατί βγήκε αυτή η τιμή</h3>
                    <ul>
                        {form.hasCabinets && (
                            <li>Τα ντουλάπια επηρεάζουν σημαντικά το συνολικό κόστος.</li>
                        )}
                        {form.hasCountertop && (
                            <li>Ο πάγκος είναι βασικός παράγοντας κόστους.</li>
                        )}
                        {form.hasFloor && (
                            <li>Το δάπεδο αυξάνει το συνολικό budget.</li>
                        )}
                        {form.hasInstallations && form.section === "kitchen" && (
                            <li>Τα υδραυλικά και ηλεκτρολογικά ανεβάζουν το έργο.</li>
                        )}
                        {form.hasSanitary && form.section === "bathroom" && (
                            <li>Τα είδη υγιεινής επηρεάζουν έντονα το τελικό εύρος.</li>
                        )}
                        {form.hasBathroomInstallations &&
                            form.section === "bathroom" && (
                                <li>
                                    Οι παρεμβάσεις σε υδραυλικά και ηλεκτρολογικά αυξάνουν
                                    το κόστος.
                                </li>
                            )}
                        <li>Η περιοχή του έργου επηρεάζει τις τιμές αγοράς και εργασίας.</li>
                    </ul>

                    {result.quoteComparisons?.length > 0 && (
                        <>
                            <h3>Σύγκριση προσφορών</h3>

                            {result.quoteComparisons.map((item, index) => {
                                const styles = getStatusStyles(item.status);

                                return (
                                    <div
                                        key={index}
                                        style={{
                                            marginTop: "12px",
                                            padding: "12px",
                                            borderRadius: "10px",
                                            background: styles.background,
                                            color: styles.color,
                                        }}
                                    >
                                        <div style={{ fontWeight: "bold" }}>
                                            Προσφορά {item.index}:{" "}
                                            {item.quote.toLocaleString("el-GR")} €
                                        </div>
                                        <div>{styles.text}</div>
                                        <div style={{ marginTop: "6px" }}>
                                            {item.comparisonMessage}
                                        </div>
                                    </div>
                                );
                            })}

                            {result.bestQuoteMessage && (
                                <p style={{ fontWeight: "bold", marginTop: "14px" }}>
                                    {result.bestQuoteMessage}
                                </p>
                            )}
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

                    <button onClick={copyResults} style={{ marginTop: "15px" }}>
                        📋 Αντιγραφή αποτελέσματος
                    </button>

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

            <TermsSection />
        </div>
    );
}