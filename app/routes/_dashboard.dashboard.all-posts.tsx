import {ActionFunctionArgs, MetaFunction, json, redirect} from "@remix-run/node"
import {
    useActionData,
    useLoaderData,
    useSearchParams,
    useSubmit
} from "@remix-run/react"
import { useEffect, useState } from "react"
import AnimationWrapper from "~/common/Animation"
import ManageDraftPost from "~/components/ManageDraftPost"
import ManagePublishedPostCard from "~/components/ManagePublishedPostCard"
import NoDataMessage from "~/components/NoDataMessage"
import InPageNavigation from "~/components/inPageNavigation"
import Post from "~/controllers/Post.server"
import { getUserAuthenticated } from "~/services/auth.server"
import toast from "react-hot-toast"
import LoadMoreDataBtn from "~/components/LoadMoreDataBtn"
import { generatePageTitle } from "~/helpers/Global"

export async function loader({ request }) {
    const user = await getUserAuthenticated(request)
    if(user.role === "ADMIN"){
        return json({
            user,
            posts: await Post.getPostsByAdmin({}),
            drafts: await Post.getPostsDraftByAdmin({}),
        })
    }
    return redirect("/")
}

export const meta: MetaFunction = ({ data, matches }) => {
    return generatePageTitle({ matches, current: "المنشورات" + ` (${data.posts.data.count})` });
};

export async function action({ request }: ActionFunctionArgs) {
    let { action, page, postId, value} = Object.fromEntries(await request.formData());
    const user = await getUserAuthenticated(request)
    page = parseInt(page)
    if(user.role === "ADMIN"){
        switch (action) {
            case "searchQueryPost": {
                return json({
                    posts: await Post.searchQuery({ value }),
                    drafts: await Post.searchDraftQuery({ value }),
                })
            }
            case "paginationPost": {
                return json({
                    posts: await Post.getPostsByAdmin({ page }),
                    action,
                })
            }
            case "paginationDraft": {
                return json({
                    action,
                    drafts: await Post.getPostsDraftByAdmin({ page }),
                })
            }
            case "deletePost": {
                if(!user.can_delete_post) return redirect("/dashboard/posts")
                return json(await Post.delete({ postId, user }))
            }
            case "publishPost": {
                value = value === "true"
                return json(await Post.publish({ postId, value }))
            }
        }
    }
    return redirect("/")
}

export default function Posts() {
    const { posts, drafts, action, user } = useLoaderData()
    const isTap = useSearchParams()[0].get("tap")
    const submit = useSubmit()
    const data = useActionData()
    const [postsList, setPostsList] = useState(posts)
    const [draftsList, setDraftsList] = useState(drafts)

    const [value, setValue] = useState("")

    useEffect(() => {
        if (data) {
            if (data.posts && data.posts.action === "searchQueryPost") {
                setPostsList(data.posts)
            }
            if (data.drafts && data.drafts.action === "searchDraftQuery") {
                setDraftsList(data.drafts)
            }
            if (data.action && data.action === "publishPost") {
                if (data.status === "error") {
                    toast.error(data.message)
                } else {
                    toast.success(data.message)
                    setTimeout(() => {
                        location.reload()
                    }, 1000)
                }
            }
            if (data.action && data.action === "deletePost") {
                if (data.status === "error") {
                    toast.error(data.message)
                } else {
                    toast.success(data.message)
                    if (postsList.data) {
                        let findDataPost = postsList.data.results.filter(post => post.id !== data.data.postId)
                        let oldDataPost = [...findDataPost]
                        setPostsList({
                            status: oldDataPost.length > 0 ? postsList.status : "error",
                            message: postsList.message,
                            data: {
                                count: parseInt(postsList.data.count) - 1,
                                page: postsList.data.page,
                                results: [...oldDataPost]
                            },
                        })
                    }

                    if (draftsList.data) {
                        let findDataDraft = draftsList.data.results.filter(post => post.id !== data.data.postId)
                        let oldDataDraft = [...findDataDraft]
                        setDraftsList({
                            status: oldDataDraft.length > 0 ? draftsList.status : "error",
                            message: draftsList.message,
                            data: {
                                count: parseInt(draftsList.data.count) - 1,
                                page: draftsList.data.page,
                                results: [...oldDataDraft]
                            },
                        })

                    }
                }
            }
            if (data.action && data.action === "paginationPost") {
                let oldData = [...postsList.data.results]
                setPostsList({
                    status: data.status,
                    message: data.message,
                    data: {
                        count: data.posts.data.count,
                        page: data.posts.data.page,
                        results: [...oldData, ...data?.posts.data?.results]
                    },
                })
            }
            if (data.action && data.action === "paginationDraft") {
                let oldData = [...draftsList.data.results]
                setDraftsList({
                    status: data.status,
                    message: data.message,
                    data: {
                        count: data.drafts.data.count,
                        page: data.drafts.data.page,
                        results: [...oldData, ...data?.drafts.data?.results]
                    },
                })
            }
        }
    }, [data])

    const searchPosts = () => {
        const formData = new FormData()
        formData.append("value", value)
        formData.append("action", "searchQueryPost")
        submit(formData, { method: "post" })
    }

    const getDataPaginationPost = () => {
        const formData = new FormData()
        formData.append("page", (postsList.data.page + 1))
        formData.append("action", "paginationPost")
        submit(formData, { method: "post" })
    }

    const getDataPaginationDraft = () => {
        const formData = new FormData()
        formData.append("page", (draftsList.data.page + 1))
        formData.append("action", "paginationDraft")
        submit(formData, { method: "post" })
    }

    return (
        <>
            <h1 className="max-md:hidden">المنشورات</h1>
            <div className="relative max-md:mt-5 md:mt-8 mb-10">
                <input onKeyDown={e => {
                    if (e.keyCode === 13 && value.length > 0) {
                        searchPosts()
                    }
                }} onChange={e => {
                    if (e.target.value.length === 0) {
                        setValue("")
                        setPostsList(posts)
                        setDraftsList(drafts)
                    } else {
                        setValue(e.target.value)
                    }
                }} type="text" placeholder="بحث عن منشورات" className="w-full bg-grey p-4 pr-12 rounded-full placeholder:text-dark-grey" />
                <i className="fi fi-rr-search absolute left-[10%] md:pointer-events-none md:right-5 top-1/2 text-xl text-dark-grey -translate-y-1/2"></i>
            </div>
            <InPageNavigation defaultActiveIndex={isTap !== "draft" ? 0 : 1} routes={["المنشورة", "المسودة"]}>
                {
                    postsList.status !== "error"
                        ? <>
                            {
                                postsList.data.results.map((post, i) =>
                                    <AnimationWrapper key={i} transition={{ delay: i * 0.04 }}>
                                        <ManagePublishedPostCard user={user} post={post} />
                                    </AnimationWrapper>
                                )
                            }
                            <LoadMoreDataBtn getDataPagination={getDataPaginationPost} state={postsList} />
                        </>
                        : <NoDataMessage message={"لا توجد منشورات"} />
                }
                {
                    draftsList.status !== "error"
                        ? <>
                            {
                                draftsList.data.results.map((post, i) =>
                                    <AnimationWrapper key={i} transition={{ delay: i * 0.04 }}>
                                        <ManageDraftPost post={post} index={i + 1} />
                                    </AnimationWrapper>
                                )
                            }
                            <LoadMoreDataBtn getDataPagination={getDataPaginationDraft} state={draftsList} />
                        </>
                        : <NoDataMessage message={"لا توجد مسودات"} />
                }

            </InPageNavigation>
        </>
    )
}