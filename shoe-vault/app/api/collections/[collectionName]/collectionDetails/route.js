import dbConnect from '@/lib/dbConnect';
import Collection from '@/models/Collection';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  await dbConnect();

  try {
    console.log('Received GET request with params:', params); // Log the params object

    const collectionName = params?.collectionName?.toLowerCase(); // Convert collectionName to lowercase
    console.log('Extracted collectionName:', collectionName);

    if (!collectionName) {
      console.error('collectionName is undefined');
      return NextResponse.json({ message: 'collectionName is required' }, { status: 400 });
    }

    console.log('Querying database for collection:', collectionName);
    const collection = await Collection.findOne({ name: { $regex: new RegExp(`^${collectionName}$`, 'i') } });

    if (!collection) {
      console.error(`Collection ${collectionName} not found`);
      return NextResponse.json({ message: 'Collection not found' }, { status: 404 });
    }

    console.log('Fetched collection:', collection);
    return NextResponse.json(collection.shoes, { status: 200 }); // Return only the shoes array
  } catch (error) {
    console.error('Error fetching collection:', error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}