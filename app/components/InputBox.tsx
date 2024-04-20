import {assertPatternLike} from "@babel/types";
import {useState} from "react";

interface Props {
    name: string;
    type: string;
    value: string;
    placeholder: string;
    icon: string;
    className: never;
    disabled: boolean;
    dir: string;
    onChange: never
}
const InputBox = ({name, className, dir = "rtl", disabled = false, type, value, placeholder, icon, onChange} : Props) => {
    const [passwordVisible, setPasswordVisible] = useState(false)
    return (
        <div className={"relative w-[100%] mb-4"}>
            <i className={"fi " + icon + " input-icon"}></i>
            <input dir={dir}
                onChange={onChange}
                type={type === "password" ? passwordVisible ? "text" : "password" : type}
                name={name}
                id={name}
                defaultValue={value}
                disabled={disabled}
                placeholder={placeholder}
                className={"input-box " + className}
            />
            {
                type === "password"
                    ? <i onClick={() => setPasswordVisible(!passwordVisible)} className={"fi " + (passwordVisible ? "fi-rr-eye" : "fi-rr-eye-crossed") + " input-icon left-4 right-[auto] cursor-pointer"}></i>
                    : null
            }
        </div>
    )
}
export default InputBox