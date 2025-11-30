// --- セッションからログインユーザーを取得 ---
const currentUserRaw = sessionStorage.getItem("currentUser");
if (!currentUserRaw) {
  // 未ログインならログイン画面へ
  alert("ログインしてください");
  window.location.href = "shiftee_login.html";
} else {
  const currentUser = JSON.parse(currentUserRaw);
  // 表示用に名前をセット
  const loggedNameEl = document.getElementById("loggedName");
  if (loggedNameEl) {
    loggedNameEl.innerText = `${currentUser.name} (${currentUser.id})${currentUser.isAdmin ? " - 管理者" : ""}`;
  }

  // ログアウトボタン
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      sessionStorage.removeItem("currentUser");
      window.location.href = "shiftee_login.html";
    });
  }

  // ここで currentUser を使って画面の挙動を分岐したい場合は currentUser.type / currentUser.isAdmin を参照してください
  // 例: バイトは編集を制限したい、など
}







const firstHalf = document.getElementById("firstHalf");
const secondHalf = document.getElementById("secondHalf");
const loadMonthBtn = document.getElementById("loadMonth");
const submitShiftBtn = document.getElementById("submitShift");

const showFirstBtn = document.getElementById("showFirst");
const showSecondBtn = document.getElementById("showSecond");

let weekdayNames = ["日","月","火","水","木","金","土"];

// シフト欄作成関数
function createShiftInputs(year, month, startDay, endDay, container) {
  for (let day = startDay; day <= endDay; day++) {
    const date = new Date(year, month - 1, day);
    const weekday = weekdayNames[date.getDay()];

    // ★曜日で色クラスを決める
    let colorClass = "";
    if (date.getDay() === 0) colorClass = "sunday";     // 日曜 → 赤
    if (date.getDay() === 6) colorClass = "saturday";   // 土曜 → 青

    const div = document.createElement("div");
    div.classList.add("shift-row");

    div.innerHTML = `
      <label class="${colorClass}">${weekday}${day}日:
        <select class="shiftType">
          <option value="rest">休み</option>
          <option value="work">出れる</option>
        </select>
      </label>
      <div class="timeSelector">
        <label>開始:
          <input type="time" class="startTime">
        </label>
        <label>終了:
          <input type="time" class="endTime">
        </label>
      </div>
    `;
    container.appendChild(div);
  }

  // 休み選択で時間入力表示切替
  container.querySelectorAll(".shiftType").forEach(select => {
    const timeDiv = select.nextElementSibling;
    select.addEventListener("change", () => {
      timeDiv.style.display = (select.value === "rest") ? "none" : "block";
    });
    select.dispatchEvent(new Event("change")); // 初期表示
  });
}

// 半月シフト生成
function loadShiftForm() {
  const year = parseInt(document.getElementById("yearInput").value);
  const month = parseInt(document.getElementById("monthInput").value);

  firstHalf.innerHTML = "";
  secondHalf.innerHTML = "";

  const lastDay = new Date(year, month, 0).getDate();

  createShiftInputs(year, month, 1, 15, firstHalf);
  createShiftInputs(year, month, 16, lastDay, secondHalf);

  // 初期表示は前半のみ
  firstHalf.style.display = "block";
  secondHalf.style.display = "none";
}

// 初回ロード
loadMonthBtn.addEventListener("click", loadShiftForm);
loadShiftForm();

// 送信処理（仮：コンソール出力）
submitShiftBtn.addEventListener("click", () => {
  const shifts = [];
  document.querySelectorAll("#firstHalf .shift-row, #secondHalf .shift-row").forEach(div => {
    const type = div.querySelector(".shiftType").value;
    const start = div.querySelector(".startTime")?.value || "";
    const end = div.querySelector(".endTime")?.value || "";
    const labelText = div.querySelector("label").innerText;
    shifts.push({ label: labelText, type, start, end });
  });

  console.log(shifts);
  alert("希望シフトを送信しました！（コンソールで確認）");
});

// ▼ 前半・後半表示切り替え
showFirstBtn.addEventListener("click", () => {
  firstHalf.style.display = "block";
  secondHalf.style.display = "none";
});

showSecondBtn.addEventListener("click", () => {
  firstHalf.style.display = "none";
  secondHalf.style.display = "block";
});

document.getElementById("applyTemplate").addEventListener("click", () => {
  const rows = document.querySelectorAll(".shift-row");

  rows.forEach(row => {
    const label = row.querySelector("label").innerText; // 例: "火5日"
    const weekday = label[0]; // 最初の1文字 → 曜日

    const index = weekdayNames.indexOf(weekday); // 0(日)〜6(土)

    const tempType = document.querySelectorAll(".tempType")[index].value;
    const tempStart = document.querySelectorAll(".tempStart")[index].value;
    const tempEnd = document.querySelectorAll(".tempEnd")[index].value;

    // ▼ 「休み or 出たい」を反映
    const shiftType = row.querySelector(".shiftType");
    shiftType.value = tempType;
    shiftType.dispatchEvent(new Event("change"));

    // ▼ 時間を反映（“出たい” の場合だけ）
    if (tempType === "work") {
      row.querySelector(".startTime").value = tempStart;
      row.querySelector(".endTime").value = tempEnd;
    } else {
      row.querySelector(".startTime").value = "";
      row.querySelector(".endTime").value = "";
    }
  });

  alert("まとめてを適用しました！");
});

// ログインしたユーザー名を表示
const userName = localStorage.getItem("username");
if (userName) {
  document.getElementById("adminWelcome").textContent =
    userName + " さん、こんにちは！";
}
