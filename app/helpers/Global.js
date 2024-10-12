export function generatePageTitle({matches, current, description = ""}) {
    let parentMeta = matches.flatMap(
        (match) => match.meta ?? []
    );
    parentMeta.push({ title: current })
    const meta = parentMeta.map(meta => meta.title)
    let newMeta = []
    meta.forEach((meta) => {
        if(!newMeta.includes(meta)){
            if(meta.includes("-")){
                newMeta.push(meta.split("-")[1].trim())
            } else {
                newMeta.push(meta)
            }
        }

    })
    return [{
        title: newMeta.join(" - "),
        description
    }]
}
export function exclude(user, keys) {
    return Object.fromEntries(
        Object.entries(user).filter(([key]) => !keys.includes(key))
    );
}