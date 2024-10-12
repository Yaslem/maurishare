import { nanoid } from "nanoid";
import { sendResponseServer } from "~/helpers/SendResponse.server";
import File from "~/helpers/Upload.server";
import db from "~/helpers/db";

export default class Post {
    static async uploadImg(image: FormDataEntryValue) {
        const folder = "posts"
        const filename = Date.now() + image.name.replaceAll(" ", "_").replaceAll("-", "_");
        await File.upload({ folder, file: image, filename })
        return `${folder}/${filename}`
    }
    static async uploadImgPost(image: FormDataEntryValue) {
        const folder = "posts"
        const filename = Date.now() + image.name.replaceAll(" ", "_").replaceAll("-", "_");
        await File.upload({ folder, file: image, filename })
        return `${folder}/${filename}`
    }
    static async get(page = 1) {
        const maxLimit = 5
        const count = await db.post.count({
            where: {
                draft: false,
                isPublished: true,
            },
        })
        const posts = await db.post.findMany({
            where: {
                draft: false,
                isPublished: true,
            },
            select: {
                id: true,
                title: true,
                slug: true,
                des: true,
                isPublished: true,
                banner: true,
                activity: true,
                tags: true,
                publishedAt: true,
                author: {
                    select: {
                        id: true,
                        photo: true,
                        username: true,
                        name: true
                    }
                }
            },
            orderBy: {
                publishedAt: "asc"
            },
            take: maxLimit,
            skip: (page - 1) * maxLimit,
        })
        if (posts.length) {
            return sendResponseServer({ status: "success", action: "getPosts", data: { results: posts, count, page }, message: "تم جلب المنشورات بنجاح 👍" })
        }
        return sendResponseServer({ status: "error", action: "getPosts", message: "لا توجد منشورات" })
    }
    static async getPostsByUsername({ page = 1, username }) {
        const maxLimit = 5
        const count = await db.post.count({
            where: {
                draft: false,
                author: {
                    username
                }
            },
        })
        const posts = await db.post.findMany({
            where: {
                draft: false,
                author: {
                    username
                }
            },
            select: {
                id: true,
                title: true,
                slug: true,
                des: true,
                                isPublished: true,
                banner: true,
                activity: {
                    select: {
                        totalComments: true,
                        totalLikes: true,
                        totalReads: true,
                    }
                },
                tags: true,
                publishedAt: true,
                author: {
                    select: {
                        id: true,
                        photo: true,
                        username: true,
                        name: true
                    }
                }
            },
            orderBy: {
                publishedAt: "asc"
            },
            take: maxLimit,
            skip: (page - 1) * maxLimit,
        })
        if (posts.length) {
            return sendResponseServer({ status: "success", action: "getPostsByUsername", data: { results: posts, count, page }, message: "تم جلب المنشورات بنجاح 👍" })
        }
        return sendResponseServer({ status: "error", action: "getPostsByUsername", data: {count}, message: "لا توجد منشورات" })
    }
    static async getPostsByAdmin({ page = 1 }) {
        const maxLimit = 5
        const count = await db.post.count({
            where: {
                draft: false,
            },
        })
        const posts = await db.post.findMany({
            where: {
                draft: false,
            },
            select: {
                id: true,
                title: true,
                slug: true,
                des: true,
                banner: true,
                isPublished: true,
                activity: {
                    select: {
                        totalComments: true,
                        totalLikes: true,
                        totalReads: true,
                    }
                },
                tags: true,
                publishedAt: true,
                author: {
                    select: {
                        id: true,
                        photo: true,
                        username: true,
                        name: true
                    }
                }
            },
            orderBy: {
                publishedAt: "asc"
            },
            take: maxLimit,
            skip: (page - 1) * maxLimit,
        })
        if (posts.length) {
            return sendResponseServer({ status: "success", action: "getPostsByAdmin", data: { results: posts, count, page }, message: "تم جلب المنشورات بنجاح 👍" })
        }
        return sendResponseServer({ status: "error", action: "getPostsByAdmin", data: {count}, message: "لا توجد منشورات" })
    }
    static async getPostsDraftByUsername({ page = 1, username }) {
        const maxLimit = 5
        const count = await db.post.count({
            where: {
                draft: true,
                author: {
                    username
                }
            },
        })
        const posts = await db.post.findMany({
            where: {
                draft: true,
                author: {
                    username
                }
            },
            select: {
                id: true,
                title: true,
                slug: true,
                des: true,
                                isPublished: true,
                banner: true,
                activity: {
                    select: {
                        totalComments: true,
                        totalLikes: true,
                        totalReads: true,
                    }
                },
                tags: true,
                publishedAt: true,
                author: {
                    select: {
                        id: true,
                        photo: true,
                        username: true,
                        name: true
                    }
                }
            },
            orderBy: {
                publishedAt: "asc"
            },
            take: maxLimit,
            skip: (page - 1) * maxLimit,
        })
        if (posts.length) {
            return sendResponseServer({ status: "success", action: "getPostsDraftByUsername", data: { results: posts, count, page }, message: "تم جلب المنشورات بنجاح 👍" })
        }
        return sendResponseServer({ status: "error", action: "getPostsDraftByUsername", message: "لا توجد منشورات" })
    }
    static async getPostsDraftByAdmin({ page = 1 }) {
        const maxLimit = 5
        const count = await db.post.count({
            where: {
                draft: true,
            },
        })
        const posts = await db.post.findMany({
            where: {
                draft: true
            },
            select: {
                id: true,
                title: true,
                slug: true,
                des: true,
                banner: true,
                isPublished: true,
                activity: {
                    select: {
                        totalComments: true,
                        totalLikes: true,
                        totalReads: true,
                    }
                },
                tags: true,
                publishedAt: true,
                author: {
                    select: {
                        id: true,
                        photo: true,
                        username: true,
                        name: true
                    }
                }
            },
            orderBy: {
                publishedAt: "asc"
            },
            take: maxLimit,
            skip: (page - 1) * maxLimit,
        })
        if (posts.length) {
            return sendResponseServer({ status: "success", action: "getPostsDraftByAdmin", data: { results: posts, count, page }, message: "تم جلب المنشورات بنجاح 👍" })
        }
        return sendResponseServer({ status: "error", action: "getPostsDraftByAdmin", message: "لا توجد منشورات" })
    }
    static async getPostBySlug({ slug }) {
        const getPost = await db.post.findFirst({
            where: {
                draft: false,
                slug,
                isPublished: true
            },
            select: {
                id: true,
                author: {
                    select: {
                        username: true,
                        account: {
                            select: {
                                totalReads: true
                            }
                        }
                    }
                },
                activity: {
                    select: {
                        totalReads: true
                    }
                }
            }
        })
        if (getPost) {
            const totalReads = getPost.activity?.totalReads
            await db.post.update({
                where: {
                    id: getPost.id,
                },
                data: {
                    activity: {
                        update: {
                            totalReads: (totalReads + 1)
                        }
                    }
                }
            })
            const userTotalReads = getPost.author?.account?.totalReads
            await db.user.update({
                where: {
                    username: getPost.author.username
                },
                data: {
                    account: {
                        update: {
                            totalReads: (userTotalReads + 1)
                        }
                    }
                }
            })
            const post = await db.post.findUnique({
                where: {
                    id: getPost.id
                },
                select: {
                    id: true,
                    content: true,
                    title: true,
                    slug: true,
                    des: true,
                                    isPublished: true,
                banner: true,
                    activity: {
                        select: {
                            id: true,
                            totalComments: true,
                            totalLikes: true,
                            totalReads: true
                        }
                    },
                    tags: {
                        select: {
                            id: true,
                            name: true
                        }
                    },
                    publishedAt: true,
                    author: {
                        select: {
                            id: true,
                            photo: true,
                            username: true,
                            name: true
                        }
                    },
                },
            })
            let tagsNames = []
            post?.tags.map(tag => tagsNames.push(tag.name))
            const similar = await db.post.findMany({
                where: {
                    draft: false,
                    isPublished: true,
                    tags: {
                        some: {
                            name: {
                                in: tagsNames
                            }
                        }
                    },
                    NOT: {
                        id: post?.id
                    },
                },
                select: {
                    id: true,
                    title: true,
                    slug: true,
                    des: true,
                                    isPublished: true,
                banner: true,
                    activity: true,
                    tags: true,
                    publishedAt: true,
                    author: {
                        select: {
                            id: true,
                            photo: true,
                            username: true,
                            name: true
                        }
                    }
                },
                orderBy: {
                    publishedAt: "asc"
                },
                take: 5,
            })
            if (post) {
                return sendResponseServer({ status: "success", action: "getPostBySlug", data: { post, similar }, message: "تم جلب المنشور بنجاح 👍" })
            }
        }
        return sendResponseServer({ status: "error", action: "getPostBySlug", message: "لا يوجد هذا المنشور" })
    }
    static async getPostById({ id }) {
        const getPost = await db.post.findUnique({
            where: {
                id,
            },
            select: {
                id: true
            }
        })
        if (getPost) {
            const post = await db.post.findUnique({
                where: {
                    id: getPost.id
                },
                select: {
                    id: true,
                    content: true,
                    title: true,
                    slug: true,
                    des: true,
                                    isPublished: true,
                banner: true,
                    activity: {
                        select: {
                            id: true,
                            totalComments: true,
                            totalLikes: true,
                            totalReads: true
                        }
                    },
                    tags: {
                        select: {
                            id: true,
                            name: true
                        }
                    },
                    publishedAt: true,
                    author: {
                        select: {
                            id: true,
                            photo: true,
                            username: true,
                            name: true
                        }
                    },
                },
            })
            if (post) {
                return sendResponseServer({ status: "success", action: "getPostById", data: post, message: "تم جلب المنشور بنجاح 👍" })
            }
        }
        return sendResponseServer({ status: "error", action: "getPostById", message: "لا يوجد هذا المنشور" })
    }
    static async likePost({ slug, user, isLikedByUser }) {
        const getPost = await db.post.findFirst({
            where: {
                slug,
                draft: false
            },
            select: {
                id: true,
                activity: {
                    select: {
                        totalLikes: true
                    }
                },
                author: {
                    select: {
                        id: true
                    }
                }
            }
        })
        if (getPost) {
            let totalLikes = isLikedByUser ? getPost.activity.totalLikes += 1 : getPost.activity.totalLikes -= 1
            const post = await db.post.update({
                where: {
                    id: getPost.id
                },
                data: {
                    activity: {
                        update: {
                            totalLikes
                        }
                    },
                }
            })
            if (isLikedByUser) {
                await db.notification.create({
                    data: {
                        type: "LIKE",
                        notificationFor: {
                            connect: { id: getPost.author.id }
                        },
                        user: {
                            connect: { id: user.id }
                        },
                        post: {
                            connect: { id: getPost.id }
                        }
                    }
                })
            } else {
                const notification = await db.notification.findFirst({
                    where: {
                        type: "LIKE",
                        postId: getPost.id,
                        userId: user.id
                    },
                    select: {
                        id: true
                    }
                })
                await db.notification.delete({
                    where: {
                        id: notification.id
                    },
                })
            }
            if (post) {
                return sendResponseServer({ status: "success", action: "likePost", message: "تم الإعجاب بالمنشور بنجاح 👍" })
            }
        }
        return sendResponseServer({ status: "error", action: "likePost", message: "لا يوجد هذا المنشور" })
    }
    static async addCommentPost({ slug, user, comment }) {
        const getPost = await db.post.findFirst({
            where: {
                slug,
                draft: false
            },
            select: {
                id: true,
                activity: {
                    select: {
                        totalComments: true,
                        totalParentComments: true,
                    }
                },
                author: {
                    select: {
                        id: true
                    }
                }
            }
        })
        if (getPost) {
            if (!comment.length) {
                return sendResponseServer({ status: "error", action: "addCommentPost", message: "محتوى التعليق مطلوب" })
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
                    content: comment
                }
            })
            let totalComments = getPost.activity?.totalComments
            let totalParentComments = getPost.activity?.totalParentComments
            const post = await db.post.update({
                where: {
                    id: getPost.id
                },
                data: {
                    activity: {
                        update: {
                            totalComments: (totalComments + 1),
                            totalParentComments: (totalParentComments + 1),
                        }
                    },
                }
            })

