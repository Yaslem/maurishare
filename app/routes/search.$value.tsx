import { ActionFunctionArgs, MetaFunction } from "@remix-run/node";
import { json, useActionData, useLoaderData, useNavigation, useParams, useSubmit } from "@remix-run/react"
import { useEffect, useState } from "react";
import AnimationWrapper from "~/common/Animation";
import LoadMoreDataBtn from "~/components/LoadMoreDataBtn";
import Loader from "~/components/Loader";
import NoDataMessage from "~/components/NoDataMessage";
import PostCard from "~/components/PostCard";
import UserCard from "~/components/UserCard";
import InPageNavigation from "~/components/inPageNavigation";
import Post from "~/controllers/Post.server";
import User from "~/controllers/User.server";
import { generatePageTitle } from "~/helpers/Global";

export async function loader({ params }) {
    return json({
        posts: await Post.searchQuery({ value: params.value }),
        users: await User.searchQuery({ value: params.value }),
    })
}

export async function action({ request, params }: ActionFunctionArgs) {
    let { action, page } = Object.fromEntries(await request.formData());
    page = parseInt(page)
    switch (action) {
        case "searchQueryPost": {
            return json(await Post.searchQuery({ value: params.value, page }))
        }
    }
    return json({})
}

export const meta: MetaFunction = ({ params, matches }) => {    
    return generatePageTitle({matches, current: "بحث عن " + `"${params.value}"`});
};


export default function Search() {
    const { posts, users } = useLoaderData()
    const params = useParams()
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
        formData.append("action", "searchQueryPost")
        submit(formData, { method: "post" })
    }

    useEffect(() => {
        if (data) {
            if (data.action === "searchQueryPost") {
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
    }, [params.value])

    const UserCardWrapper = () => {
        return (
            <>
                {
                    users.status === "error"
                        ? <NoDataMessage message={users.message} />
                        : users.data.map((user, i) =>
                            <AnimationWrapper key={i} transition={{ duraion: 1, delay: i * 0.88 }}>
                                <UserCard user={user} />
                            </AnimationWrapper>
                        )
                }
            </>
        )
    }

    return (
        <section className="h-cover flex justify-center gap-10">
            <div className="w-full">
                <InPageNavigation routes={[`نتيجة البحث عن "${params.value}"`, "المستخدمون"]} defaultHidden={["المستخدمون"]}>
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
                    <UserCardWrapper />
                </InPageNavigation>
            </div>
            <div className="min-w-[40%] lg:min-w-[350px] max-w-min border-r border-grey pr-8 pt-3 max-md:hidden">
                <h1 className="font-medium text-xl mb-8">مستخدمون لهم علاقة بالبحث <i className="fi fi-rr-user mt-1"></i></h1>
                <UserCardWrapper />
            </div>
        </section>
    )
}