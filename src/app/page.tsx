import { redirect } from 'next/navigation';

export default async function Home(): Promise<void> {
  return redirect('/homepage');
}
