import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import WebApp from "@twa-dev/sdk";

try {
  WebApp.ready();
  WebApp.expand();

  // Цвета шапки/фона Telegram (не обязательно, но приятнее)
  WebApp.setHeaderColor("#0b0716");
  WebApp.setBackgroundColor("#0b0716");

  // Важно для корректной высоты на мобиле
  document.documentElement.style.height = "100%";
  document.body.style.height = "100%";
} catch (e) {
  // вне Telegram — ок
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);