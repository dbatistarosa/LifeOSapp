import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import useAuthStore from './store/authStore';
import { useAuth } from './hooks/useAuth';

// Pages
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import Coach from './pages/Coach';
import Finance from './pages/Finance';
import Music from './pages/Music';
import Sleep from './pages/Sleep';
import Squad from './pages/Squad';
import Purpose from './pages/Purpose';
import Settings from './pages/Settings';
import CheckIn from './pages/CheckIn';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 5 * 60 * 1000 },
  },
});

function AuthInitializer({ children }) {
  useAuth(); // Initializes auth state
  return children;
}

function ProtectedRoute({ children }) {
  const { user, loading, profile } = useAuthStore();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-void flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-aurora-green animate-pulse" />
          <p className="text-text-secondary text-sm">Loading LifeOS...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Redirect to onboarding if not done
  if (profile && !profile.onboarding_done && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }

  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/checkin" element={<ProtectedRoute><CheckIn /></ProtectedRoute>} />
      <Route path="/coach" element={<ProtectedRoute><Coach /></ProtectedRoute>} />
      <Route path="/finance" element={<ProtectedRoute><Finance /></ProtectedRoute>} />
      <Route path="/music" element={<ProtectedRoute><Music /></ProtectedRoute>} />
      <Route path="/sleep" element={<ProtectedRoute><Sleep /></ProtectedRoute>} />
      <Route path="/squad" element={<ProtectedRoute><Squad /></ProtectedRoute>} />
      <Route path="/purpose" element={<ProtectedRoute><Purpose /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthInitializer>
          <AppRoutes />
        </AuthInitializer>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
