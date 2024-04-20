import { Link } from "@remix-run/react"
import getDay from "~/common/Date"

const MinimalPost = ({post, index}) => {
    let {slug, publishedAt, title, author: {name, photo, username}} = post
    return (
        <Link to={`/post/${slug}`} className="flex gap-5 mb-8">
            <h1 className="blog-index">{index < 10 ? "0" + (index + 1) : (index + 1)}</h1>
            <div>
                <div className="flex gap-2 items-center mb-7">
                    <img src={"/uploads/" + photo} className="w-6 h-6 rounded-full"/>
                    <p className="line-clamp-1">{name} @{username}</p>
                    <p className="min-h-fit">{getDay(publishedAt)}</p>
                </div>
                <h1 className="blog-title">{title}</h1>
            </div>
        </Link>
    )
}
export default MinimalPost