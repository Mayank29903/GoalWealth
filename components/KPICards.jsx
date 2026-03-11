'use client';

import { formatCurrency } from '@/utils/financialHelpers';

const formatNumber = (value) =>
  new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
  }).format(value);

const AnimatedMetricValue = ({ value, valueType }) => {
  const safeValue = Number.isFinite(value) ? value : 0;

  if (valueType === 'text') {
    return <>{value || '--'}</>;
  }

  const finalValueText =
    valueType === 'currency' ? formatCurrency(safeValue) : formatNumber(safeValue);

  return (
    <>
      <span aria-hidden="true">{finalValueText}</span>
      <span aria-hidden="true" className="export-static-value">{finalValueText}</span>
      <span className="sr-only">{finalValueText}</span>
    </>
  );
};

const KPICards = ({ cards = [] }) => {
  return (
    <section
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
      aria-label="Portfolio summary"
    >
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <article
            key={card.title}
            className="ui-card min-w-0 rounded-xl p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm font-medium text-text_secondary">{card.title}</p>
              <span className="inline-flex rounded-md bg-[#224c8714] p-2 text-primary_blue">
                <Icon size={15} aria-hidden="true" />
              </span>
            </div>
            <p
              className={`mt-2 text-2xl font-bold leading-tight break-all wrap-anywhere ${card.valueClass}`}
            >
              <AnimatedMetricValue value={card.value} valueType={card.valueType} />
            </p>
          </article>
        );
      })}
    </section>
  );
};

export default KPICards;
