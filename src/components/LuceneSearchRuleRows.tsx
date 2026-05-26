import { Input, Text } from "@fluentui/react-components";
import type { LuceneSearchRule } from "../types/LookupTypes";

type Props = {
  label: string;
  rule: LuceneSearchRule;
  onChange: (r: LuceneSearchRule) => void;
};

export function LuceneSearchRuleRow({ label, rule, onChange }: Props) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>

      {/* ENABLED */}
      <input
        type="checkbox"
        // checked={rule.enabled}
        // onChange={(e) =>
        //   onChange({
        //     ...rule,
        //     enabled: e.target.checked,
        //   })
        // }
      />

      {/* LABEL */}
      <Text style={{ minWidth: 140 }}>{label}</Text>

      {/* level */}
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <Text size={200}>Level</Text>
        <Input
          type="number"
          value={String(rule.level)}
          onChange={(e) =>
            onChange({
              ...rule,
              level: Number(e.target.value),
            })
          }
          style={{ width: 60 }}
        />
      </div>

      {/* TOP */}
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <Text size={200}>Top</Text>
        <Input
          type="number"
          value={String(rule.top)}
          onChange={(e) =>
            onChange({
              ...rule,
              top: Number(e.target.value),
            })
          }
          style={{ width: 70 }}
        />
      </div>

    </div>
  );
}


// Lucene-søk er et fleksibelt søk som kan finne treff selv om det finnes skrivefeil, manglende tegn eller små variasjoner i dataene.
// Dette brukes for å finne relevante kontakter selv når informasjonen ikke matcher helt eksakt.

// Hver regel bestemmer hvordan søket skal utføres på et bestemt felt:

// fieldName
// Hvilket felt det skal søkes i, for eksempel e-post, telefonnummer eller navn.
// level
// Hvor mange avvik/skrivefeil som tillates i søket.
// 1 betyr at ett tegn kan være feil, mangle eller være byttet ut.
// top
// Hvor mange søkeresultater som maksimalt hentes tilbake fra dette søket.
// enabled
// Angir om regelen er aktiv eller ikke.
// Hvis den er slått av, brukes ikke dette feltet i Lucene-søket.  