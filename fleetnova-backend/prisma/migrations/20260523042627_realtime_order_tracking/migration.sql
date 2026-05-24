-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "currentLatitude" DOUBLE PRECISION,
ADD COLUMN     "currentLongitude" DOUBLE PRECISION,
ADD COLUMN     "estimatedDeliveryTime" TEXT;
