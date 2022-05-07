import React, { useState, useEffect, useCallback } from 'react';

import AddMovie from './components/AddMovie'
import MoviesList from './components/MoviesList';
import './App.css';

function App() {
    const [movies, setMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchMoviesHandler = useCallback(async () => {    // with useCallback(), we can reload without infinite loop
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('https://react-http-ee446-default-rtdb.asia-southeast1.firebasedatabase.app/movies.json');     // new GET
            // const response = await fetch('https://swapi.dev/api/films/');    // GET

            if (!response.ok) {
                throw new Error('Somthing went wrong!');
            }

            const data = await response.json();

            const loadedMovies = [];

            // belows for POST form Firebase
            for (const key in data) {
                loadedMovies.push({
                    id: key,
                    title: data[key].title,
                    openingText: data[key].openingText,
                    releaseDate: data[key].releaseDate
                })
            }
            setMovies(loadedMovies);

            // belows for GET from S
            // const transformedMovies = data.results.map(movieData => {   //match json data and MovisList.js
            //     return {
            //         id: movieData.episode_id,
            //         title: movieData.title,
            //         releaseDate: movieData.release_date,
            //         openingText: movieData.opening_crawl
            //     };
            // });
            // setMovies(transformedMovies);    
            
        } catch (error) {
            setError(error.message);
        }

        setIsLoading(false);
    }, []);

    useEffect(() => {
        fetchMoviesHandler();
    }, []);

    async function addMovieHandler(movie) {
        const response = await fetch('https://react-http-ee446-default-rtdb.asia-southeast1.firebasedatabase.app/movies.json',{    // should attach .json to URL for specific request sending
            method: 'POST',
            body: JSON.stringify(movie),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        console.log(data);
    }

    let content = <p>Found no movies.</p>;
    
    if (movies.length > 0) {
        content = <MoviesList movies={movies} />;
    };

    if (error) {
        content = <p>{error}</p>;
    };

    if (isLoading) {
        content = <p>Loading...</p>;
    };

    return (
        <React.Fragment>
            <section>
                <AddMovie onAddMovie={addMovieHandler} />
            </section>
            <section>
                <button onClick={fetchMoviesHandler}>Fetch Movies</button>
            </section>
            <section>
                {content}
            </section>
        </React.Fragment>
    );
};

export default App;