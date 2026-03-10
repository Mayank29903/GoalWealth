import './globals.css';

export const metadata = {
  title: 'GoalWealth Planner',
  description:
    'Goal-based investment calculator with SIP projections, scenario analysis, and downloadable reports.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col font-sans bg-background_light text-text_primary antialiased">
        <header className="bg-primary_blue text-white py-6 shadow-md">
          <div className="container mx-auto px-4">
            <h1 className="text-2xl md:text-3xl font-bold tracking-wide">
              GoalWealth Planner
            </h1>
            <p className="text-sm opacity-90 mt-2">
              Goal-Based Investment Calculator
            </p>
          </div>
        </header>
        <main className="container mx-auto w-full flex-1 px-4 py-8">
          {children}
        </main>
        <footer className="border-t border-[#ffffff1f] bg-text_primary py-6 text-white">
          <div className="container mx-auto px-4 text-center text-sm">
            <p>&copy; {new Date().getFullYear()} GoalWealth Planner. For educational purposes only.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
