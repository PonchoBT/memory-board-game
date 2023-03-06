import { useEffect, useState } from 'react'
import Card from './card'
import Grid from '@mui/material/Grid';
import { api } from '../services/cardService';
import Swal from 'sweetalert2';


function Cards() {
    const [items, setItems] = useState(api.getCard.sort(() => Math.random() - 0.5))

    const [fallidos,setFallidos] = useState(0);




    const [prev, setPrev] = useState(-1)

    function check(current:number) {
        if(fallidos == 5)
        {
            Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Something went wrong!'
        })
            }else {

        if (items[current].id == items[prev].id) {
            items[current].stat = "correct"
            items[prev].stat = "correct"
            setItems([...items])
            setPrev(-1)
        } else {
            items[current].stat = "wrong"
            items[prev].stat = "wrong"
            setItems([...items])
            setTimeout(() => {
                items[current].stat = ""
                items[prev].stat = ""
                setItems([...items])
                setPrev(-1)
            }, 1000)
            const fallos = fallidos + 1;
            setFallidos(fallos);
            if(fallos == 5)
            {
                Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong!'
            })

            }
        }
        }
    }

    function handleClick(id:number) {

        if (prev === -1) {
            items[id].stat = "active"
            setItems([...items])
            setPrev(id)
        } else {
            check(id)
        }
    }



    return (
        
        <Grid container spacing={5}>
            <Grid color={"white"}>
            
            Fallidos: {fallidos}
            Tiempo:
            </Grid>
            {items.map((item, index) => (
                <Grid item xs={4} md={2} >
                    <Card key={index} item={item} id={index} handleClick={handleClick} />
                </Grid>
            ))}
        </Grid>
        
    )
}

export default Cards