import Cards from './components/cards'
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import {useState } from 'react';


function App() {
  const [score, setScore] = useState(0);
  
  return (
    <Container maxWidth="xl">
      <Grid container sx={{ mt: 20 }}>
        <Grid item xs={12}>
          <Typography variant="h3" gutterBottom align='center'>
           Memory Board Game
          </Typography>
        </Grid>
        <Grid container spacing={2}>
        <Grid xs={12} lg={12}className='card1'>
          <Cards />
        </Grid>
        </Grid> 
      </Grid>
    </Container>
  )
}

export default App
