import { useMemo, useState } from "react";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import WebApp from "@twa-dev/sdk";
import "./App.css";

type FeeBadge = { text: string; kind: "green" | "blue" | "gray" };

type MenuRow = {
  id: string;
  title: string;
  subtitle?: string;
  iconText: string;
  fee?: FeeBadge;
  disabled?: boolean;
  onClick?: () => void;
};

type TxType = "topup" | "withdraw" | "pay" | "bonus";
type Tx = {
  id: string;
  ts: string;
  type: TxType;
  title: string;
  amountRub?: number;
  status: "done" | "pending" | "failed";
};

function useTgUser() {
  try {
    const u = WebApp?.initDataUnsafe?.user;
    return {
      username: u?.username ? `@${u.username}` : "@username",
    };
  } catch {
    return { username: "@username" };
  }
}

function TopBar({ showBack }: { showBack?: boolean }) {
  const nav = useNavigate();
  return (
    <div className="tgTop">
      <div className="tgLeft">
        {showBack ? (
          <button className="backBtn" onClick={() => nav(-1)} aria-label="Назад">
            ←
          </button>
        ) : (
          <div className="backBtn ghost" aria-hidden>
            ←
          </div>
        )}
        <div className="appName">WalletPro</div>
      </div>
      <button className="dots" aria-label="Меню" onClick={() => alert("Меню")}>
        ⋮
      </button>
    </div>
  );
}

function HeaderWithId() {
  const nav = useNavigate();
  const walletId = "6MZ7KRRK";
  return (
    <div className="headerRow">
      <div className="brandMark" aria-hidden />
      <div className="brandTitle">WalletPro</div>

      <div className="idPill">
        <div className="idPillLabel">WALLETPRO ID</div>
        <div className="idPillValue">{walletId}</div>
        <button className="copyMini" onClick={() => navigator.clipboard.writeText(walletId)} aria-label="Копировать">
          ⧉
        </button>
      </div>

      <button className="circleBtn" onClick={() => nav("/bonuses")} aria-label="Бонусы">
        🎁
      </button>
    </div>
  );
}

function BottomNav() {
  const nav = useNavigate();
  const loc = useLocation();

  const active = useMemo(() => {
    if (loc.pathname.startsWith("/services")) return "services";
    if (loc.pathname.startsWith("/profile")) return "profile";
    return "wallet";
  }, [loc.pathname]);

  return (
    <div className="bottomWrap">
      <div className="bottomNav">
        <button className={`bnItem ${active === "wallet" ? "active" : ""}`} onClick={() => nav("/")}>
          <span className="bnDot" />
          <span className="bnText">Кошелек</span>
        </button>

        <button className={`bnItem ${active === "services" ? "active" : ""}`} onClick={() => nav("/services")}>
          <span className="bnIcon grid" />
          <span className="bnText">Сервисы</span>
        </button>

        <button className={`bnItem ${active === "profile" ? "active" : ""}`} onClick={() => nav("/profile")}>
          <span className="bnIcon user" />
          <span className="bnText">Профиль</span>
        </button>
      </div>
    </div>
  );
}

function CardRow({ row }: { row: MenuRow }) {
  const cls = `menuRow ${row.disabled ? "disabled" : ""}`;
  return (
    <button className={cls} disabled={row.disabled} onClick={row.onClick}>
      <div className="rowLeft">
        <div className="rowIcon">{row.iconText}</div>
        <div className="rowText">
          <div className="rowTitle">{row.title}</div>
          {row.subtitle ? <div className="rowSub">{row.subtitle}</div> : null}
        </div>
      </div>

      {row.fee ? <span className={`fee ${row.fee.kind}`}>{row.fee.text}</span> : <span className="chev">›</span>}
    </button>
  );
}

/* HOME */
function Home() {
  const nav = useNavigate();
  return (
    <div className="screen">
      <TopBar />
      <HeaderWithId />

      <div className="balanceRow">
        <div>
          <div className="muted">Баланс</div>
          <div className="balMain">0 ₽</div>
          <div className="balSub">0.00 USDT</div>
        </div>
        <button className="linkBtn" onClick={() => nav("/history")}>
          История операций
        </button>
      </div>

      <div className="quickRow">
        <button className="qBtn primary" onClick={() => nav("/topup")}>
          <div className="qIcon">＋</div>
          <div className="qText">Пополнить</div>
        </button>
        <button className="qBtn" onClick={() => nav("/withdraw")}>
          <div className="qIcon">↗</div>
          <div className="qText">Вывести</div>
        </button>
        <button className="qBtn" onClick={() => nav("/stars")}>
          <div className="qIcon">☆</div>
          <div className="qText">Звезды</div>
        </button>
        <button className="qBtn" onClick={() => nav("/payqr")}>
          <div className="qIcon">⌁</div>
          <div className="qText">Оплатить</div>
        </button>
      </div>

      <div className="bigBanner" onClick={() => alert("Реферальная программа")} role="button" tabIndex={0}>
        <div className="bbLeft">
          <div className="bbTitle">Реферальная программа</div>
          <div className="bbSub">Приглашай друзей</div>
        </div>
        <div className="bbArt" aria-hidden />
        <div className="bbArrow">→</div>
      </div>

      <BottomNav />
    </div>
  );
}

