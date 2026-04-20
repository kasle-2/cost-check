import { costData } from "./costData";

export function calculateEstimateResult({
                                            section,
                                            sqm,
                                            region,
                                            hasPrep,

                                            hasCabinets,
                                            cabinetMaterial,

                                            hasCountertop,
                                            countertopMaterial,

                                            hasPainting,
                                            hasFloor,
                                            floorMaterial,
                                            hasInstallations,

                                            hasSanitary,
                                            sanitaryQuality,
                                            sanitaryType,

                                            hasBathroomPainting,
                                            hasBathroomInstallations,

                                            quote1,
                                            quote2,
                                            quote3,
                                        }) {
    const area = Number(sqm);

    if (!area || area <= 0) {
        return {
            error:
                section === "kitchen"
                    ? "Βάλε σωστά τετραγωνικά κουζίνας."
                    : "Βάλε σωστά τετραγωνικά μπάνιου.",
        };
    }

    const hasAnyWork =
        hasPrep ||
        hasCabinets ||
        hasCountertop ||
        hasPainting ||
        hasFloor ||
        hasInstallations ||
        hasSanitary ||
        hasBathroomPainting ||
        hasBathroomInstallations;

    if (!hasAnyWork) {
        return {
            error: "Επίλεξε τουλάχιστον μία εργασία για να γίνει εκτίμηση.",
        };
    }

    let warning = "";

    if (section === "bathroom" && area > 20) {
        warning =
            "Πολύ μεγάλο μπάνιο — μήπως έχεις βάλει λάθος τετραγωνικά;";
    }

    if (section === "kitchen" && area > 40) {
        warning =
            "Πολύ μεγάλη κουζίνα — έλεγξε τα τετραγωνικά.";
    }

    const rf = costData.regionFactor?.[region] || 1;

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
        const prepLow = area * 20;
        const prepHigh = area * 50;

        addItem("Αποξήλωση & προετοιμασία", prepLow, prepHigh);
    }

    if (section === "kitchen") {
        if (hasCabinets) {
            const cabinetRates = {
                melamine: { low: 300, high: 600, label: "Μελαμίνη" },
                mdf: { low: 450, high: 800, label: "MDF" },
                lacquer: { low: 600, high: 1000, label: "Λάκα" },
            };

            const selectedCabinet =
                cabinetRates[cabinetMaterial] || cabinetRates.melamine;

            const cabinetsLow = area * selectedCabinet.low;
            const cabinetsHigh = area * selectedCabinet.high;

            addItem(
                `Νέα ντουλάπια (${selectedCabinet.label})`,
                cabinetsLow,
                cabinetsHigh
            );
        }

        if (hasCountertop) {
            const countertopRates = {
                laminate: { low: 150, high: 300, label: "Laminate" },
                quartz: { low: 300, high: 550, label: "Quartz" },
                granite: { low: 350, high: 650, label: "Granite" },
                corian: { low: 400, high: 700, label: "Corian" },
            };

            const selectedCountertop =
                countertopRates[countertopMaterial] || countertopRates.laminate;

            const countertopLow = area * selectedCountertop.low;
            const countertopHigh = area * selectedCountertop.high;

            addItem(
                `Νέος πάγκος (${selectedCountertop.label})`,
                countertopLow,
                countertopHigh
            );
        }

        if (hasPainting) {
            const paintLow = area * 10;
            const paintHigh = area * 20;

            addItem("Βάψιμο", paintLow, paintHigh);
        }

        if (hasFloor) {
            const kitchenFloorRates = {
                tile: { low: 30, high: 80, label: "Πλακάκι" },
                marble: { low: 80, high: 180, label: "Μάρμαρο" },
                wood: { low: 45, high: 120, label: "Ξύλο / Laminate" },
                vinyl: { low: 35, high: 90, label: "Βινυλικό" },
            };

            const selectedFloor =
                kitchenFloorRates[floorMaterial] || kitchenFloorRates.tile;

            const floorLow = area * selectedFloor.low;
            const floorHigh = area * selectedFloor.high;

            addItem(
                `Νέο δάπεδο (${selectedFloor.label})`,
                floorLow,
                floorHigh
            );
        }

        if (hasInstallations) {
            const instLow = 1200;
            const instHigh = 2800;

            addItem("Υδραυλικά & ηλεκτρολογικά", instLow, instHigh);
        }
    }

    if (section === "bathroom") {
        if (hasSanitary) {
            const sanitaryRates = {
                standard: { low: 2200, high: 4500, label: "Standard" },
                premium: { low: 3500, high: 7000, label: "Premium" },
            };

            const sanitaryTypeExtra = {
                shower: { low: 0, high: 0, label: "Ντουζιέρα" },
                bathtub: { low: 800, high: 1500, label: "Μπανιέρα" },
            };

            const selectedSanitary =
                sanitaryRates[sanitaryQuality] || sanitaryRates.standard;

            const selectedType =
                sanitaryTypeExtra[sanitaryType] || sanitaryTypeExtra.shower;

            const sanitaryLow = selectedSanitary.low + selectedType.low;
            const sanitaryHigh = selectedSanitary.high + selectedType.high;

            addItem(
                `Νέα είδη υγιεινής (${selectedSanitary.label}, ${selectedType.label})`,
                sanitaryLow,
                sanitaryHigh
            );
        }

        if (hasFloor) {
            const bathroomFloorRates = {
                tile: { low: 55, high: 110, label: "Πλακάκι" },
                marble: { low: 100, high: 190, label: "Μάρμαρο" },
                vinyl: { low: 50, high: 95, label: "Βινυλικό" },
            };

            const selectedFloor =
                bathroomFloorRates[floorMaterial] || bathroomFloorRates.tile;

            const floorLow = area * selectedFloor.low;
            const floorHigh = area * selectedFloor.high;

            addItem(
                `Νέο δάπεδο (${selectedFloor.label})`,
                floorLow,
                floorHigh
            );
        }

        if (hasBathroomPainting) {
            const bathPaintLow = area * 12;
            const bathPaintHigh = area * 25;

            addItem("Βάψιμο", bathPaintLow, bathPaintHigh);
        }

        if (hasBathroomInstallations) {
            const bathInstLow = 1200;
            const bathInstHigh = 3000;

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

        if (hasInstallations) {
            daysHigh += 2;
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

    const lowWithVat = low * 1.24;
    const highWithVat = high * 1.24;
    const avgWithVat = (lowWithVat + highWithVat) / 2;

    const adjustedBreakdown = breakdown.map((item) => ({
        label: item.label,
        low: Math.round(item.low * rf * 1.24),
        high: Math.round(item.high * rf * 1.24),
    }));

    function parseQuote(value) {
        if (value === "" || value === null || value === undefined) {
            return null;
        }

        const parsed = Number(value);

        if (!Number.isFinite(parsed) || parsed <= 0) {
            return null;
        }

        return parsed;
    }

    function getQuoteComparison(quote, index) {
        if (!quote || avgWithVat <= 0) return null;

        const percentage = Math.round(((quote - avgWithVat) / avgWithVat) * 100);

        if (quote < lowWithVat) {
            return {
                index,
                quote,
                status: "cheap",
                comparisonMessage: `Η προσφορά είναι ${Math.abs(
                    percentage
                )}% κάτω από τον μέσο όρο`,
                distanceFromAvg: Math.abs(quote - avgWithVat),
            };
        }

        if (quote > highWithVat) {
            return {
                index,
                quote,
                status: "expensive",
                comparisonMessage: `Η προσφορά είναι ${Math.abs(
                    percentage
                )}% πάνω από τον μέσο όρο`,
                distanceFromAvg: Math.abs(quote - avgWithVat),
            };
        }

        return {
            index,
            quote,
            status: "normal",
            comparisonMessage: `Η προσφορά είναι κοντά στον μέσο όρο (${percentage}%)`,
            distanceFromAvg: Math.abs(quote - avgWithVat),
        };
    }

    const parsedQuotes = [
        parseQuote(quote1),
        parseQuote(quote2),
        parseQuote(quote3),
    ];

    const quoteComparisons = parsedQuotes
        .map((quote, idx) => getQuoteComparison(quote, idx + 1))
        .filter(Boolean);

    let bestQuoteMessage = "";

    if (quoteComparisons.length === 1) {
        bestQuoteMessage = "Έχεις βάλει 1 προσφορά για σύγκριση.";
    }

    if (quoteComparisons.length > 1) {
        const normalQuotes = quoteComparisons
            .filter((item) => item.status === "normal")
            .sort((a, b) => a.distanceFromAvg - b.distanceFromAvg);

        if (normalQuotes.length > 0) {
            const best = normalQuotes[0];
            bestQuoteMessage = `Η πιο ισορροπημένη επιλογή φαίνεται να είναι η Προσφορά ${best.index}, γιατί βρίσκεται πιο κοντά στο αναμενόμενο εύρος αγοράς.`;
        } else {
            const sortedByAvg = [...quoteComparisons].sort(
                (a, b) => a.distanceFromAvg - b.distanceFromAvg
            );

            const best = sortedByAvg[0];
            bestQuoteMessage = `Καμία προσφορά δεν είναι ιδανικά μέσα στο εύρος, αλλά η Προσφορά ${best.index} είναι η πιο κοντινή στον μέσο όρο.`;
        }
    }

    return {
        low: Math.round(lowWithVat),
        high: Math.round(highWithVat),
        avg: Math.round(avgWithVat),
        breakdown: adjustedBreakdown,
        quoteComparisons,
        bestQuoteMessage,
        duration: `${daysLow} - ${daysHigh} ημέρες`,
        warning,
    };
}