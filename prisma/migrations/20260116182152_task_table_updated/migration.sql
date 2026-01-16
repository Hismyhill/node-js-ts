/*
  Warnings:

  - You are about to alter the column `completed_on` on the `tasks` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.

*/
-- AlterTable
ALTER TABLE `tasks` MODIFY `completed_on` DATETIME NULL;
