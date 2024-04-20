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

export async function loader({request, params}) {
    const isSignIn = await isAuthenticated(request)
    const userAuthenticated = await getUserAuthenticated(request)
    
    if(!isSignIn){
        return redirect("/auth/signin")
    }
    const post = await Post.getPostById({ id: params.postId })    
    if(post.status !== "error"){
        if(userAuthenticated.username === post.data.author.username){
            return json(post);
        }
    }
    return redirect("/");
}

export const meta: MetaFunction = ({ data, matches }) => {    
    return generatePageTitle({matches, current: "تعديل المنشور " + `"${data.data.title}"`});
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
            return json(await Post.create({img, title, des, tags, content, draft, user}))
        }
        case "edit": {
            draft = draft === "true"            
            tags = tags.length === 0 ? "" : [...tags.split(",")]
            return json(await Post.edit({img, title, des, tags, content, draft, user, id: params.postId}))
        }
    }
    return json({})
}


export default function editPost(){
    const post = useLoaderData()
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
    
    return (
        editorState === "editor" ? <PostEditor setEditorState={setEditorState} /> : <PublishForm setEditorState={setEditorState} />
    )
}