-- CreateTable
CREATE TABLE "Driver" (
    "id" SERIAL NOT NULL,
    "fullName" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "vehicleType" TEXT,

    CONSTRAINT "Driver_pkey" PRIMARY KEY ("id")
);
