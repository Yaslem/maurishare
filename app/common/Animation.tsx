import {motion, AnimatePresence} from "framer-motion"
interface Props {
    children: React.ReactNode,
    keyValue?: string,
    className?: string,
    initial?: any,
    animate?: any,
    transition?: any,

}
const AnimationWrapper = ({children, keyValue, className, initial = { opacity: 0 }, animate  = { opacity: 1 }, transition = {duration: 1}} : Props) => {
    return (
        <AnimatePresence>
            <motion.div
                key={keyValue}
                initial={initial}
                animate={animate}
                transition={transition}
                className={className}
            >
                {children}
            </motion.div>
        </AnimatePresence>
    )
}
export default AnimationWrapper