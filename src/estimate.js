import { costData } from "./costData";

export function calculateEstimateResult({
                                            section,
                                            sqm,
                                            quality,
                                            region,
                                            hasPrep,
                                            hasCabinets,
                                            hasCountertop,
                                            hasPainting,
                                            hasFloor,
                                            floorMaterial,
                                            hasInstallations,
                                            hasSanitary,
                                            hasBathroomPainting,
                                            hasBathroomInstallations,
                                            userQuote,
                                        }) {
    const area = Number(sqm);
    const quote = userQuote === "" ? null : Number(userQuote);

    if (!area || area <= 0) {
        return {
            error:
                section === "kitchen"
                    ? "Βάλε σωστά τετραγωνικά κουζίνας."
                    : "Βάλε σωστά τετραγωνικά μπάνιου.",
        };
    }

    const qf = costData.qualityFactor[quality] || 1;
    const rf = costData.regionFactor[region] || 1;

    let low = 0;
    let high = 0;
    const breakdown = [];

    function addItem(label, itemLow, itemHigh) {
        low += itemLow;
        high += itemHigh;

        breakdown.push({
            label,
            low: itemLow,
            high: itemHigh,
        });
    }

    if (hasPrep) {
        const prepLow = area * 20 * qf;
        const prepHigh = area * 50 * qf;

        addItem("Αποξήλωση & προετοιμασία", prepLow, prepHigh);
    }

    if (section === "kitchen") {
        if (hasCabinets) {
            const cabinetsLow = area * (quality === "premium" ? 500 : 300);
            const cabinetsHigh = area * (quality === "premium" ? 900 : 600);

            addItem("Νέα ντουλάπια", cabinetsLow, cabinetsHigh);
        }

        if (hasCountertop) {
            const countertopLow = area * (quality === "premium" ? 250 : 150);
            const countertopHigh = area * (quality === "premium" ? 500 : 300);

            addItem("Νέος πάγκος", countertopLow, countertopHigh);
        }

        if (hasPainting) {
            const paintLow = area * 10 * qf;
            const paintHigh = area * 20 * qf;

            addItem("Βάψιμο", paintLow, paintHigh);
        }

        if (hasFloor) {
            const kitchenFloorRates = {
                tile: { low: 30, high: 80 },
                marble: { low: 80, high: 180 },
                wood: { low: 45, high: 120 },
                vinyl: { low: 35, high: 90 },
            };

            const selectedRates =
                kitchenFloorRates[floorMaterial] || kitchenFloorRates.tile;

            const floorLow = area * selectedRates.low * qf;
            const floorHigh = area * selectedRates.high * qf;

            const materialLabels = {
                tile: "Πλακάκι",
                marble: "Μάρμαρο",
                wood: "Ξύλο / Laminate",
                vinyl: "Βινυλικό",
            };

            addItem(
                `Νέο δάπεδο (${materialLabels[floorMaterial] || "Πλακάκι"})`,
                floorLow,
                floorHigh
            );
        }

        if (hasInstallations) {
            const instLow = quality === "premium" ? 1500 : 1200;
            const instHigh = quality === "premium" ? 3500 : 2500;

            addItem("Υδραυλικά & ηλεκτρολογικά", instLow, instHigh);
        }
    }

    if (section === "bathroom") {
        if (hasSanitary) {
            const sanitaryLow = quality === "premium" ? 3500 : 2200;
            const sanitaryHigh = quality === "premium" ? 7000 : 4500;

            addItem("Νέα είδη υγιεινής", sanitaryLow, sanitaryHigh);
        }

        if (hasFloor) {
            const bathroomFloorRates = {
                tile: { low: 55, high: 110 },
                marble: { low: 100, high: 190 },
                wood: { low: 60, high: 130 },
                vinyl: { low: 50, high: 95 },
            };

            const selectedRates =
                bathroomFloorRates[floorMaterial] || bathroomFloorRates.tile;

            const floorLow = area * selectedRates.low * qf;
            const floorHigh = area * selectedRates.high * qf;

            const materialLabels = {
                tile: "Πλακάκι",
                marble: "Μάρμαρο",
                wood: "Ξύλο / Laminate",
                vinyl: "Βινυλικό",
            };

            addItem(
                `Νέο δάπεδο (${materialLabels[floorMaterial] || "Πλακάκι"})`,
                floorLow,
                floorHigh
            );
        }

        if (hasBathroomPainting) {
            const bathPaintLow = area * 12 * qf;
            const bathPaintHigh = area * 25 * qf;

            addItem("Βάψιμο", bathPaintLow, bathPaintHigh);
        }

        if (hasBathroomInstallations) {
            const bathInstLow = quality === "premium" ? 1800 : 1200;
            const bathInstHigh = quality === "premium" ? 4000 : 2800;

            addItem("Υδραυλικά & ηλεκτρολογικά", bathInstLow, bathInstHigh);
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

        if (hasFloor && hasSanitary && hasBathroomInstallations) {
            daysHigh = 18;
        }
    }

    low *= rf;
    high *= rf;

    const adjustedBreakdown = breakdown.map((item) => ({
        label: item.label,
        low: Math.round(item.low * rf * 1.24),
        high: Math.round(item.high * rf * 1.24),
    }));

    const lowWithVat = low * 1.24;
    const highWithVat = high * 1.24;
    const avgWithVat = (lowWithVat + highWithVat) / 2;

    let comparisonMessage = "";
    let status = "";

    if (quote !== null && Number.isFinite(quote) && quote > 0 && avgWithVat > 0) {
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

    return {
        low: Math.round(lowWithVat),
        high: Math.round(highWithVat),
        avg: Math.round(avgWithVat),
        breakdown: adjustedBreakdown,
        quote: quote && quote > 0 ? quote : null,
        comparisonMessage,
        status,
        duration: `${daysLow} - ${daysHigh} ημέρες`,
    };
}