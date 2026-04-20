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
                basic: { low: 1500, high: 2500, label: "Basic" },
                standard: { low: 2200, high: 4500, label: "Standard" },
                premium: { low: 3500, high: 7000, label: "Premium" },
            };

            const sanitaryTypeExtra = {
                shower: { low: 0, high: 0, label: "Ντουζιέρα" },
                bathtub: { low: 800, high: 1500, label: "Μπανιέρα" },
            };

            const selectedSanitary =
                sanitaryRates[sanitaryQuality] || sanitaryRates.standard;

            const selectedSanitaryType =
                sanitaryTypeExtra[sanitaryType] || sanitaryTypeExtra.shower;

            const sanitaryLow =
                selectedSanitary.low + selectedSanitaryType.low;
            const sanitaryHigh =
                selectedSanitary.high + selectedSanitaryType.high;

            addItem(
                `Νέα είδη υγιεινής (${selectedSanitary.label}, ${selectedSanitaryType.label})`,
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