// app/api/vault/route.js
import dbConnect from '../../../lib/dbConnect';
import Shoe from '../../../models/shoe';

export async function POST(req) {
  await dbConnect();

  try {
    const { styleID, shoeName, brand, thumbnail } = await req.json();
    console.log('Received POST request:', { styleID, shoeName, brand, thumbnail });

    const existingShoe = await Shoe.findOne({ styleID });

    if (existingShoe) {
      return new Response(JSON.stringify({ error: 'Shoe already in vault' }), { status: 409 });
    }

    const newShoe = new Shoe({ styleID, shoeName, brand, thumbnail });
    await newShoe.save();
    return new Response(JSON.stringify(newShoe), { status: 200 });
  } catch (err) {
    console.error('Error in POST /api/vault:', err);
    return new Response(JSON.stringify({ error: 'Server error', details: err.message }), { status: 500 });
  }
}



export async function GET() {
  await dbConnect();

  try {
    console.log('Received GET request');
    const shoes = await Shoe.find();
    return new Response(JSON.stringify(shoes), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },  // Ensure JSON content type
    });
  } catch (err) {
    console.error('Error in GET /api/vault:', err);
    return new Response(JSON.stringify({ error: 'Server error', details: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },  // Ensure JSON content type
    });
  }
}

export async function DELETE(req) {
  await dbConnect();

  try {
    const { id } = await req.json();
    console.log('Received DELETE request:', { id });
    await Shoe.deleteOne({ id });
    return new Response(JSON.stringify({ message: 'Shoe deleted' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },  // Ensure JSON content type
    });
  } catch (err) {
    console.error('Error in DELETE /api/vault:', err);
    return new Response(JSON.stringify({ error: 'Server error', details: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },  // Ensure JSON content type
    });
  }
}