            await db.notification.create({
                data: {
                    type: "COMMENT",
                    notificationFor: {
                        connect: { id: getPost.author.id }
                    },
                    user: {
                        connect: { id: user.id }
                    },
                    post: {
                        connect: { id: getPost.id }
                    },
                    comment: {
                        connect: { id: getComment.id }
                    }
                }
            })
            if (post) {
                return sendResponseServer({ status: "success", action: "addCommentPost", message: "تم التعليق على المنشور بنجاح 👍" })
            }
        }
        return sendResponseServer({ status: "error", action: "addCommentPost", message: "لا يوجد هذا المنشور" })
    }
    static async addReplyCommentPost({ slug, user, replyingTo, comment, statusReply = "reply" }) {
        const getPost = await db.post.findFirst({
            where: {
                slug,
                draft: false
            },
            select: {
                id: true,
                activity: {
                    select: {
                        totalComments: true,
                        totalParentComments: true,
                    }
                },
                author: {
                    select: {
                        id: true
                    }
                }
            }
        })
        if (getPost) {
            if (!comment.length) {
                return sendResponseServer({ status: "error", action: "addReplyCommentPost", message: "محتوى التعليق مطلوب" })
            }
            if (!replyingTo.length) {
                return sendResponseServer({ status: "error", action: "addReplyCommentPost", message: "التعليق المردود عليه مطلوب" })
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
            let totalComments = getPost.activity?.totalComments
            let totalParentComments = getPost.activity?.totalParentComments
            const post = await db.post.update({
                where: {
                    id: getPost.id
                },
                data: {
                    activity: {
                        update: {
                            totalComments: (totalComments + 1),
                            totalParentComments: (totalParentComments + 1),
                        }
                    },
                }
            })

            if(statusReply === "reply"){
                await db.notification.create({
                    data: {
                        type: "REPLY",
                        notificationFor: {
                            connect: { id: getComment.parent?.commentedBy?.id }
                        },
                        user: {
                            connect: { id: user.id }
                        },
                        post: {
                            connect: { id: getPost.id }
                        },
                        reply: {
                            connect: { id: getComment.id }
                        }
                    }
                })
            } else if(statusReply === "repliedOnComment") {
                await db.notification.create({
                    data: {
                        type: "REPLY",
                        notificationFor: {
                            connect: { id: getComment.parent?.commentedBy?.id }
                        },
                        user: {
                            connect: { id: user.id }
                        },
                        post: {
                            connect: { id: getPost.id }
                        },
                        repliedOnComment: {
                            connect: { id: getComment.id }
                        }
                    }
                })
            }
            if (post) {
                return sendResponseServer({ status: "success", action: "addReplyCommentPost", message: "تم الرد على التعليق بنجاح 👍" })
            }
        }
        return sendResponseServer({ status: "error", action: "addReplyCommentPost", message: "لا يوجد هذا التعليق" })
    }
    static async deleteCommentPost({ slug, user, id }) {
        const getPost = await db.post.findFirst({
            where: {
                slug,
                draft: false
            },
            select: {
                id: true,
                activity: {
                    select: {
                        totalComments: true,
                        totalParentComments: true,
                    }
                },
                author: {
                    select: {
                        id: true,
                        username: true
                    }
                }
            }
        })
        if (getPost) {
            if (!id.length) {
                return sendResponseServer({ status: "error", action: "deleteCommentPost", message: "معرف التعليق مطلوب" })
            }
            const comment = await db.comment.findUnique({
                where: {
                    id
                },
                select: {
                    id: true,
                    children: {
                        select: {
                            id: true,
                            children: true
                        },
                    },
                    commentedBy: true
                },
            })
            if (user) {
                if (user.username === comment.commentedBy.username || user.username === getPost.author.username) {
                    let totalComments = getPost.activity?.totalComments
                    let totalParentComments = getPost.activity?.totalParentComments
                    if (comment?.children.length) {
                        if (comment.children[0]?.children?.length) {
                            await db.comment.delete({
                                where: {
                                    id: comment.id
                                }
                            })
                            await db.post.update({
                                where: {
                                    id: getPost.id
                                },
                                data: {
                                    activity: {
                                        update: {
                                            totalComments: (totalComments - 3),
                                            totalParentComments: (totalParentComments - 3),
                                        }
                                    },
                                }
                            })
                        } else {
                            await db.comment.delete({
                                where: {
                                    id: comment.id
                                }
                            })
                            await db.post.update({
                                where: {
                                    id: getPost.id
                                },
                                data: {
                                    activity: {
                                        update: {
                                            totalComments: (totalComments - 2),
                                            totalParentComments: (totalParentComments - 2),
                                        }
                                    },
                                }
                            })
                        }
                    } else {
                        await db.comment.delete({
                            where: {
                                id: comment.id
                            }
                        })
                        await db.post.update({
                            where: {
                                id: getPost.id
                            },
                            data: {
                                activity: {
                                    update: {
                                        totalComments: (totalComments - 1),
                                        totalParentComments: (totalParentComments - 1),
                                    }
                                },
                            }
                        })
                    }
                } else {
                    return sendResponseServer({ status: "success", action: "deleteCommentPost", message: "لا يمكنك حذف التعليق" })
                }
            } else {
                return sendResponseServer({ status: "success", action: "deleteCommentPost", message: "يرجى تسجيل الدخول" })
            }

            return sendResponseServer({ status: "success", action: "deleteCommentPost", message: "تم حذف التعليق بنجاح 👍" })
        }
        return sendResponseServer({ status: "error", action: "deleteCommentPost", message: "لا يوجد هذا التعليق" })
    }
    static async getIslikeUserPost({ slug, user }) {
        const getPost = await db.post.findFirst({
            where: {
                slug,
                draft: false
            },
            select: {
                id: true,
            }
        })
        if (getPost) {
            const isLikeUser = await db.notification.findFirst({
                where: {
                    type: "LIKE",
                    postId: getPost.id,
                    userId: user.id
                },
            })
            if (isLikeUser) {
                return true
            }
        }
        return false
    }
    static async getCommentsPost({ slug, page = 1 }) {
        const maxLimit = 5
        const getPost = await db.post.findFirst({
            where: {
                slug,
                draft: false
            },
            select: {
                id: true,
            }
        })
        if (getPost) {
            const count = await db.comment.count({
                where: {
                    parent: null,
                    postId: getPost.id,
                },
            })
            const comments = await db.comment.findMany({
                where: {
                    parent: null,
                    postId: getPost.id,
                },
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
                    postAuthor: {
                        select: {
                            name: true,
                            username: true,
                            photo: true
                        }
                    },
                    children: {
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
                            postAuthor: {
                                select: {
                                    name: true,
                                    username: true,
                                    photo: true
                                }
                            },
                            children: {
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
                                    postAuthor: {
                                        select: {
                                            name: true,
                                            username: true,
                                            photo: true
                                        }
                                    },
                                    children: true,
                                    parent: true,
                                    createdAt: true
                                },
                                orderBy: {
                                    createdAt: "desc"
                                },
                            },
                            parent: true,
                            createdAt: true
                        },
                        orderBy: {
                            createdAt: "desc"
                        },
                    },
                    parent: true,
                    createdAt: true,

                },
                orderBy: {
                    createdAt: "desc"
                },
                take: maxLimit,
                skip: (page - 1) * maxLimit,
            })
            if (comments.length) {
                return sendResponseServer({ status: "success", action: "getCommentsPost", data: { results: comments, count, page }, message: "تم جلب تعليقات المنشور بنجاح 👍" })
            }
        }
        return sendResponseServer({ status: "error", action: "getCommentsPost", message: "لا توجد تعليقات" })
    }
    static async search({ tag, page = 1 }) {
        const maxLimit = 5
        const count = await db.post.count({
            where: {
                draft: false,
                isPublished: true,
                tags: {
                    some: {
                        name: {
                            contains: tag
                        }
                    }
                },
            },
        })
        const posts = await db.post.findMany({
            where: {
                draft: false,
                isPublished: true,
                tags: {
                    some: {
                        name: {
                            contains: tag
                        }
                    }
                },
            },
            select: {
                id: true,
                title: true,
                slug: true,
                des: true,
                                isPublished: true,
                banner: true,
                activity: true,
                tags: true,
                publishedAt: true,
                author: {
                    select: {
                        id: true,
                        photo: true,
                        username: true,
                        name: true
                    }
                }
            },
            orderBy: {
                publishedAt: "asc"
            },
            take: maxLimit,
            skip: (page - 1) * maxLimit
        })
        if (posts.length) {
            return sendResponseServer({ status: "success", action: "searchPost", data: { results: posts, count, page }, message: "تم جلب المنشورات بنجاح 👍" })
        }
        return sendResponseServer({ status: "error", action: "searchPost", message: "لا توجد منشورات" })
    }
    static async searchQuery({ value, page = 1 }) {
        const maxLimit = 5
        const count = await db.post.count({
            where: {
                draft: false,
                isPublished: true,
                title: {
                    contains: value
                },
            },
        })
        const posts = await db.post.findMany({
            where: {
                draft: false,
                isPublished: true,
                title: {
                    contains: value
                },
            },
            select: {
                id: true,
                title: true,
                slug: true,
                des: true,
                                isPublished: true,
                banner: true,
                activity: {
                    select: {
                        totalComments: true,
                        totalLikes: true,
                        totalReads: true,
                    }
                },
                tags: true,
                publishedAt: true,
                author: {
                    select: {
                        id: true,
                        photo: true,
                        username: true,
                        name: true
                    }
                }
            },
            orderBy: {
                publishedAt: "asc"
            },
            take: maxLimit,
            skip: (page - 1) * maxLimit
        })
        if (posts.length) {
            return sendResponseServer({ status: "success", action: "searchQueryPost", data: { results: posts, count, page }, message: "تم جلب المنشورات بنجاح 👍" })
        }
        return sendResponseServer({ status: "error", action: "searchQueryPost", message: "لا توجد منشورات" })
    }
    static async searchDraftQuery({ value, page = 1 }) {
        const maxLimit = 5
        const count = await db.post.count({
            where: {
                draft: true,
                title: {
                    contains: value
                },
            },
        })
        const posts = await db.post.findMany({
            where: {
                draft: true,
                title: {
                    contains: value
                },
            },
            select: {
                id: true,
                title: true,
                slug: true,
                des: true,
                                isPublished: true,
                banner: true,
                activity: {
                    select: {
                        totalComments: true,
                        totalLikes: true,
                        totalReads: true,
                    }
                },
                tags: true,
                publishedAt: true,
                author: {
                    select: {
                        id: true,
                        photo: true,
                        username: true,
                        name: true
                    }
                }
            },
            orderBy: {
                publishedAt: "asc"
            },
            take: maxLimit,
            skip: (page - 1) * maxLimit
        })
        if (posts.length) {
            return sendResponseServer({ status: "success", action: "searchDraftQuery", data: { results: posts, count, page }, message: "تم جلب المنشورات بنجاح 👍" })
        }
        return sendResponseServer({ status: "error", action: "searchDraftQuery", message: "لا توجد منشورات" })
    }
    static async trending() {
        const maxLimit = 5
        const posts = await db.post.findMany({
            where: {
                draft: false,
                isPublished: true,
            },
            select: {
                id: true,
                title: true,
                slug: true,
                activity: true,
                isPublished: true,
                publishedAt: true,
                author: {
                    select: {
                        id: true,
                        photo: true,
                        username: true,
                        name: true
                    }
                }
            },
            orderBy: [
                {
                    activity: {
                        totalReads: "asc"
                    }
                },
                {
                    activity: {
                        totalLikes: "asc"
                    }
                },
                {
                    publishedAt: "asc"
                }
            ],
            take: maxLimit
        })
        if (posts.length) {
            return sendResponseServer({ status: "success", action: "getPosts", data: posts, message: "تم جلب المنشورات الشائعة بنجاح 👍" })
        }
        return sendResponseServer({ status: "error", action: "getPosts", message: "لا توجد منشورات" })
    }
    static async create({ title, img, des, tags, content, draft, user }) {
        let newContent = content.replaceAll("uploads", '/uploads').replaceAll("//uploads", '/uploads')
        let newTags = []
        const slug = title.replaceAll(" ", "-").trim() + nanoid()
        if (!title.length) {
            return sendResponseServer({ status: "error", action: "createPost", message: "عنوان المنشور مطلوب" })
        }

        if (draft) {
            await db.post.create({
                data: {
                    title,
                    banner: img,
                    des,
                    slug,
                    content,
                    draft,
                    authorId: user.id,
                }
            })
            return sendResponseServer({ status: "success", action: "createPost", message: "تم حفظ المنشور كمسودة بنجاح 👍" })
        }
        if (!img.length) {
            return sendResponseServer({ status: "error", action: "createPost", message: "صورة المنشور مطلوبة." })
        }
        if (!newContent.length) {
            return sendResponseServer({ status: "error", action: "createPost", message: "اكتب شيئا ما." })
        }
        if (!des.length) {
            return sendResponseServer({ status: "error", action: "createPost", message: "الوصف القصير للمنشور مطلوب" })
        }
        if (!tags.length) {
            return sendResponseServer({ status: "error", action: "createPost", message: "أضف وسما أو اثنين" })
        }

        await Promise.all(tags.map(async tag => {
            const existingTag = await db.tag.findFirst({
                where: {
                    name: tag
                }
            })
            if (existingTag) {
                newTags.push({ id: existingTag.id })
            } else {
                await db.tag.create({
                    data: {
                        name: tag
                    }
                })
                const getTag = await db.tag.findFirst({
                    where: {
                        name: tag
                    }
                })
                newTags.push({ id: getTag.id })
            }
        }))

        await db.post.create({
            data: {
                title,
                banner: img,
                des,
                slug,
                content: newContent,
                draft,
                authorId: user.id,
                activity: { create: {} },
                tags: {
                    connect: newTags,
                }
            }
        })

        const account = await db.accountInfo.findFirst({ where: { userId: user.id } })
        let totalPosts = parseInt(account.totalPosts)
        await db.accountInfo.update({
            where: {
                id: account.id
            },
            data: {
                totalPosts: (totalPosts + 1)
            }
        })
        return sendResponseServer({ status: "success", action: "createPost", message: "تم إنشاء المنشور بنجاح 👍" })
    }
    static async delete({ postId, user }) {        
        if (!postId.length) {
            return sendResponseServer({ status: "error", action: "deletePost", message: "المنشور مطلوب" })
        }
        await db.post.delete({
            where: {
                id: postId
            }
        })

        const account = await db.accountInfo.findFirst({ where: { userId: user.id } })
        let totalPosts = parseInt(account.totalPosts)
        await db.accountInfo.update({
            where: {
                id: account.id
            },
            data: {
                totalPosts: (totalPosts - 1)
            }
        })
        return sendResponseServer({ status: "success", action: "deletePost", data: {postId}, message: "تم حذف المنشور بنجاح 👍" })
    }
    static async publish({ postId, value }) {
        if (!postId.length) {
            return sendResponseServer({ status: "error", action: "publishPost", message: "المنشور مطلوب" })
        }
        await db.post.update({
            where: {
                id: postId
            },
            data: {
                isPublished: value
            }
        })

        return sendResponseServer({ status: "success", action: "publishPost", data: {postId}, message: "تم تحديث المنشور بنجاح 👍" })
    }
    static async edit({ title, img, des, tags, content, draft, user, id }) {
        let newContent = content.replaceAll("uploads", '/uploads').replaceAll("//uploads", '/uploads')
        let newTags = []
        const slug = title.replaceAll("-", " ").replaceAll(" ", "-").trim() + nanoid()
        if (!title.length) {
            return sendResponseServer({ status: "error", action: "createPost", message: "عنوان المنشور مطلوب" })
        }

        if (draft) {
            await db.post.update({
                where: {
                    id
                },
                data: {
                    title,
                    banner: img,
                    des,
                    slug,
                    content,
                    draft,
                }
            })
            return sendResponseServer({ status: "success", action: "createPost", message: "تم تعديل المنشور كمسودة بنجاح 👍" })
        }
        if (!img.length) {
            return sendResponseServer({ status: "error", action: "createPost", message: "صورة المنشور مطلوبة." })
        }
        if (!newContent.length) {
            return sendResponseServer({ status: "error", action: "createPost", message: "اكتب شيئا ما." })
        }
        if (!des.length) {
            return sendResponseServer({ status: "error", action: "createPost", message: "الوصف القصير للمنشور مطلوب" })
        }
        if (!tags.length) {
            return sendResponseServer({ status: "error", action: "createPost", message: "أضف وسما أو اثنين" })
        }

        await Promise.all(tags.map(async tag => {
            const existingTag = await db.tag.findFirst({
                where: {
                    name: tag
                }
            })
            if (existingTag) {
                newTags.push({ id: existingTag.id })
            } else {
                await db.tag.create({
                    data: {
                        name: tag
                    }
                })
                const getTag = await db.tag.findFirst({
                    where: {
                        name: tag
                    }
                })
                newTags.push({ id: getTag.id })
            }
        }))

        const post = await db.post.findUnique({
            where: {
                id
            },
            include: {
                tags: true
            }
        })

        if(post?.draft && !post.tags.length){
            await db.post.update({
                where: {
                    id
                },
                data: {
                    title,
                    banner: img,
                    des,
                    slug,
                    content: newContent,
                    draft,
                    activity: { create: {} },
                    tags: {
                        set: [],
                    }
                }
            })
        } else {
            await db.post.update({
                where: {
                    id
                },
                data: {
                    title,
                    banner: img,
                    des,
                    slug,
                    content: newContent,
                    draft,
                    tags: {
                        set: [],
                    }
                }
            })
        }

        await db.post.update({
            where: {
                id
            },
            data: {
                tags: {
                    connect: newTags,
                }
            }
        })
        return sendResponseServer({ status: "success", action: "createPost", message: "تم تعديل المنشور بنجاح 👍" })
    }
}