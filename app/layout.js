import './globals.css';

export const metadata = {
  title: 'GoalWealth Planner',
  description:
    'Goal-based investment calculator with SIP projections, scenario analysis, and downloadable reports.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col overflow-x-hidden font-sans bg-background_light text-text_primary antialiased">
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <header
          className="relative overflow-hidden bg-linear-to-r from-[#173761] via-primary_blue to-[#2b5ea8] py-7 text-white shadow-lg"
          role="banner"
        >
          <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-[#ffffff26] blur-3xl" />
          <div className="pointer-events-none absolute -right-20 -bottom-24 h-64 w-64 rounded-full bg-[#b4231840] blur-3xl" />
          <div className="container relative z-10 mx-auto px-4">
            <h1 className="text-2xl md:text-3xl font-bold tracking-wide">
              GoalWealth Planner
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-[#e6efff]">
              Goal-Based Investment Calculator
            </p>
          </div>
        </header>
        <main
          id="main-content"
          tabIndex={-1}
          className="container mx-auto w-full flex-1 overflow-x-clip px-4 py-8"
        >
          {children}
        </main>
        <footer
          className="mt-auto shrink-0 border-t border-[#ffffff1f] bg-text_primary py-6 text-white"
          role="contentinfo"
        >
          <div className="container mx-auto px-4 text-center text-sm">
            <p>&copy; {new Date().getFullYear()} GoalWealth Planner. For educational purposes only.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
