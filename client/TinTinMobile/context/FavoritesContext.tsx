import React, { createContext, useContext, useState, ReactNode } from 'react';

interface FavoritesContextType {
  favorites: number[];
  favoriteToppings: number[];
  toggleFavorite: (id: number) => void;
  toggleFavoriteTopping: (id: number) => void;
  setFavoritesList: (ids: number[]) => void;
  setFavoriteToppingsList: (ids: number[]) => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const [favorites, setFavorites] = useState<number[]>([]);
  const [favoriteToppings, setFavoriteToppings] = useState<number[]>([]);

  const toggleFavorite = (id: number) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const toggleFavoriteTopping = (id: number) => {
    setFavoriteToppings(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const setFavoritesList = (ids: number[]) => {
    setFavorites(ids);
  };

  const setFavoriteToppingsList = (ids: number[]) => {
    setFavoriteToppings(ids);
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        favoriteToppings,
        toggleFavorite,
        toggleFavoriteTopping,
        setFavoritesList,
        setFavoriteToppingsList,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}; 