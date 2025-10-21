// src/api/tidesApi.js
import { format } from "date-fns";

const pad2 = (n) => (n < 10 ? `0${n}` : `${n}`);

export async function fetchWeeklyTidesMock(weekStartDate) {
    // Return 7 days of mock tide data:
    const result = {};
    for (let i = 0; i < 7; i++) {
        const d = new Date(weekStartDate.getTime());
        d.setDate(d.getDate() + i);
        const key = format(d, "yyyy-MM-dd");

        // Fake sunrise/sunset; drift slightly
        const sunriseH = 6 + (i % 3) * 0.2;
        const sunsetH = 20 - (i % 4) * 0.2;

        const hToStr = (h) => `${pad2(Math.floor(h))}:${pad2(Math.round((h % 1) * 60))}`;

        result[key] = {
            sunrise: hToStr(sunriseH),
            sunset:  hToStr(sunsetH),
            highs: [
                { time: hToStr(2 + (i * 0.3) % 6), height: +(2.8 + (i % 3) * 0.2).toFixed(1) },
                { time: hToStr(14 + (i * 0.25) % 6), height: +(3.0 + (i % 2) * 0.3).toFixed(1) },
            ],
            lows: [
                { time: hToStr(8 + (i * 0.4) % 6), height: +(0.6 + (i % 2) * 0.2).toFixed(1) },
                { time: hToStr(20 + (i * 0.35) % 3), height: +(0.8 + (i % 3) * 0.1).toFixed(1) },
            ],
        };
    }
    return result;
}

export async function fetchInitialSlotsMock() {
    return [
        { id: "s1", title: "Adults – Beginner", durationMins: 90 },
        { id: "s2", title: "Adults – Intermediate", durationMins: 90 },
        { id: "s3", title: "Kids Group", durationMins: 60 },
        { id: "s4", title: "Teens Group", durationMins: 75 },
        { id: "s5", title: "Adults – Advanced", durationMins: 90 },
    ];
}
