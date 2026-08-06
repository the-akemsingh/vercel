/*
  Warnings:

  - You are about to drop the column `projectId` on the `Project` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[projectDeploymentId]` on the table `Project` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `projectDeploymentId` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Project_projectId_key";

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "projectId",
ADD COLUMN     "projectDeploymentId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Project_projectDeploymentId_key" ON "Project"("projectDeploymentId");
