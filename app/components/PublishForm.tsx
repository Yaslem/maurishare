import AnimationWrapper from "~/common/Animation";
import {useDispatch, useSelector} from "react-redux";
import {postActions} from "~/redux/slices/postSlice";
import Tag from "~/components/Tag";
import toast from "react-hot-toast";
import { useActionData, useNavigation, useSubmit } from '@remix-run/react';
import { useEffect } from "react";
import { useNavigate } from '@remix-run/react';

const PublishForm = ({setEditorState}) => {
    const submit = useSubmit()
    const navigation = useNavigation();
    const loading = navigation.state === "loading"
    const navigate = useNavigate()
    let data = useActionData();
    const characterLimit = 200
    const tagLimit = 10
    const post = useSelector(state => state.post)
    
    const dispatch = useDispatch()
    let loadingToast;
    useEffect(() => {
        if(data !== undefined){
            if(data.action === "createPost"){
                toast.dismiss(loadingToast)
                if(data.status === "error"){
                    toast.error(data.message)
                } else {
                    dispatch(postActions.setTitle(""))
                    dispatch(postActions.setImg(""))
                    dispatch(postActions.setContent(""))
                    dispatch(postActions.setDes(""))
                    dispatch(postActions.setTags([]))
                    toast.success(data.message)
                    data = undefined
                    setTimeout(() => {
                        navigate("/dashboard/posts")
                    }, 500)
                }
            }
        }
    }, [data]);

    const handelSubmit = (e) => {
        loadingToast = toast.loading("يتم النشر...")
        const formData = new FormData();
        formData.append("action", post.action === "create" ? post.action : "edit");
        formData.append("img", post.img);
        formData.append("title", post.title);
        formData.append("des", post.des);
        formData.append("tags", post.tags);
        formData.append("content", post.content);
        formData.append("draft", false);
        submit(formData, { method: post.action === "create" ? "POST" : "PUT" });
    }

    const handelCloseEvent = () => {
        setEditorState("editor")
    }

    const handelKeyDown = (e) => {
        if(e.keyCode === 13){
            e.preventDefault()
            const tag = e.target.value
            if(post.tags.length < tagLimit){
                if(!post.tags.includes(tag) && tag.length){
                    dispatch(postActions.setTags([...post.tags, tag]))
                } else {
                    toast.error(`الوسم ${tag} موجود بالفعل.`)
                }
            } else {
                toast.error(`أعلى وسوم يمكنك إضافتها هي ${tagLimit} أوسم`)
            }
            e.target.value = ""
        }
    }

    return (
        <AnimationWrapper>
            <section className={"relative"}>
                <button onClick={handelCloseEvent} className={"w-12 h-12 absolute left-[5vw]"}>
                    <i className={"fi fi-br-cross"}></i>
                </button>
                <div className={"min-h-screen grid items-center lg:grid-cols-2 lg:gap-4 py-16"}>
                    <div className={" overflow-hidden"}>
                        <p className={"text-dark-grey"}>مراجعة</p>
                        <div className={"w-full aspect-video rounded-lg overflow-hidden bg-grey mt-4"}>
                            <img src={post.img}/>
                        </div>
                        <h1 className={"text-4xl font-medium mt-2 leading-tight line-clamp-2"}>{post.title}</h1>
                        <p className={"line-clamp-2 text-xl leading-tight mt-4"}>{post.des}</p>
                    </div>
                    <div className={"border-grey lg:border-1 lg:pr-8"}>
                        <p className={"text-dark-grey mb-2 mt-9"}>عنوان المنشور</p>
                        <input onChange={e => dispatch(postActions.setTitle(e.target.value))} className={"input-box pr-4"} defaultValue={post.title} placeholder={"عنوان المنشور"}
                               type={"text"}/>

                        <p className={"text-dark-grey mb-2 mt-9"}>وصف قصير للمنشور</p>
                        <textarea onChange={e => dispatch(postActions.setDes(e.target.value))} className={"h-40 resize-none leading-7 input-box pr-4"} maxLength={characterLimit} defaultValue={post.des}></textarea>
                        <p className={"mt-1 text-dark-grey text-sm text-left"}>{characterLimit - post.des.length} حرفا متبقيا</p>

                        <p className={"text-dark-grey mb-2 mt-9"}>الوسوم - تساعد في البحث عن منشورك وترتيبه</p>
                        <div className={"relative input-box pr-2 py-2 pb-4"}>
                            <input onKeyDown={handelKeyDown} type={"text"} placeholder={"الوسم"} className={"sticky input-box top-0 right-0 pr-4 pb-3 bg-white focus:bg-white"}/>
                            {
                                post.tags.map((tag, i) => <Tag tagIndex={i} tag={tag} key={i} />)
                            }
                        </div>
                        <p className={"mt-1 text-dark-grey text-sm text-left"}>{tagLimit - post.tags.length} وسما متبقيا</p>
                        <button onClick={handelSubmit} disabled={loading} className={"px-8 btn-dark"}>{post.action === "create" ? "نشر" : "تعديل"}</button>
                    </div>
                </div>

            </section>
        </AnimationWrapper>
    )
}
export default PublishForm