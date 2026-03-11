'use client';

import { useSyncExternalStore } from 'react';
import LandingPage from '@/components/LandingPage';
import PlannerWorkspace from '@/components/PlannerWorkspace';

const VIEW_SESSION_KEY = 'goalwealth:view:planner-open-v1';
const viewListeners = new Set();
const noopSubscribe = () => () => {};

const readPersistedView = () => {
  if (typeof window === 'undefined') return false;

  try {
    return window.sessionStorage.getItem(VIEW_SESSION_KEY) === 'true';
  } catch {
    return false;
  }
};

const subscribeToView = (listener) => {
  viewListeners.add(listener);
  return () => viewListeners.delete(listener);
};

const persistView = (nextValue) => {
  if (typeof window === 'undefined') return;

  try {
    window.sessionStorage.setItem(VIEW_SESSION_KEY, nextValue ? 'true' : 'false');
  } catch {
    // Ignore storage write errors and keep navigation functional.
  }

  viewListeners.forEach((listener) => listener());
};

export default function Home() {
  const isHydrated = useSyncExternalStore(noopSubscribe, () => true, () => false);
  const hasStarted = useSyncExternalStore(
    subscribeToView,
    readPersistedView,
    () => false
  );

  if (!isHydrated) {
    return null;
  }

  return (
    <div className="min-h-0">
      <section
        aria-hidden={hasStarted}
        className={hasStarted ? 'hidden' : 'view-transition-in block'}
      >
        <LandingPage onStart={() => persistView(true)} />
      </section>

      <section
        aria-hidden={!hasStarted}
        className={hasStarted ? 'view-transition-in block' : 'hidden'}
      >
        <PlannerWorkspace onBack={() => persistView(false)} />
      </section>
    </div>
  );
}

