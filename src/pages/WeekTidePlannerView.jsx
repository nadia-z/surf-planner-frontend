import React, { useEffect, useMemo, useState } from "react";
import { Card, Button } from "react-bootstrap";
import { startOfWeek, addDays, format } from "date-fns";
import TideChart from "../components/tides/TideChart";
import SlotBlock from "../components/slot/SlotBlock";
import { fetchWeeklyTidesMock } from "../api/tidesApi";
import "./WeekTidePlannerView.css";

const dayLabel = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

export default function WeekTidePlannerView() {
    const [weekStart, setWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 0 }));
    const weekDays = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)), [weekStart]);

    const [tides, setTides] = useState({});           // { yyyy-mm-dd: { sunrise, sunset, highs:[{time,height}], lows:[...] } }
    const [scheduled, setScheduled] = useState({});   // { yyyy-mm-dd: [{ id, title, startHour, durationMins }] }

    // Make week fit in one page height
    useEffect(() => {
        const dayHeight = `calc((100vh - 160px) / 7)`;
        document.documentElement.style.setProperty("--day-height", dayHeight);
    }, []);

    useEffect(() => {
        (async () => {
            setTides(await fetchWeeklyTidesMock(weekStart));
            setScheduled({}); // reset when week changes
        })();
    }, [weekStart]);

    const addSlot = (dateKey, suggestedHour) => {
        const list = scheduled[dateKey] || [];
        const id = `slot-${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
        const startHour = Math.max(0, Math.min(23.0, suggestedHour ?? 9));
        const durationMins = 90;
        setScheduled(prev => ({ ...prev, [dateKey]: [...list, { id, title: "Surf Slot", startHour, durationMins }] }));
    };

    const deleteSlot = (dateKey, id) => {
        setScheduled(prev => ({ ...prev, [dateKey]: (prev[dateKey] || []).filter(s => s.id !== id) }));
    };

    const updateSlot = (dateKey, id, patch) => {
        setScheduled(prev => ({
            ...prev,
            [dateKey]: (prev[dateKey] || []).map(s => (s.id === id ? { ...s, ...patch } : s)),
        }));
    };

    const onClickAddAtPosition = (dateKey, pxX, containerWidth) => {
        const hour = (pxX / containerWidth) * 24;
        addSlot(dateKey, hour);
    };

    return (
        <div className="container-fluid py-2">
            <div className="d-flex justify-content-between align-items-center mb-2">
                <h5 className="mb-0">Week Scheduler (tides in background)</h5>
                <div>
                    <Button size="sm" variant="secondary" className="me-2" onClick={() => setWeekStart(d => addDays(d, -7))}>← Prev week</Button>
                    <strong className="me-2">{format(weekStart, "EEE dd.MM.yyyy")}</strong>
                    <Button size="sm" variant="secondary" onClick={() => setWeekStart(d => addDays(d, 7))}>Next week →</Button>
                </div>
            </div>

            <div className="col-12">
                {weekDays.map((d, idx) => {
                    const dateKey = format(d, "yyyy-MM-dd");
                    const tide = tides[dateKey];
                    const dayItems = scheduled[dateKey] || [];
                    return (
                        <Card className="mb-2 shadow-sm day-row" key={dateKey}>
                            <Card.Header className="py-1 d-flex justify-content-between align-items-center">
                                <div className="fw-semibold">
                                    {dayLabel[idx]} <span className="text-muted">({format(d, "dd.MM")})</span>
                                </div>
                                <div className="d-flex align-items-center gap-2 small">
                  <span className="text-muted me-2">
                    {tide ? `Sunrise ${tide.sunrise} • Sunset ${tide.sunset}` : "…"}
                  </span>
                                    <Button size="sm" onClick={() => addSlot(dateKey)} variant="primary">+ Add Slot</Button>
                                </div>
                            </Card.Header>

                            <TideChart
                                width={1000}
                                height={120}
                                sunrise={tide?.sunrise}
                                sunset={tide?.sunset}
                                highs={tide?.highs || []}
                                lows={tide?.lows || []}
                                onClickTrack={(pxX, widthPx) => onClickAddAtPosition(dateKey, pxX, widthPx)}
                            >
                                {/* Foreground layer: draggable/resizable slots */}
                                {(widthPx) => (
                                    <div className="scheduled-layer">
                                        {dayItems.map(item => (
                                            <SlotBlock
                                                key={item.id}
                                                slot={item}
                                                dayWidthPx={widthPx}
                                                onChange={(patch) => {
                                                    // constrain within day [0..24], min 30m
                                                    const nextStart = Math.max(0, Math.min(24, patch.startHour ?? item.startHour));
                                                    const nextDur   = Math.max(30, patch.durationMins ?? item.durationMins);
                                                    // clamp so slot doesn't overflow right edge
                                                    const maxStart = 24 - nextDur / 60;
                                                    updateSlot(dateKey, item.id, {
                                                        startHour: Math.min(nextStart, maxStart),
                                                        durationMins: nextDur
                                                    });
                                                }}
                                                onDelete={() => deleteSlot(dateKey, item.id)}
                                            />
                                        ))}
                                    </div>
                                )}
                            </TideChart>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
