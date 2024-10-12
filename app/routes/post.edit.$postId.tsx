import { ActionFunctionArgs, MetaFunction, json, redirect } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import PostEditor from "~/components/PostEditor"
import PublishForm from "~/components/PublishForm"
import Post from "~/controllers/Post.server"
import { generatePageTitle } from "~/helpers/Global"
import { postActions } from "~/redux/slices/postSlice"
import { getUserAuthenticated, isAuthenticated } from "~/services/auth.server"
import {NotAllowed} from "~/components/NotAllowed";

export async function loader({request, params}) {
    const isSignIn = await isAuthenticated(request)
    const userAuthenticated = await getUserAuthenticated(request)
    
    if(!isSignIn){
        return redirect("/auth/signin")
    }
    const post = await Post.getPostById({ id: params.postId })    
    if(post.status !== "error"){
        if(userAuthenticated.username === post.data.author.username || userAuthenticated.role === "ADMIN"){
            return json({post, user: userAuthenticated});
        }
    }
    return redirect("/");
}

export const meta: MetaFunction = ({ data, matches }) => {    
    return generatePageTitle({matches, current: "تعديل المنشور " + `"${data.post.data.title}"`});
};

export async function action({request, params}: ActionFunctionArgs) {
    let {action, img, title, des, tags, content, draft} = Object.fromEntries(await request.formData());
    const isSignIn = await isAuthenticated(request)
    if(!isSignIn) return redirect("/auth/signin")
    const user = await getUserAuthenticated(request)
    switch (action) {
        case "uploadBanner": {
            return json({imgUrl: await Post.uploadImg(img)})
        }
        case "create": {
            draft = draft === "true"
            tags = tags.length === 0 ? "" : [...tags.split(",")]
            if(!user.can_create_post) return redirect("/dashboard/posts")
            return json(await Post.create({img, title, des, tags, content, draft, user}))
        }
        case "edit": {
            draft = draft === "true"            
            tags = tags.length === 0 ? "" : [...tags.split(",")]
            if(!user.can_update_post) return redirect("/dashboard/posts")
            return json(await Post.edit({img, title, des, tags, content, draft, user, id: params.postId}))
        }
    }
    return json({})
}


export default function editPost(){
    const {post, user} = useLoaderData()
    const [editorState, setEditorState] = useState("editor")
    const dispatch = useDispatch()

    useEffect(() => {
        let tagsNames = []
        post.data?.tags.map(tag => tagsNames.push(tag.name))
        dispatch(postActions.setAction("edit"))
        dispatch(postActions.setTitle(post.data.title))
        dispatch(postActions.setImg(post.data.banner))
        dispatch(postActions.setDes(post.data.des))
        dispatch(postActions.setContent(post.data.content))
        dispatch(postActions.setTags(tagsNames))
    }, [])
    if(user.can_update_post){
        return (
            editorState === "editor" ? <PostEditor setEditorState={setEditorState} /> : <PublishForm setEditorState={setEditorState} />
        )
    }
    return <NotAllowed message={"عفوا، لقد تم منعك من تعديل هذا المنشور، رجاء تواصل مع إدارة الموقع."} />

}