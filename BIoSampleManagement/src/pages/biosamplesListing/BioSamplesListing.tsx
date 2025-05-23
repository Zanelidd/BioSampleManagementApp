import {useEffect, useReducer, useState} from "react";
import type {BiosampleTypes, stateType} from "../../types/Biosample.types.ts";
import style from "./BioSamplesListing.module.css"
import {useNavigate} from "react-router-dom";
import Filter from "../../components/filter/Filter.tsx";


const BioSamplesListing = () => {

    const navigate = useNavigate();
    const [biosamples, setBioSamples] = useState<Array<BiosampleTypes>>([])
    const [limit, setLimit] = useState(10);
    const [page, setPage] = useState(1);
    const [pageTotal, setPageTotal] = useState(0);
    const [sortBy, setSortBy] = useState<string>("created_at");
    const [sortOrder, setSortOrder] = useState<string>("desc");


    const sortList = (column: string) => {
        if (sortBy === column) {
            const newOrder = sortOrder === "desc" ? 'asc' : 'desc'
            setSortOrder(newOrder)
        } else {
            setSortBy(column)
            setSortOrder('asc')
        }

    }

    const arrow = (col: string) => {
        if (sortBy !== col) return null

        return <span>{sortOrder === 'asc' ? '↑' : '↓'}  </span>
    }

    const initialState: stateType = {
        locations: [],
        types: [],
        operators: []
    }


    const reducer = (state: stateType, action: { type: string, payload?: any }) => {
            switch (action.type) {
                case "locations":
                    return {...state, locations: [...state.locations, ...action.payload]}
                case "types":
                    return {...state, types: [...state.types, ...action.payload]}
                case "operators":
                    return {...state, operators: [...state.operators, ...action.payload]}
                case "clear_locations":
                    return {...state, locations: []}
                case "clear_types":
                    return {...state, types: []}
                case "clear_operators":
                    return {...state, operators: []}
                case "reset":
                    return initialState
                default:
                    return state;
            }
        }
    ;

    const [state, dispatch] = useReducer(reducer, initialState);

    const resetFilter = () => {
        dispatch({type: "reset"})
    }


    useEffect(() => {
            fetch(`${import.meta.env.VITE_BACKEND_URL}/biosamples/`,
                {
                    method: 'POST', headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        filter_type: state,
                        page_index: page,
                        limit: limit,
                        sort_by: sortBy,
                        sort_order: sortOrder
                    })
                },
            )
                .then((res) => res.json())
                .then((res) => {
                    setBioSamples(res.data)
                    setPageTotal(res.page_total)
                })
                .catch((error: Error) => console.error(error))
        },
        [page, limit, sortBy, sortOrder, state]
    )

    return <div className={style.pageContainer}>
        <h1>Bio Sample Management Mini App</h1>
        <div className={style.filterContainer}>
            <label>
                <Filter toSelect={"operators"} dispatch={dispatch}  state={state}/>
            </label>
            <label>
                <Filter toSelect={"locations"} dispatch={dispatch}  state={state}/>
            </label>
            <label>
                <Filter toSelect={"types"} dispatch={dispatch}  state={state}/>
            </label>
            <button onClick={() => {
                resetFilter()
            }}>Reset filters
            </button>

        </div>
        <div className={style.tableContainer}>
            <table className={style.table}>
                <thead>
                <tr>
                    <th onClick={() => sortList("id")}>ID {arrow("id")}</th>
                    <th onClick={() => sortList("locations")}>Location {arrow("locations")}</th>
                    <th onClick={() => sortList("types")}>Type {arrow("types")}</th>
                    <th onClick={() => sortList("dates")}>Date {arrow("dates")}</th>
                    <th onClick={() => sortList("operators")}>Operator {arrow("operators")}</th>
                </tr>
                </thead>
                <tbody>
                {biosamples.map((biosample: BiosampleTypes) => (
                    <tr key={biosample.id} onClick={() => navigate(`/${biosample.id}`)}>
                        <td>{biosample.id}</td>
                        <td>{biosample.locations}</td>
                        <td>{biosample.types}</td>
                        <td>{biosample.date}</td>
                        <td>{biosample.operators}</td>
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
            <button className={style.addButton} onClick={() => navigate("/create")}>Add a new sample</button>

        </div>
    </div>

}

export default BioSamplesListing;