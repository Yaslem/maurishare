import { Link } from "@remix-run/react"
import { getFullDay } from "~/common/Date";

const AboutUser = ({className, bio, name, socialLinks, joinedAt}) => {    
    return (
        <div className={`md:w-[90%] md:mt-7 ` + className}>
            <p className="text-base leading-7">{bio ? bio : `لم يضف ${name} معلومات عنه حتى الآن.`}</p>
            <div className="flex gap-x-7 gap-y-2 flex-wrap my-7 items-center text-dark-grey">
                {
                    Object.keys(socialLinks).map((key) => {
                        let link = socialLinks[key]                        
                        return link ? <Link target="_blank" key={key} to={link}>
                            <i className={"fi " + (key !== "website" ? `fi-brands-${key}` : "fi-rr-globe") + " text-2xl hover:text-black"}></i>
                        </Link> : null
                    })
                }
            </div>
            <p className="text-xl leading-7 text-dark-grey">{getFullDay(joinedAt)}</p>
        </div>
    )
}
export default AboutUser