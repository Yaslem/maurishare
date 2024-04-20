import AnimationWrapper from "~/common/Animation";
import {Link, useSubmit} from "@remix-run/react";
import {useSelector} from "react-redux";

const NavigationPanel = () => {
    const submit = useSubmit();
    const user = useSelector(state => state.user.data)
    return (
        <AnimationWrapper
            className={"absolute left-0"}
            transition={{duration: 0.2}}
        >
            <div className={"bg-white z-50 absolute left-0 border border-grey w-60 overflow-hidden duration-200"}>
                <Link to={"/"} className={"flex gap-2 link md:hidden pl-8 py-4"}>
                    <i className="fi fi-rr-edit"></i>
                    <p>اكتب</p>
                </Link>
                <Link to={`/user/${user?.username}`} className={"flex gap-2 link md:hidden pl-8 py-4"}>
                    <p>الملف الشخصي</p>
                </Link>
                <Link to={`dashboard/posts`} className={"flex gap-2 link md:hidden pl-8 py-4"}>
                    <p>صفحة التحكم</p>
                </Link>
                <Link to={`/dashboard/edit-profile`} className={"flex gap-2 link md:hidden pl-8 py-4"}>
                    <p>الإعدادات</p>
                </Link>
                <span className={"absolute border-t border-grey w-[100%]"}/>
                <button onClick={(e) => {
                    e.preventDefault()
                    const formData = new FormData();
                    formData.append("action", "signout");
                    submit(formData, {method: "post"});
                }} type={"submit"} className={"text-right p-4 hover:bg-grey w-full pr-8 py-4"}>
                    <h1 className={"font-bold text-xl mb-1"}>تسجيل الخروج</h1>
                    <p className={"text-dark-grey"}>@{user?.username}</p>
                </button>
            </div>
        </AnimationWrapper>
    )
}
export default NavigationPanel