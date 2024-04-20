import {z} from "zod";

export default class Validate {

     static #checkFileType(file) {
        if (file?.name) {
            const fileType = file.name.split(".").pop();
            if (fileType === "xlsx" || fileType === "CSV") return true;
        }
        return false;
    }
    static signIn = z.object({
        email: z.string({
            required_error: "البريد مطلوب.",
            invalid_type_error: "بريد غير صالح.",
        }).email({ message: "بريد غير صالح." }),
        password: z.string({
            required_error: "كلمة المرور مطلوبة.",
            invalid_type_error: "كلمة مرور غير صالحة.",
        })
            .min(8, { message: "كلمة المرور يجب أن تكون أطول من 8 أحرف." })
            .max(16, { message: "كلمة المرور يجب أن تكون أقل من 16 أحرف." }),
    });
    static signUp = z.object({
        name: z.string({
            required_error: "الاسم مطلوب.",
            invalid_type_error: "الاسم يجب أن يكون متكونا من أحرف.",
        }).min(2, { message: "الاسم يجب أن يكون أكبر من حرفين." }),
        email: z.string({
            required_error: "البريد مطلوب.",
            invalid_type_error: "بريد غير صالح.",
        }).email({ message: "بريد غير صالح." }),
        password: z.string({
            required_error: "كلمة المرور مطلوبة.",
            invalid_type_error: "كلمة مرور غير صالحة.",
        })
            .min(8, { message: "كلمة المرور يجب أن تكون أطول من 8 أحرف." })
            .max(16, { message: "كلمة المرور يجب أن تكون أقل من 16 أحرف." }),
    });
    static changePassword = z.object({
        newPassword: z.string({
            required_error: "كلمة المرور مطلوبة.",
            invalid_type_error: "كلمة مرور غير صالحة.",
        })
            .min(8, { message: "كلمة المرور يجب أن تكون أطول من 8 أحرف." })
            .max(16, { message: "كلمة المرور يجب أن تكون أقل من 16 أحرف." }),
        currentPassword: z.string({
            required_error: "كلمة المرور مطلوبة.",
            invalid_type_error: "كلمة مرور غير صالحة.",
        })
            .min(8, { message: "كلمة المرور يجب أن تكون أطول من 8 أحرف." })
            .max(16, { message: "كلمة المرور يجب أن تكون أقل من 16 أحرف." }),
    });
    static reset = z.object({
        email: z.string({
            required_error: "البريد مطلوب.",
            invalid_type_error: "بريد غير صالح.",
        }).email({ message: "بريد غير صالح." })
    });
    static newPassword = z.object({
        password: z.string({
            required_error: "كلمة المرور مطلوبة.",
            invalid_type_error: "كلمة مرور غير صالحة.",
        })
            .min(8, { message: "كلمة المرور يجب أن تكون أطول من 8 أحرف." })
            .max(16, { message: "كلمة المرور يجب أن تكون أقل من 16 أحرف." }),
    });
}