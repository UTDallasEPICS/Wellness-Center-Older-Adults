-- CreateTable
CREATE TABLE "Address" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "street" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Ride" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "customerID" INTEGER,
    "date" DATETIME NOT NULL,
    "pickupTime" DATETIME NOT NULL,
    "totalTime" TEXT,
    "waitTime" REAL,
    "startAddressID" INTEGER NOT NULL,
    "endAddressID" INTEGER,
    "specialNote" TEXT,
    "status" TEXT NOT NULL DEFAULT 'AVAILABLE',
    "volunteerID" INTEGER,
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Ride_customerID_fkey" FOREIGN KEY ("customerID") REFERENCES "Customer" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Ride_endAddressID_fkey" FOREIGN KEY ("endAddressID") REFERENCES "Address" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Ride_startAddressID_fkey" FOREIGN KEY ("startAddressID") REFERENCES "Address" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Ride_volunteerID_fkey" FOREIGN KEY ("volunteerID") REFERENCES "VolunteerInfo" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phone" TEXT,
    "role" TEXT NOT NULL,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "reminderTime" TEXT
);

-- CreateTable
CREATE TABLE "Customer" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "firstName" TEXT NOT NULL,
    "middleName" TEXT,
    "lastName" TEXT NOT NULL,
    "addressID" INTEGER NOT NULL,
    "customerPhone" TEXT NOT NULL,
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Customer_addressID_fkey" FOREIGN KEY ("addressID") REFERENCES "Address" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "VolunteerInfo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userID" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'AVAILABLE',
    CONSTRAINT "VolunteerInfo_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_customerPhone_key" ON "Customer"("customerPhone");

-- CreateIndex
CREATE UNIQUE INDEX "VolunteerInfo_userID_key" ON "VolunteerInfo"("userID");
