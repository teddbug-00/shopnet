import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

interface AuthRequest extends Request {
  user?: any;
}

export const updateProfile = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { name, phone, address, profileImage } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        profile: {
          upsert: {
            create: { phone, address, profileImage },
            update: { phone, address, profileImage },
          },
        },
      },
      include: {
        profile: true,
      },
    });

    const { password: _, ...userWithoutPassword } = updatedUser;
    res.json({ user: userWithoutPassword });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ error: "Failed to update profile" });
  }
};

export const changePassword = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { currentPassword, newPassword } = req.body;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const isValidPassword = await bcrypt.compare(
      currentPassword,
      user.password,
    );
    if (!isValidPassword) {
      res.status(400).json({ error: "Current password is incorrect" });
      return;
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({ error: "Failed to change password" });
  }
};

export const updateNotificationPreferences = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { emailNotifications, orderUpdates } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        profile: {
          upsert: {
            create: {
              emailNotifications,
              orderUpdates,
            },
            update: {
              emailNotifications,
              orderUpdates,
            },
          },
        },
      },
      include: {
        profile: true,
      },
    });

    const { password: _, ...userWithoutPassword } = updatedUser;
    res.json({ user: userWithoutPassword });
  } catch (error) {
    console.error("Update notification preferences error:", error);
    res
      .status(500)
      .json({ error: "Failed to update notification preferences" });
  }
};
