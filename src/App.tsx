import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import './utils/i18n';
import Layout from './components/layout/Layout';

const ForensicsDashboard = lazy(() => import('./pages/forensics/ForensicsDashboard'));
const ForensicsScenario = lazy(() => import('./pages/forensics/ForensicsScenario'));
const ForensicsResults = lazy(() => import('./pages/forensics/ForensicsResults'));

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></div>
        <p className="text-slate-400 font-mono text-sm tracking-wider">CHARGEMENT DU LAB DFIR...</p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<ForensicsDashboard />} />
            <Route path="/scenario/:id" element={<ForensicsScenario />} />
            <Route path="/results/:id" element={<ForensicsResults />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
