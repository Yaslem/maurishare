import { ActionFunctionArgs, MetaFunction } from "@remix-run/node"
import { Form, json, useActionData, useLoaderData, useNavigation, useSubmit } from "@remix-run/react"
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
    return json((await User.getProfile({ username: user.username })).data)

}

export const meta: MetaFunction = ({ data, matches }) => {            
    return generatePageTitle({matches, current: `تعديل معلومات ` + `${data.name} ` + `(@${data.username})`});
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
    const user = useLoaderData()    
    const submit = useSubmit()
    const navigation = useNavigation();
    const loading = navigation.state === "loading"
    let data = useActionData()
    const [img, setImg] = useState({
        imgUrl: `/uploads/${user.photo}`,
        newImg: ""
    })

    let loadingToast;
    const bioLimit = 150
    const [charectersLeft, setCharecterLeft] = useState(bioLimit)

    const handelImgUpload = () => {
        if (img.imgUrl !== `/uploads/${user.photo}`) {
            loadingToast = toast.loading("يتم تحميل الصورة...")
            const formData = new FormData()
            formData.append("action", "uploadUserPhoto")
            formData.append("img", img.newImg)
            submit(formData, { method: "POST", encType: "multipart/form-data" })
        } else {
            toast.error("اختر صورة جديدة")
        }
    }

    useEffect(() => {
        if (data) {
            toast.dismiss(loadingToast)
            if (data.imgUrl) {
                toast.success("تم تحميل الصورة بنجاح 👍.")
                setImg({
                    imgUrl: `/uploads/${data.imgUrl}`,
                    newImg: ""
                })
            }
            else if (data.action === "editProfile") {
                if (data.status === "error") {
                    toast.error(data.message)
                } else {
                    toast.success(data.message)
                    data = undefined
                }
            }
        }
    }, [data]);

    return (
        <AnimationWrapper>
            <h1 className="max-md:hidden">تعديل الحساب</h1>
            <div className="flex flex-col lg:flex-row items-start py-10 gap-8 lg:gap-10">
                <div className="max-lg:center mb-5 flex flex-col">
                    <label htmlFor="uploadImg" className="relative cursor-pointer bg-grey block w-48 h-48  rounded-full overflow-hidden">
                        <img src={img.imgUrl} />
                    </label>
                    <input onChange={(e) => {
                        const img = e.target.files[0]
                        setImg({
                            imgUrl: URL.createObjectURL(img),
                            newImg: img
                        })
                    }} hidden id="uploadImg" type="file" accept=".jpeg, .png .jpg" />
                    <button onClick={handelImgUpload} disabled={loading} className="btn-light mt-5 max-lg:center lg:w-full">تحميل</button>
                </div>
                <Form method="PUT" className="w-full">
                    <input type="hidden" name="action" value={"editProfile"} />
                    <div className="grid grid-cols-1 md:grid-cols-2 md:gap-5">
                        <div>
                            <InputBox disabled={true} icon="fi-rr-user" value={user.name} type="text" name="name" placeholder="الاسم" />
                        </div>
                        <div>
                            <InputBox disabled={true} icon="fi-rr-envelope" value={user.email} type="email" name="email" placeholder="البريد" />
                        </div>
                    </div>
                    <InputBox icon="fi-rr-at" value={user.username} type="text" name="username" placeholder="اسم المستخدم" />
                    <p className="text-dark-grey -mt-3">سنستحدم اسم حسابك للبحث عنك، ورؤية الآخرين لحسابك.</p>
                    <textarea onChange={(e) => {
                        setCharecterLeft(bioLimit - e.target.value.length)
                    }} placeholder="نبذة قصيرة عنك.." defaultValue={user.bio} name="bio" maxLength={bioLimit} className="input-box h-64 lg:h-40 resize-none leading-7 mt-5 pr-5"></textarea>
                    <p className="mt-1 text-dark-grey">{charectersLeft} حرفا متبقيا</p>
                    <p className="text-dark-grey my-6">أضف روابط حساباتك على مواقع التواصل الاجتماعي</p>
                    <div className="md:grid md:grid-cols-2 gap-x-6">
                        {
                            Object.keys(user.socialLinks).map((key, i) => {
                                let link = user.socialLinks[key]
                                return <InputBox onChange={e => setSocialLinks({
                                    key,
                                    value: e.target.value
                                })} icon={"fi " + (key !== "website" ? `fi-brands-${key}` : "fi-rr-globe") + " text-2xl hover:text-black"} dir="ltr" className={"text-left"} type="text" value={link} placeholder="https://" key={i} name={key} />
                            })
                        }
                    </div>
                    <button disabled={loading} type="submit" className="btn-dark w-auto px-10">تحديث الملف الشخصي</button>
                </Form>
            </div>
        </AnimationWrapper>
    )
}