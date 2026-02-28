export const dashboardData = {
    overview: {
        netRevenue: {
            value: "₹42.5 L",
            trend: "+12%",
            isPositive: true,
            label: "vs Last Month"
        },
        totalSpending: {
            value: "₹38.2 L",
            trend: "-2.1%",
            isPositive: false,
            label: "Ops & Resources"
        },
        wasteDiversion: {
            value: "84.2%",
            trend: "+2.4%",
            isPositive: true,
            label: "Target: 90%"
        },
        processEfficiency: {
            value: "99.4%",
            label: "Uptime"
        }
    },
    valueChain: {
        villages: {
            volume: "15,200 Tn",
            financial: "-₹12.5 L",
            hoverText: "Collected from 2,345 active villages across 15 districts.",
            details: [
                { label: "Dry Waste", value: "8,500 Tn" },
                { label: "Wet Waste", value: "6,700 Tn" }
            ]
        },
        pwmuCenter: {
            volume: "15,200 Tn",
            financial: "-₹8.2 L",
            hoverText: "Processing and baling facility operations.",
            details: [
                { label: "Processing Loss", value: "400 Tn" },
                { label: "Recovered", value: "14,800 Tn" }
            ]
        },
        sinks: [
            {
                id: "recyclers",
                name: "Recyclers",
                volume: "6,500 Tn",
                financial: "+₹35.4 L",
                color: "green",
                hoverText: "High-value plastics sold to authorized recyclers."
            },
            {
                id: "cementKiln",
                name: "Cement Kiln",
                volume: "4,200 Tn",
                financial: "-₹2.1 L",
                color: "red",
                hoverText: "Non-recyclable combustibles sent for co-processing."
            },
            {
                id: "roadConstruction",
                name: "Road Const.",
                volume: "3,100 Tn",
                financial: "+₹1.5 L",
                color: "yellow",
                hoverText: "Low-value plastics used in PWD road projects."
            }
        ]
    }
};
