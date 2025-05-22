import {type Dispatch, useEffect, useState} from "react";

const Filter = ({toSelect, dispatch}: {
    toSelect: string,
    dispatch: Dispatch<{ type: string, payload?: any }>
}) => {

    const [dataSelect, setDataSelect] = useState<string[]>([]);
    useEffect(() => {
            fetch(`${import.meta.env.VITE_BACKEND_URL}/biosamples/${toSelect}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            })
                .then((response) => response.json())
                .then((data) => setDataSelect(data))
                .catch((error) => console.error(error))
        }

        , []);

    return <>
    <h3>{toSelect.toUpperCase()}</h3>
    <select onChange={(e) =>
        dispatch({
            type: toSelect,
            payload: e.target.value
        })}>
    <option value="">...</option>
    {dataSelect?.map((data, index) => {
        return <option key={index}
                       value={data}
        >{data}</option>
    })}

    </select>
</>
}

export default Filter