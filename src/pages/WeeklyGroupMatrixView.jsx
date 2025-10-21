import React, { useEffect, useMemo, useState } from "react";
import { addDays, format, startOfWeek } from "date-fns";
import "./WeeklyGroupMatrixView.css";

// ---- API base ----
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8000";

// ---- helpers ----
const toISO = (d) =>
    d instanceof Date ? d.toISOString().slice(0, 10) : String(d).slice(0, 10);

const norm = (s) => (s || "").toString().trim().toLowerCase();

const normalizeLevel = (student) => {
    const g = norm(student.age_group);
    if (g.includes("kid")) return "kids";
    if (g.includes("teen")) return "teens";
    const lvl = norm(student.level);
    if (!lvl) return "beginner";
    if (lvl === "beginner+" || lvl === "beginner plus") return "beginner plus";
    return lvl;
};

const classify = (student) => {
    const g = norm(student.age_group);
    if (g.includes("kid")) return "kids";
    if (g.includes("teen")) return "teens";
    return "adults";
};

const isSameDay = (a, b) => {
    if (!a || !b) return false;
    const da = new Date(a);
    const db = new Date(b);
    da.setHours(0, 0, 0, 0);
    db.setHours(0, 0, 0, 0);
    return da.getTime() === db.getTime();
};

const isPresentOnDay = (student, day) => {
    if (!student.arrival || !student.departure) return false;
    const d = new Date(day); d.setHours(0,0,0,0);
    const arr = new Date(student.arrival); arr.setHours(0,0,0,0);
    const dep = new Date(student.departure); dep.setHours(0,0,0,0);
    // present on site: arrival <= day < departure
    return arr <= d && d < dep;
};

const isPlannableOnDay = (student, day) => {
    if (!student.arrival || !student.departure) return false;
    const d = new Date(day); d.setHours(0,0,0,0);
    const start = new Date(student.arrival);
    start.setDate(start.getDate() + 1);
    start.setHours(0, 0, 0, 0);
    const dep = new Date(student.departure); dep.setHours(0, 0, 0, 0);
    return start <= d && d < dep;
};

const isArrivalOnDay = (student, day) => isSameDay(student.arrival, day);
const isDepartureOnDay = (student, day) => isSameDay(student.departure, day);

// initial empty plan map: { [studentId]: Set(isoDates) }
const emptyPlan = () => Object.create(null);

