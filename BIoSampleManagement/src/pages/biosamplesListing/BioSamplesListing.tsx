import {useEffect, useState} from "react";
import type {BiosampleTypes} from "../../types/Biosample.types.ts";
import style from "./BioSamplesListing.module.css"
import {useNavigate} from "react-router-dom";


const BioSamplesListing = () => {

    const navigate = useNavigate();
    const [biosamples, setBioSamples] = useState<Array<BiosampleTypes>>([])


    useEffect(() => {
        fetch(`${import.meta.env.VITE_BACKEND_URL}/biosamples`,
            {
                method: 'GET', headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include"
            })
            .then((res) => res.json())
            .then((res) => setBioSamples(res.data))
            .catch((error: Error) => console.error(error))
    }, []);

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
                        <td>{biosample.operator}</td>
                        <td>{biosample.date}</td>
                        <td>{biosample.operator}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            <button onClick={() => navigate("/create")}>Add a new sample</button>

        </div>
    </div>

}

export default BioSamplesListing;