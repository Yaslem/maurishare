import { ActionFunctionArgs, json, type MetaFunction } from "@remix-run/node";
import { useActionData, useLoaderData, useNavigation, useSubmit } from "@remix-run/react";
import { useEffect, useState } from "react";
import AnimationWrapper from "~/common/Animation";
import LoadMoreDataBtn from "~/components/LoadMoreDataBtn";
import Loader from "~/components/Loader";
import MinimalPost from "~/components/MinimalPost";
import NoDataMessage from "~/components/NoDataMessage";
import PostCard from "~/components/PostCard";
import InPageNavigation, { activeTapRef } from "~/components/inPageNavigation";
import Post from "~/controllers/Post.server";

export async function loader() {
  return json({
    posts: await Post.get(),
    trending: await Post.trending()
  })
}

export async function action({request}:ActionFunctionArgs) {
  let {action, tag, page} = Object.fromEntries(await request.formData());
  page = parseInt(page)
  switch (action) {
    case "getPosts": {
      return json(await Post.get(page))
    }
    case "searchPost": {
      return json(await Post.search({tag, page}))
    }
  }
  return json({})
}

export default function Index() {
  const { posts, trending } = useLoaderData()
  const submit = useSubmit()
  const navigation = useNavigation().state === "loading"
  const [isLoading, setIsLoading] = useState({
    status: false,
    state: "post"
  })
  let data = useActionData()
  const [postsList, setPostsList] = useState(posts)
  const [trendingList, setTrendingList] = useState(trending)
  const [pageState, setPageState] = useState("الرئيسية")
  const categories = ["البرمجة", "الاستشراق", "التربية", "الشريعة", "اللغة", "الرياضيات", "الهندسة", "الاقتصاد"]

  const loagPostByCategory = (e) => {
    const category = e.target.innerText
    setIsLoading({
      status: navigation,
      state: "post"
    })
    if(pageState === category){
      setPageState("الرئيسية")
      return;
    }
    setPageState(category)
  }


  const getTrendPosts = () => {

  }

  const getDataPagination = () => {
    const formData = new FormData()
    formData.append("page", (postsList.data.page + 1))
    if(pageState === "الرئيسية") {
      formData.append("action", "getPosts")
    } else {
      formData.append("tag", pageState)
      formData.append("action", "searchPost")
    }
    submit(formData, {method: "post"})
  }

  useEffect(() => {
    if(data){            
      if(data.action === "getPosts"){
        let oldData = [...postsList.data.results]
        setPostsList({
          status: data.status,
          message: data.message,
          data: {
            count: data.data.count,
            page: data.data.page,
            results: [...oldData, ...data?.data?.results]
          },
        })
      }

      if(data.action === "searchPost"){
        if(data.status !== "error"){
          let oldData = []
          if(postsList && postsList.data.results.length){
            oldData = [...postsList.data.results]  
          }
          setPostsList({
            status: data.status,
            message: data.message,
            data: {
              count: data.data.count,
              page: data.data.page,
              results: [...oldData, ...data?.data?.results]
            },
          })
        } else {
          setPostsList(data)
        }
        setIsLoading({
          status: false,
          state: "post"
        })
      }
    }
  }, [data])

  useEffect(() => {
    activeTapRef.current.click()
    if(pageState === "الرئيسية"){
      setPostsList(posts)
    } else {    
      const formData = new FormData()
      formData.append("action", "searchPost")
      formData.append("page", 1)
      formData.append("tag", pageState)
      submit(formData, {method: "post"})
      data = undefined
      setIsLoading({
        status: true,
        state: "post"
      })
      setPostsList(null)
    }
    if(!trendingList){
      getTrendPosts()
    }
  }, [pageState])

  return (
    <AnimationWrapper>
      <section className="h-cover flex justify-center gap-10">
        <div className="w-full">
          <InPageNavigation defaultHidden={["المنشورات الشائعة"]} routes={[pageState, "المنشورات الشائعة"]}>
            <>
              {
                isLoading.status && isLoading.state === "post"
                  ? <Loader />
                  : postsList.status === "error"
                  ? <NoDataMessage message={postsList.message} />
                  : postsList.data.results.map((post, i) =>
                    <AnimationWrapper transition={{ duration: 1, delay: i * .1 }} key={i}>
                      <PostCard content={post} author={post.author} />
                    </AnimationWrapper>
                  )
              }
              <LoadMoreDataBtn getDataPagination={getDataPagination} state={postsList}  />
            </>
              {
                trendingList === null
                  ? <Loader />
                  : trendingList.status === "error"
                  ? <NoDataMessage message={trendingList.message} />
                  : trendingList.data.map((post, i) =>
                    <AnimationWrapper transition={{ duration: 1, delay: i * .1 }} key={i}>
                    <MinimalPost post={post} index={i} />
                  </AnimationWrapper>
                  )
              }
          </InPageNavigation>
        </div>
        <div className="min-w-[40%] lg:min-w-[400px] max-w-min border-r border-grey pr-8 pt-3 max-md:hidden">
          <div className="flex flex-col gap-10">
            <div>
              <h1 className="font-medium text-xl mb-8">منشورات من جميع الاهتمامات</h1>
              <div className="flex gap-3 flex-wrap">
                {
                  categories.map((category, i) =>
                    <button onClick={loagPostByCategory} key={i} className={"tag " + (pageState === category ? "bg-black text-white" : null)}>{category}</button>
                  )
                }
              </div>
            </div>
            <div>
              <h1 className="font-medium text-xl mb-8">
                المنشورات الشائعة <i className="fi fi-rr-arrow-trend-up"></i>
              </h1>
              {
                trendingList === null
                ? <Loader />
                : trendingList.status === "error"
                ? <NoDataMessage message={trendingList.message} />
                : trendingList.data.map((post, i) =>
                  <AnimationWrapper transition={{ duration: 1, delay: i * .1 }} key={i}>
                  <MinimalPost post={post} index={i} />
                </AnimationWrapper>
                )
              }
            </div>
          </div>
        </div>
      </section>
    </AnimationWrapper>
  )
}
