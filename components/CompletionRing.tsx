type Props = {
  /** 0–1 */
  value: number;
  done: number;
  total: number;
  size?: number;
  tone?: "ink" | "ledger" | "muted";
};

export default function CompletionRing({
  value,
  done,
  total,
  size = 44,
  tone = "ink",
}: Props) {
  const stroke = 4;
  const r = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;
  const color =
    tone === "muted"
      ? "var(--color-ink-faint)"
      : tone === "ledger" || value === 1
        ? "var(--color-ledger)"
        : "var(--color-ink)";

  return (
    <span
      className="relative inline-flex shrink-0 items-center justify-center"
      style={{ width: size, height: size }}
      role="img"
      aria-label={`${done} of ${total} requirements complete`}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--color-rule)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - value)}
          style={{
            transition:
              "stroke-dashoffset 520ms cubic-bezier(0.22, 1, 0.36, 1), stroke 320ms ease",
          }}
        />
      </svg>
      <span
        className="font-mono absolute text-[11px] leading-none tabular-nums"
        style={{ color }}
        aria-hidden="true"
      >
        {done}/{total}
      </span>
    </span>
  );
}
