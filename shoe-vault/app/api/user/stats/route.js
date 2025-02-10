import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import Shoe from "@/models/shoe";
import CustomShoe from "@/models/customshoe";
import Collection from "@/models/Collection";

export async function GET(request) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const userId = session.user.id;

    // Get counts in parallel
    const [shoes, customShoes, collections, favorites] = await Promise.all([
      Shoe.countDocuments({ userId }),
      CustomShoe.countDocuments({ userId }),
      Collection.countDocuments({ userId }),
      Shoe.countDocuments({ userId, favorite: true }),
    ]);

    return Response.json({
      totalShoes: shoes + customShoes,
      collections,
      favorites,
    });
  } catch (error) {
    console.error("Stats fetch error:", error);
    return Response.json(
      { error: "Failed to fetch user stats" },
      { status: 500 }
    );
  }
}
