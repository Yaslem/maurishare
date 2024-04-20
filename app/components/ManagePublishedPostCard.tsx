import { Link, useSubmit } from "@remix-run/react"
import { useState } from "react"
import getDay from "~/common/Date"

const ManagePublishedPostCard = ({ post }) => {
    const submit = useSubmit()
    const [showState, setShowState] = useState(false)

    return (
        <>
            <div className="flex gap-10 border-b mb-6 max-md:px-4 border-grey pb-6 items-center">
                <img className="max-md:hidden lg:hidden xl:block w-28 h-28 flex-none bg-grey object-cover" src={post.banner} />
                <div className="flex flex-col justify-between py-2 w-full min-w-[300px]">
                    <div>
                        <Link className="blog-title mb-4 hover:underline" to={`/post/${post.slug}`}>{post.title}</Link>
                        <p className="line-clamp-1">نُشر في {getDay(post.publishedAt)}</p>
                    </div>
                    <div className="flex items-center gap-6 mt-3">
                        <Link to={`/post/edit/${post.id}`}>تعديل</Link>
                        <button onClick={() => setShowState(!showState)} className="pl-r py-2 underline lg:hidden">الحالة</button>
                        <button onClick={() => {
                        const formData = new FormData()
                        formData.append("postId", post.id)
                        formData.append("action", "deletePost")
                        submit(formData, {method: "PUT"})
                    }} className="pl-r py-2 underline text-red">حذف</button>
                    </div>
                </div>
                <div className="max-lg:hidden">
                    <PostState state={post.activity} />
                </div>
            </div>
            {
                showState
                    ? <div>
                        <PostState state={post.activity} />
                    </div>
                    : null
            }
        </>
    )
}

const PostState = ({ state }) => {
    function getValueName(value){
        switch(value){
            case "totalLikes":
                return "الإعجابات"
            case "totalComments":
                return "التعليقات"
            case "totalReads":
                return "المشاهدات"
            case "totalParentComments":
                return "الردود"
        }
    }
    return (
        <div className="flex gap-2 max-lg:mb-6 max-lg:pb-6 border-grey max-lg:border-b">
            {
                Object.keys(state).map((info, i) => {
                    return <div key={i} className={"flex flex-col items-center w-full h-full justify-center p-4 px-6 " + (i !== 0 ? "border-r border-grey" : null)}>
                        <h1 className="text-xl lg:text-2xl mb-2">{state[info].toLocaleString()}</h1>
                        <p className="max-lg:text-dark-grey">{getValueName(info)}</p>
                    </div>;
                    
                })
            }
        </div>
    )
}
export default ManagePublishedPostCard