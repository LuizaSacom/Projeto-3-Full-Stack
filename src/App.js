import React from 'react';
import { CategoryProvider } from './context/CategoryContext';
import CategoryButton from './components/CategoryButton';
import ItemList from './components/ItemList';
import './App.css';

function App() {
  const categories = ['ailments', 'armor', 'charms', 'decorations', 'events', 'items', 'locations', 'monsters', 'skills', 'weapons'];

  return (
    <CategoryProvider>
      <div className="App">
        <header className="App-header">
          <h1>Categorias</h1>
          {categories.map(category => (
            <CategoryButton key={category} category={category} />
          ))}
          <ItemList />
        </header>
      </div>
    </CategoryProvider>
    
  );
}

export default App;