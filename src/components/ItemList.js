import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useCategory } from '../context/CategoryContext';
import { FixedSizeList as List } from 'react-window';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import './ItemList.css'; 

function ItemList() {
    const { currentCategory: category } = useCategory();
    const [items, setItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(''); 

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`https://mhw-db.com/${category}`);
                setItems(response.data);
                setFilteredItems(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Erro ao obter os itens:', error);
                setLoading(false);
            }
        };

        if (category) {
            fetchData();
        }
    }, [category]);

    const handleSearch = () => {
        if (searchText.trim().length === 0) {
            setError('Insira pelo menos 1 letra para pesquisar.');
            return;
        }
        setError(''); 
        const text = searchText.trim().toLowerCase();
        const filtered = items.filter(item => item.name.toLowerCase().includes(text));
        setFilteredItems(filtered);
    };

    const renderRow = ({ index, style }) => {
        return (
            <ListItem style={style} key={filteredItems[index].id} component="div" divider>
                <ListItemText primary={filteredItems[index].name} />
            </ListItem>
        );
    };

    return (
        <div className="glassEffect">
            <h1>Lista de {category}</h1>
            <div>
                <input
                    type="text"
                    placeholder="Pesquisar..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="searchInput"
                />
                <Button variant="contained" color="primary" onClick={handleSearch}>
                    Pesquisar
                </Button>
            </div>
            {error && <p style={{ color: 'red' }}>{error}</p>} {}
            {loading ? (
                <CircularProgress style={{ color: '#392620' }} />
            ) : (
                <List
                    height={400}
                    width={'100%'}
                    itemSize={80}
                    itemCount={filteredItems.length}
                    overscanCount={5}
                >
                    {renderRow}
                </List>
            )}
        </div>
    );
}

export default ItemList;
