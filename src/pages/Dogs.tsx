import React, { useState, useEffect } from 'react';
import { fetchAPI } from '../utils/api';


export interface Dog {
  id: string;
  name: string;
  breed: string;
  age: number;
  zip_code: string;
  img: string; 
}

interface DogSearchProps {
    onFavoritesChange: (favorites: Dog[]) => void; 
  }

const DogSearch: React.FC<DogSearchProps> = ({onFavoritesChange}) => {
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [favorites, setFavorites] = useState<Dog[]>([]);
  const [breedFilter, setBreedFilter] = useState<string>('Labrador');
  const [breeds, setBreeds] = useState<string[]>([]); 
  const [sortField, setSortField] = useState<'breed' | 'name' | 'age'>('breed'); 
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc'); 
  const [page, setPage] = useState<number>(1);
  const [totalDogs, setTotalDogs] = useState<number>(0);
  const [dogIds, setDogIds] = useState<string[]>([]); 

  
  const fetchBreeds = async () => {
    try {
      const response = await fetchAPI('/dogs/breeds', {
        method: 'GET',
      });
      setBreeds(response); 
    } catch (error) {
      console.error('Error fetching breeds:', error);
    }
  };

  const fetchDogs = async () => {
    try {
      const params = new URLSearchParams({
        breeds: breedFilter,
        size: '100',
        sort: `${sortField}:${sortOrder}`,
        page: page.toString(),
      });

      const response = await fetchAPI(`/dogs/search?${params.toString()}`, {
        method: 'GET'
      });

      const ids = response.resultIds;

      setDogIds(ids);
      console.log(dogIds);

      const batchedDogs: Dog[] = [];
      const batchSize = 100;

      for (let i = 0; i < ids.length; i += batchSize) {
        const batchIds = ids.slice(i, i + batchSize);
        const dogsBatch = await fetchDogsByIds(batchIds);
        batchedDogs.push(...dogsBatch);
      }

      setDogs(batchedDogs);
      setTotalDogs(response.total);
    } catch (error) {
      console.error('Error fetching dogs:', error);
    }
  };

  
  const fetchDogsByIds = async (ids: string[]) => {
    try {
      const response = await fetchAPI('/dogs', {
        method: 'POST',
        body: JSON.stringify(ids)
      });
      return response; 
    } catch (error) {
      console.error('Error fetching dog batch:', error);
      return [];
    }
  };

  useEffect(() => {
    fetchDogs();
  }, [breedFilter, sortField, sortOrder, page]);

  useEffect(() => {
    fetchBreeds();
  }, []);

  const handleFavoriteToggle = (dog: Dog) => {
    if (favorites.includes(dog)) {
      setFavorites(favorites.filter((fav) => fav.id !== dog.id));
    } else {
      setFavorites([...favorites, dog]);
    }
    onFavoritesChange(favorites);
  };

  const handleSortChange = (field: 'breed' | 'name' | 'age') => {
    setSortField(field);
  };

  const handleSortOrderToggle = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const handleBreedFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setBreedFilter(event.target.value);
  };

  return (
    <div>
      <h2>Dogs</h2>

      <select value={breedFilter} onChange={handleBreedFilterChange}>
        <option value="">Select Breed</option>
        {breeds.map((breed, index) => (
          <option key={index} value={breed}>
            {breed}
          </option>
        ))}
      </select>


      <div>
        <label>
          Sort by:
          <select
            value={sortField}
            onChange={(e) => handleSortChange(e.target.value as 'breed' | 'name' | 'age')}
          >
            <option value="breed">Breed</option>
            <option value="name">Name</option>
            <option value="age">Age</option>
          </select>
        </label>

        <button onClick={handleSortOrderToggle}>
          Sort Order: {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
        </button>
         
      </div>

      <div style={{ marginTop: '20px' }}>
        <table  cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Breed</th>
              <th>Age</th>
              <th>Zip Code</th>
              <th>Favorites</th>
            </tr>
          </thead>
          <tbody>
            {dogs.map((dog) => (
              <tr key={dog.id}>
                <td>
                  <img
                    src={dog.img}
                    alt={dog.name}
                    style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                  />
                </td>
                <td>{dog.name}</td>
                <td>{dog.breed}</td>
                <td>{dog.age}</td>
                <td>{dog.zip_code}</td>
                <td>
                  <button onClick={() => handleFavoriteToggle(dog)}>
                    {favorites.includes(dog) ? 'Unfavorite' : 'Favorite'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: '20px' }}>
        <button onClick={() => setPage(page - 1)} disabled={page === 1}>
          Previous
        </button>
        <span> Page {page} </span>
        <button
          onClick={() => setPage(page + 1)}
          disabled={page * 25 >= totalDogs}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default DogSearch;
