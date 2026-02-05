import { useEffect, useMemo, useRef, useState } from "react";
import Cardss from "./card";
import { api } from "../services/cardService";
import Swal from "sweetalert2";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Timer from "./Timer";

function Cards() {
  const [items, setItems] = useState(api.getCard);
  const [ganados, setGanados] = useState(0);
  const [fallidos, setFallidos] = useState(0);
  const [tiempo, setTiempo] = useState(0);
  const [customImages, setCustomImages] = useState<string[]>([]);
  const [prev, setPrev] = useState(-1);
  const [reiniciar, setReiniciar] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [previewActiva, setPreviewActiva] = useState(false);
  const [juegoIniciado, setJuegoIniciado] = useState(false);
  const [resaltarPlay, setResaltarPlay] = useState(false);
  const previewTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const previewDelayRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resaltarTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const objectUrlsRef = useRef<string[]>([]);
  const totalPairs = useMemo(() => Math.floor(items.length / 2), [items.length]);
  const gameWon = ganados === totalPairs;
  const formatTime = (totalSegundos: number) => {
    const getSeconds = `0${totalSegundos % 60}`.slice(-2);
    const minutes = Math.floor(totalSegundos / 60);
    const getMinutes = `0${minutes % 60}`.slice(-2);
    const getHours = `0${Math.floor(totalSegundos / 3600)}`.slice(-2);
    return `${getHours} : ${getMinutes} : ${getSeconds}`;
  };

  const buildDeck = (images: string[]) => {
    const deck = images.flatMap((img, index) => [
      { id: index + 1, img, stat: "" },
      { id: index + 1, img, stat: "" },
    ]);
    return deck.sort(() => Math.random() - 0.5);
  };


  const startPreview = (duracionMs: number) => {
    if (previewTimeoutRef.current) {
      clearTimeout(previewTimeoutRef.current);
    }
    setPreviewActiva(true);
    previewTimeoutRef.current = setTimeout(() => {
      setPreviewActiva(false);
    }, duracionMs);
  };

  const startPreviewSequence = (duracionMs: number, delayMs: number) => {
    if (previewDelayRef.current) {
      clearTimeout(previewDelayRef.current);
    }
    setPreviewActiva(false);
    previewDelayRef.current = setTimeout(() => {
      startPreview(duracionMs);
    }, delayMs);
  };

  useEffect(() => {
    setJuegoIniciado(false);
    startPreviewSequence(10000, 500);
    return () => {
      if (previewTimeoutRef.current) {
        clearTimeout(previewTimeoutRef.current);
      }
      if (previewDelayRef.current) {
        clearTimeout(previewDelayRef.current);
      }
      if (resaltarTimeoutRef.current) {
        clearTimeout(resaltarTimeoutRef.current);
      }
    };
  }, [reiniciar]);

  useEffect(() => {
    return () => {
      objectUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
      objectUrlsRef.current = [];
    };
  }, []);

  function check(current: number) {
    if (items[current].id === items[prev].id) {
      const aciertos = ganados + 1;
      setGanados(aciertos);
      items[current].stat = "correct";
      items[prev].stat = "correct";
      setItems([...items]);
      setPrev(-1);

      if (aciertos === totalPairs) {
        Swal.fire({
          icon: "success",
          title: "¡Muy bien!",
          text: `Tu tiempo: ${formatTime(tiempo)}`,
        });
      }
    } else {
      setIsChecking(true);
      items[current].stat = "wrong";
      items[prev].stat = "wrong";
      setItems([...items]);
      setTimeout(() => {
        items[current].stat = "";
        items[prev].stat = "";
        setItems([...items]);
        setPrev(-1);
        setIsChecking(false);
      }, 1000);
      const fallos = fallidos + 1;
      setFallidos(fallos);
    }
  }
  function handleClick(id: number) {
    if (!juegoIniciado) {
      setResaltarPlay(true);
      if (resaltarTimeoutRef.current) {
        clearTimeout(resaltarTimeoutRef.current);
      }
      resaltarTimeoutRef.current = setTimeout(() => {
        setResaltarPlay(false);
      }, 700);
      return;
    }
    if (previewActiva) return;
    if (gameWon || isChecking) return;
    if (items[id].stat === "correct") return;
    if (id === prev) {
      items[id].stat = "";
      setItems([...items]);
      setPrev(-1);
      return;
    }

    if (prev === -1) {
      items[id].stat = "active";
      setItems([...items]);
      setPrev(id);
      return;
    }

    check(id);
  }

  function reiniciarJuego() {
    const reiniciarCards =
      customImages.length === 9 ? buildDeck(customImages) : [...api.getCard];
    reiniciarCards.forEach((card) => {
      card.stat = "";
    });
    setItems(reiniciarCards);
    setFallidos(0);
    setGanados(0);
    setPrev(-1);
    setIsChecking(false);
    setPreviewActiva(false);
    setJuegoIniciado(false);
    setResaltarPlay(false);
    if (previewTimeoutRef.current) {
      clearTimeout(previewTimeoutRef.current);
      previewTimeoutRef.current = null;
    }
    if (previewDelayRef.current) {
      clearTimeout(previewDelayRef.current);
      previewDelayRef.current = null;
    }
    if (resaltarTimeoutRef.current) {
      clearTimeout(resaltarTimeoutRef.current);
      resaltarTimeoutRef.current = null;
    }
    setReiniciar(!reiniciar);
  }

  function handleUploadImages(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    if (files.length !== 9) {
      Swal.fire({
        icon: "warning",
        title: "Sube 9 imágenes",
        text: "Debes seleccionar exactamente 9 imágenes para jugar.",
      });
      event.target.value = "";
      return;
    }

    objectUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    objectUrlsRef.current = [];

    const urls = files.map((file) => URL.createObjectURL(file));
    objectUrlsRef.current = urls;
    setCustomImages(urls);
    setItems(buildDeck(urls));
    setFallidos(0);
    setGanados(0);
    setPrev(-1);
    setIsChecking(false);
    setJuegoIniciado(false);
    startPreviewSequence(10000, 500);
  }

  return (
    <Container maxWidth="xl" className="app-shell">
      <Box sx={{ flexGrow: 1 }}>
        <Grid item xs={12}>
          <Typography
            variant="h3"
            gutterBottom
            align="center"
            className="game-title"
          >
            Juego Memorama
          </Typography>
        </Grid>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8} lg={9}>
            <Card className="board-card">
              <CardContent>
                <Grid container spacing={2} className="cards-grid">
                  {items.map((item, index) => (
                    <Grid item xs={4} sm={3} md={2} key={index}>
                      <Cardss
                        key={index}
                        item={item}
                        id={index}
                        handleClick={handleClick}
                        previewActiva={previewActiva}
                      />
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4} lg={3}>
            <Card className="side-card">
              <CardContent className="side-content">
                {gameWon && (
                  <Typography variant="body2" className="game-status">
                    Estado: Ganaste
                  </Typography>
                )}
                <Box className="upload-box">
                  <input
                    id="upload-images"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleUploadImages}
                    className="upload-input"
                  />
                  <label htmlFor="upload-images" className="upload-label">
                    Subir 9 imágenes
                  </label>
                </Box>
                <Typography variant="body2" className="timer-label">
                  Tiempo
                </Typography>
                <Box className="timer-box">
                  <Timer
                    reiniciar={reiniciar}
                    onStartGame={() => setJuegoIniciado(true)}
                    highlightPlay={resaltarPlay}
                    onTimeChange={setTiempo}
                    stop={gameWon}
                  />
                </Box>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={reiniciarJuego}
                  className="reset-button"
                  fullWidth
                >
                  Jugar de nuevo
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default Cards;
