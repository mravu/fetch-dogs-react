const BASE_URL = "https://frontend-take-home-service.fetch.com";

export const fetchAPI = async (endpoint: string, options: RequestInit = {}) => {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      ...options,
    });
    if (!response.ok) throw new Error('Network response was not ok');
    const contentType = response.headers.get("content-type");
    if(contentType && contentType.includes("application/json")){
    return await response.json();
    }else{
      return response.text();
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};