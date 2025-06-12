export const handler = async () => {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "✅ Netlify function works!" }),
  };
};