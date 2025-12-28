import { useState, useEffect, useRef } from "react";

const CATEGORIES = ["Развлечения", "Работа", "Обучение", "Другое"];
const COLORS = ["#2563eb", "#16a34a", "#ea580c", "#9333ea"];

function App() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Развлечения");
  const canvasRef = useRef(null);

  const [subscriptions, setSubscriptions] = useState(() => {
    const saved = localStorage.getItem("subscriptions");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("subscriptions", JSON.stringify(subscriptions));
  }, [subscriptions]);

  useEffect(() => {
    drawChart();
  }, [subscriptions]);

  const addSubscription = () => {
    if (!name || !price) return;
    setSubscriptions([
      ...subscriptions,
      { id: Date.now(), name, price: Number(price), category },
    ]);
    setName("");
    setPrice("");
  };

  const removeSubscription = (id) => {
    setSubscriptions(subscriptions.filter((s) => s.id !== id));
  };

  const totalsByCategory = CATEGORIES.map((cat) =>
    subscriptions
      .filter((s) => s.category === cat)
      .reduce((sum, s) => sum + s.price, 0)
  );

  const monthlyTotal = totalsByCategory.reduce((a, b) => a + b, 0);

  const drawChart = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const max = Math.max(...totalsByCategory, 1);
    totalsByCategory.forEach((value, i) => {
      const h = (value / max) * 140;
      ctx.fillStyle = COLORS[i];
      ctx.fillRect(40 + i * 70, 160 - h, 40, h);
      ctx.fillStyle = "#000";
      ctx.fillText(CATEGORIES[i], 32 + i * 70, 180);
    });
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Subscriptions</h1>

        <input
          style={styles.input}
          placeholder="Сервис (Netflix)"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          style={styles.input}
          placeholder="Цена в месяц"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <select
          style={styles.input}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {CATEGORIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>

        <button style={styles.button} onClick={addSubscription}>
          + Добавить
        </button>

        <canvas ref={canvasRef} width={320} height={200} />

        {subscriptions.map((s) => (
          <div key={s.id} style={styles.item}>
            <span>{s.name}</span>
            <b>${s.price}</b>
            <button onClick={() => removeSubscription(s.id)}>✕</button>
          </div>
        ))}

        <div style={styles.total}>
          Итого в месяц: ${monthlyTotal}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#eef2ff",
    display: "flex",
    justifyContent: "center",
    padding: 12,
  },
  card: {
    width: "100%",
    maxWidth: 420,
    background: "#fff",
    borderRadius: 16,
    padding: 16,
    boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
  },
  title: {
    textAlign: "center",
    marginBottom: 12,
  },
  input: {
    width: "100%",
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
    border: "1px solid #ddd",
  },
  button: {
    width: "100%",
    padding: 14,
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    marginBottom: 12,
  },
  item: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: 6,
  },
  total: {
    marginTop: 12,
    fontWeight: "bold",
    textAlign: "center",
  },
};

export default App;
