export function Switch(
    {
        title,
        value,
        name,
        isTitle = false,
        checked,
        onChange
    }) {
    return (
        <label className="relative inline-flex gap-2 justify-between items-center cursor-pointer">
            <input
                type="checkbox"
                name={name}
                value={value}
                defaultChecked={checked}
                className="sr-only peer"
                onChange={onChange}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-3 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
            {
                isTitle &&
                <span className="ms-3 text-sm font-medium text-slate-700">{title}</span>
            }
        </label>
    )
}