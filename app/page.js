'use client';

import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import LandingPage from '@/components/LandingPage';
import PlannerWorkspace from '@/components/PlannerWorkspace';

export default function Home() {
  const [hasStarted, setHasStarted] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const transitionProps = shouldReduceMotion
    ? {
        initial: { opacity: 1 },
        animate: { opacity: 1 },
        exit: { opacity: 1 },
      }
    : {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -10 },
      };

  return (
    <AnimatePresence mode="wait" initial={false}>
      {!hasStarted ? (
        <motion.div
          key="landing"
          {...transitionProps}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        >
          <LandingPage onStart={() => setHasStarted(true)} />
        </motion.div>
      ) : (
        <motion.div
          key="planner"
          {...transitionProps}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        >
          <PlannerWorkspace onBack={() => setHasStarted(false)} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

