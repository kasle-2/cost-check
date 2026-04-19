export const costData = {
    renovationBase: {
        light: { low: 120, mid: 170, high: 220 },
        partial: { low: 250, mid: 350, high: 450 },
        full: { low: 450, mid: 600, high: 800 },
    },

    qualityFactor: {
        basic: 0.9,
        standard: 1,
        premium: 1.25,
    },

    regionFactor: {
        athens: 1.1,
        thessaloniki: 1.05,
        other: 0.95,
    },

    propertyFactor: {
        apartment: 1,
        office: 1.1,
        shop: 1.15,
    },

    kitchenCost: {
        basic: { low: 3000, mid: 4500, high: 6000 },
        standard: { low: 5000, mid: 7000, high: 9000 },
        premium: { low: 7000, mid: 11000, high: 14000 },
    },

    bathroomCost: {
        basic: { low: 2500, mid: 3500, high: 5000 },
        standard: { low: 3500, mid: 5000, high: 7000 },
        premium: { low: 5000, mid: 7500, high: 10000 },
    },
};