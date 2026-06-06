import { useMemo } from 'react';

const WEIGHTS = {
  mood: 0.20,
  stress: 0.20,
  sleep_quality: 0.15,
  energy: 0.15,
  finance_stress: 0.10,
  purpose: 0.10,
  squad: 0.10,
};

function computeScore(checkin) {
  if (!checkin) return 0;
  const mood = (checkin.mood / 10) * WEIGHTS.mood;
  const stress = ((10 - checkin.stress) / 10) * WEIGHTS.stress;
  const sleep = (checkin.sleep_quality / 10) * WEIGHTS.sleep_quality;
  const energy = (checkin.energy / 10) * WEIGHTS.energy;
  const finance = ((10 - checkin.finance_stress) / 10) * WEIGHTS.finance_stress;
  const purpose = (checkin.purpose / 10) * WEIGHTS.purpose;
  const squad = (checkin.squad / 10) * WEIGHTS.squad;
  return Math.round((mood + stress + sleep + energy + finance + purpose + squad) * 100);
}

export function useLifeScore(checkins = []) {
  const score = useMemo(() => {
    if (!checkins.length) return 72;
    // Use last 7 days
    const recent = checkins.slice(0, 7);
    if (recent.length === 0) return 72;
    const avg = {
      mood: 0, stress: 0, sleep_quality: 0, energy: 0,
      finance_stress: 0, purpose: 0, squad: 0,
    };
    recent.forEach((c) => {
      Object.keys(avg).forEach((k) => { avg[k] += (c[k] || 5); });
    });
    Object.keys(avg).forEach((k) => { avg[k] /= recent.length; });
    return computeScore(avg);
  }, [checkins]);

  const pillarScores = useMemo(() => {
    if (!checkins.length) return {
      mood: 72, stress: 60, sleep: 70, energy: 75,
      finance: 65, purpose: 68, squad: 80, body: 70,
    };
    const recent = checkins.slice(0, 7);
    const avg = { mood: 0, stress: 0, sleep_quality: 0, energy: 0, finance_stress: 0, purpose: 0, squad: 0 };
    recent.forEach((c) => {
      Object.keys(avg).forEach((k) => { avg[k] += (c[k] || 5); });
    });
    Object.keys(avg).forEach((k) => { avg[k] /= recent.length; });
    return {
      mood: Math.round((avg.mood / 10) * 100),
      stress: Math.round(((10 - avg.stress) / 10) * 100),
      sleep: Math.round((avg.sleep_quality / 10) * 100),
      energy: Math.round((avg.energy / 10) * 100),
      finance: Math.round(((10 - avg.finance_stress) / 10) * 100),
      purpose: Math.round((avg.purpose / 10) * 100),
      squad: Math.round((avg.squad / 10) * 100),
      body: Math.round((avg.energy / 10) * 95),
    };
  }, [checkins]);

  return { score, pillarScores };
}
