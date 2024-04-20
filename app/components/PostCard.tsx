import { Link } from '@remix-run/react';
import getDay from './../common/Date';
const PostCard = ({content, author}) => {
    let {id, slug, publishedAt, title, tags, des, banner, activity: {totalLikes}} = content
    let {name, photo, username} = author    
    
    return (
        <Link to={`/post/${slug}`} className='flex items-center gap-8 border-b border-grey pb-5 mb-4'>
            <div className="w-full">
                <div className="flex gap-2 mb-7">
                    <Link to={`/user/${username}`} className='flex gap-2 items-center mb-7'>
                        <img src={"/uploads/" + photo} className="w-6 h-6 rounded-full"/>
                        <p className="line-clamp-1">{name} @{username}</p>
                    </Link>
                    <p className="min-h-fit">{getDay(publishedAt)}</p>
                </div>
                <h1 className='blog-title'>{title}</h1>
                <p className='my-3 text-xl leading-7 max-sm:hidden md:max-[1100px]:hidden line-clamp-2'>{des}</p>
                <div className='flex gap-4 mt-7'>
                    {
                        tags.length 
                            ? <span className='btn-light py-1 px-4'>{tags[0].name}</span>
                            : null
                    }
                    <span className='mr-3 flex items-center gap-2 text-dark-grey'>
                        <i className='fi fi-rr-heart text-xl'></i>
                        {totalLikes}
                    </span>
                </div>
            </div>
            <div className='h-28 aspect-square bg-grey'>
                <img src={banner} className='w-full h-full aspect-square object-cover' />
            </div>
        </Link>
    )
}
export default PostCard