# 💜 ClearBudget — AI Finance Coach for Students

> Built for the Orion Build Challenge 2026

ClearBudget helps students take control of their money. Enter your income and expenses, get an instant spending breakdown chart, and receive personalised AI-powered financial advice in plain English — no jargon, no spreadsheets.

---

## 🌐 Live Demo

**[https://clearbudget-lime.vercel.app/](https://clearbudget-lime.vercel.app/)**

---

## 🎯 The Problem

Millions of students globally struggle with personal finance. With rising tuition, rent, and living costs, most have no structured way to understand where their money goes or how to save. Existing tools are too complex, too generic, or built for professionals — not students living on tight budgets.

---

## ✨ The Solution

ClearBudget is a web app where students input their monthly income and expense categories. The app instantly visualises their spending breakdown and uses Claude AI to return a personalised financial health assessment, overspending alerts, and three specific savings tips — all in plain English.

---

## 🚀 Features

- 📊 Real-time spending pie chart across 8 expense categories
- 🤖 Claude AI-powered personalised financial advice
- 💡 Overspending detection and savings recommendations
- 📱 Works on mobile and desktop
- ⚡ No sign-up required — instant and free to use

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite |
| Charts | Chart.js + react-chartjs-2 |
| AI Engine | Anthropic Claude API |
| Deployment | Vercel |

---

## 🏗️ Architecture

```
User Input (income + expenses)
        ↓
React State Management
        ↓
Chart.js → Spending Pie Chart
        ↓
Prompt Builder → Anthropic Claude API
        ↓
Personalised Financial Advice → UI
```

---

## 📦 Setup & Installation

1. Clone the repository
```bash
git clone https://github.com/YOURUSERNAME/clearbudget.git
cd clearbudget
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file in the root directory
```
VITE_API_KEY=your_anthropic_api_key_here
```

4. Run the development server
```bash
npm run dev
```

5. Open [http://localhost:5173](http://localhost:5173) in your browser

---

## 🌍 Real-World Impact

ClearBudget targets the 200+ million students globally who lack access to affordable financial advice. The app can scale to support:

- Multiple currencies
- Open banking API integration
- Loan and scholarship tracking
- Peer spending benchmarking
- University partnership programmes

---

## 📁 Project Structure

```
clearbudget/
├── src/
│   ├── App.jsx        # Main application component
│   └── index.css      # Global styles
├── .env               # API key (not committed)
├── .gitignore
├── vite.config.js     # Vite + proxy configuration
├── package.json
└── README.md
```

---

## 🏆 Hackathon

Built solo for the **Orion Build Challenge 2026** across the following domains:
- Financial Technology
- Artificial Intelligence & Machine Learning
- Web & Mobile Development

---

## 👤 Author

Built with 💜 by Uthman Mustapha
