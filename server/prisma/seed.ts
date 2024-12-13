import { PrismaClient, NotificationType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Replace with an actual user ID from your database
  const user = await prisma.user.findFirst();

  if (!user) {
    console.log("No user found to add notifications to");
    return;
  }

  await prisma.notification.createMany({
    data: [
      {
        userId: user.id,
        title: "Welcome to ShopNet!",
        message: "Thanks for joining. Start exploring our features now.",
        type: "SYSTEM",
        read: false,
      },
      {
        userId: user.id,
        title: "New Product Feature",
        message: "You can now add multiple images to your products.",
        type: "SYSTEM",
        read: false,
      },
      {
        userId: user.id,
        title: "Profile Update Reminder",
        message: "Don't forget to complete your profile information.",
        type: "ACCOUNT",
        read: false,
      },
    ],
  });

  console.log("Added test notifications");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
