import { Montserrat } from 'next/font/google';
import './globals.css';

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
});

export const metadata = {
  title: 'Smart Goal-Based Investment Planner',
  description: 'An interactive financial calculator to estimate required SIP for future goals.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${montserrat.variable} font-sans bg-background_light text-text_primary antialiased`}>
        <header className="bg-primary_blue text-white py-6 shadow-md">
          <div className="container mx-auto px-4">
            <h1 className="text-2xl md:text-3xl font-bold tracking-wide">
              Smart Goal-Based Investment Planner
            </h1>
            <p className="text-sm opacity-90 mt-2">
              Educational Tool for Financial Planning
            </p>
          </div>
        </header>
        <main className="container mx-auto px-4 py-8 min-h-screen">
          {children}
        </main>
        <footer className="bg-text_primary text-white py-6 mt-12">
          <div className="container mx-auto px-4 text-center text-sm">
            <p>&copy; {new Date().getFullYear()} Smart Goal Planner. For Educational Purposes Only.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}