/* TOPUP */
function TopUp() {
  const nav = useNavigate();
  const rows: MenuRow[] = [
    { id: "qr", title: "QR", iconText: "⌁", fee: { text: "Комиссия: 3%", kind: "blue" }, onClick: () => nav("/payqr") },
    { id: "qr2", title: "QR", subtitle: "От 3000₽", iconText: "⌁", fee: { text: "Комиссия: 15%", kind: "blue" }, disabled: true },
    { id: "gifts", title: "Подарки Telegram", iconText: "🧩", onClick: () => nav("/gifts") },
    { id: "crypto", title: "Криптовалюта", iconText: "₮", fee: { text: "Без комиссии", kind: "green" }, onClick: () => alert("Криптовалюта (скоро)") },
  ];
  return (
    <div className="screen">
      <TopBar showBack />
      <HeaderWithId />
      <div className="pageTitleRow">
        <div className="pageTitle">Пополнить баланс</div>
        <button className="backPill" onClick={() => nav(-1)}>
          ◀ Назад
        </button>
      </div>
      <div className="listWrap">{rows.map((r) => <CardRow key={r.id} row={r} />)}</div>
      <BottomNav />
    </div>
  );
}

/* WITHDRAW */
function Withdraw() {
  const nav = useNavigate();
  const rows: MenuRow[] = [
    { id: "pgonid", title: "PGON ID", iconText: "S", fee: { text: "Без комиссии", kind: "green" }, onClick: () => alert("PGON ID (скоро)") },
    { id: "sbp", title: "СБП", subtitle: "От 1500₽", iconText: "▶", fee: { text: "Комиссия: 3.5%", kind: "blue" }, onClick: () => alert("СБП (скоро)") },
    { id: "card", title: "Карта", subtitle: "От 1500₽", iconText: "💳", fee: { text: "Комиссия: 3.5%", kind: "blue" }, onClick: () => alert("Карта (скоро)") },
    { id: "crypto", title: "Криптовалюта", iconText: "₮", onClick: () => alert("Криптовалюта (скоро)") },
  ];
  return (
    <div className="screen">
      <TopBar showBack />
      <HeaderWithId />
      <div className="pageTitleRow">
        <div className="pageTitle">Вывести средства</div>
        <button className="backPill" onClick={() => nav(-1)}>
          ◀ Назад
        </button>
      </div>
      <div className="listWrap">{rows.map((r) => <CardRow key={r.id} row={r} />)}</div>
      <BottomNav />
    </div>
  );
}

/* PAY QR */
function PayQr() {
  const nav = useNavigate();
  const [link, setLink] = useState("");
  const can = link.trim().length > 5;

  return (
    <div className="screen">
      <TopBar showBack />
      <HeaderWithId />

      <div className="pageTitleRow">
        <div className="pageTitle">Оплатить по QR-коду</div>
        <button className="backPill" onClick={() => nav(-1)}>
          ◀ Назад
        </button>
      </div>

      <div className="formBlock">
        <div className="inputCard">
          <div className="inpLabel">Ссылка</div>
          <input className="inp" placeholder="Вставьте ссылку на оплату" value={link} onChange={(e) => setLink(e.target.value)} />
        </div>

        <button className="linkPurple" onClick={() => alert("Открыть сканер (позже)")}>
          Оплатить по QR-коду
        </button>

        <button className={`primaryWide ${can ? "" : "disabled"}`} disabled={!can} onClick={() => alert("Продолжить: " + link)}>
          Продолжить
        </button>
      </div>

      <BottomNav />
    </div>
  );
}

