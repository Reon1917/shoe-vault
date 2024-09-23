import dbConnect from '@/lib/dbConnect';
import Collection from '@/models/Collection';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  await dbConnect();

  try {
    const { collectionName } = params;

    // Ensure that collectionName is fetched case-insensitively using regex
    const collection = await Collection.findOne({
      name: { $regex: new RegExp(`^${collectionName}$`, 'i') },
    });

    if (!collection) {
      return NextResponse.json({ message: 'Collection not found' }, { status: 404 });
    }

    // Return the exact collection name from the database
    return NextResponse.json({
      collectionName: collection.name, // Return the name as stored in the database
      shoes: collection.shoes,
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// Handle PATCH request to update collection name
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

    // Check if the new name is the same as the old name (ignoring case), if so, update regardless of case
    if (collection.name.toLowerCase() === newCollectionName.trim().toLowerCase()) {
      collection.name = newCollectionName.trim();
    } else {
      // Ensure no other collection has the same name
      const existingCollection = await Collection.findOne({ name: { $regex: new RegExp(`^${newCollectionName}$`, 'i') } });
      if (existingCollection) {
        return NextResponse.json({ message: 'A collection with this name already exists' }, { status: 400 });
      }
      collection.name = newCollectionName.trim();
    }
    
    // Save the updated collection
    await collection.save();

    return NextResponse.json({ message: 'Collection name updated successfully', collectionName: collection.name }, { status: 200 });
  } catch (error) {
    console.error('Error updating collection name:', error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
export async function DELETE(req, { params }) {
  await dbConnect();

  const { collectionName, styleID } = params; // Get the collection name and shoe styleID from the URL

  try {
    // Find the collection by name (case insensitive)
    const collection = await Collection.findOne({ name: { $regex: new RegExp(`^${collectionName}$`, 'i') } });

    if (!collection) {
      return NextResponse.json({ message: 'Collection not found' }, { status: 404 });
    }

    // Remove the shoe from the collection's shoes array using styleID
    collection.shoes = collection.shoes.filter((shoe) => shoe.styleID !== styleID);

    // Save the updated collection
    await collection.save();

    return NextResponse.json({ message: 'Shoe removed from collection successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error removing shoe from collection:', error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
