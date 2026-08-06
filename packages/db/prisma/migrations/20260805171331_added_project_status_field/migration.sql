/*
  Warnings:

  - You are about to drop the `Projects` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('PENDING', 'SAVED_TO_S3', 'BUILDING', 'BUILD_COMPLETE', 'UPLOADING_BUILD', 'DEPLOYED', 'FAILED');

-- DropForeignKey
ALTER TABLE "Projects" DROP CONSTRAINT "Projects_userId_fkey";

-- DropTable
DROP TABLE "Projects";

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "githubUrl" TEXT NOT NULL,
    "projectId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "ProjectStatus" NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Project_projectId_key" ON "Project"("projectId");

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
