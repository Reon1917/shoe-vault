import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { hash, compare } from "bcryptjs";
import User from "@/models/User";

export async function PUT(request) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { name, currentPassword, newPassword, confirmPassword } = await request.json();
    const user = await User.findById(session.user.id);

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    // Update name if provided
    if (name && name !== user.name) {
      user.name = name;
    }

    // Update password if provided
    if (currentPassword && newPassword) {
      if (newPassword !== confirmPassword) {
        return Response.json({ error: "New passwords do not match" }, { status: 400 });
      }

      const isValidPassword = await compare(currentPassword, user.password);
      if (!isValidPassword) {
        return Response.json({ error: "Current password is incorrect" }, { status: 400 });
      }

      user.password = await hash(newPassword, 12);
    }

    await user.save();

    return Response.json({
      message: "Profile updated successfully",
      user: {
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Profile update error:", error);
    return Response.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
