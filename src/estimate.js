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
                                            hasInstallations,
                                            hasSanitary,
                                            hasTiles,
                                            hasBathroomPainting,
                                            hasBathroomInstallations,
                                            userQuote,
                                        }) {
    const area = Number(sqm);
    const quote = Number(userQuote);

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
            const cabinetsLow = area * (quality === "premium" ? 500 : 300);
            const cabinetsHigh = area * (quality === "premium" ? 900 : 600);

            low += cabinetsLow;
            high += cabinetsHigh;

            breakdown.push({
                label: "Νέα ντουλάπια",
                low: cabinetsLow,
                high: cabinetsHigh,
            });
        }

        if (hasCountertop) {
            const countertopLow = area * (quality === "premium" ? 250 : 150);
            const countertopHigh = area * (quality === "premium" ? 500 : 300);

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
                label: "Νέα πλακάκια (τοίχος + δάπεδο)",
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

    return {
        low: Math.round(lowWithVat),
        high: Math.round(highWithVat),
        avg: Math.round(avgWithVat),
        breakdown,
        quote: quote > 0 ? quote : null,
        comparisonMessage,
        status,
        duration: `${daysLow} - ${daysHigh} ημέρες`,
    };
}