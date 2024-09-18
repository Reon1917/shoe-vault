import { NextResponse } from 'next/server';
import CustomShoe from '@/models/customshoe'; // Ensure the path is correctly cased
import dbConnect from '@/lib/dbConnect';

// Connect to the database
dbConnect();

export async function POST(req) {
  try {
    const { styleID, brand, shoeName, imageUrl } = await req.json();

    console.log('Received data:', { styleID, brand, shoeName, imageUrl });

    const newShoe = new CustomShoe({
      styleID,
      brand,
      shoeName,
      thumbnail // Save the image URL as thumbnail
    });

    await newShoe.save();
    console.log('New shoe saved:', newShoe);

    return new NextResponse(JSON.stringify(newShoe), { status: 201 });
  } catch (error) {
    console.error('Error saving new shoe:', error);
    return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 });
  }
}