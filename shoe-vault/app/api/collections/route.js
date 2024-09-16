import dbConnect from '@/lib/dbConnect';
import Collection from '@/models/Collection';
import Shoe from '@/models/shoe';
import { NextResponse } from 'next/server';

export async function GET() {
  await dbConnect();

  try {
    const collections = await Collection.find({});
    return NextResponse.json(collections, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(req) {
    await dbConnect();
  
    try {
      const { name } = await req.json();  // Expecting 'name' as you're creating a collection, not adding shoes
  
      // Create a new collection
      const newCollection = new Collection({
        name,
        shoes: []
      });
  
      await newCollection.save();
      return NextResponse.json(newCollection, { status: 201 });
    } catch (error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
  }
  

  export async function DELETE(req) {
    await dbConnect();
  
    try {
      const { name } = await req.json();  // Expecting 'name' instead of 'collectionId'
  
      // Find and delete by name
      const deletedCollection = await Collection.findOneAndDelete({ name });
  
      if (!deletedCollection) {
        return NextResponse.json({ message: 'Collection not found' }, { status: 404 });
      }
  
      return NextResponse.json({ message: 'Collection deleted' }, { status: 200 });
    } catch (error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
  }
  

export async function PUT(req) {
  await dbConnect();

  try {
    const { collectionId, newName } = await req.json();
    const collection = await Collection.findById(collectionId);
    if (!collection) {
      return NextResponse.json({ message: 'Collection not found' }, { status: 404 });
    }

    collection.name = newName;
    await collection.save();
    return NextResponse.json(collection, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
