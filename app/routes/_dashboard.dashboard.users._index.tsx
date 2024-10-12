import {ActionFunctionArgs, MetaFunction, redirect} from "@remix-run/node"
import {Form, json, Link, useActionData, useLoaderData, useNavigation, useSubmit} from "@remix-run/react"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import AnimationWrapper from "~/common/Animation"
import InputBox from "~/components/InputBox"
import User from "~/controllers/User.server"
import { generatePageTitle } from "~/helpers/Global"
import { getUserAuthenticated } from "~/services/auth.server"
import { commitSession, getSession } from "~/services/session.server"

export async function loader({ request }) {
    const user = await getUserAuthenticated(request)
    if(user.role === "ADMIN"){
        return json(await User.getAllUsers())
    }
    return redirect("/")
}

export const meta: MetaFunction = ({ data, matches }) => {            
    return generatePageTitle({matches, current: `المستخدمون`});
};

export async function action({ request }: ActionFunctionArgs) {
    let user = await getUserAuthenticated(request)
    let { action, img, instagram, username, bio, facebook, twitter, youtube, website } = Object.fromEntries(await request.formData());    
    switch (action) {
        case "uploadUserPhoto": {
            let imgUrl = await User.uploadImg(img, user.username)
            const session = await getSession(
                request.headers.get("Cookie")
            )
            user.photo = imgUrl
            session.set("user", user)
            return json({ imgUrl }, {
                headers: {
                    "Set-Cookie": await commitSession(session),
                },
            })
        }
        case "editProfile": {
            const session = await getSession(
                request.headers.get("Cookie")
            )
            const res = await User.editProfile({
                username: user.username,
                newUsername: username,
                instagram,
                youtube,
                facebook,
                twitter,
                website,
                bio
            })
            if(res.status === "success"){
                user.username = username
                session.set("user", user)

            }
            return json(res, {
                headers: {
                    "Set-Cookie": await commitSession(session),
                },
            })
        }
    }
    return json({})
}

export default function editProfile() {
    const users = useLoaderData()
    const submit = useSubmit()
    const navigation = useNavigation();
    const loading = navigation.state === "loading"
    let data = useActionData()

    useEffect(() => {
        if (data) {
            if (data.action === "editProfile") {
                if (data.status === "error") {
                    toast.error(data.message)
                } else {
                    toast.success(data.message)
                    data = undefined
                }
            }
        }
    }, [data]);
    let tableNames = ["الصورة", "الاسم", "اسم المستخدم", "البريد", "خيارات"]
    return (
        <AnimationWrapper>
            <h1 className="max-md:hidden">تعديل الحساب</h1>
            <div className={"overflow-auto border border-black/10 mt-4 rounded-lg"}>
                <table className="w-full">
                    <thead>
                    <tr>
                        {
                            tableNames.map((name, i) => 
                                <th className={"text-center border-black/10 bg-black/5 p-2 border-b " + (i === 0 ? "rounded-tr-lg " : null) + ((tableNames.length -1) === i ? "rounded-tl-lg" : null)}>{name}</th>
                            )
                        }
                        {/* <th className={"text-center border-black/10 bg-black/5 p-2 border-b rounded-tr-lg"}>الصورة</th>
                        <th className={"text-center border-black/10 bg-black/5 p-2 border-b"}>الاسم</th>
                        <th className={"text-center border-black/10 bg-black/5 p-2 border-b"}>اسم المستخدم</th>
                        <th className={"text-center border-black/10 bg-black/5 p-2 border-b"}>البريد</th>
                        <th className={"text-center border-black/10 bg-black/5 p-2 border-b rounded-tl-lg"}>خيارات</th> */}
                    </tr>
                    </thead>
                    <tbody>
                    {
                        users.data.map((user, i) =>
                            <tr key={i} className={"odd:border-b border-black/10"}>
                                <td className={"p-2"}>
                                    <img className="w-12 h-12 rounded-full" src={"/uploads/" + user.photo}/>
                                </td>
                                <td className={"p-2"}>{user.name}</td>
                                <td className={"p-2 underline"}>
                                    <Link to={`/user/${user.username}`}>@{user.username}</Link>
                                </td>
                                <td className={"p-2"}>{user.email}</td>
                                <td className={"p-2"}>
                                    <Link to={`/dashboard/users/${user.username}`} className={"btn-dark flex items-center justify-center"}>عرض</Link>
                                </td>
                            </tr>
                        )
                    }
                    </tbody>
                </table>
            </div>
        </AnimationWrapper>
    )
}