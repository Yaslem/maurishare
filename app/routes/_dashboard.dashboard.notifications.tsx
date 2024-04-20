import { useEffect, useState } from "react"
import User from "../controllers/User.server"
import { json, useActionData, useLoaderData, useSubmit } from "@remix-run/react"
import { getUserAuthenticated } from "../services/auth.server"
import { ActionFunctionArgs, MetaFunction } from "@remix-run/node"
import AnimationWrapper from "~/common/Animation"
import NotificationCard from "~/components/NotificationCard"
import { generatePageTitle } from "~/helpers/Global"
import LoadMoreDataBtn from "~/components/LoadMoreDataBtn"
import NoDataMessage from "~/components/NoDataMessage"

export async function loader({ request }) {
    const user = await getUserAuthenticated(request)
    return json(await User.getNotifications({ username: user.username }))
}

export const meta: MetaFunction = ({ data, matches }) => {
    return generatePageTitle({ matches, current: "الإشعارات" + ` (${data.data.countAll})` });
};

export async function action({ request }: ActionFunctionArgs) {
    let { action, comment, page, notificationId, type, replyingTo, postId } = Object.fromEntries(await request.formData());
    const user = await getUserAuthenticated(request)
    page = parseInt(page)
    if (action === "getNotifications") {
        return json(await User.getNotifications({ username: user.username, type }))
    }
    switch (action) {
        // case "reply": {
        //     return json(await User.addReplyCommentNotification({ postId, replyingTo, notificationId, user, comment }))
        // }
        case "notificationsPagination": {
            return json({
                action,
                data: await User.getNotifications({ username: user.username, page, type })
            })
        }
    }
    return json({})
}

export default function Notifications() {
    const submit = useSubmit()
    let data = useActionData()
    const notifications = useLoaderData()
    const [notificationsList, setNotificationsList] = useState(notifications)
    const [filter, setFilter] = useState("الكل")
    let filters = ["الكل", "الإعجابات", "التعليقات", "الردود"]

    const getNameFilter = (name) => {
        switch (name) {
            case "الكل":
                return "all"
            case "الإعجابات":
                return "LIKE"
            case "التعليقات":
                return "COMMENT"
            case "الردود":
                return "REPLY"
        }

    }

    const getDataPagination = () => {
        const formData = new FormData()
        formData.append("page", (notificationsList.data.page + 1))
        formData.append("type", getNameFilter(filter))
        formData.append("action", "notificationsPagination")
        submit(formData, { method: "post" })
    }

    const getDataByFilter = (filterName) => {
        const formData = new FormData()
        formData.append("type", getNameFilter(filterName))
        formData.append("action", "getNotifications")
        submit(formData, { method: "post" })
    }

    useEffect(() => {
        if (data) {
            console.log(data.action);
            
            if (data.action === "getNotifications") {
                setNotificationsList(data)
            }
            if (data.action === "notificationsPagination") {
                console.log("here");
                
                let oldData = [...notificationsList.data.results]
                setNotificationsList({
                    status: data.data.status,
                    message: data.data.message,
                    data: {
                        count: data.data.data.count,
                        page: data.data.data.page,
                        results: [...oldData, ...data.data?.data?.results]
                    },
                })
            }
        }
    }, [data])

    return (
        <div>
            <h1 className="max-md:hidden">الإشعارات الأخيرة</h1>
            <div className="my-8 flex gap-6">
                {
                    filters.map((filterName, i) =>
                        <button onClick={(e) => {
                            setFilter(e.target.innerText);
                            getDataByFilter(e.target.innerText)
                        }} key={i} className={"py-2 " + (filterName === filter ? "btn-dark" : "btn-light")}>{filterName}</button>
                    )
                }
            </div>
            {
                notificationsList.status !== "error"
                    ? notificationsList.data.results.map((notification, i) =>
                        <AnimationWrapper key={i} transition={{ delay: i * 0.08 }}>
                            <NotificationCard notification={notification} />
                        </AnimationWrapper>
                    )
                    : <NoDataMessage message={"لا توجد إشعارات."}/>
            }
            <LoadMoreDataBtn getDataPagination={getDataPagination} state={notificationsList} />
        </div>
    )
}