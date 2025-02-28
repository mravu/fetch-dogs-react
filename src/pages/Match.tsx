import React, { useEffect, useState } from 'react';
import { fetchAPI } from '../utils/api';
import { Dog } from './Dogs';

interface MatchProps {
    favorites: Dog[];
  }

const Match:  React.FC<MatchProps>  = ({favorites}) => {
  const [match, setMatch] = useState<Dog | null>(null);


  const generateMatch = async (favor: Dog[]) => {
    if (favor.length === 0) return;

    try {
      const response = await fetchAPI('/dogs/match', {
        method: 'POST',
        body: JSON.stringify(favorites.map(dog => dog.id)),
      });
      const matchingDog:Dog[] = favorites.filter(c => c.id === response.match);
      setMatch(matchingDog[0]);
    } catch (error) {
      console.error('Error generating match:', error);
    }
  };

  useEffect(() => {
    generateMatch(favorites);
  }, [favorites]);

  return (
    <div>
      <h2>Match</h2>
      {match ? (
        <div>
          <h3>{match.name}</h3>
          <img src={match.img} alt={match.name} />
          <p>Breed: {match.breed}</p>
          <p>Age: {match.age}</p>
          <p>Zip Code: {match.zip_code}</p>
        </div>
      ) : (
        <p>No match yet. Please select some favorites!</p>
      )}
    </div>
  );
};

export default Match;
