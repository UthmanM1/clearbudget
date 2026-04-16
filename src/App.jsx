import { useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const EXPENSE_CATEGORIES = [
  "Rent / Housing",
  "Food & Groceries",
  "Transport",
  "Entertainment",
  "Utilities",
  "Education",
  "Health",
  "Other",
];

const COLORS = [
  "#7F77DD", "#1D9E75", "#D85A30", "#D4537E",
  "#378ADD", "#639922", "#BA7517", "#888780",
];

export default function App() {
  const [income, setIncome] = useState("");
  const [expenses, setExpenses] = useState(
    Object.fromEntries(EXPENSE_CATEGORIES.map((c) => [c, ""]))
  );
  const [advice, setAdvice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const totalExpenses = Object.values(expenses)
    .map(Number)
    .reduce((a, b) => a + b, 0);

  const remaining = Number(income) - totalExpenses;

  const chartData = {
    labels: EXPENSE_CATEGORIES.filter((c) => Number(expenses[c]) > 0),
    datasets: [
      {
        data: EXPENSE_CATEGORIES.map((c) => Number(expenses[c])).filter((v) => v > 0),
        backgroundColor: COLORS,
        borderWidth: 1,
      },
    ],
  };

  const handleAnalyse = async () => {
    if (!income || totalExpenses === 0) {
      setError("Please enter your income and at least one expense.");
      return;
    }
    setError(null);
    setLoading(true);
    setAdvice(null);

    const expenseLines = EXPENSE_CATEGORIES
      .filter((c) => Number(expenses[c]) > 0)
      .map((c) => `- ${c}: £${expenses[c]}`)
      .join("\n");

    const prompt = `You are a friendly personal finance coach for students. A student has shared their monthly finances:

Monthly Income: £${income}
Monthly Expenses:
${expenseLines}
Total Expenses: £${totalExpenses}
Remaining: £${remaining}

Please provide:
1. A brief assessment of their financial health (2-3 sentences)
2. The top 2 areas where they are overspending (if any)
3. Three specific, actionable savings tips tailored to their situation
4. A recommended savings goal for the month

Keep the tone friendly, encouraging, and jargon-free. Format your response with clear headings using emoji.`;

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": import.meta.env.VITE_API_KEY,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }],
        }),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error.message);
      setAdvice(data.content[0].text);
    } catch (err) {
      setError("Something went wrong: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8f7ff", fontFamily: "system-ui, sans-serif" }}>
      
      {/* Header */}
      <div style={{ background: "#7F77DD", padding: "1.5rem 2rem", color: "white" }}>
        <h1 style={{ margin: 0, fontSize: "1.6rem", fontWeight: 600 }}>💜 ClearBudget</h1>
        <p style={{ margin: "0.25rem 0 0", opacity: 0.85, fontSize: "0.95rem" }}>
          AI-powered finance coach for students
        </p>
      </div>

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "2rem 1rem" }}>
        
        {/* Income */}
        <div style={cardStyle}>
          <h2 style={sectionTitle}>Monthly Income</h2>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontSize: "1.2rem", color: "#888" }}>£</span>
            <input
              type="number"
              placeholder="e.g. 1200"
              value={income}
              onChange={(e) => setIncome(e.target.value)}
              style={inputStyle}
            />
          </div>
        </div>

        {/* Expenses */}
        <div style={cardStyle}>
          <h2 style={sectionTitle}>Monthly Expenses</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
            {EXPENSE_CATEGORIES.map((cat) => (
              <div key={cat}>
                <label style={{ fontSize: "0.85rem", color: "#555", display: "block", marginBottom: "4px" }}>
                  {cat}
                </label>
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <span style={{ color: "#888" }}>£</span>
                  <input
                    type="number"
                    placeholder="0"
                    value={expenses[cat]}
                    onChange={(e) => setExpenses({ ...expenses, [cat]: e.target.value })}
                    style={{ ...inputStyle, width: "100%" }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary bar */}
        {income && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "1.5rem" }}>
            {[
              { label: "Income", value: `£${Number(income).toLocaleString()}`, color: "#1D9E75" },
              { label: "Expenses", value: `£${totalExpenses.toLocaleString()}`, color: "#D85A30" },
              { label: remaining >= 0 ? "Remaining" : "Overspent", value: `£${Math.abs(remaining).toLocaleString()}`, color: remaining >= 0 ? "#7F77DD" : "#E24B4A" },
            ].map((s) => (
              <div key={s.label} style={{ background: "white", borderRadius: "12px", padding: "1rem", textAlign: "center", border: "0.5px solid #e0e0e0" }}>
                <div style={{ fontSize: "0.8rem", color: "#888", marginBottom: "4px" }}>{s.label}</div>
                <div style={{ fontSize: "1.4rem", fontWeight: 600, color: s.color }}>{s.value}</div>
              </div>
            ))}
          </div>
        )}

        {/* Chart */}
        {chartData.labels.length > 0 && (
          <div style={{ ...cardStyle, display: "flex", justifyContent: "center" }}>
            <div style={{ width: "280px" }}>
              <h2 style={{ ...sectionTitle, textAlign: "center" }}>Spending Breakdown</h2>
              <Pie data={chartData} options={{ plugins: { legend: { position: "bottom" } } }} />
            </div>
          </div>
        )}

        {/* Analyse button */}
        {error && <p style={{ color: "#E24B4A", textAlign: "center" }}>{error}</p>}
        <div style={{ textAlign: "center", margin: "1.5rem 0" }}>
          <button onClick={handleAnalyse} disabled={loading} style={buttonStyle}>
            {loading ? "Analysing..." : "✨ Get AI Advice"}
          </button>
        </div>

        {/* AI Advice */}
        {advice && (
          <div style={{ ...cardStyle, borderLeft: "4px solid #7F77DD" }}>
            <h2 style={sectionTitle}>Your Personalised Advice</h2>
            <div style={{ whiteSpace: "pre-wrap", lineHeight: 1.7, color: "#333", fontSize: "0.97rem" }}>
              {advice}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

const cardStyle = {
  background: "white",
  borderRadius: "12px",
  padding: "1.5rem",
  marginBottom: "1.5rem",
  border: "0.5px solid #e0e0e0",
};

const sectionTitle = {
  margin: "0 0 1rem",
  fontSize: "1rem",
  fontWeight: 600,
  color: "#333",
};

const inputStyle = {
  border: "1px solid #ddd",
  borderRadius: "8px",
  padding: "8px 12px",
  fontSize: "1rem",
  outline: "none",
  width: "140px",
};

const buttonStyle = {
  background: "#7F77DD",
  color: "white",
  border: "none",
  borderRadius: "10px",
  padding: "0.8rem 2.5rem",
  fontSize: "1rem",
  fontWeight: 600,
  cursor: "pointer",
};
