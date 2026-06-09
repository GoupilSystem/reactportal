type LookupRowProps = {
  children: React.ReactNode;
  isSubheader?: boolean;
};

export const LookupRow = ({ children, isSubheader = false }: LookupRowProps) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 8,
      height: isSubheader ? 18 : 24,
    }}
  >
    {children}
  </div>
);