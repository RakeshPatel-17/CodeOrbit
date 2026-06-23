export const API_BASE_URL = 
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export async function fetchResidents(token: string | null) {
  const headers: HeadersInit = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  
  const response = await fetch(`${API_BASE_URL}/residents`, {
    headers
  });
  
  if (!response.ok) {
    throw new Error("Failed to fetch residents");
  }
  
  return response.json();
}
