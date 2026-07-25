import React, { useEffect, useState } from 'react';

export function UserProfile({ userId }: { userId: string }) {
  const [user, setUser] = useState<any>(null);

  // Dangerous Assumption #1: Developer assumes userId will never change during component lifecycle
  // Dangerous Assumption #2: Developer assumes fetch network call will never fail or timeout
  useEffect(() => {
    fetch(`/api/users/${userId}`)
      .then((res) => res.json())
      .then((data) => setUser(data));
  }, []);

  // Dangerous Assumption #3: Developer assumes 'user' state is initialized synchronously before mount
  return (
    <div className="user-profile">
      <h2>User Profile</h2>
      <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>
    </div>
  );
}
