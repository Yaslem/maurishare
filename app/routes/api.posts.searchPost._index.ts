import {ActionFunctionArgs} from "@remix-run/node";
import {json} from "@remix-run/react";
import Post from "~/controllers/Post.server";

export async function action({request}: ActionFunctionArgs) {
    const {tag} = Object.fromEntries(await request.formData());
    return json(await Post.search(tag))
}