// ---- component ----
export default function WeeklyPlannerView() {
    // windowStart is always a Sunday (start of visible 7-day window)
    const [windowStart, setWindowStart] = useState(
        startOfWeek(new Date(), { weekStartsOn: 0 })
    );

    const days = useMemo(
        () => Array.from({ length: 7 }, (_, i) => addDays(windowStart, i)),
        [windowStart]
    );

    const [allStudents, setAllStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    // plan = { [studentId]: Set of ISO date strings that are planned }
    const [plan, setPlan] = useState(emptyPlan);

    useEffect(() => {
        let mounted = true;
        async function load() {
            setLoading(true);
            try {
                // Adjust endpoint if needed (this expects your API returns a flat list of Student models)
                const res = await fetch(`${API_BASE_URL}/students`);
                const data = await res.json();
                if (!mounted) return;
                setAllStudents(Array.isArray(data) ? data : []);
            } catch (e) {
                console.error("Failed to load students:", e);
                if (mounted) setAllStudents([]);
            } finally {
                if (mounted) setLoading(false);
            }
        }
        load();
        return () => (mounted = false);
    }, []);

    // Students visible in the current 7-day window (at least present on one of the days)
    const visibleStudents = useMemo(() => {
        if (!allStudents?.length) return [];
        return allStudents.filter((s) =>
            days.some((d) => isPresentOnDay(s, d))
        );
    }, [allStudents, days]);

    // Recompute daily summary from visible students
    const daySummary = useMemo(() => {
        const mk = () => ({
            total: 0,
            adults: 0,
            kids: 0,
            teens: 0,
            byLevel: { beginner: 0, "beginner plus": 0, intermediate: 0, advanced: 0 },
        });
        const map = {};
        for (const d of days) map[toISO(d)] = mk();

        for (const s of visibleStudents) {
            for (const d of days) {
                const key = toISO(d);
                if (!isPresentOnDay(s, d)) continue;
                const level = normalizeLevel(s);
                const group = classify(s);
                map[key].total += 1;
                map[key][group] += 1;
                if (level in map[key].byLevel) map[key].byLevel[level] += 1;
            }
        }
        return map;
    }, [days, visibleStudents]);

    // Planned count per student (in the *entire* plan map)
    const plannedCountForStudent = (studentId) =>
        plan[studentId] ? plan[studentId].size : 0;

    // Toggle plan on a specific day cell
    const togglePlan = (student, day) => {
        if (!isPlannableOnDay(student, day)) return; // respect arrival+1 and no departure day
        const iso = toISO(day);
        setPlan((prev) => {
            const next = { ...prev };
            const setFor = new Set(next[student.id] || []);
            if (setFor.has(iso)) {
                setFor.delete(iso);
            } else {
                setFor.add(iso);
            }
            next[student.id] = setFor;
            return next;
        });
    };

    // navigation & date picking
    const goPrevDay = () => setWindowStart((p) => addDays(p, -1));
    const goNextDay = () => setWindowStart((p) => addDays(p, 1));
    const setFromDateInput = (e) => setWindowStart(new Date(e.target.value));

    return (
        <div className="wk-container">
            <div className="wk-toolbar">
                <div className="wk-title">Weekly Surf Lesson Planner</div>
                <div className="wk-controls">
                    <button className="btn btn-sm btn-outline-primary" onClick={goPrevDay}>
                        ←
                    </button>
                    <input
                        type="date"
                        className="form-control form-control-sm wk-date"
                        value={toISO(windowStart)}
                        onChange={setFromDateInput}
                    />
                    <button className="btn btn-sm btn-outline-primary" onClick={goNextDay}>
                        →
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="alert alert-info">Loading students…</div>
            ) : visibleStudents.length === 0 ? (
                <div className="alert alert-warning">
                    No students present in the selected window.
                </div>
            ) : (
                <div className="wk-table-wrap">
                    <table className="wk-table">
                        <thead>
                        <tr>
                            <th className="sticky-left left-col">Name</th>
                            {days.map((d) => {
                                const k = toISO(d);
                                const s = daySummary[k];
                                return (
                                    <th key={k}>
                                        <div className="day-title">{format(d, "EEE dd.MM")}</div>
                                        <div className="day-sub">
                                            Tot {s.total} • Adults {s.adults} • Kids {s.kids} • Teens {s.teens}
                                        </div>
                                    </th>
                                );
                            })}
                            <th className="sticky-right right-col">Booked</th>
                            <th className="sticky-right right-col">Planned</th>
                            <th className="sticky-right right-col">Remaining</th>
                        </tr>
                        </thead>

                        <tbody>
                        {visibleStudents.map((s) => {
                            const booked = Number(s.number_of_surf_lessons || 0);
                            const planned = plannedCountForStudent(s.id);
                            const remaining = Math.max(0, booked - planned);

                            return (
                                <tr key={s.id}>
                                    {/* left sticky */}
                                    <td className="sticky-left left-col">
                                        <div className="student-cell">
                                            <div className="name">
                                                {s.first_name} {s.last_name}
                                            </div>
                                            <div className="meta small">
                                                {normalizeLevel(s)} • {classify(s)}
                                            </div>
                                        </div>
                                    </td>

                                    {/* week cells */}
                                    {days.map((d) => {
                                        const iso = toISO(d);
                                        const plannedToday = !!plan[s.id]?.has?.(iso);
                                        const present = isPresentOnDay(s, d);
                                        const arrival = isArrivalOnDay(s, d);
                                        const departure = isDepartureOnDay(s, d);
                                        const plannable = isPlannableOnDay(s, d);

                                        const cls = [
                                            "wk-cell",
                                            plannedToday && "planned",
                                            !plannedToday && present && "present",
                                            arrival && "arrival",
                                            departure && "departure",
                                            !plannable && "not-plannable",
                                        ]
                                            .filter(Boolean)
                                            .join(" ");

                                        return (
                                            <td
                                                key={iso}
                                                className={cls}
                                                title={`${format(d, "EEE dd.MM")} • ${
                                                    plannedToday
                                                        ? "Planned"
                                                        : present
                                                            ? "Present"
                                                            : "Off site"
                                                }`}
                                                onClick={() => togglePlan(s, d)}
                                            />
                                        );
                                    })}

                                    {/* right sticky */}
                                    <td className="sticky-right right-col">{booked}</td>
                                    <td className={`sticky-right right-col ${planned > booked ? "warn" : ""}`}>
                                        {planned}
                                    </td>
                                    <td className="sticky-right right-col">{remaining}</td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>
            )}

            <div className="legend small text-muted mt-2">
        <span className="badge me-2" style={{ background: "#c9f7d5" }}>
          planned
        </span>
                <span className="badge me-2" style={{ background: "#e8f1ff", color: "#111" }}>
          present
        </span>
                <span className="badge me-2 legend-stripe legend-arr">arrival stripe</span>
                <span className="badge legend-stripe legend-dep">departure stripe</span>
            </div>
        </div>
    );
}
