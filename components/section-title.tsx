import type { ReactNode } from "react";
export function SectionTitle({
  children,
  id,
}: {
  children: ReactNode;
  id?: string;
}) {
  return (
    <h2 className="section-title" id={id}>
      <span>{children}</span>
    </h2>
  );
}
