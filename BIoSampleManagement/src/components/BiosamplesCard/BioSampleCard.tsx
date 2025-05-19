import type {BiosampleTypes} from "../../types/Biosample.types.ts";
import style from "./bioSamplesCard.module.css"
import {type FormEvent, useState} from "react";

const BioSampleCard = ({biosample}: { biosample: BiosampleTypes }) => {
    const [comment, setComment] = useState("");
    const [comments, setComments] = useState(biosample.comments || []);

    const handleAddComment = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/biosamples/${biosample.id}/comments?comment=${comment}`,
            {
                method: 'POST', headers: {
                    "Content-Type": "application/json"

                },
                credentials: "include",
            })
        if (response.status === 200) {
            const newComment = await response.json()
            setComments((prev) => [...prev, newComment]);
            setComment("");
        } else {
            console.error("Server Error: " + response.status)
        }
    }

    return <>
        <div className={style.cardContainer}>
            <h2> Sample details</h2>
            <p>Location : {biosample.location}</p>
            <p> Type : {biosample.type}</p>
            <p> Date : {biosample.date}</p>
            <p> Operator : {biosample.operator}</p>
            <div className={style.commentsContainer}>
                Comments :
                <div className={style.existingComments}>
                    {comments && comments.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).map((comment) => {
                            return <p key={comment.id}>{comment.content}</p>
                        }
                    )}</div>
            </div>
            <form className={style.formComment} onSubmit={(e) =>
                handleAddComment(e)}>
                <textarea
                    value={comment}
                    className={style.textComment}
                    onChange={(e) => {
                        setComment(e.target.value)
                    }}/>
                < button type="submit" className={style.commentButton}> Add
                    comment
                </button>
            </form>
        </div>

    </>
}

export default BioSampleCard;