const SneaksAPI = require('sneaks-api');
const sneaks = new SneaksAPI();

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const keyword = searchParams.get('keyword') || 'Yeezy Cinder';

  console.log(`Searching for keyword: ${keyword}`);

  return new Promise((resolve) => {
    sneaks.getProducts(keyword, 10, function(err, products) {
      if (err) {
        console.error(`Error fetching products for keyword "${keyword}":`, err);
        resolve(new Response(JSON.stringify({ error: err.message }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }));
      } else {
        resolve(new Response(JSON.stringify(products), {
          headers: { 'Content-Type': 'application/json' },
        }));
      }
    });
  });
}