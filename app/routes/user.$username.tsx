import { ActionFunctionArgs, MetaFunction, json, redirect } from "@remix-run/node"
import { Link, useActionData, useLoaderData, useParams, useSubmit } from "@remix-run/react"
import { useEffect, useState } from "react"
import AnimationWrapper from "~/common/Animation"
import AboutUser from "~/components/AboutUser"
import LoadMoreDataBtn from "~/components/LoadMoreDataBtn"
import Loader from "~/components/Loader"
import NoDataMessage from "~/components/NoDataMessage"
import PostCard from "~/components/PostCard"
import InPageNavigation from "~/components/inPageNavigation"
import Post from "~/controllers/Post.server"
import User from "~/controllers/User.server"
import { generatePageTitle } from "~/helpers/Global"
import { getUserAuthenticated } from "~/services/auth.server"

export async function loader({ params, request }) {
    const username = params.username
    const user = await User.getProfile({ username })    
    if(user.status !== "error"){        
        return json({
            user,
            posts: await Post.getPostsByUsername({ username }),
            userAuthenticated: await getUserAuthenticated(request)
        })
    }
    return redirect("/");
}

export async function action({ request, params }: ActionFunctionArgs) {
    let { action, page } = Object.fromEntries(await request.formData());
    page = parseInt(page)
    switch (action) {
        case "getPostsByUsername": {
            return json(await Post.getPostsByUsername({ username: params.username, page }))
        }
    }
    return json({})
}

export const meta: MetaFunction = ({ data, matches }) => {    
    return generatePageTitle({matches, current: `${data.user.data.name} ` + `(@${data.user.data.username})`});
};

export default function UserId() {
    const params = useParams()
    const { user, posts, userAuthenticated } = useLoaderData()
    
    const [postsList, setPostsList] = useState(posts)

    const submit = useSubmit()
    let data = useActionData()
    const [isLoading, setIsLoading] = useState({
        status: false,
        state: "post"
    })

    const getDataPagination = () => {
        setIsLoading({
            status: true,
            state: "post"
        })
        const formData = new FormData()
        formData.append("page", (postsList.data.page + 1))
        formData.append("action", "getPostsByUsername")
        submit(formData, { method: "post" })
    }

    useEffect(() => {
        if (data) {
            if (data.action === "getPostsByUsername") {
                if (data.status !== "error") {
                    let oldData = []
                    if (postsList && postsList.data.results.length) {
                        oldData = [...postsList.data.results]
                    }
                    setPostsList({
                        status: data.status,
                        message: data.message,
                        data: {
                            count: data.data.count,
                            page: data.data.page,
                            results: [...oldData, ...data?.data?.results]
                        },
                    })
                } else {
                    setPostsList(data)
                }
                setIsLoading({
                    status: false,
                    state: "post"
                })
            }
        }
    }, [data])

    useEffect(() => {
        setPostsList(posts)
    }, [params.username])

    return (
        <AnimationWrapper>
            <section className="h-cover md:flex flex-row-reverse items-start gap-5 min-[1100px]:gap-12">
                <div className="flex flex-col max-md:items-center gap-5 min-w-[250px] md:w-[50%] md:pr-8 md:border-r border-grey md:sticky md:top-[100px] md:py-10">
                    <img src={`/uploads/${user.data.photo}`} className="w-48 h-48 bg-grey rounded-full md:w-32 md:h-32" />
                    <h1 className="text-2xl font-semibold">@{user.data.username}</h1>
                    <p className="text-xl h-6">{user.data.name}</p>

                    <p className="">{user.data.account.totalPosts.toLocaleString()} منشورا - {user.data.account.totalReads.toLocaleString()} قراءة</p>
                    {
                        userAuthenticated && userAuthenticated.username === params.username
                            ? <div className="flex gap-4 mt-2">
                                <Link to={"/dashboard/user/edit-profile"} className="btn-light rounded-md">تعديل الملف الشخصي</Link>
                            </div>
                            : null
                    }
                    <AboutUser name={user.data.name} className={"max-md:hidden"} bio={user.data.bio} socialLinks={user.data.socialLinks} joinedAt={user.data.createdAt} />
                </div>
                <div className="max-md:mt-12 w-full">
                <InPageNavigation routes={["المنشورات", "عن المستخدم"]} defaultHidden={["عن المستخدم"]}>
                    <>
                        {
                            isLoading.status && isLoading.state === "post"
                                ? <Loader />
                                : postsList.status === "error"
                                    ? <NoDataMessage message={postsList.message} />
                                    : postsList.data.results.map((post, i) =>
                                        <AnimationWrapper transition={{ duration: 1, delay: i * .1 }} key={i}>
                                            <PostCard content={post} author={post.author} />
                                        </AnimationWrapper>
                                    )
                        }
                        <LoadMoreDataBtn getDataPagination={getDataPagination} state={postsList} />
                    </>
                    <AboutUser name={user.data.name} bio={user.data.bio} socialLinks={user.data.socialLinks} joinedAt={user.data.createdAt} />
                </InPageNavigation>
                </div>
            </section>
        </AnimationWrapper>
    )
}