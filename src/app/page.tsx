import { redirect } from 'next/navigation';

export default async function App(): Promise<void> {
  return redirect('/home');
}
