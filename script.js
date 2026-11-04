// Paste your deployed Google Apps Script Web App URL between the quotes.
const API_URL = "https://script.google.com/macros/s/AKfycbw3MDNDwD7hxyqD9mAwvk1BqfMg1QXRLc9q8YAzSgosLYQXPTqfCpUMtFDMvu2eJNh4/exec";

let students = [];
const form = document.getElementById("studentForm");
const message = document.getElementById("message");
const tableBody = document.getElementById("studentTableBody");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const id = document.getElementById("studentId").value;
  const payload = {
    action: id ? "update" : "create",
    id,
    name: document.getElementById("name").value.trim(),
    email: document.getElementById("email").value.trim(),
    domain: document.getElementById("domain").value,
    status: document.getElementById("status").value
  };
  try {
    setMessage(id ? "Updating student…" : "Creating student…", "success");
    const result = await sendRequest(payload);
    if (!result.success) throw new Error(result.message || "Request failed");
    setMessage(result.message, "success");
    resetForm();
    await loadStudents();
  } catch (error) {
    setMessage(error.message, "error");
  }
});

async function loadStudents() {
  if (!isConfigured()) {
    tableBody.innerHTML = '<tr><td colspan="5" class="empty">Connect your Apps Script Web App URL in script.js to load records.</td></tr>';
    setMessage("Setup required: add your deployed Apps Script URL in script.js.", "error");
    return;
  }
  try {
    tableBody.innerHTML = '<tr><td colspan="5" class="empty">Loading records…</td></tr>';
    const response = await fetch(`${API_URL}?action=read`);
    if (!response.ok) throw new Error(`Server returned ${response.status}`);
    const result = await response.json();
    if (!result.success) throw new Error(result.message || "Unable to read records");
    students = result.data || [];
    renderTable();
    updateStats();
    setMessage(`Loaded ${students.length} student record(s).`, "success");
  } catch (error) {
    tableBody.innerHTML = '<tr><td colspan="5" class="empty">Could not load records. Check your Apps Script deployment and URL.</td></tr>';
    setMessage("Unable to load data: " + error.message, "error");
  }
}

function renderTable() {
  tableBody.innerHTML = "";
  if (!students.length) {
    tableBody.innerHTML = '<tr><td colspan="5" class="empty">No student records yet. Add the first student above.</td></tr>';
    return;
  }
  students.forEach(student => {
    const row = document.createElement("tr");
    const nameCell = document.createElement("td");
    nameCell.innerHTML = `<span class="student-name">${escapeHtml(student.name)}</span><span class="student-id">ID: ${escapeHtml(student.id)}</span>`;
    row.appendChild(nameCell);
    [student.email, student.domain].forEach(value => {
      const cell = document.createElement("td");
      cell.textContent = value || "";
      row.appendChild(cell);
    });
    const statusCell = document.createElement("td");
    const status = document.createElement("span");
    status.className = "status " + String(student.status || "").toLowerCase().replace(/\s+/g, "-");
    status.textContent = student.status || "";
    statusCell.appendChild(status);
    row.appendChild(statusCell);
    const actions = document.createElement("td");
    actions.innerHTML = `<div class="row-actions"><button class="btn edit" type="button" data-action="edit">Edit</button><button class="btn danger" type="button" data-action="delete">Delete</button></div>`;
    actions.querySelector('[data-action="edit"]').addEventListener("click", () => editStudent(student.id));
    actions.querySelector('[data-action="delete"]').addEventListener("click", () => deleteStudent(student.id));
    row.appendChild(actions);
    tableBody.appendChild(row);
  });
}

function editStudent(id) {
  const student = students.find(item => String(item.id) === String(id));
  if (!student) return;
  document.getElementById("studentId").value = student.id;
  document.getElementById("name").value = student.name;
  document.getElementById("email").value = student.email;
  document.getElementById("domain").value = student.domain;
  document.getElementById("status").value = student.status;
  document.getElementById("formTitle").textContent = "Update student";
  document.getElementById("submitBtn").textContent = "Save changes";
  document.getElementById("modeTag").textContent = "EDIT MODE";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

async function deleteStudent(id) {
  if (!confirm("Are you sure you want to delete this student record?")) return;
  try {
    setMessage("Deleting student…", "success");
    const result = await sendRequest({ action: "delete", id });
    if (!result.success) throw new Error(result.message || "Delete failed");
    setMessage(result.message, "success");
    await loadStudents();
  } catch (error) {
    setMessage(error.message, "error");
  }
}

async function sendRequest(payload) {
  if (!isConfigured()) throw new Error("Add your deployed Apps Script URL in script.js first.");
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(payload)
  });
  if (!response.ok) throw new Error(`Server returned ${response.status}`);
  return response.json();
}

function resetForm() {
  form.reset();
  document.getElementById("studentId").value = "";
  document.getElementById("formTitle").textContent = "Add a student";
  document.getElementById("submitBtn").textContent = "Create student";
  document.getElementById("modeTag").textContent = "CREATE MODE";
}

function setMessage(text, type) {
  message.textContent = text;
  message.className = "message " + type;
}
function updateStats() {
  document.getElementById("totalCount").textContent = students.length;
  document.getElementById("learningCount").textContent = students.filter(s => s.status === "Learning").length;
  document.getElementById("placedCount").textContent = students.filter(s => s.status === "Placed").length;
}
function isConfigured() {
  return API_URL.startsWith("https://script.google.com/") && !API_URL.includes("PASTE_YOUR");
}
function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  })[char]);
}
document.getElementById("cancelBtn").addEventListener("click", () => { resetForm(); setMessage("", ""); });
document.getElementById("refreshBtn").addEventListener("click", loadStudents);
loadStudents();
