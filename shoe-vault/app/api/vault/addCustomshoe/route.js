import { NextResponse } from 'next/server';
import CustomShoe from '@/models/customshoe'; // Ensure the path is correctly cased
import dbConnect from '@/lib/dbConnect';

export async function POST(req) {
  await dbConnect(); // Ensure the database connection is established

  try {
    const { styleID, brand, shoeName, thumbnail } = await req.json();

    console.log('Received data:', { styleID, brand, shoeName, thumbnail });

    const newShoe = new CustomShoe({
      styleID,
      brand,
      shoeName,
      thumbnail, // Save the image URL as thumbnail
    });

    await newShoe.save();
    console.log('New shoe saved:', newShoe);

    return new NextResponse(JSON.stringify(newShoe), { status: 201 });
  } catch (error) {
    console.error('Error saving new shoe:', error);
    return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

export async function GET() {
  await dbConnect(); // Ensure the database connection is established

  try {
    console.log('Received GET request');
    const shoes = await CustomShoe.find(); // Fetch custom shoes

    return new NextResponse(JSON.stringify(shoes), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }, // Ensure JSON content type
    });
  } catch (error) {
    console.error('Error in GET /api/vault:', error);
    return new NextResponse(JSON.stringify({ error: 'Server error', details: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }, // Ensure JSON content type
    });
  }
}