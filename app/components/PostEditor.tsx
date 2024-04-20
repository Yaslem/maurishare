import { useActionData, useNavigate, useNavigation, useSubmit} from "@remix-run/react";
import AnimationWrapper from "~/common/Animation";
import {useEffect, useState} from "react";
import {toast} from "react-hot-toast";
import {useDispatch, useSelector} from "react-redux";
import {postActions} from "~/redux/slices/postSlice";
import {Editor} from "@tinymce/tinymce-react";
import axios from "axios";

const PostEditor = ({setEditorState}) => {
    const submit = useSubmit()
    const navigation = useNavigation();
    const loading = navigation.state === "loading"
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const post = useSelector(state => state.post)
    let data = useActionData()
    let loadingToast;

    const handelBannerUpload = (e) => {
        const img = e.target.files[0]
        if(img){
            loadingToast = toast.loading("يتم تحميل الصورة...")
            dispatch(postActions.setImg(URL.createObjectURL(img)))
            const formData = new FormData()
            formData.append("action", "uploadBanner")
            formData.append("img", img)
            submit(formData, { method: "POST", encType: "multipart/form-data" })
        }
    }

    const handelTitleKeyDown = (e) => {
        if(e.keyCode === 13){
            e.preventDefault()
        }
    }

    const handelTitleChange = (e) => {
        dispatch(postActions.setTitle(e.target.value))
        let input = e.target
        input.style.height = "auto"
        input.style.height = input.scrollHeight + "px"
    }

    useEffect(() => {
        if(data){
            toast.dismiss(loadingToast)
            if(data.imgUrl){
                toast.success("تم تحميل الصورة بنجاح 👍.")
                dispatch(postActions.setImg(`/uploads/${data.imgUrl}`))
            } else if(data.action === "createPost") {
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
                        navigate("/dashboard/posts?tap=draft")
                    }, 500)
                }
            }
        }
    }, [data]);

    const image_upload_handler = (blobInfo, progress) => new Promise((resolve, reject) => {
        const formData = new FormData();
        formData.append('img', blobInfo.blob());
        formData.append('action', "uploadImgPost");
        submit(formData, { method: "POST", encType: "multipart/form-data" })
        axios.post(`/api/uploadImgPost`, formData).then(({data}) => {            
            resolve(`/uploads/${data.location}`);
        })
    });

    const handelPublishEvent = () => {
        if(!post.img.length) {
            return toast.error("أدرج صورة المنشور")
        }
        if(!post.title.length) {
            return toast.error("اكتب عنوان المنشور")
        }
        if(!post.content.length) {
            return toast.error("اكتب شيئا ما")
        }
        setEditorState("pubish")
    }

    const handelDraft = (e) => {
        loadingToast = toast.loading("يتم الحفظ...")
        const formData = new FormData();
        formData.append("action", post.action === "create" ? post.action : "edit");
        formData.append("img", post.img);
        formData.append("title", post.title);
        formData.append("des", post.des);
        formData.append("tags", post.tags);
        formData.append("content", post.content);
        formData.append("draft", true);
        submit(formData, { method: post.action === "create" ? "POST" : "PUT" });
    }

    return (
        <>
            <nav className={"navbar"}>
                <p className={"max-md:hidden font-medium text-black line-clamp-1 w-full"}>
                    {post.title.length ? post.title : post.action === "create" ? "منشور جديد" : "تعديل منشور"}
                </p>

                <div className={"flex gap-4 mr-auto"}>
                    <button onClick={handelPublishEvent} className={"py-2 btn-dark"}>{post.action === "create" ? "نشر" : "تعديل"}</button>
                    <button onClick={handelDraft} disabled={loading} className={"py-2 btn-light"}>حفظ كمسودة</button>
                </div>
            </nav>
            <AnimationWrapper>
                <section>
                    <div className={"mx-auto max-w-[900px] w-full"}>
                        <div className={"relative aspect-video hover:opacity-80 bg-white border-4 border-grey"}>
                            <label htmlFor={"uploadBanner"}>
                                {
                                    post.img.length
                                        ? <img className={"w-full h-full object-cover"} src={post.img}/>
                                        : <img className={"w-full h-full object-cover"} src={"/images/default_banner.png"}/>
                                }
                                <input className={"opacity-0 absolute inset-0"} onChange={handelBannerUpload} id={"uploadBanner"} type={"file"} accept={".png, .jpg, .jpeg"}/>
                            </label>
                        </div>
                        <textarea defaultValue={post.title} onChange={handelTitleChange} onKeyDown={handelTitleKeyDown} className={"text-4xl font-semibold w-full h-20 outline-none resize-none mt-10 leading-tight placeholder:opacity-40"} placeholder={"عنوان المنشور"}></textarea>
                        <hr className={"w-full opacity-10 my-5"}/>
                        <Editor
                            apiKey={"jc310rvlu02i8ml51knh2pn1fdeh6xr8o1b21fsffsrlu4p2"}
                            onEditorChange={(newValue, editor) => {                                
                                dispatch(postActions.setContent(newValue))
                            }}
                            init={{
                                plugins: 'anchor autolink directionality charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount',
                                toolbar: 'undo redo | blocks fontsize | bold italic underline strikethrough | link image imageupload media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat | ltr rtl',
                                language_url: "/lang/tinymce/ar.js",
                                language: "ar",
                                directionality: "rtl",
                                images_upload_handler: image_upload_handler,
                                image_caption: true,
                                image_title: true,
                                placeholder: "ابدأ بكتابة منشورك"

                            }}
                            value={post.content}
                        />
                    </div>
                </section>
            </AnimationWrapper>
        </>
    )


}
export default PostEditor