import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import BioSampleCard from "../../components/BiosamplesCard/BioSampleCard.tsx";
import type {BiosampleTypes} from "../../types/Biosample.types.ts";
import style from "./bioSample.module.css"

const BioSample = () => {

    const params = useParams()
    const navigate = useNavigate();
    const [biosample, setBiosample] = useState<BiosampleTypes>()
    const [isDelete, setIsDelete] = useState<boolean>(false)

    useEffect(() => {
        fetch(`${import.meta.env.VITE_BACKEND_URL}/biosamples/${params.BioSample_Id}`,
            {
                method: 'GET', headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include"
            })
            .then((res) => res.json())
            .then((res) => setBiosample(res))
    }, [params.BioSample_Id]);

    const handleDelete = async () => {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/biosamples/${biosample?.id}`,
            {
                method: 'DELETE',
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include"
            })
        if (response.status === 204) {
            setIsDelete(true)
        } else {
            console.error(response.statusText)
        }
    }


    return <>
        {isDelete ? <div className={style.sampleContainer}>
                <p>The sample has been deleted! </p>
                <button onClick={() => navigate("/")}>Return to listing</button>
            </div>
            :
            <div className={style.sampleContainer}>
                {biosample && <BioSampleCard biosample={biosample} key={params.BioSample_Id}/>}
                <div className={style.buttonContainer}>
                    <button onClick={() => {
                        navigate(`update`, {state: {data: biosample}});
                    }}>Update Sample
                    </button>
                    <button onClick={handleDelete}>Delete Sample
                    </button>
                </div>
            </div>

        }

    </>
}


export default BioSample