/* STARS */
function Stars() {
  const nav = useNavigate();
  const tg = useTgUser();
  const [tab, setTab] = useState<"stars" | "premium">("stars");
  const [username, setUsername] = useState(tg.username);
  const [count, setCount] = useState("50");

  const price = Math.round(Number(count || "0") * 1.35 * 100) / 100;
  const available = 0.0;
  const canBuy = tab === "stars" && username.trim().length > 1 && Number(count) > 0;

  return (
    <div className="screen">
      <TopBar showBack />
      <HeaderWithId />

      <div className="pageTitleRow">
        <div className="pageTitle">Звезды Telegram</div>
        <button className="backPill" onClick={() => nav(-1)}>
          ◀ Назад
        </button>
      </div>

      <div className="tabs">
        <button className={`tabBtn ${tab === "stars" ? "active" : ""}`} onClick={() => setTab("stars")}>
          Звезды
        </button>
        <button className={`tabBtn ${tab === "premium" ? "active" : ""}`} onClick={() => setTab("premium")}>
          Премиум
        </button>
      </div>

      <div className="inputStack">
        <div className="inputCard">
          <div className="inpLabel">Ник Telegram</div>
          <input className="inp" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>

        <div className="inputCard">
          <div className="inpLabel">Количество звезд</div>
          <input className="inp" inputMode="numeric" value={count} onChange={(e) => setCount(e.target.value.replace(/[^\d]/g, ""))} />
        </div>

        <div className="priceCard">
          <div className="priceLeft">{price.toFixed(2)} ₽</div>
          <div className="priceRight">К оплате</div>
        </div>

        <div className="availCard">
          <div className="availLeft">{available.toFixed(2)} ₽</div>
          <div className="availRight">Доступно</div>
        </div>

        <div className="note">Звезды зачисляются после покупки</div>

        <button className={`buyBtn ${canBuy ? "" : "disabled"}`} disabled={!canBuy} onClick={() => alert("Покупка звезд (скоро)")}>
          Купить звезды
        </button>
      </div>

      <BottomNav />
    </div>
  );
}

/* SERVICES */
function Services() {
  const nav = useNavigate();
  const rows: MenuRow[] = [
    { id: "tgifts", title: "Подарки Telegram", iconText: "🧩", onClick: () => nav("/gifts") },
    { id: "crypto", title: "Криптовалюта", iconText: "₮", fee: { text: "Без комиссии", kind: "green" }, onClick: () => alert("Криптовалюта (скоро)") },
    { id: "cryptobot", title: "CryptoBot", iconText: "V", fee: { text: "Комиссия: 3%", kind: "blue" }, onClick: () => alert("CryptoBot (скоро)") },
    { id: "xrocket", title: "xRocket", iconText: "🚀", fee: { text: "Комиссия: 1.5%", kind: "blue" }, onClick: () => alert("xRocket (скоро)") },
    { id: "promo", title: "Промокод", iconText: "▦", fee: { text: "Без комиссии", kind: "green" }, onClick: () => alert("Промокод (скоро)") },
    { id: "pgonid", title: "PGON ID", iconText: "S", fee: { text: "Без комиссии", kind: "green" }, onClick: () => alert("PGON ID (скоро)") },
  ];
  return (
    <div className="screen">
      <TopBar />
      <HeaderWithId />
      <div className="pageTitleRow">
        <div className="pageTitle">Сервисы</div>
        <div />
      </div>
      <div className="listWrap">{rows.map((r) => <CardRow key={r.id} row={r} />)}</div>
      <BottomNav />
    </div>
  );
}

/* GIFTS */
function Gifts() {
  const nav = useNavigate();
  return (
    <div className="screen">
      <TopBar showBack />
      <HeaderWithId />
      <div className="pageTitleRow">
        <div className="pageTitle">Подарки Telegram</div>
        <button className="backPill" onClick={() => nav(-1)}>
          ◀ Назад
        </button>
      </div>
      <div className="sectionCard">
        <div className="sectionTitle">Пополнение подарками</div>
        <div className="sectionSub">Раздел добавим: выбор подарка → подтверждение → зачисление.</div>
      </div>
      <BottomNav />
    </div>
  );
}

/* BONUSES */
function Bonuses() {
  const nav = useNavigate();
  return (
    <div className="screen">
      <TopBar showBack />
      <HeaderWithId />
      <div className="pageTitleRow">
        <div className="pageTitle">Бонусы</div>
        <button className="backPill" onClick={() => nav(-1)}>
          ◀ Назад
        </button>
      </div>
      <div className="sectionCard">
        <div className="sectionTitle">Бонусный баланс</div>
        <div className="bigValue">0</div>
        <div className="sectionSub">Правила начислений добавим следующим шагом.</div>
      </div>
      <BottomNav />
    </div>
  );
}

