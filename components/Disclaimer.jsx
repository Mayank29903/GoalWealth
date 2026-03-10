import React from 'react';

const Disclaimer = () => {
  return (
    <section
      className="rounded-r-md border-l-4 border-accent_red bg-background_light p-6"
      aria-label="Important disclaimer and assumptions"
    >
      <h3 className="mb-2 text-lg font-bold text-primary_blue">Important Disclaimer</h3>
      <p className="text-sm leading-relaxed text-text_secondary">
        This tool is for educational planning only and does not constitute investment, tax, or
        legal advice. Always validate decisions with a SEBI-registered investment adviser or a
        certified financial planner.
      </p>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-text_secondary">
        <li>Assumes constant annual inflation and annual return throughout the goal period.</li>
        <li>Assumes monthly SIP contributions and excludes taxes, exit loads, and fund charges.</li>
        <li>Market returns are volatile; actual outcomes can materially differ from projections.</li>
      </ul>
    </section>
  );
};

export default Disclaimer;
