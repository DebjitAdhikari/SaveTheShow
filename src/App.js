import { Children, useEffect, useRef, useState } from "react"
import StarRating from "./StarRating";
// const mediaData = [
//   {
//     Poster: "https://m.media-amazon.com/images/M/MV5BN2IzYzBiOTQtNGZmMi00NDI5LTgxMzMtN2EzZjA1NjhlOGMxXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_SX300.jpg",
//     Title: "Game of Thrones",
//     Type: "series",
//     Year: "2011–2019",
//     imdbID: "tt0944947"
//   },
//   {
//     Poster: "https://m.media-amazon.com/images/M/MV5BYWE3MDVkN2EtNjQ5MS00ZDQ4LTliNzYtMjc2YWMzMDEwMTA3XkEyXkFqcGdeQXVyMTEzMTI1Mjk3._V1_SX300.jpg",
//     Title: "Squid Game",
//     Type: "series",
//     Year: "2021–",
//     imdbID: "tt10919420"
//   },
//   {
//     Poster: "https://m.media-amazon.com/images/M/MV5BMTQwMzQ5Njk1MF5BMl5BanBnXkFtZTcwNjIxNzIxNw@@._V1_SX300.jpg",
//     Title: "Sherlock Holmes: A Game of Shadows",
//     Type: "movie",
//     Year: "2011",
//     imdbID: "tt1515091"
//   }
// ];
const details = [
  {
    title: "Game of Thrones",
    released: "17 Apr 2011",
    runtime: "57 min",
    genre: "Action, Adventure, Drama",
    director: "N/A",
    plot: "Nine noble families fight for control over the lands of Westeros, while an ancient enemy returns after being dormant for millennia.",
    language: "English",
    poster: "https://m.media-amazon.com/images/M/MV5BN2IzYzBiOTQtNGZmMi00NDI5LTgxMzMtN2EzZjA1NjhlOGMxXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_SX300.jpg",
    imdbRating: "9.2",
    imdbID: "tt0944947"
  },
];


const API_KEY = "402d5b0"
const movieName = "game"
const imdbID = "tt0944947"


