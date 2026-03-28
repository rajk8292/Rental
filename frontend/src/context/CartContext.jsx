import { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        const storedCart = localStorage.getItem('cart');
        if (storedCart) {
            setCartItems(JSON.parse(storedCart));
        }
    }, []);

    const addToCart = (utensil, quantity) => {
        const existingItem = cartItems.find(item => item.utensil === utensil._id);
        let newCart;
        if (existingItem) {
            newCart = cartItems.map(item => 
                item.utensil === utensil._id 
                ? { ...item, quantity: item.quantity + quantity } 
                : item
            );
        } else {
            newCart = [...cartItems, { 
                utensil: utensil._id, 
                name: utensil.name, 
                pricePerDay: utensil.pricePerDay, 
                quantity,
                image: utensil.image
            }];
        }
        setCartItems(newCart);
        localStorage.setItem('cart', JSON.stringify(newCart));
    };

    const removeFromCart = (utensilId) => {
        const newCart = cartItems.filter(item => item.utensil !== utensilId);
        setCartItems(newCart);
        localStorage.setItem('cart', JSON.stringify(newCart));
    };

    const clearCart = () => {
        setCartItems([]);
        localStorage.removeItem('cart');
    };

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};
