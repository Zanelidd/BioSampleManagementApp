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


    useEffect(() => {
        fetch(`${import.meta.env.VITE_BACKEND_URL}/biosamples?page_index=${page}&limit=${limit}`,
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
    }, [page, limit]);

    return <div className={style.pageContainer}>
        <h1>Bio Sample Management Mini App</h1>
        <div className={style.tableContainer}>
            <table className={style.table}>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Location</th>
                    <th>Type</th>
                    <th>Date</th>
                    <th>Operator</th>
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