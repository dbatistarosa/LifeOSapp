import { Navigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

export default function Landing() {
  const { user, loading } = useAuthStore();
  if (loading) return null;
  return <Navigate to={user ? '/dashboard' : '/auth'} replace />;
}
