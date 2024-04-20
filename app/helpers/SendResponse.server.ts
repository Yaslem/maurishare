interface Args {
    status?: string,
    code?: number,
    message?: string,
    action: string,
    data?: never
}
export const sendResponseServer = ({status, code, message, action, data} : Args) => {
    return {
        data: data,
        action: action,
        status: status,
        code: code || 200,
        message: message || "لا توجد بيانات."
    }
}