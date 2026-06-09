import { useRef } from "react";

type Props = {
  weight: number;
  min: number;
  max: number;
  onChange: (weight: number, min: number, max: number) => void;
};

export function StepScoreBar({ weight, min, max, onChange }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  const clamp = (v: number) => Math.max(0, Math.min(100, v));

  const getValue = (e: PointerEvent) => {
    const el = ref.current;
    if (!el) return 0;

    const rect = el.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));

    return Math.round((x / rect.width) * 100);
  };

  const startDrag =
    (type: "min" | "max") =>
    (e: React.PointerEvent<HTMLDivElement>) => {
      e.preventDefault();

      const target = e.currentTarget;
      target.setPointerCapture?.(e.pointerId);

      const move = (ev: PointerEvent) => {
        const value = getValue(ev);

        if (type === "min") {
          const newMin = Math.min(value, max - 1);
          onChange(weight, newMin, max);
        } else {
          const newMax = Math.max(value, min + 1);
          onChange(weight, min, newMax);
        }
      };

      const stop = () => {
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerup", stop);
      };

      window.addEventListener("pointermove", move);
      window.addEventListener("pointerup", stop);
    };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <div style={{ fontSize: 11 }}>
        {weight} pts ({min} → {max})
      </div>

      <div
        ref={ref}
        style={{
          position: "relative",
          height: 10,
          width: "100%",
          minWidth: 120,
          background: "#eee",
          border: "1px solid #444",
        }}
      >
        {/* range */}
        <div
          style={{
            position: "absolute",
            left: `${min}%`,
            width: `${Math.max(0, max - min)}%`,
            height: "100%",
            background: "#F1C40F",
          }}
        />

        {/* min handle */}
        <div
          onPointerDown={startDrag("min")}
          style={{
            position: "absolute",
            left: `${min}%`,
            width: 10,
            height: 18,
            background: "#777",
            cursor: "ew-resize",
            transform: "translate(-50%, -20%)",
            zIndex: 2,
          }}
        />

        {/* max handle */}
        <div
          onPointerDown={startDrag("max")}
          style={{
            position: "absolute",
            left: `${max}%`,
            width: 10,
            height: 18,
            background: "#777",
            cursor: "ew-resize",
            transform: "translate(-50%, -20%)",
            zIndex: 3,
          }}
        />
      </div>
    </div>
  );
}