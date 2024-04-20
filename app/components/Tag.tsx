import toast from "react-hot-toast"
import { useDispatch, useSelector } from "react-redux"
import { postActions } from "~/redux/slices/postSlice"

const Tag = ({tag, tagIndex}) => {
    const post = useSelector(state => state.post)
    const dispatch = useDispatch()

    const handelDeleteTag = () => {
        let tags = post.tags.filter(t => t !== tag)
        dispatch(postActions.setTags(tags))
    }

    const handelEditTag = (e) => {        
        if(e.keyCode === 13){
            e.preventDefault()
            const currentTag = e.target.innerText
            let tags = [...post.tags ] 
            if(currentTag.length){   
                tags[tagIndex] = currentTag
            } else {
                toast.error(`الوسم لا يمكن أن يكون فارغا.`)
                e.target.innerText = tags[tagIndex]
            }
            dispatch(postActions.setTags(tags))
            e.target.setAttribute("contentEditable", false)
        }
    }

    const handelAddEditable = (e) => {
        e.target.setAttribute("contentEditable", true)
        e.target.focus()
    }

    return (
        <div className={"relative p-2 mt-2 ml-2 px-5 bg-white rounded-full inline-block hover:bg-opacity-50 pl-8"}>
            <p className={"outline-none"} onKeyDown={handelEditTag} onClick={handelAddEditable}>{tag}</p>
            <button onClick={handelDeleteTag} className={"mt-[2px] rounded-full absolute left-3 top-1/2 -translate-y-1/2"}>
                <i className={"fi fi-br-cross text-sm pointer-events-none"}></i>
            </button>
        </div>
    )
}
export default Tag