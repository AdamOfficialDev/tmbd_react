import React, { useEffect, useState } from 'react';
import tmdb from './tmdb'; // Import utilitas untuk mengakses API
import { Modal, Button, FormControl, InputGroup, Card, Dropdown } from 'react-bootstrap'; // Import komponen modal Bootstrap
import './App.css'; // Import file CSS kustom

function App() {
  // State untuk daftar film
  const [movies, setMovies] = useState([]);
  // State untuk detail film yang dipilih
  const [selectedMovie, setSelectedMovie] = useState(null);
  // State untuk nilai pencarian
  const [searchTerm, setSearchTerm] = useState('');
  // State untuk tema gelap
  const [darkMode, setDarkMode] = useState(false);
  // State untuk kategori yang dipilih
  const [selectedCategory, setSelectedCategory] = useState('Trending');

  useEffect(() => {
    // Fungsi untuk mengambil daftar film saat komponen dimuat dan ketika kategori berubah
    const fetchMovies = async () => {
      try {
        let response;
        if (selectedCategory === 'Trending') {
          response = await tmdb.get('movie/popular');
        } else if (selectedCategory === 'Popular') {
          response = await tmdb.get('movie/top_rated');
        }
        setMovies(response.data.results); // Mengatur state dengan hasil dari API
      } catch (error) {
        console.error('Terjadi kesalahan:', error);
      }
    };

    fetchMovies(); // Panggil fungsi pengambilan data film
  }, [selectedCategory]);

  // Fungsi untuk membuka modal detail film
  const openModal = async (movie) => {
    // Tambahan: Ambil informasi trailer film
    try {
      const response = await tmdb.get(`movie/${movie.id}/videos`);
      const trailers = response.data.results;
      if (trailers.length > 0) {
        movie.trailerKey = trailers[0].key; // Ambil kunci trailer pertama jika ada
      } else {
        movie.trailerKey = null; // Set null jika tidak ada trailer
      }
    } catch (error) {
      console.error('Terjadi kesalahan:', error);
    }

    setSelectedMovie(movie);
  };

  // Fungsi untuk menutup modal detail film
  const closeModal = () => {
    setSelectedMovie(null);
  };

  // Fungsi untuk menghandle pencarian film
  const handleSearch = async () => {
    if (searchTerm) {
      try {
        const response = await tmdb.get('search/movie', {
          params: {
            query: searchTerm,
          },
        });
        setMovies(response.data.results); // Mengatur state dengan hasil pencarian
        setSearchTerm(''); // Membersihkan nilai searchTerm setelah pencarian selesai
      } catch (error) {
        console.error('Terjadi kesalahan:', error);
      }
    }
  };

  // Fungsi untuk mengaktifkan atau menonaktifkan tema gelap
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`App ${darkMode ? 'dark-mode' : ''}`}>
      <div className='container col-lg-10 pt-3'>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className='fst-italic'>Movie DB</h2>

          {/* Dropdown Kategori Film */}
          <Dropdown>
            <Dropdown.Toggle variant={darkMode ? 'light' : 'dark'} id="category-dropdown">
              Category: {selectedCategory}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => setSelectedCategory('Trending')}>Trending</Dropdown.Item>
              <Dropdown.Item onClick={() => setSelectedCategory('Popular')}>Popular</Dropdown.Item>
              {/* Tambahkan opsi kategori lain di sini */}
            </Dropdown.Menu>
          </Dropdown>

          {/* Tombol Tema Gelap */}
          <Button
            variant={darkMode ? 'light' : 'dark'}
            onClick={toggleDarkMode}
            className={`dark-mode-button ${darkMode ? 'dark-mode' : 'light-mode'}`}
          >
            {darkMode ? 'Light' : 'Dark'}
          </Button>

        </div>

        {/* Pencarian Film */}
        <InputGroup className="mb-4">
          <FormControl
            placeholder="Find movie..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button
            variant={darkMode ? 'light' : 'dark'}
            onClick={handleSearch}
          >
            Search
          </Button>
        </InputGroup>

        <div className="row">
          {movies.map((movie) => (
            <div key={movie.id} className="col-lg-4 mb-4">
              <Card className="movie-card">
                <Card.Img
                  variant="top"
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                />
                <Card.Body>
                  <Card.Title><h6>{movie.title}</h6></Card.Title>
                  <small>
                    Release : {movie.release_date}<br />
                    Rating : {movie.vote_average}
                  </small><br />
                  <Button className='my-2 btn btn-primary' onClick={() => openModal(movie)}>
                    Detail
                  </Button>
                </Card.Body>
              </Card>
            </div>
          ))}
        </div>

        {/* Modal Detail Film */}
        <Modal show={selectedMovie !== null} onHide={closeModal}>
          {selectedMovie && (
            <div className="card mb-3" style={{ maxWidth: '540px' }}>
              <div className="row g-0">
                <div className="col-lg-4">
                  {/* Tambahkan tautan ke trailer jika tersedia */}
                  {selectedMovie.trailerKey && (
                    <iframe
                      title="Trailer"
                      width="100%"
                      height="auto"
                      src={`https://www.youtube.com/embed/${selectedMovie.trailerKey}`}
                      frameBorder="0"
                      allowFullScreen
                    ></iframe>
                  )}
                  <img
                    src={`https://image.tmdb.org/t/p/w500${selectedMovie.poster_path}`}
                    className="img-fluid rounded"
                    alt={selectedMovie.title}
                  />
                </div>
                <div className="col-md-8">
                  <div className="card-body">
                    <h5 className="card-title">{selectedMovie.title}</h5>
                    <p className="card-text">{selectedMovie.overview}</p>
                    <p className="card-text">
                      <small className="text-body-secondary">
                        Release : {selectedMovie.release_date}
                      </small>
                    </p>
                    <p className="card-text">
                      <small className="text-body-secondary">
                        Rating : {selectedMovie.vote_average}
                      </small>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          <Modal.Footer>
            <Button variant="danger" onClick={closeModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}

export default App;
