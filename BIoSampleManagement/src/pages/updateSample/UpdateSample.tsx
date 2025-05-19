import {useLocation, useNavigate, useParams} from "react-router-dom";
import {type FormEvent, useState} from "react";
import type {CreateSampleType} from "../../types/Biosample.types.ts";
import style from "../../components/Form/form.module.css";

const UpdateSample = () => {

    const location = useLocation();
    const biosample = location || {}
    const params = useParams();

    const navigate = useNavigate();
    const [formData, setFormData] = useState<CreateSampleType>({
        location: biosample.state.data.location,
        type: biosample.state.data.type,
        operator: biosample.state.data.operator,
        date: biosample.state.data.date,
    });
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/biosamples/${params.BioSample_Id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        })
        if (response.status === 200) {
            setFormData({
                location: "",
                type: "",
                operator: "",
                date: "",
            })
            navigate(-1)
        } else {
            console.error("Error" + response.statusText)
        }
    }

    return <div className={style.formContainer}>
        <form onSubmit={handleSubmit} className={style.form}>
            <label>Location :
                <input placeholder={"Location"} value={formData.location}
                       onChange={(e) => setFormData({...formData, location: e.target.value})}></input>
            </label>
            <label>Type :
                <input placeholder={"Type"} value={formData.type}
                       onChange={(e) => setFormData({...formData, type: e.target.value})}/>
            </label>
            <label>Date :
                <input type={"date"} placeholder={"Date"} value={formData.date}
                       onChange={(e) => setFormData({...formData, date: e.target.value})}/>
            </label>
            <label>Operator :
                <input placeholder={"Operator"} value={formData.operator}
                       onChange={(e) => setFormData({...formData, operator: e.target.value})}/>
            </label>
            <button type={"submit"}>Update Sample</button>
        </form>
    </div>
}

export default UpdateSample;