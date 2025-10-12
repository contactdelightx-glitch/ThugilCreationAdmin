const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// ---------- AUTH ----------
export async function login(email: string, password: string) {
  return fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
}

// ---------- USERS ----------
export async function createUser(
  email: string,
  password: string,
  permissions: string[],
  status: string = "active",
) {
  return fetch(`${API_BASE_URL}/user/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password, status, permissions }),
  });
}

export async function getAllUsers() {
  return fetch(`${API_BASE_URL}/user`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function updateUser(
  id: number,
  data: { email?: string; password?: string; status?: string },
) {
  return fetch(`${API_BASE_URL}/user/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

export async function deleteUser(id: number) {
  return fetch(`${API_BASE_URL}/user/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
}

// ---------- DASHBOARD ----------
export async function getDashboardData(data: { email: string }) {
  if (!data.email) throw new Error("Email is required for dashboard data");

  const encodedEmail = encodeURIComponent(data.email);

  return fetch(`${API_BASE_URL}/dashboard/${encodedEmail}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  }).then((res) => res.json());
}

// ---------- DESIGNS ----------
export async function getDesigns(page: number = 1, limit: number = 50) {
  return fetch(`${API_BASE_URL}/designs?page=${page}&limit=${limit}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
}
export async function getDesignsWithFilters(
  page: number = 1, 
  limit: number = 50, 
  filters: Record<string, string | number> = {}
) {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...filters
  });

  return fetch(`${API_BASE_URL}/designs?${params.toString()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
}
export async function getTodaysDesigns() {
  return fetch(`${API_BASE_URL}/designs/recents`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function createDesign(data: object) {
  return fetch(`${API_BASE_URL}/designs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then((res) => res.json());
}

export async function updateDesign(id: number, data: object) {
  return fetch(`${API_BASE_URL}/designs/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then((res) => res.json());
}

export async function deleteDesign(id: number) {
  return fetch(`${API_BASE_URL}/designs/${id}`, {
    method: "DELETE",
  }).then((res) => res.json());
}

// ---------- IMAGES ----------
export async function getAllStoreImages(page: number = 1, limit: number = 50) {
  return fetch(`${API_BASE_URL}/images?page=${page}&limit=${limit}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function getStoreImageByKey(key: string) {
  return fetch(`${API_BASE_URL}/images/${key}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
}
