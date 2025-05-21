import {useNavigate} from "react-router-dom";
import {type FormEvent, useState} from "react";
import type {CreateSampleType} from "../../types/Biosample.types.ts";
import style from "../../components/Form/form.module.css";

const CreationSample = () => {

    const navigate = useNavigate();
    const [formData, setFormData] = useState<CreateSampleType>({
        location: "",
        type: "",
        operator: "",
        date: "",
    });
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!formData || formData.location === "" || formData.type === "" || formData.operator === "" || formData.date === "") {
            console.error("Please add value")
        } else {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/biosamples/`, {
                method: "POST",
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
                navigate("/")
            } else {
                console.error("Error" + response.status)
            }
        }
    }

    return <div className={style.formContainer}>
        <form onSubmit={handleSubmit} className={style.form}>
            <label>Location :
                <input required placeholder={"Location"} value={formData.location}
                       onChange={(e) => setFormData({...formData, location: e.target.value})}></input>
            </label>
            <label>Type :
                <input required placeholder={"Type"} value={formData.type}
                       onChange={(e) => setFormData({...formData, type: e.target.value})}/>
            </label>
            <label>Date :
                <input required type={"date"} placeholder={"Date"} value={formData.date}
                       onChange={(e) => setFormData({...formData, date: e.target.value})}/>
            </label>
            <label>Operator :
                <input required placeholder={"Operator"} value={formData.operator}

                       onChange={(e) => setFormData({...formData, operator: e.target.value})}/>
            </label>
            <button type={"submit"}>Create sample</button>
        </form>
    </div>
}

export default CreationSample;