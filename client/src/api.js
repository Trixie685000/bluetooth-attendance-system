async function request(url, options = {}) {
  const response = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || data.message || "Something went wrong");
  }

  return data;
}

export function login(user) {
  return request("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(user)
  });
}

export function register(user) {
  return request("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(user)
  });
}

export function getStudents() {
  return request("/api/students");
}

export function createStudent(student) {
  return request("/api/students", {
    method: "POST",
    body: JSON.stringify(student)
  });
}

export function updateStudent(id, student) {
  return request(`/api/students/${id}`, {
    method: "PUT",
    body: JSON.stringify(student)
  });
}

export function deleteStudent(id) {
  return request(`/api/students/${id}`, { method: "DELETE" });
}

export function getAttendance() {
  return request("/api/attendance");
}

export function createAttendance(record) {
  return request("/api/attendance", {
    method: "POST",
    body: JSON.stringify(record)
  });
}

export function updateAttendance(id, record) {
  return request(`/api/attendance/${id}`, {
    method: "PUT",
    body: JSON.stringify(record)
  });
}

export function deleteAttendance(id) {
  return request(`/api/attendance/${id}`, { method: "DELETE" });
}
