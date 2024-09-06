const SneaksAPI = require('sneaks-api');
const sneaks = new SneaksAPI();

export async function GET(request) {
  const { pathname } = new URL(request.url);
  const styleID = pathname.split('/').pop();

  console.log(`Fetching details for styleID: ${styleID}`);

  return new Promise((resolve) => {
    sneaks.getProductPrices(styleID, function(err, product) {
      if (err) {
        console.error(`Error fetching product details for styleID "${styleID}":`, err);
        resolve(new Response(JSON.stringify({ error: err.message }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }));
      } else {
        resolve(new Response(JSON.stringify(product), {
          headers: { 'Content-Type': 'application/json' },
        }));
      }
    });
  });
}