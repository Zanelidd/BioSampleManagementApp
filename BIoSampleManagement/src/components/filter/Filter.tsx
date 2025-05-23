import {type Dispatch, useEffect, useState} from "react";
import type {FilterKey, stateType} from "../../types/Biosample.types.ts";

const Filter = ({toSelect, dispatch, state}: {
    toSelect: FilterKey,
    dispatch: Dispatch<{ type: string, payload?: Array<string> }>
    state:  stateType

}) => {

    const [dataSelect, setDataSelect] = useState<Array<string>>([]);


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
        <select
            multiple
            value={state[toSelect]}
            onChange={(e) => {
                if (e.target.value == "") {
                    dispatch({type: `clear_${toSelect}`})
                }else{
                const selected = Array.from(e.target.selectedOptions, option => option.value);
                dispatch({
                    type: toSelect,
                    payload: selected
                })}
            }}>
            <option value={""}>...</option>
            {dataSelect?.map((data, index) => {
                return <option key={index}
                               value={String(data)}
                >{data}</option>
            })}

        </select>
    </>
}

export default Filter