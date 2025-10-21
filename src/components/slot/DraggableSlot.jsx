// src/components/slot/DraggableSlot.jsx
import React from "react";
import { useDrag } from "react-dnd";
import { ItemTypes } from "../../constants/ItemTypes";

export default function DraggableSlot({ slot }) {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: ItemTypes.SURF_SLOT,
        item: { slot },
        collect: (monitor) => ({ isDragging: !!monitor.isDragging() })
    }), [slot]);

    return (
        <div
            ref={drag}
            className="draggable-slot"
            style={{
                opacity: isDragging ? 0.6 : 1,
                border: "1px solid #e0e0e0",
                padding: "6px 8px",
                borderRadius: 6,
                marginBottom: 8,
                background: "#ffffff",
                fontSize: 12,
                cursor: "grab"
            }}
            title={`${slot.title} • ${slot.durationMins} min`}
        >
            <div className="fw-semibold">{slot.title}</div>
            <div className="text-muted small">{slot.durationMins} min</div>
        </div>
    );
}
