import type React from "react"
import { CardModel } from "../models/cardModel"

function Card({
    item,
    id,
    handleClick,
    previewActiva,
}: {
    item: CardModel
    id: number
    handleClick: (id: number) => void
    previewActiva: boolean
}) {
    const itemClass = item.stat ? " active " + item.stat : ""
    const previewClass = previewActiva && !item.stat ? " preview" : ""
    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault()
            handleClick(id)
        }
    }

    return (
        <div
            className={"cards" + itemClass + previewClass}
            onClick={() => handleClick(id)}
            onKeyDown={handleKeyDown}
            role="button"
            tabIndex={0}
            aria-label={`Carta ${item.id}`}
        >
            <img src={item.img} alt={`Carta ${item.id}`} />
        </div>
    )
}
export default Card