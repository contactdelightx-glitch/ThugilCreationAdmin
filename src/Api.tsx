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

export async function getSareeStyles(token: string) {
  return fetch(`${API_BASE_URL}/designs/saree-styles`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
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
  data: {
    email?: string;
    password?: string;
    status?: string;
    permissions?: string[];
  },
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
  filters: Record<string, string | number> = {},
) {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...filters,
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
export async function uploadImage(file: File, emailid: string) {
  const formData = new FormData();
  formData.append("image", file);
  formData.append("emailid", emailid);

  const res = await fetch(`${API_BASE_URL}/images/upload`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok)
    throw new Error((await res.json()).error || "Failed to upload image");
  return (await res.json()).message;
}

export async function getImagesByEmail(emailid: string) {
  const res = await fetch(
    `${API_BASE_URL}/images/by-email/${encodeURIComponent(emailid)}`,
  );
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Failed to fetch images by email");
  }
  return res.json();
}

export async function deleteImageByIdAndEmail(
  id: number,
  emailid: string,
): Promise<string> {
  const res = await fetch(
    `${API_BASE_URL}/images/${id}/${encodeURIComponent(emailid)}`,
    {
      method: "DELETE",
    },
  );

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Failed to delete image");
  }

  const data = await res.json();
  return data.message;
}

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

export async function getFullReport(
  customer_email?: string,
  customer_name?: string,
  user_email?: string,
) {
  const url = new URL(`${API_BASE_URL}/reports/full`);

  if (customer_email) url.searchParams.append("customer_email", customer_email);
  if (customer_name) url.searchParams.append("customer_name", customer_name);
  if (user_email) url.searchParams.append("user_email", user_email);

  return fetch(url.toString());
}
