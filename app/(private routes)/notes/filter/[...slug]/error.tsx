'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div style={{ padding: '24px' }}>
      <h2>Something went wrong!</h2>
      <p>Could not fetch the list of notes. {error.message}</p>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}
