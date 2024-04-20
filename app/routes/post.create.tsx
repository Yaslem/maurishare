import { ActionFunctionArgs, MetaFunction, redirect } from "@remix-run/node";
import { generatePageTitle } from "~/helpers/Global";
import { getUserAuthenticated, isAuthenticated } from "~/services/auth.server";
import { lazy, useState } from "react";
import { json } from "@remix-run/react";
import Post from "~/controllers/Post.server";
import PostEditor from "~/components/PostEditor";
import PublishForm from "~/components/PublishForm";
import { useDispatch } from "react-redux";
import { postActions } from "~/redux/slices/postSlice";
import { loader } from './$';
export const meta: MetaFunction = ({ matches }) => {
    return generatePageTitle({ matches, current: "كتابة منشور" });
};

export async function action({ request }: ActionFunctionArgs) {
    let { action, img, title, des, tags, content, draft } = Object.fromEntries(await request.formData());
    const user = await getUserAuthenticated(request)
    if (!user) return redirect("/auth/signin")
    switch (action) {
        case "uploadBanner": {
            return json({ imgUrl: await Post.uploadImg(img) })
        }
        case "create": {
            draft = draft === "true"
            tags = tags.length === 0 ? "" : [...tags.split(",")]
            return json(await Post.create({ img, title, des, tags, content, draft, user }))
        }
    }
    return json({})
}

export async function loader({ request }) {
    const user = await getUserAuthenticated(request)
    if (!user) return redirect("/auth/signin")
    return json({})

}

export default function EditorPage() {
    const [editorState, setEditorState] = useState("editor")
    const dispatch = useDispatch()
    if (typeof window !== "undefined") {
        dispatch(postActions.setAction("create"))
        return (
            editorState === "editor" ? <PostEditor setEditorState={setEditorState} /> : <PublishForm setEditorState={setEditorState} />
        )
    }
    return null

}