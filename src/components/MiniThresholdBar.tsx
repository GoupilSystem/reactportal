import { useRef } from "react";

type Props = {
  min: number;
  max: number;
  onChange: (min: number, max: number) => void;
};

export function MiniThresholdBar({ min, max, onChange }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const active = useRef<"min" | "max" | null>(null);

  const clamp = (v: number) => Math.max(0, Math.min(100, v));

  const getValue = (e: PointerEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return 0;

    const x = e.clientX - rect.left;
    return clamp(Math.round((x / rect.width) * 100));
  };

  const onPointerMove = (e: PointerEvent) => {
    if (!active.current) return;

    const v = getValue(e);

    if (active.current === "min") {
      onChange(clamp(v), Math.max(v, max));
    } else {
      onChange(Math.min(v, min), clamp(v));
    }
  };

  const stop = () => {
    active.current = null;
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("pointerup", stop);
  };

  const start = (type: "min" | "max") => () => {
    active.current = type;
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", stop);
  };

  return (
    <div
      ref={ref}
      style={{
        position: "relative",
        height: 10,
        borderRadius: 0,
        background:
          "repeating-linear-gradient(90deg, #ccc 0px, #ccc 2px, transparent 2px, transparent 6px)",
        border: "1px solid #444",
        overflow: "visible",
      }}
    >
      {/* RANGE */}
      <div
        style={{
          position: "absolute",
          left: `${min}%`,
          width: `${Math.max(0, max - min)}%`,
          height: "100%",
          background: "rgba(52, 152, 219, 0.4)",
        }}
      />

      {/* MIN */}
      <div
        onPointerDown={start("min")}
        style={{
          position: "absolute",
          left: `${min}%`,
          top: "50%",
          width: 6,
          height: 18,
          background: "#888",
          border: "1px solid #555",
          transform: "translate(-50%, -50%)",
          cursor: "grab",
        }}
      />

      {/* MAX */}
      <div
        onPointerDown={start("max")}
        style={{
          position: "absolute",
          left: `${max}%`,
          top: "50%",
          width: 6,
          height: 18,
          background: "#888",
          border: "1px solid #555",
          transform: "translate(-50%, -50%)",
          cursor: "grab",
        }}
      />
    </div>
  );
}