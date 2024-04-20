import { ActionFunctionArgs, MetaFunction, json } from "@remix-run/node";
import { Form, useActionData, useSubmit } from "@remix-run/react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import AnimationWrapper from "~/common/Animation";
import InputBox from "~/components/InputBox";
import { AuthServer } from "~/controllers/Auth.server";
import User from "~/controllers/User.server";
import { generatePageTitle } from "~/helpers/Global";
import { getUserAuthenticated } from "~/services/auth.server";

export async function action({ request }: ActionFunctionArgs) {
    let { action, newPassword, currentPassword } = Object.fromEntries(await request.formData());
    if (action === "changePassword") {
        return json(await AuthServer.changePassword(request, newPassword, currentPassword))
    }
    return json({})

}

export async function loader({ request }) {
    const user = await getUserAuthenticated(request)
    return json((await User.getProfile({ username: user.username })).data)

}

export const meta: MetaFunction = ({ data, matches }) => {            
    return generatePageTitle({matches, current: `تغيير كلمة مرور ` + `${data.name} ` + `(@${data.username})`});
};

export default function changePassword() {
    const submit = useSubmit()
    let data = useActionData()
    let [currentPassword, setCurrentPassword] = useState("")
    let [newPassword, setNewPassword] = useState("")

    useEffect(() => {
        if (data) {
            if (data.action === "changePassword") {
                setCurrentPassword("")
                setNewPassword("")
                if (data.status === "error") {
                    toast.error(data.message)
                } else {
                    toast.success(data.message)
                }
            }
        }
    }, [data])

    const handelSubmit = (e) => {
        e.preventDefault()
        if (!currentPassword.length || !newPassword.length) {
            return toast.error("املأ جميع الحقول.")
        } else if (newPassword.length < 8) {
            return toast.error("كلمة المرور الجديدة يجب أن تكون أطول من 8 أحرف.")
        } else if (newPassword.length > 16) {
            return toast.error("كلمة المرور الجديدة يجب أن تكون أقل من 16 أحرف.")
        }

        // e.target.setAttribute("disabled", true)

        const formData = new FormData()
        formData.append("newPassword", newPassword)
        formData.append("currentPassword", currentPassword)
        formData.append("action", "changePassword")
        submit(formData, { method: "PUT" })

    }

    return <AnimationWrapper>
        <h1 className="max-md:hidden">تغيير كلمة المرور</h1>
        <div className="py-10 w-full md:max-w-[400px]">
            <InputBox value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} className={"profile-edit-input"} icon="fi-rr-unlock" placeholder="كلمة المرور الحالية" name="currentPassword" type="password" />
            <InputBox value={newPassword} onChange={e => setNewPassword(e.target.value)} className={"profile-edit-input"} icon="fi-rr-unlock" placeholder="كلمة المرور الجديدة" name="newPassword" type="password" />
            <button onClick={handelSubmit} className="btn-dark px-10">تغيير كلمة المرور</button>
        </div>
    </AnimationWrapper>
}