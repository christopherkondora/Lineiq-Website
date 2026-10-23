interface ArrowUpRightProps {
  className?: string;
}

/**
 * The ↗ as a drawing, not a character. None of the three faces carries U+2197,
 * so the browser borrowed it from a system font, and on iOS that font is Apple
 * Color Emoji: a blue tile in the middle of the type. Sized in em and stroked
 * in currentColor, it follows the text it sits in.
 */
export default function ArrowUpRight({ className }: ArrowUpRightProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      width="0.72em"
      height="0.72em"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="square"
      aria-hidden="true"
      focusable="false"
      style={{ display: "inline-block", verticalAlign: "0.02em", overflow: "visible" }}
    >
      <path d="M3 13 13 3M5 3h8v8" />
    </svg>
  );
}
