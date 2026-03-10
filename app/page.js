'use client';

import { useState } from 'react';
import LandingPage from '@/components/LandingPage';
import PlannerWorkspace from '@/components/PlannerWorkspace';

export default function Home() {
  const [hasStarted, setHasStarted] = useState(false);

  if (!hasStarted) {
    return <LandingPage onStart={() => setHasStarted(true)} />;
  }

  return <PlannerWorkspace onBack={() => setHasStarted(false)} />;
}

