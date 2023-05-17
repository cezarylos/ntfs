import { ReactElement } from 'react';

export default async function ThankYou(): Promise<ReactElement> {
  return <>
    <h1>Thank you</h1>
    <h2>Your file has been downloaded</h2>
  </>;
}
