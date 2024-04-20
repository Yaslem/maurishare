import { Link } from "@remix-run/react";
import { useState } from "react";
import getDay from "~/common/Date";
import NotificationCommentField from "./NotificationCommentField";

const NotificationCard = ({ notification }) => {
    console.log(notification.seen);
    
    return (
        <div className={"p-6 border-b border-grey border-r-black " + (!notification.seen ? "border-r-2" : null)}>
            <div className="flex gap-5 mb-3">
                <img className="w-14 h-14 flex-none rounded-full" src={`/uploads/${notification.user.photo}`} />
                <div className="w-full">
                    <h1 className="font-semibold text-base text-dark-grey">
                        <span className="font-normal">
                            {
                                notification.type === "LIKE" ? "أعجب" :
                                    notification.type === "COMMENT" ? "علق" :
                                        notification.type === "REPLY" ? "رد" : null
                            }
                        </span>
                        <span className="lg:inline-block mx-1 hidden">{notification.user.name}</span>
                        <Link className="mx-1 text-black underline" to={`/user/${notification.user.username}`}>@{notification.user.username}</Link>
                        <span className="font-normal">
                            {
                                notification.type === "LIKE" ? "بمنشورك" :
                                    notification.type === "COMMENT" ? "على منشورك" :
                                        notification.type === "REPLY" ? "على تعليقك" : null
                            }
                        </span>
                    </h1>
                    {
                        notification.type === "REPLY"
                            ? <div className="p-4 mt-4 rounded-md bg-grey">
                                {
                                    notification.type === "REPLY"
                                        ? notification.repliedOnComment
                                            ? <p>{notification.repliedOnComment.content}</p>
                                            : <p>{notification.reply.content}</p>
                                        : <p>{notification.comment.content}</p>
                                }
                            </div>
                            : notification.type === "COMMENT"
                                ? <div className="flex mt-4 flex-col gap-2">
                                    <Link className="text-black underline" to={`/post/${notification.post.slug}`}>{notification.post.title}</Link>
                                    <div className="p-4 rounded-md bg-grey">
                                        <p>{notification.comment.content}</p>
                                    </div>
                                </div>
                                : <Link className="underline mt-4 text-dark-grey line-clamp-1 font-medium" to={`/post/${notification.post.slug}`}>{notification.post.title}</Link>
                    }
                </div>
            </div>
            <div className="mr-14 pr-5 mt-3 text-dark-grey flex gap-8">
                <p>{getDay(notification.createdAt)}</p>
                
            </div>
        </div>
    )
}
export default NotificationCard