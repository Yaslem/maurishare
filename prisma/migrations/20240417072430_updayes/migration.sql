/*
  Warnings:

  - You are about to drop the column `commentReplyId` on the `notifications` table. All the data in the column will be lost.
  - You are about to drop the column `repliedOnCommentId` on the `notifications` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `notifications` DROP FOREIGN KEY `notifications_commentReplyId_fkey`;

-- DropForeignKey
ALTER TABLE `notifications` DROP FOREIGN KEY `notifications_repliedOnCommentId_fkey`;

-- AlterTable
ALTER TABLE `notifications` DROP COLUMN `commentReplyId`,
    DROP COLUMN `repliedOnCommentId`;
