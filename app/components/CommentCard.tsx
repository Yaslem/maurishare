import { useState } from "react";
import toast from "react-hot-toast";
import getDay from "~/common/Date";
import CommentField from "./CommentField";
import { useSubmit } from "@remix-run/react";

const CommentCard = ({ comment, index, user, post }) => {
    const submit = useSubmit()
    const [isReply, setIsReply] = useState({
        statsu: false,
        type: "comment",
        id: 0
    })

    const [isShowReply, setIsShowReply] = useState({
        statsu: false,
        type: "comment",
        id: 0,
        isChild: false
    })

    const handelDeleteComment = (id) => {
        let formData = new FormData()
        formData.append("commentId", id)
        formData.append("action", "deleteComment")
        submit(formData, { method: "DELETE" })
    }

    return (
        <div className="w-full">
            <div className="border border-grey my-5 p-6 rounded-md">
                <div className="flex gap-3 items-center mb-8">
                    <img className="rounded-full w-8 h-8 object-cover" src={`/uploads/${comment.commentedBy.photo}`} />
                    <p className="line-clamp-1">{comment.commentedBy.name} @{comment.commentedBy.username}</p>
                    <p className="min-w-fit">{getDay(comment.createdAt)}</p>
                </div>
                <p className="text-base p-2 overflow-auto rounded-e-lg mr-3 border-r-2 border-black/50 bg-grey/80">{comment.content}</p>
                <div className="flex gap-5 justify-between items-center mt-5">
                    <button onClick={() => {
                        if (!user) {
                            toast.error("رجاء سجل الدخول لكي تستطيع الرد على التعليق.")
                        } else {
                            setIsReply({
                                statsu: !isReply.statsu,
                                type: "comment",
                                id: 0,
                                isChild: false
                            })
                        }
                    }} className="underline">{isReply.statsu && isReply.type === "comment" ? "إخفاء" : "رد"}</button>
                    <div className="flex gap-3 items-center">
                        <button onClick={() => {
                            setIsShowReply({
                                statsu: !isShowReply.statsu,
                                type: "comment",
                                id: 0,
                                isChild: false
                            })
                        }} className="text-sm underline"> {comment.children.length && isShowReply.statsu ? "إخفاء" : "عرض"} الردود ({comment.children.length})</button>
                        {
                            user
                                ? user.username === comment.commentedBy.username || user.username === post.author.username
                                    ? <button onClick={() => handelDeleteComment(comment.id)} className="p-2 px-3 rounded-md border border-grey hover:bg-red/30 hover:text-red flex items-center">
                                        <i className="fi fi-rr-trash"></i>
                                    </button>
                                    : null
                                : null
                        }
                    </div>
                </div>
                {
                    isReply.statsu && isReply.type === "comment"
                        ? <div className="mt-8">
                            <CommentField statusReply={"reply"} message={`أنت الآن ترد على تعليق @${comment.commentedBy.username}`} placeholder="اترك ردا..." user={user} replyingTo={comment.id} action={"رد"} />
                        </div>
                        : null
                }
                {
                    comment.children.length && isShowReply.statsu
                        ? comment.children.map((children, i) =>
                            <div key={i} className="border mr-6 border-grey my-5 p-6 rounded-md">
                                <div className="flex gap-3 items-center mb-8">
                                    <img className="rounded-full w-8 h-8 object-cover" src={`/uploads/${children.commentedBy.photo}`} />
                                    <p className="line-clamp-1">{children.commentedBy.name} @{children.commentedBy.username}</p>
                                    <p className="min-w-fit">{getDay(children.createdAt)}</p>
                                </div>
                                <p className="text-base p-2 overflow-auto rounded-e-lg mr-3 border-r-2 border-black/50 bg-grey/80">{children.content}</p>
                                <div className="flex gap-5 justify-between items-center mt-5">
                                    <button onClick={() => {
                                        if (!user) {
                                            toast.error("رجاء سجل الدخول لكي تستطيع الرد على التعليق.")
                                        } else {
                                            setIsReply({
                                                statsu: !isReply.statsu,
                                                type: "reply",
                                                id: children.id,
                                                isChild: true
                                            })
                                        }
                                    }} className="underline">{isReply.statsu && isReply.type === "reply" && isReply.id === children.id ? "إخفاء" : "رد"}</button>
                                    <div className="flex gap-3 items-center">
                                        <button onClick={() => {
                                            setIsShowReply({
                                                statsu: true,
                                                type: "reply",
                                                id: children.id,
                                                isChild: !isShowReply.isChild
                                            })
                                        }} className="text-sm underline"> {children.children.length && isShowReply.isChild && isShowReply.id === children.id && isShowReply.statsu && isShowReply.type === "reply" ? "إخفاء" : "عرض"} الردود ({children.children.length})</button>
                                        {
                                            user
                                                ? user.username === children.commentedBy.username || user.username === post.author.username
                                                    ? <button onClick={() => handelDeleteComment(children.id)} className="p-2 px-3 rounded-md border border-grey hover:bg-red/30 hover:text-red flex items-center">
                                                        <i className="fi fi-rr-trash"></i>
                                                    </button>
                                                    : null
                                                : null
                                        }
                                    </div>

                                </div>
                                {
                                    isReply.statsu && isReply.type === "reply" && isReply.id === children.id
                                        ? <div className="mt-8">
                                            <CommentField statusReply={"repliedOnComment"} message={`أنت الآن ترد على رد @${children.commentedBy.username}`} placeholder="اترك ردا..." user={user} replyingTo={children.id} action={"رد"} />
                                        </div>
                                        : null
                                }
                                {
                                    children.children.length && isShowReply.isChild && isShowReply.id === children.id && isShowReply.statsu && isShowReply.type === "reply"
                                        ? children.children.map((c, i) =>
                                            <div key={i} className="border mr-4 border-grey my-5 p-6 rounded-md">
                                                <div className="flex gap-3 items-center mb-8">
                                                    <img className="rounded-full w-8 h-8 object-cover" src={`/uploads/${c.commentedBy.photo}`} />
                                                    <p className="line-clamp-1">{c.commentedBy.name} @{c.commentedBy.username}</p>
                                                    <p className="min-w-fit">{getDay(c.createdAt)}</p>
                                                </div>
                                                <p className="text-base p-2 overflow-auto rounded-e-lg mr-3 border-r-2 border-black/50 bg-grey/80">{c.content}</p>
                                                <div className="flex gap-5 justify-between items-center mt-5">
                                                    {
                                                        user
                                                            ? user.username === c.commentedBy.username || user.username === post.author.username
                                                                ? <button onClick={() => handelDeleteComment(c.id)} className="p-2 px-3 rounded-md border border-grey hover:bg-red/30 hover:text-red flex items-center">
                                                                    <i className="fi fi-rr-trash"></i>
                                                                </button>
                                                                : null
                                                            : null
                                                    }
                                                </div>
                                            </div>
                                        )
                                        : null
                                }
                            </div>
                        )
                        : null
                }
            </div>
        </div>
    )
}
export default CommentCard