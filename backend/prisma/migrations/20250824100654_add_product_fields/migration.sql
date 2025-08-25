-- AlterTable
ALTER TABLE "products" ADD COLUMN     "careInstructions" TEXT,
ADD COLUMN     "dimensions" TEXT,
ADD COLUMN     "discountPercentage" DECIMAL(5,2),
ADD COLUMN     "isFeatured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "material" TEXT,
ADD COLUMN     "stockQuantity" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "weight" TEXT;
