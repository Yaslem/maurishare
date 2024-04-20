-- AlterTable
ALTER TABLE `notifications` ADD COLUMN `commentReplyId` VARCHAR(191) NULL,
    ADD COLUMN `repliedOnCommentId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `notifications` ADD CONSTRAINT `notifications_repliedOnCommentId_fkey` FOREIGN KEY (`repliedOnCommentId`) REFERENCES `comments`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notifications` ADD CONSTRAINT `notifications_commentReplyId_fkey` FOREIGN KEY (`commentReplyId`) REFERENCES `comments`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
