import HomeView from '@/components/HomeView';
import { getMoonState } from '@/lib/moon';

// Keep in step with layout.tsx
export const revalidate = 3600;

export default function Home() {
  return <HomeView moon={getMoonState()} />;
}
