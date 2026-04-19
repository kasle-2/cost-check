import { useState } from "react";
import "./App.css";
import { costData } from "./costData";

export default function App() {
    const [section, setSection] = useState("kitchen");
    const [sqm, setSqm] = useState("");
    const [propertyType, setPropertyType] = useState("apartment");
    const [renovationType, setRenovationType] = useState("partial");
    const [quality, setQuality] = useState("standard");
    const [region, setRegion] = useState("athens");

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

        const base = costData.renovationBase[renovationType];
        const qf = costData.qualityFactor[quality];

        let low = area * base.low * qf;
        let high = area * base.high * qf;

        const breakdown = [
            {
                label: "Βασικές εργασίες",
                low,
                high,
            },
        ];

        if (section === "kitchen") {
            if (hasCabinets) {
                const cabinetsLow =
                    quality === "premium" ? 7000 : quality === "basic" ? 3000 : 5000;
                const cabinetsHigh =
                    quality === "premium" ? 14000 : quality === "basic" ? 6000 : 9000;

                low += cabinetsLow;
                high += cabinetsHigh;

                breakdown.push({
                    label: "Νέα ντουλάπια",
                    low: cabinetsLow,
                    high: cabinetsHigh,
                });
            }

            if (hasCountertop) {
                const countertopLow =
                    quality === "premium" ? 5000 : quality === "basic" ? 2500 : 3500;
                const countertopHigh =
                    quality === "premium" ? 10000 : quality === "basic" ? 5000 : 7000;

                low += countertopLow;
                high += countertopHigh;

                breakdown.push({
                    label: "Νέος πάγκος",
                    low: countertopLow,
                    high: countertopHigh,
                });
            }

            if (hasPainting) {
                const paintLow = area * 10;
                const paintHigh = area * 20;

                low += paintLow;
                high += paintHigh;

                breakdown.push({
                    label: "Βάψιμο",
                    low: paintLow,
                    high: paintHigh,
                });
            }

            if (hasFloor) {
                const floorLow = area * 30;
                const floorHigh = area * 80;

                low += floorLow;
                high += floorHigh;

                breakdown.push({
                    label: "Νέο δάπεδο",
                    low: floorLow,
                    high: floorHigh,
                });
            }

            if (hasInstallations) {
                const instLow = 800;
                const instHigh = 2500;

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
                const sanitaryLow =
                    quality === "premium" ? 3500 : quality === "basic" ? 1200 : 2200;
                const sanitaryHigh =
                    quality === "premium" ? 7000 : quality === "basic" ? 2500 : 4500;

                low += sanitaryLow;
                high += sanitaryHigh;

                breakdown.push({
                    label: "Νέα είδη υγιεινής",
                    low: sanitaryLow,
                    high: sanitaryHigh,
                });
            }

            if (hasTiles) {
                const tilesLow = area * (quality === "premium" ? 90 : quality === "basic" ? 35 : 55);
                const tilesHigh = area * (quality === "premium" ? 160 : quality === "basic" ? 70 : 110);

                low += tilesLow;
                high += tilesHigh;

                breakdown.push({
                    label: "Νέα πλακάκια",
                    low: tilesLow,
                    high: tilesHigh,
                });
            }

            if (hasBathroomPainting) {
                const bathPaintLow = area * 12;
                const bathPaintHigh = area * 25;

                low += bathPaintLow;
                high += bathPaintHigh;

                breakdown.push({
                    label: "Βάψιμο",
                    low: bathPaintLow,
                    high: bathPaintHigh,
                });
            }

            if (hasBathroomFloor) {
                const bathFloorLow = area * 35;
                const bathFloorHigh = area * 90;

                low += bathFloorLow;
                high += bathFloorHigh;

                breakdown.push({
                    label: "Νέο δάπεδο",
                    low: bathFloorLow,
                    high: bathFloorHigh,
                });
            }

            if (hasBathroomInstallations) {
                const bathInstLow =
                    quality === "premium" ? 1800 : quality === "basic" ? 700 : 1200;
                const bathInstHigh =
                    quality === "premium" ? 4000 : quality === "basic" ? 1800 : 2800;

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
        let percentage = 0;

        if (quote > 0) {
            percentage = Math.round(((quote - avg) / avg) * 100);

            if (quote < low) {
                comparisonMessage = `Η προσφορά είναι ${Math.abs(
                    percentage
                )}% κάτω από τον μέσο όρο`;
            } else if (quote > high) {
                comparisonMessage = `Η προσφορά είναι ${Math.abs(
                    percentage
                )}% πάνω από τον μέσο όρο`;
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

            <p>
                {section === "kitchen"
                    ? "Υπολογισμός κόστους ανακαίνισης κουζίνας"
                    : "Υπολογισμός κόστους ανακαίνισης μπάνιου"}
            </p>

            <div className="card">
                <label>Ενότητα</label>
                <select value={section} onChange={(e) => setSection(e.target.value)}>
                    <option value="kitchen">Κουζίνα</option>
                    <option value="bathroom">Μπάνιο</option>
                </select>

                <label>
                    {section === "kitchen"
                        ? "Τετραγωνικά κουζίνας (m²)"
                        : "Τετραγωνικά μπάνιου (m²)"}
                </label>
                <input
                    type="number"
                    value={sqm}
                    onChange={(e) => setSqm(e.target.value)}
                />

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
                    <h2>
                        💰 Εκτιμώμενο κόστος{" "}
                        {section === "kitchen" ? "κουζίνας" : "μπάνιου"}
                    </h2>

                    <p className="price">
                        {result.low.toLocaleString("el-GR")} € —{" "}
                        {result.high.toLocaleString("el-GR")} €
                    </p>

                    <p>Μέσο κόστος: {result.avg.toLocaleString("el-GR")} €</p>

                    <p>
                        €/m²: {result.avgPerSqmLow} - {result.avgPerSqmHigh}
                    </p>

                    <p className="note">
                        Η εκτίμηση βασίζεται σε ενδεικτικές τιμές αγοράς και δεν αποτελεί
                        δεσμευτική προσφορά.
                    </p>

                    <h3>Ανάλυση</h3>
                    <ul>
                        {result.breakdown.map((item, i) => (
                            <li key={i}>
                                {item.label}: {Math.round(item.low)}€ - {Math.round(item.high)}€
                            </li>
                        ))}
                    </ul>

                    {result.quote && (
                        <p
                            style={{
                                marginTop: "20px",
                                fontWeight: "bold",
                                color:
                                    result.quote < result.low
                                        ? "green"
                                        : result.quote > result.high
                                            ? "red"
                                            : "#2563eb",
                            }}
                        >
                            Προσφορά: {result.quote.toLocaleString("el-GR")} € →{" "}
                            {result.comparisonMessage}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}