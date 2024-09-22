import dbConnect from '@/lib/dbConnect';
import Collection from '@/models/Collection';
import Shoe from '@/models/shoe';
import CustomShoe from '@/models/customshoe';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  await dbConnect();

  try {
    const { collectionName } = params;

    // Query the collection name in a case-insensitive way using regex
    const collection = await Collection.findOne({ name: { $regex: new RegExp(`^${collectionName}$`, 'i') } });

    if (!collection) {
      return NextResponse.json({ message: 'Collection not found' }, { status: 404 });
    }

    return NextResponse.json(collection, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function PATCH(req, { params }) {
  await dbConnect();

  const { collectionName } = params; // Get the collection name from the URL
  const { newCollectionName } = await req.json(); // Get the new collection name from the request body

  try {
    if (!newCollectionName || newCollectionName.trim() === '') {
      return NextResponse.json({ message: 'New collection name is required' }, { status: 400 });
    }

    // Find the collection by the current name (case insensitive)
    const collection = await Collection.findOne({ name: { $regex: new RegExp(`^${collectionName}$`, 'i') } });
    
    if (!collection) {
      return NextResponse.json({ message: 'Collection not found' }, { status: 404 });
    }

    // Check if the new name is the same as the old name (ignoring case)
    if (collection.name.toLowerCase() === newCollectionName.trim().toLowerCase()) {
      collection.name = newCollectionName.trim();
    } else {
      // Check if another collection with the same name (ignoring case) already exists
      const existingCollection = await Collection.findOne({ name: { $regex: new RegExp(`^${newCollectionName}$`, 'i') } });
      if (existingCollection) {
        return NextResponse.json({ message: 'A collection with this name already exists' }, { status: 400 });
      }
      collection.name = newCollectionName.trim();
    }

    // Save the updated collection name
    await collection.save();

    return NextResponse.json({ message: 'Collection name updated successfully', collectionName: collection.name }, { status: 200 });
  } catch (error) {
    console.error('Error updating collection name:', error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}