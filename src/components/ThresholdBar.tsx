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

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      
      {/* LABEL ROW */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Text>
          <Text weight="semibold">Total Score</Text> Review: {review} → Automerge: {autoMatch}
        </Text>
      </div>

      {/* TRACK */}
      <div
        ref={ref}
        style={{
          position: "relative",
          height: 10,
          borderRadius: 6,
          background: "#eee",
        }}
      >
        {/* RED (0 → review) */}
        <div
          style={{
            position: "absolute",
            left: 0,
            width: `${review}%`,
            height: "100%",
            background: red,
            borderTopLeftRadius: 6,
            borderBottomLeftRadius: 6,
          }}
        />

        {/* YELLOW (review → autoMatch) */}
        <div
          style={{
            position: "absolute",
            left: `${review}%`,
            width: `${Math.max(0, autoMatch - review)}%`,
            height: "100%",
            background: yellow,
          }}
        />

        {/* GREEN (autoMatch → 100) */}
        <div
          style={{
            position: "absolute",
            left: `${autoMatch}%`,
            width: `${100 - autoMatch}%`,
            height: "100%",
            background: green,
            borderTopRightRadius: 6,
            borderBottomRightRadius: 6,
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
            top: -5,
            width: 14,
            height: 18,
            background: red,
            borderRadius: 4,
            cursor: "grab",
            transform: "translateX(-50%)",
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
            top: -5,
            width: 14,
            height: 18,
            background: green,
            borderRadius: 4,
            cursor: "grab",
            transform: "translateX(-50%)",
            zIndex: 3,
          }}
        />
      </div>
    </div>
  );
}