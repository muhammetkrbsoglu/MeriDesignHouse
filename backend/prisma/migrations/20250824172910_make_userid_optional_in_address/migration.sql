/*
  Warnings:

  - You are about to drop the column `guestUserId` on the `cart_items` table. All the data in the column will be lost.
  - You are about to drop the column `guestUserId` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the `guest_users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "cart_items" DROP CONSTRAINT "cart_items_guestUserId_fkey";

-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_guestUserId_fkey";

-- AlterTable
ALTER TABLE "addresses" ADD COLUMN     "phoneNumber" TEXT,
ALTER COLUMN "userId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "cart_items" DROP COLUMN "guestUserId";

-- AlterTable
ALTER TABLE "orders" DROP COLUMN "guestUserId";

-- DropTable
DROP TABLE "guest_users";
