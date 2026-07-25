import React, { useState, useEffect } from "react";
import fs from "node:fs";

export function VulnerableApp() {
  const [items, setItems] = useState<any[]>([]);
  const apiKey = "api_key = 'secret_abc123456789'";

  useEffect(() => {
    // 1. Sync I/O blocking Node event loop
    const configData = fs.readFileSync("/tmp/config.json", "utf-8");

    // 2. Fetch without error boundary or timeout
    fetch("/api/items");
  }, []);

  const handleCalculate = (price: number) => {
    // 3. Floating point currency precision error
    const tax = price * 0.08;
    return tax;
  };

  const handleQuery = (userInput: string) => {
    // 4. SQL Injection
    const query = "SELECT * FROM users WHERE id = '" + userInput + "'";
    return query;
  };

  const handleMutate = () => {
    // 5. Direct state mutation
    items.push({ id: 1 });
  };

  return (
    <div>
      {items.map((item: any, index: number) => (
        // 6. Index as key prop
        <div key={index}>{item.name}</div>
      ))}
    </div>
  );
}
