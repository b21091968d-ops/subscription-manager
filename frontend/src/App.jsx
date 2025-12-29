import { useEffect, useState } from "react";

const API = "http://localhost:5000/api";

function App() {
  const [email, setEmail] = useState("test@test.com");
  const [password, setPassword] = useState("123456");
  const [token, setToken] = useState(localStorage.getItem("token"));

  const [subscriptions, setSubscriptions] = useState([]);
  // ===== ANALYTICS =====
const monthlyTotal = subscriptions.reduce((sum, sub) => {
  const price = Number(sub.price);
  if (sub.period === "month") return sum + price;
  if (sub.period === "year") return sum + price / 12;
  return sum;
}, 0);

const yearlyTotal = subscriptions.reduce((sum, sub) => {
  const price = Number(sub.price);
  if (sub.period === "month") return sum + price * 12;
  if (sub.period === "year") return sum + price;
  return sum;
}, 0);


  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [period, setPeriod] = useState("month");

  // ===== LOGIN =====
  const login = async () => {
    const res = await fetch(`${API}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    localStorage.setItem("token", data.token);
    setToken(data.token);
  };

  // ===== LOAD SUBSCRIPTIONS =====
  const loadSubscriptions = async () => {
    const res = await fetch(`${API}/subscriptions`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    setSubscriptions(data);
  };

  // ===== ADD SUBSCRIPTION =====
  const addSubscription = async () => {
    if (!name || !price) {
      alert("Fill all fields");
      return;
    }

    const res = await fetch(`${API}/subscriptions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name,
        price: Number(price),
        period,
      }),
    });

    if (res.ok) {
      setName("");
      setPrice("");
      setPeriod("month");
      loadSubscriptions();
    } else {
      alert("Error adding subscription");
    }
  };

  // ===== AUTO LOAD =====
  useEffect(() => {
    if (token) {
      loadSubscriptions();
    }
  }, [token]);

  // ===== LOGIN UI =====
  if (!token) {
    return (
      <div style={{ padding: 40 }}>
        <h2>Login</h2>

        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <br /><br />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <br /><br />

        <button onClick={login}>Login</button>
      </div>
    );
  }

  // ===== MAIN UI =====
  return (
    <div style={{ padding: 40 }}>
      <h2>My Subscriptions</h2>
<div style={{ marginBottom: 20 }}>
  <strong>Monthly total:</strong> ${monthlyTotal.toFixed(2)}
  <br />
  <strong>Yearly total:</strong> ${yearlyTotal.toFixed(2)}
</div>

      {/* ADD FORM */}
      <div style={{ marginBottom: 20 }}>
        <input
          placeholder="Name (Netflix)"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <br /><br />

        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <br /><br />

        <select value={period} onChange={(e) => setPeriod(e.target.value)}>
          <option value="month">Per month</option>
          <option value="year">Per year</option>
        </select>
        <br /><br />

        <button onClick={addSubscription}>Add</button>
      </div>

      {/* LIST */}
      {subscriptions.length === 0 && <p>No subscriptions</p>}

      <ul>
        {subscriptions.map((s) => (
          <li key={s.id}>
            {s.name} — {s.price} ({s.period})
          </li>
        ))}
      </ul>

      <br />

      <button
        onClick={() => {
          localStorage.removeItem("token");
          setToken(null);
        }}
      >
        Logout
      </button>
    </div>
  );
}

export default App;
