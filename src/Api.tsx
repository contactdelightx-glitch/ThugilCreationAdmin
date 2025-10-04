const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function login(email: string, password: string) {
  return fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
}

export async function getDesigns(page: number = 1, limit: number = 50) {
  return fetch(`${API_BASE_URL}/designs?page=${page}&limit=${limit}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
}
