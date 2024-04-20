const LoadMoreDataBtn = ({state, getDataPagination }) => {            
    if(state !== null && state.status !== "error" && state?.data.count > state?.data.results.length){
        return (
            <button onClick={getDataPagination} className="text-dark-grey p-2 px-3 hover:bg-grey/30 rounded-md flex items-center gap-2">تحميل المزيد</button>
        )
    }

}
export default LoadMoreDataBtn