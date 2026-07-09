import { Redirect } from 'expo-router';
import { useApp } from '../lib/store';

export default function Index() {
  const { onboardingComplete, locked } = useApp();

  if (!onboardingComplete) return <Redirect href="/onboarding/welcome" />;
  if (locked) return <Redirect href="/lock" />;
  return <Redirect href="/(tabs)" />;
}
