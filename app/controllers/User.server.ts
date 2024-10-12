import { nanoid } from "nanoid";
import { sendResponseServer } from "~/helpers/SendResponse.server";
import File from "~/helpers/Upload.server";
import db from "~/helpers/db";

export default class User {
    static async getProfile({ username }) {
        const user = await db.user.findUnique({
            where: {
                username
            },
            select: {
                id: true,
                photo: true,
                username: true,
                email: true,
                bio: true,
                name: true,
                socialLinks: {
                    select: {
                        instagram: true,
                        facebook: true,
                        twitter: true,
                        youtube: true,
                        website: true
                    }
                },
                account: true,
                createdAt: true
            },
        })
        if (user) {
            return sendResponseServer({ status: "success", action: "getUserProfile", data: user, message: "تم جلب المستخدم بنجاح 👍" })
        }
        return sendResponseServer({ status: "error", action: "getUserProfile", message: "هذا المستخدم غير موجود" })
    }
    static async getProfileByAdmin({ username }) {
        const user = await db.user.findUnique({
            where: {
                username
            },
            select: {
                id: true,
                photo: true,
                username: true,
                can_update_post: true,
                can_create_post: true,
                can_delete_post: true,
                can_create_comment: true,
                email: true,
                bio: true,
                name: true,
                posts: {
                  select: {
                      _count: true
                  }
                },

                socialLinks: {
                    select: {
                        instagram: true,
                        facebook: true,
                        twitter: true,
                        youtube: true,
                        website: true
                    }
                },
                account: true,
                createdAt: true
            },
        })
        if (user) {
            return sendResponseServer({ status: "success", action: "getUserProfile", data: user, message: "تم جلب المستخدم بنجاح 👍" })
        }
        return sendResponseServer({ status: "error", action: "getUserProfile", message: "هذا المستخدم غير موجود" })
    }
    static async getAllUsers(){
        const users = await db.user.findMany({
            select: {
                id: true,
                photo: true,
                username: true,
                email: true,
                bio: true,
                name: true,
                createdAt: true
            },
        })
        if (users.length) {
            return sendResponseServer({ status: "success", action: "getAllUsers", data: users, message: "تم جلب المستخدمين بنجاح 👍" })
        }
        return sendResponseServer({ status: "error", action: "getAllUsers", message: "لا يوجد مستخدمين" })
    }
    static async editProfile({ username, instagram, newUsername, bio, facebook, twitter, youtube, website }) {
        const bioLimit = 150
        if (!newUsername.length) {
            return sendResponseServer({ status: "error", action: "editProfile", message: "اسم المستخدم مطلوب" })
        }
        if (bio.length > bioLimit) {
            return sendResponseServer({ status: "error", action: "editProfile", message: `الوصف المختصر يجب أن يكون أقل من ${bioLimit} حرفا.` })
        }
        if (facebook.length) {
            if (!facebook.includes(`https://`) || !facebook.includes(`.com`)) {
                return sendResponseServer({ status: "error", action: "editProfile", message: `الرابط "${facebook}" غير صالح.` })
            }
        }

        if (instagram.length) {
            if (!instagram.includes(`https://`) || !instagram.includes(`.com`)) {
                return sendResponseServer({ status: "error", action: "editProfile", message: `الرابط "${instagram}" غير صالح.` })
            }
        }

        if (twitter.length) {
            if (!twitter.includes(`https://`) || !twitter.includes(`.com`)) {
                return sendResponseServer({ status: "error", action: "editProfile", message: `الرابط "${twitter}" غير صالح.` })
            }
        }

        if (youtube.length) {
            if (!youtube.includes(`https://`) || !youtube.includes(`.com`)) {
                return sendResponseServer({ status: "error", action: "editProfile", message: `الرابط "${youtube}" غير صالح.` })
            }
        }

        const user = await db.user.findUnique({
            where: {
                username: newUsername
            },
            select: {
                id: true,
                username: true
            },
        })
        if (user && user.username !== username) {
            return sendResponseServer({ status: "error", action: "editProfile", message: `اسم الحساب "${newUsername}" مستخدم بالفعل من قِبل شخص آخر,` })
        }
        await db.user.update({
            where: { username },
            data: {
                bio,
                username: newUsername,
                socialLinks: {
                    update: {
                        instagram,
                        facebook,
                        twitter,
                        youtube,
                        website
                    }
                }
            }
        })
        return sendResponseServer({ status: "success", action: "editProfile", message: "تم تعديل الحساب بنجاح." })
    }
    static async editProfileByAdmin({ username, instagram, newUsername, bio, facebook, twitter, youtube, website, name, email, can_update_post,can_create_post,can_delete_post, can_create_comment }) {
        const bioLimit = 150
        if (!newUsername.length) {
            return sendResponseServer({ status: "error", action: "editProfile", message: "اسم المستخدم مطلوب" })
        }
        if (bio.length > bioLimit) {
            return sendResponseServer({ status: "error", action: "editProfile", message: `الوصف المختصر يجب أن يكون أقل من ${bioLimit} حرفا.` })
        }
        if (facebook.length) {
            if (!facebook.includes(`https://`) || !facebook.includes(`.com`)) {
                return sendResponseServer({ status: "error", action: "editProfile", message: `الرابط "${facebook}" غير صالح.` })
            }
        }

        if (instagram.length) {
            if (!instagram.includes(`https://`) || !instagram.includes(`.com`)) {
                return sendResponseServer({ status: "error", action: "editProfile", message: `الرابط "${instagram}" غير صالح.` })
            }
        }

        if (twitter.length) {
            if (!twitter.includes(`https://`) || !twitter.includes(`.com`)) {
                return sendResponseServer({ status: "error", action: "editProfile", message: `الرابط "${twitter}" غير صالح.` })
            }
        }

        if (youtube.length) {
            if (!youtube.includes(`https://`) || !youtube.includes(`.com`)) {
                return sendResponseServer({ status: "error", action: "editProfile", message: `الرابط "${youtube}" غير صالح.` })
            }
        }

        const user = await db.user.findUnique({
            where: {
                username: newUsername
            },
            select: {
                id: true,
                username: true
            },
        })
        if (user && user.username !== username) {
            return sendResponseServer({ status: "error", action: "editProfile", message: `اسم الحساب "${newUsername}" مستخدم بالفعل من قِبل شخص آخر,` })
        }
        await db.user.update({
            where: { username },
            data: {
                bio,
                username: newUsername,
                name, email, can_update_post,can_create_post,can_delete_post, can_create_comment,
                socialLinks: {
                    update: {
                        instagram,
                        facebook,
                        twitter,
                        youtube,
                        website
                    }
                }
            }
        })
        return sendResponseServer({ status: "success", action: "editProfile", message: "تم تعديل الحساب بنجاح." })
    }
    static async searchQuery({ value }) {
        const maxLimit = 50
        const users = await db.user.findMany({
            where: {
                OR: [
                    {
                        username: {
                            contains: value
                        },
                    },
                    {
                        name: {
                            contains: value
                        },
                    },
                ]
            },
            select: {
                id: true,
                photo: true,
                username: true,
                name: true
            },
            take: maxLimit,
        })
        if (users.length) {
            return sendResponseServer({ status: "success", action: "searchQueryUser", data: users, message: "تم جلب المستخدمين بنجاح 👍" })
        }
        return sendResponseServer({ status: "error", action: "searchQueryUser", message: "لا توجد مستخدمون" })
    }
    static async getNewNotification({ username }) {
        const notification = await db.notification.findFirst({
            where: {
                seen: false,
                notificationFor: {
                    username
                },
                NOT: {
                    user: {
                        username
                    },
                }
            }
        })
        if (notification) {
            return sendResponseServer({ status: "success", action: "getNewNotification", message: "توجد إشعارات جديدة" })
        }
        return sendResponseServer({ status: "error", action: "getNewNotification", message: "لا توجد إشعارات جديدة" })
    }
    static async getNotifications({ username, type = "all", page = 1 }) {
        const countAll = await db.notification.count({
            where: {
                seen: false,
                notificationFor: {
                    username
                },
                NOT: {
                    user: {
                        username
                    },
                },
            }

        })
        const notificationlimit = 50
        if (type !== "all") {
            let count = await db.notification.count({
                where: {
                    notificationFor: {
                        username
                    },
                    type: type,
                    NOT: {
                        user: {
                            username
                        },
                    },
                }

            })
            let notifications = await db.notification.findMany({
                where: {
                    notificationFor: {
                        username
                    },
                    type: type,
                    NOT: {
                        user: {
                            username
                        },
                    },
                },
                select: {
                    id: true,
                    createdAt: true,
                    comment: {
                        select: {
                            id: true,
                            content: true,
                            commentedBy: {
                                select: {
                                    name: true,
                                    username: true,
                                    photo: true
                                }
                            }
                        }
                    },
                    reply: {
                        select: {
                            id: true,
                            content: true,
                            commentedBy: {
                                select: {
                                    name: true,
                                    username: true,
                                    photo: true
                                }
                            }
                        }
                    },
                    repliedOnComment: {
                        select: {
                            id: true,
                            
                            content: true,
                            commentedBy: {
                                select: {
                                    name: true,
                                    username: true,
                                    photo: true
                                }
                            },
                        }
                    },
                    user: {
                        select: {
                            name: true,
                            username: true,
                            photo: true
                        }
                    },
                    type: true,
                    seen: true,
                    post: {
                        select: {
                            id: true,
                            title: true,
                            slug: true,
                            author: {
                                select: {
                                    name: true,
                                    username: true,
                                    photo: true
                                }
                            }
                        }
                    }

                },
                orderBy: {
                    createdAt: "desc"
                },
                take: notificationlimit,
                skip: (page - 1) * notificationlimit,

            })

            await db.notification.updateMany({
                where: {
                    notificationFor: {
                        username
                    },
                    type: type,
                    NOT: {
                        user: {
                            username
                        },
                    },
                },
                data: {
                    seen: true
                }
            })

            if (notifications.length) {
                return sendResponseServer({ status: "success", action: "getNotifications", data: { results: notifications, count, page, countAll }, message: "تم جلب الإشعارات بنجاح 👍" })
            }
        } else {
            let count = await db.notification.count({
                where: {
                    notificationFor: {
                        username
                    },
                    NOT: {
                        user: {
                            username
                        },
                    },
                }

            })
            let notifications = await db.notification.findMany({
                where: {
                    notificationFor: {
                        username
                    },
                    NOT: {
                        user: {
                            username
                        },
                    },
                },
                select: {
                    id: true,
                    createdAt: true,
                    comment: {
                        select: {
                            id: true,
                            content: true,
                            commentedBy: {
                                select: {
                                    name: true,
                                    username: true,
                                    photo: true
                                }
                            }
                        }
                    },
                    reply: {
                        select: {
                            id: true,
                            content: true,
                            commentedBy: {
                                select: {
                                    name: true,
                                    username: true,
                                    photo: true
                                }
                            }
                        }
                    },
                    repliedOnComment: {
                        select: {
                            id: true,
                            content: true,
                            commentedBy: {
                                select: {
                                    name: true,
                                    username: true,
                                    photo: true
                                }
                            }
                        }
                    },
                    user: {
                        select: {
                            name: true,
                            username: true,
                            photo: true
                        }
                    },
                    type: true,
                    seen: true,
                    post: {
                        select: {
                            id: true,
                            title: true,
                            slug: true,
                            author: {
                                select: {
                                    name: true,
                                    username: true,
                                    photo: true
                                }
                            }
                        }
                    }

                },
                take: notificationlimit,
                skip: (page - 1) * notificationlimit,
                orderBy: {
                    createdAt: "desc"
                }

            })

            await db.notification.updateMany({
                where: {
                    notificationFor: {
                        username
                    },
                    NOT: {
                        user: {
                            username
                        },
                    },
                },
                data: {
                    seen: true
                }
            })

            if (notifications.length) {
                return sendResponseServer({ status: "success", action: "getNotifications", data: { results: notifications, count, page, countAll }, message: "تم جلب الإشعارات بنجاح 👍" })
            }
        }

        return sendResponseServer({ status: "error", action: "getNotifications", data: {countAll}, message: "لا توجد إشعارات" })
    }
    static async addReplyCommentNotification({ notificationId, postId, user, replyingTo, comment }) {
        if(postId && notificationId){
            const getPost = await db.post.findFirst({
                where: {
                    id: postId
                },
                select: {
                    id: true,
                    author: {
                        select: {
                            id: true
                        }
                    }
                }
            })
            const getNotification = await db.notification.findFirst({
                where: {
                    id: notificationId
                },
                select: {
                    id: true,
                }
            })
            if (getNotification) {
                if (!comment.length) {
                    return sendResponseServer({ status: "error", action: "addReplyCommentNotification", message: "محتوى التعليق مطلوب" })
                }
                if (!replyingTo.length) {
                    return sendResponseServer({ status: "error", action: "addReplyCommentNotification", message: "التعليق المردود عليه مطلوب" })
                }
                const getComment = await db.comment.create({
                    data: {
                        post: {
                            connect: { id: getPost.id }
                        },
                        postAuthor: {
                            connect: { id: getPost.author.id }
                        },
                        commentedBy: {
                            connect: { id: user.id }
                        },
                        content: comment,
                        parent: {
                            connect: { id: replyingTo }
                        }
                    },
                    include: {
                        commentedBy: true,
                        parent: {
                            select: {
                                commentedBy: true
                            }
                        }
                    }
                })
    
                await db.notification.update({
                    where: {
                        id: getNotification.id
                    },
                    data: {
                        reply: {
                            connect: { id: getComment.id }
                        }
                    }
                })
                return sendResponseServer({ status: "success", action: "addReplyCommentNotification", message: "تم الرد على التعليق بنجاح 👍" })
            }
        }
        return sendResponseServer({ status: "error", action: "addReplyCommentNotification", message: "حدث خطأ ما بسبب هذا التعليق" })
    }
    static async uploadImg(image: FormDataEntryValue, username: string) {
        const folder = "avatars"
        const filename = Date.now() + image.name.replaceAll(" ", "_").replaceAll("-", "_");
        await File.upload({ folder, file: image, filename })
        await db.user.update({
            where: { username },
            data: { photo: `${folder}/${filename}` }
        })
        return `${folder}/${filename}`
    }
}