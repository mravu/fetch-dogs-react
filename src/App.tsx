// src/App.tsx
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from "react-router-dom";
import { useState } from "react";
import Login from "./pages/Login";
import DogSearch, { Dog } from "./pages/Dogs";
import Match from "./pages/Match";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [favorites, setFavorites] = useState<Dog[]>([]);
  const navigate = useNavigate();

  const handleFavoritesChange = (favorites: Dog[]) => {
    setFavorites(favorites);
    console.log(favorites);
    console.log(isAuthenticated);
  };

    const handleMatchClick = () => {
      navigate('/match', { state: { favorites } }); 
    };
  

  return (
  
      <>
          {isAuthenticated && <button onClick={handleMatchClick} disabled={favorites.length === 0}>
          Generate Match
        </button>}
      <Routes>
        <Route path="/" element={<Login onLogin={() => setIsAuthenticated(true)} />} />
        <Route path="/dogs" element={isAuthenticated ?  <DogSearch onFavoritesChange={handleFavoritesChange} /> : <Navigate to="/" />} />
        <Route path="/match" element={isAuthenticated ?  <Match favorites={favorites}/> : <Navigate to="/" />} />
      </Routes>
      </>
   
  );
};

export default App;