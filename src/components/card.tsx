import { CardModel } from "../models/cardModel"

function Card({ item, id, handleClick }: { item:CardModel, id:number, handleClick:any }) {
    const itemClass = item.stat ? " active " + item.stat : ""
    return (
        <div className={"cards" + itemClass} onClick={() => handleClick(id)}>
            <img src={item.img} alt="" />
        </div>
    )
}
export default Card