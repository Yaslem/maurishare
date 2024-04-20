import { useSubmit } from "@remix-run/react"
import { useState } from "react"
import toast from "react-hot-toast"

const NotificationCommentField = ({ replyingTo, notificationId, postId, placeholder, message }) => {
    const [comment, setComment] = useState("")
    const submit = useSubmit()
    let toastId;
    const handelComment = () => {
        if (!comment.length) {
            return toast.error("رجاء اكتب شيئا ما.")
        }
        toastId = toast.loading("يتم إضافة الرد...")
        const formData = new FormData()
        formData.append("comment", comment)
        formData.append("notificationId", notificationId)
        formData.append("postId", postId)
        formData.append("replyingTo", replyingTo)
        formData.append("action", "reply")
        submit(formData, { method: "POST" })


    }
    return (
        <>
            <p className="text-sm mb-3">{message}</p>
            <textarea onChange={(e) => setComment(e.target.value)} defaultValue={comment} value={comment} className="input-box pr-5 placeholder:text-dark-grey resize-none h-[150px] overflow-auto" placeholder={placeholder}></textarea>
            <button onClick={handelComment} className="btn-dark mt-5 px-10">رد</button>
        </>
    )
}
export default NotificationCommentField