/* HISTORY */
function History() {
  const nav = useNavigate();
  const [filter, setFilter] = useState<"all" | TxType>("all");

  const txs: Tx[] = [
    { id: "t1", ts: "Сегодня", type: "pay", title: "Оплата по QR", amountRub: -399, status: "done" },
    { id: "t2", ts: "Вчера", type: "topup", title: "Пополнение", amountRub: 1000, status: "done" },
    { id: "t3", ts: "Вчера", type: "withdraw", title: "Вывод", amountRub: -1500, status: "pending" },
    { id: "t4", ts: "2 дня назад", type: "bonus", title: "Бонусы", amountRub: 50, status: "done" },
  ];

  const shown = txs.filter((t) => (filter === "all" ? true : t.type === filter));

  return (
    <div className="screen">
      <TopBar showBack />
      <HeaderWithId />
      <div className="pageTitleRow">
        <div className="pageTitle">История операций</div>
        <button className="backPill" onClick={() => nav(-1)}>
          ◀ Назад
        </button>
      </div>

      <div className="tabs small">
        <button className={`tabBtn ${filter === "all" ? "active" : ""}`} onClick={() => setFilter("all")}>
          Все
        </button>
        <button className={`tabBtn ${filter === "topup" ? "active" : ""}`} onClick={() => setFilter("topup")}>
          Пополн.
        </button>
        <button className={`tabBtn ${filter === "withdraw" ? "active" : ""}`} onClick={() => setFilter("withdraw")}>
          Вывод
        </button>
        <button className={`tabBtn ${filter === "pay" ? "active" : ""}`} onClick={() => setFilter("pay")}>
          Оплаты
        </button>
        <button className={`tabBtn ${filter === "bonus" ? "active" : ""}`} onClick={() => setFilter("bonus")}>
          Бонусы
        </button>
      </div>

      <div className="listWrap">
        {shown.map((t) => (
          <div key={t.id} className="histRow">
            <div className="histLeft">
              <div className="histTitle">{t.title}</div>
              <div className="histSub">
                {t.ts} • {t.status === "done" ? "Успешно" : t.status === "pending" ? "В процессе" : "Отмена"}
              </div>
            </div>
            <div className="histRight">
              {typeof t.amountRub === "number" ? (
                <div className={`histAmt ${t.amountRub < 0 ? "neg" : "pos"}`}>
                  {t.amountRub < 0 ? "-" : "+"}
                  {Math.abs(t.amountRub)} ₽
                </div>
              ) : (
                <div className="histAmt">—</div>
              )}
            </div>
          </div>
        ))}
      </div>

      <BottomNav />
    </div>
  );
}

/* PROFILE */
function Profile() {
  const nav = useNavigate();
  const tg = useTgUser();
  const walletId = "6MZ7KRRK";

  const rows: MenuRow[] = [
    { id: "bonuses", title: "Бонусы", iconText: "🎁", onClick: () => nav("/bonuses") },
    { id: "ref", title: "Реферальная программа", iconText: "👥", onClick: () => alert("Реферальная программа (скоро)") },
    { id: "history", title: "История операций", iconText: "🕒", onClick: () => nav("/history") },
    { id: "appeal", title: "Апелляции", iconText: "⚠", onClick: () => alert("Апелляции (скоро)") },
    { id: "api", title: "API", iconText: "🔗", onClick: () => alert("API (скоро)") },
    { id: "verify", title: "Верификация", iconText: "👤", onClick: () => alert("Верификация (скоро)") },
    { id: "support", title: "Поддержка", iconText: "💬", onClick: () => alert("Поддержка (скоро)") },
  ];

  return (
    <div className="screen">
      <TopBar showBack />

      <div className="profileTop">
        <div className="profileUser">{tg.username}</div>
        <div className="profileId">
          ID: #{walletId}
          <button className="copyDot" onClick={() => navigator.clipboard.writeText(walletId)} aria-label="Копировать ID">
            ●
          </button>
        </div>
      </div>

      <div className="listWrap profileList">
        {rows.map((r) => (
          <button key={r.id} className="profileRow" onClick={r.onClick}>
            <div className="prLeft">
              <div className="prIcon">{r.iconText}</div>
              <div className="prTitle">{r.title}</div>
            </div>
          </button>
        ))}
      </div>

      <BottomNav />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/topup" element={<TopUp />} />
        <Route path="/withdraw" element={<Withdraw />} />
        <Route path="/payqr" element={<PayQr />} />
        <Route path="/stars" element={<Stars />} />

        <Route path="/services" element={<Services />} />
        <Route path="/gifts" element={<Gifts />} />

        <Route path="/bonuses" element={<Bonuses />} />
        <Route path="/history" element={<History />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}