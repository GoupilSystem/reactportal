import { useRef } from "react";
import { Text } from "@fluentui/react-components";

type Props = {
  review: number;
  autoMatch: number;
  onChange: (review: number, autoMatch: number) => void;
};

export function ThresholdBar({ review, autoMatch, onChange }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  const clamp = (v: number) => Math.max(0, Math.min(100, v));

  const getValueFromEvent = (e: PointerEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return 0;

    const x = e.clientX - rect.left;
    return clamp(Math.round((x / rect.width) * 100));
  };

  const handleMove =
    (type: "review" | "auto") =>
    (e: PointerEvent) => {
      const value = getValueFromEvent(e);

      if (type === "review") {
        onChange(clamp(value), Math.max(value + 1, autoMatch));
      } else {
        onChange(Math.min(value - 1, review), clamp(value));
      }
    };

  const red = "#E74C3C";
  const yellow = "#F1C40F";
  const green = "#2ECC71";
  const border = "#3F3F3F";
  const handleGrey = "#8A8A8A";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <Text>
        <Text weight="semibold">Total Score</Text> Review: {review} → Automerge: {autoMatch}
      </Text>

      {/* TRACK */}
      <div
        ref={ref}
        style={{
          position: "relative",
          height: 12,
          borderRadius: 0, // squared edges
          background: "#eee",
          border: `1px solid ${border}`,
          overflow: "visible",
        }}
      >
        <div style={{ position: "absolute", left: 0, width: `${review}%`, height: "100%", background: red }} />
        <div
          style={{
            position: "absolute",
            left: `${review}%`,
            width: `${Math.max(0, autoMatch - review)}%`,
            height: "100%",
            background: yellow,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: `${autoMatch}%`,
            width: `${100 - autoMatch}%`,
            height: "100%",
            background: green,
          }}
        />

        {/* REVIEW HANDLE */}
        <div
          onPointerDown={(e) => {
            const move = handleMove("review");
            const onMove = (ev: PointerEvent) => move(ev);
            const stop = () => {
              window.removeEventListener("pointermove", onMove);
              window.removeEventListener("pointerup", stop);
            };
            window.addEventListener("pointermove", onMove);
            window.addEventListener("pointerup", stop);
          }}
          style={{
            position: "absolute",
            left: `${review}%`,
            top: "50%",
            width: 8,
            height: 24,
            background: handleGrey,
            borderRadius: 4,
            border: `1px solid #5A5A5A`,
            cursor: "grab",
            transform: "translate(-50%, -50%)",
            zIndex: 2,
          }}
        />

        {/* AUTOMATCH HANDLE */}
        <div
          onPointerDown={(e) => {
            const move = handleMove("auto");
            const onMove = (ev: PointerEvent) => move(ev);
            const stop = () => {
              window.removeEventListener("pointermove", onMove);
              window.removeEventListener("pointerup", stop);
            };
            window.addEventListener("pointermove", onMove);
            window.addEventListener("pointerup", stop);
          }}
          style={{
            position: "absolute",
            left: `${autoMatch}%`,
            top: "50%",
            width: 8,
            height: 24,
            background: handleGrey,
            borderRadius: 4,
            border: `1px solid #5A5A5A`,
            cursor: "grab",
            transform: "translate(-50%, -50%)",
            zIndex: 3,
          }}
        />
      </div>
    </div>
  );
}