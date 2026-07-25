import React, { useEffect, useState } from 'react';

export function CleanComponent({ userId }: { userId: string }) {
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    fetch(`/api/users/${userId}`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch user");
        return res.json();
      })
      .then((data) => setUser(data))
      .catch((err) => {
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      });

    return () => controller.abort();
  }, [userId]);

  if (error) {
    return <div className="error-banner">{error}</div>;
  }

  if (!user) {
    return <div className="loading-spinner">Loading...</div>;
  }

  return (
    <div className="user-profile">
      <h2>{user?.name}</h2>
    </div>
  );
}
