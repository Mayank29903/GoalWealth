import { formatCurrency } from '@/utils/financialHelpers';

const InvestmentTable = ({ rows = [] }) => {
  return (
    <section
      className="ui-card rounded-lg p-4"
      aria-label="Year by year investment breakdown table"
    >
      <h3 className="text-lg font-semibold text-primary_blue">Year-by-Year Breakdown</h3>
      <p className="mt-1 text-sm text-text_secondary">
        Annual progress of invested amount, expected value, and gain.
      </p>

      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full border-collapse text-sm">
          <caption className="sr-only">
            Yearly invested amount, expected value, and estimated gain breakdown table.
          </caption>
          <thead>
            <tr className="border-b border-[#9190904d] text-left text-text_secondary">
              <th scope="col" className="px-3 py-2 font-medium">
                Year
              </th>
              <th scope="col" className="px-3 py-2 font-medium">
                Total Invested
              </th>
              <th scope="col" className="px-3 py-2 font-medium">
                Expected Value
              </th>
              <th scope="col" className="px-3 py-2 font-medium">
                Estimated Gain
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.year} className="border-b border-[#91909033]">
                <th scope="row" className="px-3 py-2 font-medium text-text_primary">
                  {row.year}
                </th>
                <td className="px-3 py-2 text-text_secondary">
                  {formatCurrency(row.totalInvested)}
                </td>
                <td className="px-3 py-2 text-text_primary">
                  {formatCurrency(row.expectedValue)}
                </td>
                <td className="px-3 py-2 font-semibold text-accent_red">
                  {formatCurrency(row.estimatedGain)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default InvestmentTable;

