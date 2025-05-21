import {useEffect, useState} from "react";
import type {BiosampleTypes} from "../../types/Biosample.types.ts";
import style from "./BioSamplesListing.module.css"
import {useNavigate} from "react-router-dom";


const BioSamplesListing = () => {

    const navigate = useNavigate();
    const [biosamples, setBioSamples] = useState<Array<BiosampleTypes>>([])
    const [limit, setLimit] = useState(10);
    const [page, setPage] = useState(1);
    const [pageTotal, setPageTotal] = useState(0);
    const [sortBy, setSortBy] = useState<string>("created_at");
    const [sortOrder, setSortOrder] = useState<string>("desc");

    const sortList = (column :string) => {
        if (sortBy === column) {
            const newOrder = sortOrder === "desc" ? 'asc' : 'desc'
            setSortOrder(newOrder)
        }else{
            setSortBy(column)
            setSortOrder('asc')
        }

    }

    const arrow = (col: string) => {
        if (sortBy !== col) return null

        return <span>{sortOrder === 'asc' ? '↑' : '↓'}  </span>
    }

    useEffect(() => {
        fetch(`${import.meta.env.VITE_BACKEND_URL}/biosamples?page_index=${page}&limit=${limit}&sort_by=${sortBy}&sort_order=${sortOrder}`,
            {
                method: 'GET', headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include"
            })
            .then((res) => res.json())
            .then((res) => {
                setBioSamples(res.data)
                setPageTotal(res.page_total)
            })
            .catch((error: Error) => console.error(error))
    }, [page, limit, sortBy, sortOrder]);


    console.log(sortBy)
    console.log(sortOrder)
    return <div className={style.pageContainer}>
        <h1>Bio Sample Management Mini App</h1>
        <div className={style.tableContainer}>
            <table className={style.table}>
                <thead>
                <tr>
                    <th onClick={() => sortList("id")}>ID {arrow("id")}</th>
                    <th onClick={() => sortList("location")}>Location {arrow("location")}</th>
                    <th onClick={() => sortList("type")}>Type {arrow("type")}</th>
                    <th onClick={() => sortList("date")}>Date {arrow("date")}</th>
                    <th onClick={() => sortList("operator")}>Operator {arrow("operator")}</th>
                </tr>
                </thead>
                <tbody>
                {biosamples.map((biosample: BiosampleTypes) => (
                    <tr key={biosample.id} onClick={() => navigate(`/${biosample.id}`)}>
                        <td>{biosample.id}</td>
                        <td>{biosample.location}</td>
                        <td>{biosample.type}</td>
                        <td>{biosample.date}</td>
                        <td>{biosample.operator}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            <div className={style.paginationContainer}>

                <button onClick={() =>
                    (page > 1) && setPage(page - 1)
                }
                        disabled={page <= 1}>
                    {"<"}
                </button>
                <div className="pageInformation">{page} / {pageTotal}</div>


                <button onClick={() => (page < pageTotal) && setPage(page + 1)}
                        disabled={page >= pageTotal}>
                    {">"}
                </button>
                <select value={limit} onChange={e => setLimit(Number(e.target.value))}>
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                </select>

            </div>
            <button onClick={() => navigate("/create")}>Add a new sample</button>

        </div>
    </div>

}

export default BioSamplesListing;