export default function App() {
  const [query, setQuery] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setLoading] = useState(false)
  const [searchedMovies, setSearchedMovies] = useState([])
  const [isSearchedSection, setSearchedSection] = useState(true)
  const [selectedId, setSelectedId] = useState(null)
  const ref=useRef(null)
  const [watchedMovie,setWatchedMovie]=useState(function(){
    const data=localStorage.getItem("Watched-movies")
    const movies=JSON.parse(data)
    return movies || []
  })

  useEffect(function(){
    localStorage.setItem("Watched-movies",JSON.stringify(watchedMovie))
  },[watchedMovie])


  useEffect(function () {
    const controller = new AbortController()
    async function getMovie() {
      try {
        setError("")
        setLoading(true)
        const res = await fetch(`http://www.omdbapi.com/?apikey=${API_KEY}&s=${query}`, { signal: controller.signal })
        // const res = await fetch(`http://www.omdbapi.com/?apikey=${API_KEY}&i=${imdbID}`)
        if (!res.ok) throw new Error("Some error happened")
        const data = await res.json()
        console.log(data)
        if (data.Response === "False") throw new Error("Movie not found")
        const movieData = data.Search
        setSearchedMovies(movieData)

      } catch (err) {
        if (err.name != "AbortError")
          setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    if (query.length < 3)
      setSearchedMovies([])
    else
      getMovie()
    return function () {
      controller.abort()
      setError("")
    }
  }, [query])

  return (
    <div className="main" >
      <NavBar>
        <Search query={query} setQuery={setQuery}></Search>
        <p>{searchedMovies.length} search results</p>
      </NavBar>

      <SectionDivs isSearchedSection={isSearchedSection} setSearchedSection={setSearchedSection}></SectionDivs>

      <WholeBox>
        {
          isSearchedSection ?
            <>
              <SearchedMovieBox error={error} isLoading={isLoading} movies={searchedMovies}
                setSelectedId={setSelectedId} searchedMovies={searchedMovies} theRef={ref}></SearchedMovieBox>
              <MovieDetails selectedId={selectedId} setSelectedId={setSelectedId} theRef={ref} setWatchedMovie={setWatchedMovie} watchedMovie={watchedMovie}></MovieDetails>
            </> : 
            <WatchedMovieBox >
                <p className="heading-title">Total: {watchedMovie.length} </p>
                <WatchedMovieList watchedMovie={watchedMovie} setWatchedMovie={setWatchedMovie}></WatchedMovieList>
            </WatchedMovieBox>
        }
      </WholeBox>

      <Footer></Footer> 


    </div>
  );
}

function NavBar({ children }) {
  return (
    <div className="nav-bar">
      <Logo></Logo>
      {children}
    </div>
  )
}
function Logo() {
  return (
    <div className="logo">
      <img src="/images/logo.png" alt=""></img>
      <h3>SaveTheShow</h3>
    </div>
  )
}
function Search({ query, setQuery }) {
  return (
    <div className="search">
      <input placeholder="Enter the name of the movie..."
        value={query} onChange={(e) => setQuery(e.target.value)}></input>
      <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="50" height="50" viewBox="0 0 50 50">
        <path d="M 7 4 C 5.3545455 4 4 5.3545455 4 7 L 4 43 C 4 44.645455 5.3545455 46 7 46 L 43 46 C 44.645455 46 46 44.645455 46 43 L 46 7 C 46 5.3545455 44.645455 4 43 4 L 7 4 z M 7 6 L 43 6 C 43.554545 6 44 6.4454545 44 7 L 44 43 C 44 43.554545 43.554545 44 43 44 L 7 44 C 6.4454545 44 6 43.554545 6 43 L 6 7 C 6 6.4454545 6.4454545 6 7 6 z M 22.5 13 C 17.26514 13 13 17.26514 13 22.5 C 13 27.73486 17.26514 32 22.5 32 C 24.758219 32 26.832076 31.201761 28.464844 29.878906 L 36.292969 37.707031 L 37.707031 36.292969 L 29.878906 28.464844 C 31.201761 26.832076 32 24.758219 32 22.5 C 32 17.26514 27.73486 13 22.5 13 z M 22.5 15 C 26.65398 15 30 18.34602 30 22.5 C 30 26.65398 26.65398 30 22.5 30 C 18.34602 30 15 26.65398 15 22.5 C 15 18.34602 18.34602 15 22.5 15 z"></path>
      </svg>
    </div>
  )
}

function Loader() {
  return (
    <div className="loader">
      <img src="./images/loader.png"></img>
    </div>
  );
}

function SectionDivs({ isSearchedSection, setSearchedSection }) {
  return (
    <div className="section-divs">
      <div className={`search-results ${isSearchedSection ? "section-active" : ""}`}
        onClick={() => setSearchedSection(true)} >Search Results</div>
      <div className={`watched-list ${!isSearchedSection ? "section-active" : ""}`}
        onClick={() => setSearchedSection(false)}>Watched!</div>
    </div>
  )
}

function WholeBox({ children }) {
  return (
    <div className="whole-box">
      {children}
    </div>
  )
}
function SearchedMovieBox({ error, isLoading, searchedMovies, movies, setSelectedId,theRef }) {
  return (
    <div className="search-movie-box movie-box ">
      <p className="heading-title">Results: </p>
      {!isLoading && !error && searchedMovies.length==0?<p className="no-results">No results found !</p>:"" }
      {isLoading && !error ? <Loader></Loader> : ""}
      {!isLoading && error ? <p className="error">🚫 {error}</p> : ""}
      {!isLoading && !error ? <SearchedMovieList movies={movies} theRef={theRef} setSelectedId={setSelectedId}></SearchedMovieList> : ""}

    </div>
  )
}
function SearchedMovieList({ movies, setSelectedId,theRef }) {
  return (
    <ul className="search-movie-list">
      {movies.map(movie => <SearchedMovie movie={movie} theRef={theRef} key={movie.imdbID} setSelectedId={setSelectedId}></SearchedMovie>)}
    </ul>
  )
}
function SearchedMovie({ movie, setSelectedId,theRef }) {
  function handleSelectedMovie(){
    setSelectedId(id=>{
      if(id!=movie.imdbID){
        if(window.innerWidth<743)
          theRef?.current?.scrollIntoView({behavior:"smooth"})
        return movie.imdbID
      }
      else 
        return null
    })
  }
  return (
    <li className="search-movie" onClick={() => handleSelectedMovie()}>
      <img src={movie.Poster}></img>
      <div className="movie-preview">
        <h3>{movie.Title}</h3>
        <p>📅 <span>{movie.Year}</span></p>
        <p>🎬 <span>{movie.Type}</span></p>
      </div>
    </li>
  )
}
///////////////////////
function MovieDetails({ selectedId,setSelectedId,setWatchedMovie,watchedMovie }) {
  const [isLoading, setLoading] = useState(false)
  const [selectedMovie, setSelectedMovie] = useState([])
  const [userRating,setUserRating]=useState(0)
  const {
    Title: title,
    Released: released,
    Runtime: runtime,
    Genre: genre,
    Plot: plot,
    Poster: poster,
    imdbRating: imdbRating,
    imdbID: imdbID
} = selectedMovie;

function addWatchedMovie(){
  const newMovie={
    title,
    poster,
    imdbRating,
    userRating,
    imdbID
  }
  setWatchedMovie(movie=>[...movie,newMovie])
  setSelectedId(null)
}

  useEffect(function () {
    const controller = new AbortController()
    setLoading(false)
    async function getMovieDetails() {
      try {
        setLoading(true)
        const res = await fetch(`http://www.omdbapi.com/?apikey=${API_KEY}&i=${selectedId}`, { signal: controller.signal })
        if (!res.ok) throw new Error("Some error happened")
        const data = await res.json()
        console.log(data)
        setSelectedMovie(data)
        if(data.Title)
          document.title=data.Title
      } catch (err) {
        if (err.name != "AbortError")
          return
      }finally{
        setLoading(false)
      
      }
    }
    getMovieDetails()
    return function(){
      setUserRating(0)
      document.title="SaveTheShow"
    }
  }, [selectedId])
  return (
    <div className="movie-details movie-box ">
      <p className="heading-title">Details: </p>
      { 
        !selectedId?<p className="no-details">No details</p>:
        isLoading?<Loader></Loader>:<div className="selected-movie-details">
          
        <img src="./images/back-button-svgrepo-com.svg" className="back-btn" onClick={()=>setSelectedId(null)}></img>
        <div className="movie-info">
          <img src={poster}></img>
          <div className="information">
            <h3 className="title">{title}</h3>
            <p><span>🗓️</span> {released} </p>
            <p><span>⭐</span> IMDb Rating: {imdbRating}</p>
            <p><span>🎬</span> {genre}</p>
            <p><span>📺</span> {runtime}</p>
          </div>
        </div>

        <div className="rating">
          {
            watchedMovie?.some(movie=>movie.imdbID===imdbID)?
            <p className="already-watched">You have already watched this movie.</p>
            :<>
              <StarRating size={window.innerWidth > 360 ? "24" : "20"} maxStarCount={10} setUserRating={setUserRating}></StarRating>
              {userRating>0?<button className="add-btn" onClick={addWatchedMovie}>Mark as watched</button>:""}
            </>

          }
          
        </div>

        <div className="movie-story">
          <p>Storyline:</p>
          <em>{plot}
          </em>
        </div>
      </div>
      }
      
    </div>
  )
}
///////////////////////
function WatchedMovieBox({children}) {
  return (
    <div className="watched-movie-box movie-box ">
      
      {children}
    </div>
  )
}
function WatchedMovieList({watchedMovie,setWatchedMovie}) {
  return (
    <ul className="watched-movie-list">
      {
        watchedMovie.map(movie=><WatchedMovie movie={movie} setWatchedMovie={setWatchedMovie} key={movie.title}></WatchedMovie>)
      }
      
    </ul>
  )
}
function WatchedMovie({movie,setWatchedMovie}) {
  function deleteWatchedMovie(){
    setWatchedMovie(allmovies=>allmovies.filter(mov=>mov.imdbID!==movie.imdbID))
  }
  return (
    <li className="watched-movie">
      <img src={movie.poster}></img>
      <div className="watched-movie-info">
        <h3>{movie.title}</h3>
        <p><span>⭐</span> {movie.imdbRating} (IMDb)</p>
        <p><span>🌟</span> {movie.userRating} (Your's)</p>
      </div>
      <button className="delete-btn" onClick={deleteWatchedMovie}>&#10005;</button>
    </li>
  )
}
function Footer() {
  return (
    <footer>
      <p>&copy; 2024 Debjit Adhikari. All rights reserved.</p>
    </footer>
  )
}


