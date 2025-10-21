import React, { useRef, useState } from "react";
import "./SlotBlock.css";

const clamp = (val, min, max) => Math.max(min, Math.min(max, val));
const fmt = (h) => {
    const hh = Math.floor(h);
    const mm = Math.round((h - hh) * 60);
    return `${String(hh).padStart(2,"0")}:${String(mm).padStart(2,"0")}`;
};

export default function SlotBlock({ slot, dayWidthPx, onChange, onDelete }) {
    const ref = useRef(null);
    const [dragging, setDragging] = useState(null); // "move" | "resize-l" | "resize-r"
    const [startSnapshot, setStartSnapshot] = useState({ startHour: slot.startHour, durationMins: slot.durationMins });

    const leftPct = (slot.startHour / 24) * 100;
    const widthPct = (slot.durationMins / 60 / 24) * 100;

    const onMouseDown = (e, mode) => {
        e.stopPropagation();
        setDragging(mode);
        setStartSnapshot({ startHour: slot.startHour, durationMins: slot.durationMins });
        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);
    };

    const onMouseMove = (e) => {
        if (!dragging || !ref.current) return;
        const rect = ref.current.parentElement.getBoundingClientRect();
        const x = clamp(e.clientX - rect.left, 0, rect.width);
        const hourAtX = (x / rect.width) * 24;

        if (dragging === "move") {
            const newStart = clamp(hourAtX - (slot.durationMins / 60) / 2, 0, 24 - slot.durationMins / 60);
            onChange({ startHour: newStart });
        } else if (dragging === "resize-l") {
            // change left edge; end fixed
            const endHour = startSnapshot.startHour + startSnapshot.durationMins / 60;
            const newStart = clamp(hourAtX, 0, endHour - 0.5);
            const newDurM = Math.max(30, (endHour - newStart) * 60);
            onChange({ startHour: newStart, durationMins: newDurM });
        } else if (dragging === "resize-r") {
            // change right edge; start fixed
            const newEnd = clamp(hourAtX, startSnapshot.startHour + 0.5, 24);
            const newDurM = Math.max(30, (newEnd - startSnapshot.startHour) * 60);
            onChange({ durationMins: newDurM });
        }
    };

    const onMouseUp = () => {
        setDragging(null);
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
    };

    const startTime = fmt(slot.startHour);
    const endTime = fmt(slot.startHour + slot.durationMins / 60);

    return (
        <div
            className="slot-block"
            ref={ref}
            style={{ left: `${leftPct}%`, width: `${Math.max(4, widthPct)}%` }}
            onDoubleClick={(e) => { e.stopPropagation(); onDelete?.(); }}
        >
            {/* resize handles */}
            <div className="handle handle-l" onMouseDown={(e) => onMouseDown(e, "resize-l")} title="Resize start" />
            <div className="handle handle-r" onMouseDown={(e) => onMouseDown(e, "resize-r")} title="Resize end" />

            {/* center for moving */}
            <div className="slot-core" onMouseDown={(e) => onMouseDown(e, "move")} title="Drag to move">
                <div className="times">
                    <span className="badge-time">{startTime}</span>
                    <span className="title">{slot.title}</span>
                    <span className="badge-time">{endTime}</span>
                </div>
                <button className="btn-close-slot" onClick={(e) => { e.stopPropagation(); onDelete?.(); }} aria-label="delete">×</button>
            </div>
        </div>
    );
}
