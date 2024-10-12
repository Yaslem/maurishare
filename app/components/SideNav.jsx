import { NavLink, useLocation } from "@remix-run/react"
import { useEffect, useRef, useState } from "react"

const SideNav = ({newNotification, user}) => {
    const location = useLocation().pathname.split("/")[2]
    function getPathName(pathname){
        switch (pathname) {
            case "posts":
                return "المنشورات"
        
            default:
                return "صفحة التحكم"
        }
    }
    const [page, setPage] = useState(getPathName(location))
    const [showSideNav, setShowSideNav] = useState(false)
    let activeTapLine = useRef()
    let sideBarIcon = useRef()
    let pageStateTap = useRef()

    const changePageState = (e) => {
        const { offsetWidth, offsetLeft, offsetParent } = e.target                
        activeTapLine.current.style.width = offsetWidth + "px"
        activeTapLine.current.style.right = (offsetParent.offsetWidth - offsetWidth - offsetLeft) + "px"

        if(e.target === sideBarIcon.current){
            setShowSideNav(true)
        } else {
            setShowSideNav(false)
        }
    }
    useEffect(() => {
        setShowSideNav(false)
        pageStateTap.current.click()
    }, [page])
    return (
        <div className="sticky top-[90px] z-30">
                <div className="md:hidden bg-white py-1 border-b border-grey flex flex-nowrap overflow-y-auto">
                    <button onClick={changePageState} ref={sideBarIcon} className="p-5 capitalize">
                        <i className="fi fi-rr-bars-staggered pointer-events-none"></i>
                    </button>
                    <button onClick={changePageState} ref={pageStateTap} className="p-5 capitalize">
                        {page}
                    </button>
                    <hr ref={activeTapLine} className="absolute bottom-0 duration-500"/>
                </div>
                <div className={"overflow-y-auto h-[calc(100vh-80px-60px)] md:h-cover min-w-[250px] md:sticky top-24 p-6 md:pl-0 md:border-grey md:border-l absolute max-md:top-[64px] bg-white max-md:w-[calc(100%+80px)] max-md:px-16 max-md:-mr-7 duration-500 " + (!showSideNav ? "max-md:opacity-0 max-md:pointer-events-none" : "max-md:opacity-100 max-md:pointer-events-auto")}>
                    <h1 className="text-xl text-dark-grey mb-3 ">صفحة التحكم</h1>
                    <hr  className="border-grey -mr-6 mb-8 ml-6"/>
                    {
                        user.role === "ADMIN"
                            ? <>
                                <NavLink className={"sidebar-link"} to={"/dashboard/all-posts"} onClick={e => setPage(e.target.innerText)}>
                                    <i className="fi fi-rr-border-all"></i>
                                    المنشورات
                                </NavLink>
                                <NavLink className={"sidebar-link"} to={"/dashboard/users"} onClick={e => setPage(e.target.innerText)}>
                                    <i className="fi fi-rr-users-alt"></i>
                                    المستخدمون
                                </NavLink>
                            </>
                            : null
                    }
                    <NavLink className={"sidebar-link"} to={"/dashboard/posts"} onClick={e => setPage(e.target.innerText)}>
                        <i className="fi fi-rr-document"></i>
                        {user.role === "ADMIN" ? "منشوراتي" : "المنشورات"}
                    </NavLink>
                    <NavLink className={"sidebar-link"} to={"/dashboard/notifications"} onClick={e => setPage(e.target.innerText)}>
                        <div className="relative">
                        <i className="fi fi-rr-bell"></i>
                            {
                                newNotification
                                    ? <span className="bg-red w-3 h-3 rounded-full absolute z-10 top-0 right-2" />
                                    : null
                            }
                        </div>
                        الإشعارات
                    </NavLink>
                    <NavLink className={"sidebar-link"} to={"/post/create"} onClick={e => setPage(e.target.innerText)}>
                        <i className="fi fi-rr-file-edit"></i>
                        اكتب
                    </NavLink>
                    <h1 className="text-xl text-dark-grey mt-20 mb-3 ">صفحة التحكم</h1>
                    <hr  className="border-grey -mr-6 mb-8 ml-6"/>
                    <NavLink className={"sidebar-link"} to={"/dashboard/edit-profile"} onClick={e => setPage(e.target.innerText)}>
                        <i className="fi fi-rr-user"></i>
                        تعديل الملف الشخصي
                    </NavLink>
                    <NavLink className={"sidebar-link"} to={"/dashboard/change-password"} onClick={e => setPage(e.target.innerText)}>
                        <i className="fi fi-rr-lock"></i>
                        تغيير كلمة المرور
                    </NavLink>
                </div>
            </div>
    )
}
export default SideNav