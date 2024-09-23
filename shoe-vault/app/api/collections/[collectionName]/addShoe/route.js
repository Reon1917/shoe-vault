import dbConnect from '@/lib/dbConnect';
import Collection from '@/models/Collection';
import Shoe from '@/models/shoe';
import CustomShoe from '@/models/customshoe';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  await dbConnect();

  try {
    const { collectionName } = params; // Extract collectionName from the URL params
    const collection = await Collection.findOne({ name: collectionName });

    if (!collection) {
      return NextResponse.json({ message: 'Collection not found' }, { status: 404 });
    }

    return NextResponse.json(collection, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(req, { params }) {
  await dbConnect();

  try {
    const { collectionName } = params;
    const { styleID } = await req.json();

    const collection = await Collection.findOne({ name: collectionName });
    if (!collection) {
      return NextResponse.json({ message: 'Collection not found' }, { status: 404 });
    }

    // Check both Shoe and CustomShoe collections
    let shoe = await Shoe.findOne({ styleID });
    if (!shoe) {
      shoe = await CustomShoe.findOne({ styleID });
    }

    if (!shoe) {
      return NextResponse.json({ message: 'Shoe not found' }, { status: 404 });
    }

    const isShoeInCollection = collection.shoes.some(s => s.styleID === shoe.styleID);
    if (isShoeInCollection) {
      return NextResponse.json({ message: 'Shoe already in collection' }, { status: 400 });
    }

    collection.shoes.push({
      styleID: shoe.styleID,
      shoeName: shoe.shoeName,
      brand: shoe.brand,
      thumbnail: shoe.thumbnail,
    });

    await collection.save();
    return NextResponse.json(collection, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}


export async function DELETE(req, { params }) {
  await dbConnect();

  try {
    const { collectionName } = params;
    const { styleID } = await req.json();

    const collection = await Collection.findOne({ name: collectionName });
    if (!collection) {
      return NextResponse.json({ message: 'Collection not found' }, { status: 404 });
    }

    collection.shoes = collection.shoes.filter(shoe => shoe.styleID !== styleID);
    await collection.save();
    return NextResponse.json({ message: 'Shoe removed from collection' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
};