// shiftee_login.js

const GLOBAL_ADMIN_PASSWORD_KEY = "adminPassword";
if (!localStorage.getItem(GLOBAL_ADMIN_PASSWORD_KEY)) {
  localStorage.setItem(GLOBAL_ADMIN_PASSWORD_KEY, "admin123");
}

// =============================
// ユーザー読み込み
// =============================
function loadUsers() {
  const employees = JSON.parse(localStorage.getItem("shiftee_employees") || "[]");
  const parts = JSON.parse(localStorage.getItem("shiftee_parts") || "[]");

  employees.forEach(u => {
    u.type = u.type || "社員";
    u.id = String(u.id); // ← ID を文字列化して統一
  });

  parts.forEach(u => {
    u.type = u.type || "バイト";
    u.id = String(u.id);
  });

  return [...employees, ...parts];
}

// =============================
// ログイン成功処理
// =============================
function onLoginSuccess(user, asAdmin = false) {

  // ★ ここを追加！ログインした人の名前を保存
  localStorage.setItem("username", user.name);

  const current = {
    id: user.id,
    name: user.name,
    section: user.section,
    type: user.type,
    isAdmin: !!asAdmin
  };
  sessionStorage.setItem("currentUser", JSON.stringify(current));

  if (asAdmin) {
    window.location.href = "shiftee_admin.html";
  } else {
    window.location.href = "shiftee_employee.html";
  }
}

// =============================
// 一般ログイン
// =============================
document.getElementById("employeeLogin").addEventListener("click", () => {
  const id = document.getElementById("employeeId").value.trim();
  const pw = document.getElementById("password").value;

  if (!id || !pw) {
    alert("従業員番号とパスワードを入力してください");
    return;
  }

  const users = loadUsers();
  const user = users.find(u => u.id === String(id) && u.password === pw);

  if (user) {
    onLoginSuccess(user, false);
  } else {
    alert("従業員番号またはパスワードが違います");
  }
});

// =============================
// 責任者ログイン
// =============================
document.getElementById("adminLogin").addEventListener("click", () => {
  const id = document.getElementById("employeeId").value.trim();
  const pw = document.getElementById("password").value;

  if (!id || !pw) {
    alert("従業員番号とパスワードを入力してください");
    return;
  }

  const users = loadUsers();
  const user = users.find(u => u.id === String(id));

  if (!user) {
    alert("従業員番号が存在しません");
    return;
  }

  // ★ バイトは管理者不可
  if (user.type === "バイト") {
    alert("責任者ログインは社員のみ使用できます（バイト不可）");
    return;
  }

  const adminPw = localStorage.getItem(GLOBAL_ADMIN_PASSWORD_KEY);

  // 固定管理者パスワード
  if (pw === adminPw) {
    onLoginSuccess(user, true);
    return;
  }

  // 社員の通常パスワード
  if (user.password !== pw) {
    alert("従業員番号またはパスワードが違います");
    return;
  }

  onLoginSuccess(user, true);
});
