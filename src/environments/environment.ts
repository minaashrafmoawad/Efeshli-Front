export const environment = {
  production: true,
  apiUrl: (window as any)["env"]["API_URL"] || "http://localhost:5104/api"
};
