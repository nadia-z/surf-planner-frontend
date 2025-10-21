import React, { useMemo, useRef, useState } from "react";

// Parse "HH:MM" → fractional hour
const hhmmToHours = (hhmm) => {
    if (!hhmm) return 0;
    const [h, m] = hhmm.split(":").map(Number);
    return h + (m || 0) / 60;
};

// Catmull-Rom to cubic Bézier
function catmullRom2bezier(points) {
    if (points.length < 2) return "";
    const path = [`M ${points[0].x} ${points[0].y}`];
    for (let i = 0; i < points.length - 1; i++) {
        const p0 = points[Math.max(0, i - 1)];
        const p1 = points[i];
        const p2 = points[i + 1];
        const p3 = points[Math.min(points.length - 1, i + 2)];
        const c1x = p1.x + (p2.x - p0.x) / 6;
        const c1y = p1.y + (p2.y - p0.y) / 6;
        const c2x = p2.x - (p3.x - p1.x) / 6;
        const c2y = p2.y - (p3.y - p1.y) / 6;
        path.push(`C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2.x} ${p2.y}`);
    }
    return path.join(" ");
}

export default function TideChart({ width, height, sunrise, sunset, highs, lows, onClickTrack, children }) {
    const containerRef = useRef(null);
    const [clientWidth, setClientWidth] = useState(width);

    const sunriseH = hhmmToHours(sunrise);
    const sunsetH  = hhmmToHours(sunset);

    const { pathD, toXpx, mapY, minH, maxH } = useMemo(() => {
        const keys = [];
        (highs || []).forEach(h => keys.push({ t: hhmmToHours(h.time), h: h.height }));
        (lows || []).forEach(l => keys.push({ t: hhmmToHours(l.time), h: l.height }));

        if (keys.length === 0) {
            const midY = height / 2;
            return {
                pathD: `M 0 ${midY} L ${width} ${midY}`,
                toXpx: t => (t / 24) * width,
                mapY: () => midY,
                minH: 0, maxH: 1
            };
        }

        keys.sort((a,b) => a.t - b.t);
        const allH = keys.map(k => k.h);
        const minH = Math.min(...allH);
        const maxH = Math.max(...allH);
        const pad = Math.max(0.2, (maxH - minH) * 0.15);
        const vMin = minH - pad;
        const vMax = maxH + pad;

        const toX = (t) => (t / 24) * width;
        const toY = (h) => {
            const top = 8, bottom = height - 8;
            const ratio = (h - vMin) / (vMax - vMin || 1);
            return bottom - ratio * (bottom - top);
        };

        const pts = [];
        if (keys[0].t > 0) pts.push({ x: toX(0), y: toY(keys[0].h) });
        keys.forEach(k => pts.push({ x: toX(k.t), y: toY(k.h) }));
        if (keys[keys.length - 1].t < 24) pts.push({ x: toX(24), y: toY(keys[keys.length - 1].h) });

        return {
            pathD: catmullRom2bezier(pts),
            toXpx: t => (t / 24) * width,
            mapY: toY,
            minH, maxH
        };
    }, [width, height, highs, lows]);

    const handleClick = (e) => {
        if (!onClickTrack) return;
        const rect = containerRef.current.getBoundingClientRect();
        const pxX = Math.min(Math.max(e.clientX - rect.left, 0), rect.width);
        onClickTrack(pxX, rect.width);
    };

    const refCb = (node) => {
        containerRef.current = node;
        if (node) setClientWidth(node.clientWidth);
    };

    return (
        <div
            ref={refCb}
            className="tide-chart"
            style={{
                position: "relative",
                width: "100%",
                height: "var(--day-height)",
                borderRadius: 8,
                overflow: "hidden",
                border: "1px solid #e2e2e2",
                background: "#fafafa",
                cursor: onClickTrack ? "crosshair" : "default"
            }}
            onDoubleClick={handleClick}
        >
            <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
                {/* Night/Day/Night */}
                <rect x="0" y="0" width={(sunriseH / 24) * width} height={height} fill="#0b1726" opacity="0.20" />
                <rect x={(sunriseH / 24) * width} y="0" width={((sunsetH - sunriseH) / 24) * width} height={height} fill="#fff8e1" />
                <rect x={(sunsetH / 24) * width} y="0" width={width - (sunsetH / 24) * width} height={height} fill="#0b1726" opacity="0.20" />

                {/* Tide curve */}
                <path d={pathD} fill="none" stroke="#1976d2" strokeWidth="2" />

                {/* Sunrise/Sunset markers */}
                <line x1={toXpx(sunriseH)} y1="0" x2={toXpx(sunriseH)} y2={height} stroke="#ff9800" strokeDasharray="4 3" opacity="0.6" />
                <text x={toXpx(sunriseH) + 4} y="12" fontSize="10" fill="#ff9800">Sunrise {sunrise}</text>
                <line x1={toXpx(sunsetH)} y1="0" x2={toXpx(sunsetH)} y2={height} stroke="#ff9800" strokeDasharray="4 3" opacity="0.6" />
                <text x={toXpx(sunsetH) + 4} y="12" fontSize="10" fill="#ff9800">Sunset {sunset}</text>

                {/* Highs/Lows exactly on curve */}
                {(highs || []).map((h, i) => {
                    const hH = hhmmToHours(h.time);
                    return (
                        <g key={`h${i}`}>
                            <circle cx={toXpx(hH)} cy={mapY(h.height)} r="5" fill="#1976d2" />
                            <text x={toXpx(hH) + 6} y={mapY(h.height) - 6} fontSize="10" fill="#1976d2">{`H ${h.height}m`}</text>
                        </g>
                    );
                })}
                {(lows || []).map((l, i) => {
                    const lH = hhmmToHours(l.time);
                    return (
                        <g key={`l${i}`}>
                            <circle cx={toXpx(lH)} cy={mapY(l.height)} r="5" fill="#9c27b0" />
                            <text x={toXpx(lH) + 6} y={mapY(l.height) + 12} fontSize="10" fill="#9c27b0">{`L ${l.height}m`}</text>
                        </g>
                    );
                })}
            </svg>

            {/* Foreground for slots, gets the actual pixel width */}
            {typeof children === "function" ? children(containerRef.current?.clientWidth || clientWidth) : children}
        </div>
    );
}
