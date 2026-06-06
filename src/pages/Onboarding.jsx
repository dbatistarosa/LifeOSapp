import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import useAuthStore from '../store/authStore';
import OnboardingFlow from '../components/onboarding/OnboardingFlow';

export default function Onboarding() {
  const navigate = useNavigate();
  const { user, setProfile } = useAuthStore();

  const handleComplete = async ({ challenges, watch }) => {
    if (user) {
      try {
        const { data } = await supabase
          .from('profiles')
          .upsert({
            id: user.id,
            onboarding_done: true,
            challenges,
            watch_type: watch,
          })
          .select().single();
        if (data) setProfile(data);
      } catch (e) {
        // Continue anyway
      }
    }
    navigate('/dashboard');
  };

  return <OnboardingFlow onComplete={handleComplete} />;
}
