-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('NEW', 'PROCESSING', 'AWAITING_PAYMENT', 'PAID', 'COMPLETED', 'CANCELLED');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "telegramId" TEXT NOT NULL,
    "username" TEXT,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Admin" (
    "id" SERIAL NOT NULL,
    "telegramId" TEXT NOT NULL,
    "username" TEXT,
    "firstName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "emoji" TEXT,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Service" (
    "id" SERIAL NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Price" (
    "id" SERIAL NOT NULL,
    "serviceId" INTEGER NOT NULL,
    "duration" TEXT NOT NULL,
    "basePrice" DOUBLE PRECISION NOT NULL,
    "commission" DOUBLE PRECISION NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Price_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "serviceId" INTEGER NOT NULL,
    "duration" TEXT NOT NULL,
    "totalPrice" DOUBLE PRECISION NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'NEW',
    "notes" TEXT,
    "adminNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_telegramId_key" ON "User"("telegramId");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_telegramId_key" ON "Admin"("telegramId");

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Price" ADD CONSTRAINT "Price_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
