import { money, moneyShort } from "@/lib/derive";

type Props = {
  studentName: string;
  awarded: number;
  inPlay: number;
  openCount: number;
};

export default function LedgerStrip({
  studentName,
  awarded,
  inPlay,
  openCount,
}: Props) {
  return (
    <header className="border-rule bg-card border-b">
      <div className="mx-auto flex max-w-5xl flex-wrap items-baseline justify-between gap-x-10 gap-y-4 px-6 py-6">
        <h1 className="font-display text-ink text-[26px] font-semibold tracking-tight">
          {studentName}&rsquo;s scholarships
        </h1>

        <dl className="flex items-baseline gap-x-8">
          <div className="flex items-baseline gap-2">
            <dt className="text-ink-soft text-[13px]">Awarded to date</dt>
            <dd className="font-mono text-ledger text-[22px] font-semibold tabular-nums">
              {money(awarded)}
            </dd>
          </div>

          <div aria-hidden="true" className="bg-rule h-6 w-px" />

          <div className="flex items-baseline gap-2">
            <dt className="text-ink-soft text-[13px]">Still in play</dt>
            <dd className="font-mono text-ink text-[22px] font-semibold tabular-nums">
              {moneyShort(inPlay)}
              <span className="text-ink-faint ml-2 text-[13px] font-normal">
                across {openCount}
              </span>
            </dd>
          </div>
        </dl>
      </div>
    </header>
  );
}
