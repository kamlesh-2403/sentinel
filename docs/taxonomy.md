# Sentinel Rule & Issue Taxonomy Guide

This document provides a comprehensive reference of all 15+ production readiness rules evaluated by Sentinel across React, Node.js, JavaScript, and TypeScript.

---

## Table of Contents
- [React & Frontend Rules](#react--frontend-rules)
  - [REACT_HOOK_DEPENDENCY_RULE](#react_hook_dependency_rule)
  - [REACT_LIST_KEY_REORDERING_RULE](#react_list_key_reordering_rule)
  - [IMMUTABLE_STATE_MUTATION_RULE](#immutable_state_mutation_rule)
  - [UNHANDLED_ASYNC_EVENT_HANDLER_RULE](#unhandled_async_event_handler_rule)
  - [MEMORY_LEAK_EVENT_LISTENER_RULE](#memory_leak_event_listener_rule)
- [Node.js & Backend Rules](#nodejs--backend-rules)
  - [NODE_EVENT_LOOP_BLOCKING_RULE](#node_event_loop_blocking_rule)
  - [SILENT_ERROR_SWALLOWING_RULE](#silent_error_swallowing_rule)
  - [NETWORK_TIMEOUT_BOUNDARY_RULE](#network_timeout_boundary_rule)
  - [API_RATE_LIMITING_RULE](#api_rate_limiting_rule)
- [Security & Defensive Coding Rules](#security--defensive-coding-rules)
  - [HARDCODED_SECRET_SECURITY_RULE](#hardcoded_secret_security_rule)
  - [SQL_INJECTION_PREVENTION_RULE](#sql_injection_prevention_rule)
  - [NULL_SAFETY_RULE](#null_safety_rule)
  - [UNSAFE_TYPE_ASSERTION_RULE](#unsafe_type_assertion_rule)
  - [FLOATING_POINT_CURRENCY_PRECISION_RULE](#floating_point_currency_precision_rule)

---

## React & Frontend Rules

### `REACT_HOOK_DEPENDENCY_RULE`
- **Severity:** `HIGH`
- **Issue:** Stale Closure & Stale View Hazard.
- **Why Code Coverage Misses It:** Initial render tests pass 100%, but when props update dynamically during user navigation, the component closure retains old variable references.
- **Bad Code:**
  ```tsx
  useEffect(() => {
    fetch(`/api/users/${userId}`);
  }, []); // Missing userId dependency!
  ```
- **Good Code:**
  ```tsx
  useEffect(() => {
    fetch(`/api/users/${userId}`);
  }, [userId]);
  ```

---

### `REACT_LIST_KEY_REORDERING_RULE`
- **Severity:** `MEDIUM`
- **Issue:** Array Index Used as Key Prop.
- **Why Code Coverage Misses It:** Rendering static test lists works fine, but when users re-order, sort, or delete items, React re-uses component instances with stale form input state.
- **Bad Code:**
  ```tsx
  {items.map((item, index) => <ItemCard key={index} data={item} />)}
  ```
- **Good Code:**
  ```tsx
  {items.map((item) => <ItemCard key={item.id} data={item} />)}
  ```

---

### `IMMUTABLE_STATE_MUTATION_RULE`
- **Severity:** `HIGH`
- **Issue:** Direct In-Place State Mutation.
- **Why Code Coverage Misses It:** Mutating arrays directly in state updates internal memory references, so `console.log` shows updated data, but React shallow comparison ignores it and fails to re-render the view.
- **Bad Code:**
  ```tsx
  items.push(newItem);
  setItems(items);
  ```
- **Good Code:**
  ```tsx
  setItems((prev) => [...prev, newItem]);
  ```

---

### `UNHANDLED_ASYNC_EVENT_HANDLER_RULE`
- **Severity:** `HIGH`
- **Issue:** Async UI Event Handler Lacks Error Boundary.
- **Why Code Coverage Misses It:** Mock API calls succeed in unit tests, but when real network calls fail or timeout, the button remains permanently in a disabled or loading state.
- **Bad Code:**
  ```tsx
  const handleClick = async () => {
    setLoading(true);
    await api.submit();
    setLoading(false);
  };
  ```
- **Good Code:**
  ```tsx
  const handleClick = async () => {
    try {
      setLoading(true);
      await api.submit();
    } catch (err) {
      showErrorBanner(err);
    } finally {
      setLoading(false);
    }
  };
  ```

---

### `MEMORY_LEAK_EVENT_LISTENER_RULE`
- **Severity:** `HIGH`
- **Issue:** Unbound Event Listener Attached Without Teardown.
- **Why Code Coverage Misses It:** Component mount tests pass quickly, but in real browser usage, unmounting and re-mounting components leaks event listeners onto `window`, causing tab sluggishness and browser OOM crashes.
- **Bad Code:**
  ```tsx
  useEffect(() => {
    window.addEventListener("resize", handleResize);
  }, []);
  ```
- **Good Code:**
  ```tsx
  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  ```

---

## Node.js & Backend Rules

### `NODE_EVENT_LOOP_BLOCKING_RULE`
- **Severity:** `CRITICAL`
- **Issue:** Synchronous I/O Execution in Server Request Cycle.
- **Why Code Coverage Misses It:** Single-user unit tests pass in milliseconds, but under concurrent production traffic, `fs.readFileSync` blocks the single Node.js main thread, freezing all concurrent requests.
- **Bad Code:**
  ```ts
  app.get("/data", (req, res) => {
    const file = fs.readFileSync("./large-file.json", "utf-8");
    res.json(JSON.parse(file));
  });
  ```
- **Good Code:**
  ```ts
  app.get("/data", async (req, res) => {
    const file = await fs.promises.readFile("./large-file.json", "utf-8");
    res.json(JSON.parse(file));
  });
  ```

---

### `SILENT_ERROR_SWALLOWING_RULE`
- **Severity:** `HIGH`
- **Issue:** Empty Catch Block Swallows Exceptions.
- **Why Code Coverage Misses It:** The catch block executes and passes coverage, but hides production bugs from telemetry tools like Sentry and Datadog.
- **Bad Code:**
  ```ts
  try {
    processPayment();
  } catch (err) {}
  ```
- **Good Code:**
  ```ts
  try {
    processPayment();
  } catch (err) {
    logger.error("Payment failed", { error: err });
    throw err;
  }
  ```

---

### `NETWORK_TIMEOUT_BOUNDARY_RULE`
- **Severity:** `HIGH`
- **Issue:** HTTP Client Request Lacks Timeout.
- **Why Code Coverage Misses It:** Fast local mock servers resolve instantly, but slow or hung upstream production services exhaust Node server socket pools.
- **Bad Code:**
  ```ts
  const response = await fetch("https://third-party-api.com/data");
  ```
- **Good Code:**
  ```ts
  const response = await fetch("https://third-party-api.com/data", {
    signal: AbortSignal.timeout(5000),
  });
  ```

---

## Security & Defensive Coding Rules

### `HARDCODED_SECRET_SECURITY_RULE`
- **Severity:** `CRITICAL`
- **Issue:** Hardcoded Credentials in Source Code.
- **Bad Code:**
  ```ts
  const apiKey = "api_key = 'secret_abc123456789'";
  ```
- **Good Code:**
  ```ts
  const apiKey = process.env.API_KEY;
  ```

---

### `SQL_INJECTION_PREVENTION_RULE`
- **Severity:** `CRITICAL`
- **Issue:** Dynamic SQL Query String Concatenation.
- **Bad Code:**
  ```ts
  const query = "SELECT * FROM users WHERE id = '" + userInput + "'";
  ```
- **Good Code:**
  ```ts
  const query = "SELECT * FROM users WHERE id = $1";
  await db.query(query, [userInput]);
  ```
