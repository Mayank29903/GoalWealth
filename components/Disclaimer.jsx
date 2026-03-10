import React from 'react';

const Disclaimer = () => {
  return (
    <section className="mt-8 p-6 bg-background_light border-l-4 border-accent_red rounded-r-md" aria-label="Important Disclaimer">
      <h3 className="text-lg font-bold text-primary_blue mb-2">Important Disclaimer</h3>
      <p className="text-sm text-text_secondary leading-relaxed">
        This tool has been designed for information purposes only. Actual results may vary depending on market conditions. 
        The results should not be interpreted as investment advice or recommendation for any financial product. 
        Past performance is not indicative of future returns. Please consult a certified financial planner before making investment decisions.
      </p>
    </section>
  );
};

export default Disclaimer;