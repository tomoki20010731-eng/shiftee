document.addEventListener("DOMContentLoaded", () => {
  // --- 現在ログインしている管理者情報を取得 ---
  const currentUser = JSON.parse(sessionStorage.getItem("currentUser") || "{}");
  if (currentUser.name) {
    document.getElementById("adminWelcome").textContent = `${currentUser.name} さん、ようこそ管理者画面へ`;
  }

  // --- 初期データ（必要ならここを編集） ---
  const defaultEmployees = [
    { id: "001", name: "廣瀬新太", section: "ホール", password: "pass001" },
    { id: "002", name: "磯田朱里", section: "ホール", password: "pass002" }
  ];

  const defaultParts = [
    { id: "101", name: "トキ", section: "キッチン", password: "part001" },
    { id: "102", name: "土田優衣", section: "外販", password: "part002" }
  ];

  // --- DOM 要素 ---
  const empTbody = document.querySelector("#employeeTable tbody");
  const partTbody = document.querySelector("#partTable tbody");

  const addEmployeeBtn = document.getElementById("addEmployee");
  const saveEmployeeBtn = document.getElementById("saveEmployee");
  const addPartBtn = document.getElementById("addPart");
  const savePartBtn = document.getElementById("savePart");

  // --- データ読み込み／保存 ---
  let employees = JSON.parse(localStorage.getItem("shiftee_employees") || "null");
  let parts = JSON.parse(localStorage.getItem("shiftee_parts") || "null");

  if (!employees) {
    employees = defaultEmployees;
    localStorage.setItem("shiftee_employees", JSON.stringify(employees));
  }
  if (!parts) {
    parts = defaultParts;
    localStorage.setItem("shiftee_parts", JSON.stringify(parts));
  }

  function saveEmployees() {
    localStorage.setItem("shiftee_employees", JSON.stringify(employees));
  }
  function saveParts() {
    localStorage.setItem("shiftee_parts", JSON.stringify(parts));
  }

  // --- レンダリング関数 ---
  function renderEmployees() {
    empTbody.innerHTML = "";
    employees.forEach((u, idx) => {
      const tr = document.createElement("tr");
      tr.dataset.index = idx;
      tr.innerHTML = `
        <td><input class="inp-id" value="${escapeHtml(u.id)}"></td>
        <td><input class="inp-name" value="${escapeHtml(u.name)}"></td>
        <td>
          <select class="inp-section">
            <option value="ホール"${u.section==="ホール"?" selected":""}>ホール</option>
            <option value="キッチン"${u.section==="キッチン"?" selected":""}>キッチン</option>
            <option value="外販"${u.section==="外販"?" selected":""}>外販</option>
          </select>
        </td>
        <td><input class="inp-pass" value="${escapeHtml(u.password)}" type="text"></td>
        <td><button class="btn-del-emp">削除</button></td>
      `;
      empTbody.appendChild(tr);
    });
  }

  function renderParts() {
    partTbody.innerHTML = "";
    parts.forEach((u, idx) => {
      const tr = document.createElement("tr");
      tr.dataset.index = idx;
      tr.innerHTML = `
        <td><input class="inp-id" value="${escapeHtml(u.id)}"></td>
        <td><input class="inp-name" value="${escapeHtml(u.name)}"></td>
        <td>
          <select class="inp-section">
            <option value="ホール"${u.section==="ホール"?" selected":""}>ホール</option>
            <option value="キッチン"${u.section==="キッチン"?" selected":""}>キッチン</option>
            <option value="外販"${u.section==="外販"?" selected":""}>外販</option>
          </select>
        </td>
        <td><input class="inp-pass" value="${escapeHtml(u.password)}" type="text"></td>
        <td><button class="btn-del-part">削除</button></td>
      `;
      partTbody.appendChild(tr);
    });
  }

  // --- ユーティリティ ---
  function escapeHtml(str) {
    if (str == null) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  // --- イベント: 追加・保存・削除（既存コード通り） ---
  addEmployeeBtn.addEventListener("click", () => {
    const nextId = generateNextId(employees, "001");
    employees.push({ id: nextId, name: "", section: "ホール", password: "" });
    renderEmployees();
  });

  addPartBtn.addEventListener("click", () => {
    const nextId = generateNextId(parts, "101");
    parts.push({ id: nextId, name: "", section: "キッチン", password: "" });
    renderParts();
  });

  function generateNextId(list, start) {
    const nums = list.map(x => parseInt(x.id, 10)).filter(n => !isNaN(n));
    const base = parseInt(start, 10) || 1;
    const max = nums.length ? Math.max(...nums) : base - 1;
    const next = max + 1;
    return String(next).padStart(3, "0");
  }

  saveEmployeeBtn.addEventListener("click", () => {
    const rows = empTbody.querySelectorAll("tr");
    rows.forEach((tr, idx) => {
      const id = tr.querySelector(".inp-id").value.trim();
      const name = tr.querySelector(".inp-name").value.trim();
      const section = tr.querySelector(".inp-section").value;
      const password = tr.querySelector(".inp-pass").value;
      employees[idx] = { id, name, section, password };
    });
    saveEmployees();
    alert("社員データを保存しました");
    renderEmployees();
  });

  savePartBtn.addEventListener("click", () => {
    const rows = partTbody.querySelectorAll("tr");
    rows.forEach((tr, idx) => {
      const id = tr.querySelector(".inp-id").value.trim();
      const name = tr.querySelector(".inp-name").value.trim();
      const section = tr.querySelector(".inp-section").value;
      const password = tr.querySelector(".inp-pass").value;
      parts[idx] = { id, name, section, password };
    });
    saveParts();
    alert("バイトデータを保存しました");
    renderParts();
  });

  empTbody.addEventListener("click", (e) => {
    if (e.target && e.target.classList.contains("btn-del-emp")) {
      const tr = e.target.closest("tr");
      const idx = Number(tr.dataset.index);
      if (confirm("この社員を削除しますか？")) {
        employees.splice(idx, 1);
        saveEmployees();
        renderEmployees();
      }
    }
  });

  partTbody.addEventListener("click", (e) => {
    if (e.target && e.target.classList.contains("btn-del-part")) {
      const tr = e.target.closest("tr");
      const idx = Number(tr.dataset.index);
      if (confirm("このバイトを削除しますか？")) {
        parts.splice(idx, 1);
        saveParts();
        renderParts();
      }
    }
  });

  renderEmployees();
  renderParts();
});
