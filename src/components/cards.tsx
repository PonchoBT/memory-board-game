import { useState } from 'react'
import Cardss from './card'
import { api } from '../services/cardService';
import Swal from 'sweetalert2';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';


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
                        title: 'Felicidades, ganaste!!. 🥳'
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
                        title: 'Perdiste 😔',
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

    function reiniciarJuego() {
        const reiniciarCards = api.getCard.sort(() => Math.random() - 0.5)
        for (let index = 0; index < reiniciarCards.length; index++) {
            const card = reiniciarCards[index];
            card.stat = "";
        }
        setItems(reiniciarCards);
        setFallidos(0);
        setGanados(0);
    }


    return (
        <Container maxWidth="xl">
            <Box sx={{ flexGrow: 1 }}>
                <Grid item xs={12}>
                    <Typography variant="h3" gutterBottom align='center' sx={{ mb: 5, mt:5 }}>
                    Juego Memorama
                    </Typography>
                </Grid>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={8} lg={8}>
                        <Card className='card1'>
                            <CardContent>
                                <Grid container xs={12} lg={12}>
                                    {items.map((item, index) => (
                                        <Grid item xs={4} md={2}>
                                            <Cardss key={index} item={item} id={index} handleClick={handleClick} />
                                        </Grid>
                                    ))}
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={4} lg={4}>
                        <Card className='card2'>
                            <CardContent>
                                <Typography variant="h6" color={"red"} gutterBottom>
                                    Fallidos: {fallidos}
                                </Typography>
                                <Grid xs={12} lg={6} margin={"auto"} mt={4}>
                                <Button variant="contained" color="success" onClick={reiniciarJuego} sx={{ width: '100%'}}>Reiniciar Juego</Button>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    )
}

export default Cards