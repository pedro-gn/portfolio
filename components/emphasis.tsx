import { Fragment } from "react";

/**
 * Renders text with `**bold**` segments as <strong>, without resorting to
 * dangerouslySetInnerHTML. Keeps copy in the JSON data files easy to edit.
 */
export function Emphasis({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, i) => {
        const match = /^\*\*([^*]+)\*\*$/.exec(part);
        return match ? (
          <strong key={i}>{match[1]}</strong>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        );
      })}
    </>
  );
}
