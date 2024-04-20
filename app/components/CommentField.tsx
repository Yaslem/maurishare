import { useActionData, useSubmit } from "@remix-run/react"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"

const CommentField = ({ action, user, replyingTo, statusReply, placeholder, message }) => {
    const submit = useSubmit()
    let data = useActionData()
    let toastId;
    const [comment, setComment] = useState("")
    useEffect(() => {
        if(data){
            if(data.action === "addCommentPost" || data.action === "addReplyCommentPost"){
                toast.dismiss(toastId)
                if(data.status === "error"){
                    toast.error(data.message)
                } else {
                    toast.success(data.message)
                }
                data = undefined
                setComment("")
            }
        }
    }, [data, toastId])
    const handelComment = () => {
        if(action === "تعليق"){
            if(!user){
                toast.error("رجاء سجل الدخول لكي تستطيع التعليق على المنشور.")
            } else if(!comment.length){
                toast.error("رجاء اكتب شيئا ما.")
            } else {
                toastId = toast.loading("يتم إضافة التعليق...")
                const formData = new FormData()
                formData.append("comment", comment)
                formData.append("action", "comment")
                submit(formData, {method: "POST"})
            }
        } else if(action === "رد"){
            if(!user){
                toast.error("رجاء سجل الدخول لكي تستطيع الرد على التعليق.")
            } else if(!comment.length){
                toast.error("رجاء اكتب شيئا ما.")
            } else {
                toastId = toast.loading("يتم إضافة الرد...")
                const formData = new FormData()
                formData.append("comment", comment)
                formData.append("replyingTo", replyingTo)
                formData.append("action", "reply")
                formData.append("statusReply", statusReply)
                submit(formData, {method: "POST"})
            }
        }
    }
    return (
        <>
            <p className="text-sm mb-3">{message}</p>
            <textarea onChange={(e) => setComment(e.target.value)} defaultValue={comment} value={comment} className="input-box pr-5 placeholder:text-dark-grey resize-none h-[150px] overflow-auto" placeholder={placeholder}></textarea>
            <button onClick={handelComment} className="btn-dark mt-5 px-10">{action}</button>
        </>
    )
}
export default CommentField