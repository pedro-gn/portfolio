import { Fragment } from "react";

/**
 * Renders `**bold**` and `*italic*` segments without resorting to
 * dangerouslySetInnerHTML. Keeps copy in the JSON data files easy to edit.
 */
export function Emphasis({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
  return (
    <>
      {parts.map((part, i) => {
        const bold = /^\*\*([^*]+)\*\*$/.exec(part);
        if (bold) return <strong key={i}>{bold[1]}</strong>;
        const italic = /^\*([^*]+)\*$/.exec(part);
        if (italic) return <em key={i}>{italic[1]}</em>;
        return <Fragment key={i}>{part}</Fragment>;
      })}
    </>
  );
}
