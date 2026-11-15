/**
 * One panel on the Session tab: a titled box with an optional aside.
 *
 * Its own file because the Situation panel and the session close share it with
 * the rest of the tab, and a second copy of the same box is how two panels on
 * one page start looking different from each other.
 */

export default function Panel({
  title,
  aside,
  children,
  testid,
}: {
  title: string;
  aside?: React.ReactNode;
  children: React.ReactNode;
  testid?: string;
}) {
  return (
    <section className="rounded-large border border-outline-variant p-5" data-testid={testid}>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-title-medium text-on-surface">{title}</h3>
        {aside}
      </div>
      <div className="mt-3">{children}</div>
    </section>
  );
}
