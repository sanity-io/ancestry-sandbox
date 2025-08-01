export const getBaseUrl = () => {
  let baseUrl: string;
  
  if (process.env.VERCEL_ENV === "production") {
    baseUrl = `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  } else if (process.env.VERCEL_ENV === "preview") {
    baseUrl = `https://${process.env.VERCEL_URL}`;
  } else {
    baseUrl = "http://localhost:3000";
  }
  
  // Ensure the URL doesn't end with a slash
  return baseUrl.replace(/\/$/, '');
};
