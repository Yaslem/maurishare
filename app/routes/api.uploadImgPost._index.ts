import {ActionFunctionArgs} from "@remix-run/node";
import {json} from "@remix-run/react";
import Post from "~/controllers/Post.server";

export async function action({request}: ActionFunctionArgs) {
    const {img} = Object.fromEntries(await request.formData());
    return json({location: await Post.uploadImgPost(img)})
}
