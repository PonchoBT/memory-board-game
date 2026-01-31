import Cards from './components/cards'

function App() {
  return (
    <div className="app-layout">
      <main className="app-main">
        <Cards />
      </main>
      <footer className="footer">
        <div className="footer-content">
          <span className="footer-text">
            Hecho con <i className="fas fa-heart footer-heart" aria-hidden="true"></i> por
          </span>
          <a
            className="footer-link"
            href="https://www.ponchobt.dev/"
            target="_blank"
            rel="noopener noreferrer"
          >
            PonchoBT.Dev
          </a>
          <span className="footer-divider">|</span>
          <span className="footer-text">Síguenos:</span>
          <a
            className="footer-link footer-icon-link"
            href="https://www.facebook.com/deaftech.com.mx"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook DeafTech"
            title="Facebook"
          >
            <i className="fab fa-facebook-square" aria-hidden="true"></i>
          </a>
        </div>
      </footer>
    </div>
  )
}

export default App
