import { ActionFunctionArgs, MetaFunction, json, redirect } from "@remix-run/node";
import { Link, useActionData, useLoaderData } from "@remix-run/react";
import AnimationWrapper from "~/common/Animation";
import getDay from "~/common/Date";
import PostCard from "~/components/PostCard";
import parse from 'html-react-parser';
import PostInteraction from "~/components/PostInteraction";
import Post from "~/controllers/Post.server";
import { getUserAuthenticated, isAuthenticated } from "~/services/auth.server";
import CommentContainer from "~/components/CommentContainer";
import { useEffect, useState } from "react";
import { generatePageTitle } from "~/helpers/Global";
export async function loader({ params, request }) {
    const user = await getUserAuthenticated(request)
    const post = await Post.getPostBySlug({ slug: params.slug })    
    if(post.status !== "error"){
        return json({
            postData: post, 
            userAuthenticated: await getUserAuthenticated(request),
            isLikeUser: user ? await Post.getIslikeUserPost({user, slug: params.slug}) : false,
            comments: await Post.getCommentsPost({slug: params.slug}),
        });
    }
    return redirect("/");
}

export const meta: MetaFunction = ({ data, matches }) => {        
    return generatePageTitle({matches, current: `${data.postData.data.post.title}`});
};

export async function action({request, params}: ActionFunctionArgs) {
    let {action, comment, page, statusReply, replyingTo, commentId, isLikedByUser} = Object.fromEntries(await request.formData());
    page = parseInt(page)
    if(action === "getCommentsPost"){
        return json(await Post.getCommentsPost({slug: params.slug, page}))
    }
    const isSignIn = await isAuthenticated(request)
    if(!isSignIn) return redirect("/auth/signin")
    const user = await getUserAuthenticated(request)
    switch (action) {
        case "likePost": {
            isLikedByUser = isLikedByUser === "false"
            return json(await Post.likePost({user, slug: params.slug, isLikedByUser}))
        }
        case "comment": {
            return json(await Post.addCommentPost({user, slug: params.slug, comment}))
        }
        case "reply": {
            return json(await Post.addReplyCommentPost({statusReply, replyingTo, user, slug: params.slug, comment}))
        }
        case "deleteComment": {
            return json(await Post.deleteCommentPost({ user, slug: params.slug, id: commentId}))
        }
    }
    return json({})
}

export default function PostSlug() {
    const {postData: {data: {post, similar}}, userAuthenticated, isLikeUser, comments} = useLoaderData()        
    const [commentsList, setCommentsList] = useState(comments)
    const [commentWrapper, setCommentWrapper] = useState(false)

    let data = useActionData()

    useEffect(() => {        
        if(data && data.action === "addCommentPost") {
            setCommentsList(comments)
        } else if(data && data.action === "addReplyCommentPost"){
            setCommentsList(comments)
        } else if(data && data.action === "deleteCommentPost"){
            setCommentsList(comments)
        }
    }, [comments])

    useEffect(() => {
        if (data) {
            if (data.action === "getCommentsPost") {
                let oldData = [...commentsList.data.results]
                setCommentsList({
                    status: data.status,
                    message: data.message,
                    data: {
                        count: data.data.count,
                        page: data.data.page,
                        results: [...oldData, ...data?.data?.results]
                    },
                })
            }
            data = undefined
        }
    }, [data])


    return (
        <AnimationWrapper>
            <CommentContainer comments={commentsList} user={userAuthenticated} post={post} setCommentWrapper={setCommentWrapper} commentWrapper={commentWrapper} />
            <div className="max-w-[900px] center py-10 max-lg:px-[5vw]">
                <img src={post.banner} className="aspect-video"/>
                <div className="mt-12">
                    <h2>{post.title}</h2>
                    <div className="flex max-sm:flex-col justify-between my-8">
                        <div className="flex items-start gap-5">
                            <img className="w-12 h-12 rounded-full" src={`/uploads/${post.author.photo}`}/>
                            <p>
                                {post.author.name}
                                <br />
                                @<Link className="underline" to={`/user/${post.author.username}`}>{post.author.username}</Link>
                            </p>
                        </div>
                        <p className="text-dark-grey opacity-75 max-sm:mt-6 max-sm:mr-12 max-sm:pr-5">نُشِر في {getDay(post.publishedAt)}</p>
                    </div>
                </div>
                <PostInteraction setCommentWrapper={setCommentWrapper} commentWrapper={commentWrapper} isLikeUser={isLikeUser} user={userAuthenticated} post={post} />
                <div className="my-12 blog-page-content" >
                    {parse(post.content)}
                </div>
                {
                    similar.length 
                        ? <>
                        <hr className="border-grey my-2" />
                        <h1 className="text-2xl mt-14 mb-10 font-semibold">المنشورات المشابهة</h1>
                        {
                            similar.map((post, i) => 
                                <AnimationWrapper transition={{duraion: 1, delay: i*0.88}} key={i}>
                                    <PostCard content={post} author={post.author} />
                                </AnimationWrapper>
                            )
                        }
                        </>
                        : null
                }
            </div>
        </AnimationWrapper>
    )
}