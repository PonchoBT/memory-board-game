import { useEffect, useState } from 'react'
import Card from './card'
import { api } from '../services/cardService';
import Swal from 'sweetalert2';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';


function Cards() {



    const [items, setItems] = useState(api.getCard);
    const [ganados, setGanados] = useState(0);
    const [fallidos, setFallidos] = useState(0);




    const [prev, setPrev] = useState(-1)

    function check(current: number) {

        if (fallidos == 5) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong!'
            })
        } else {

            if (items[current].id == items[prev].id) {
                const aciertos = ganados + 1;
                setGanados(aciertos);
                items[current].stat = "correct"
                items[prev].stat = "correct"
                setItems([...items])
                setPrev(-1)
   

                if (aciertos == 9) {


                    Swal.fire({
                        icon: 'success',
                        title: 'Felicidades, eres ganador.'
                    })

                }
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
                if (fallos == 5) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Eres perdedor',
                        text: 'Fin del juego'
                    })

                }
            }
        }
    }

    function handleClick(id: number) {

        if (prev === -1) {
            items[id].stat = "active"
            setItems([...items])
            setPrev(id)
        } else {
            check(id)
        }
    }

    function reiniciarJuego()
    {
       
   

        const reiniciarCards = api.getCard.sort(() => Math.random() - 0.5)
        
        for (let index = 0; index < reiniciarCards.length; index++) {
            const card= reiniciarCards[index];
            card.stat = "";
            
        }
        setItems(reiniciarCards);

        setFallidos(0);
        setGanados(0);
    }




    return (
        <Container maxWidth="xl">
            <Grid container sx={{ mt: 20 }}>
                <Grid item xs={12}>
                    <Typography variant="h3" gutterBottom align='center'>
                        Memory Board Game
                    </Typography>
                </Grid>
                <Grid container  xs={12} lg={8} className='card1' spacing={2} sx={{mr:4}}>
                    {items.map((item, index) => (
                        <Grid item xs={4} md={2}>
                            <Card key={index} item={item} id={index} handleClick={handleClick} />
                        </Grid>
                    ))}
                </Grid>
                <Grid xs={12} lg={3} className="card2">
                    <Grid item xs={12} className='cardtext'>
                        Fallidos: {fallidos}
 
                        <Button variant="contained" onClick={reiniciarJuego}>Reiniciar Juego</Button>
                    </Grid>
                </Grid>
            </Grid>

        </Container>
    )
}

export default Cards