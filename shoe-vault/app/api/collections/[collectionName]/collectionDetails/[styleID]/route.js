import dbConnect from '@/lib/dbConnect';
import Collection from '@/models/Collection';
import { NextResponse } from 'next/server';

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