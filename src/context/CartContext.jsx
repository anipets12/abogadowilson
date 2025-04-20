import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import coursesService from '../services/coursesService';
import { useAuth } from './AuthContext';

// Definir el contexto
const CartContext = createContext();

// Acciones para el reducer
export const CART_ACTIONS = {
  ADD_TO_CART: 'ADD_TO_CART',
  REMOVE_FROM_CART: 'REMOVE_FROM_CART',
  UPDATE_QUANTITY: 'UPDATE_QUANTITY',
  CLEAR_CART: 'CLEAR_CART',
  SET_CART: 'SET_CART',
};

// Estado inicial
const initialState = {
  items: [],
  total: 0
};

// Función para calcular el total
const calculateTotal = (items) => {
  return items.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);
};

// Reducer para manejar las acciones del carrito
const cartReducer = (state, action) => {
  switch (action.type) {
    case CART_ACTIONS.ADD_TO_CART: {
      // Verificar si el item ya está en el carrito
      const existingItemIndex = state.items.findIndex(item => 
        item.id === action.payload.id && item.type === action.payload.type
      );
      
      let newItems;
      
      if (existingItemIndex >= 0) {
        // Si el item ya existe, incrementar la cantidad (excepto para cursos y ebooks)
        if (action.payload.type === 'course' || action.payload.type === 'ebook') {
          // Para cursos y ebooks, mostrar un mensaje y no duplicar
          toast.error('Este item ya está en tu carrito');
          return state;
        }
        
        newItems = [...state.items];
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: (newItems[existingItemIndex].quantity || 1) + (action.payload.quantity || 1)
        };
      } else {
        // Si el item no existe, agregarlo al carrito
        newItems = [...state.items, { ...action.payload, quantity: action.payload.quantity || 1 }];
      }
      
      const newTotal = calculateTotal(newItems);
      
      // Guardar el carrito en localStorage
      localStorage.setItem('cart', JSON.stringify({
        items: newItems,
        total: newTotal
      }));
      
      return {
        items: newItems,
        total: newTotal
      };
    }
    
    case CART_ACTIONS.REMOVE_FROM_CART: {
      const newItems = state.items.filter(item => 
        !(item.id === action.payload.id && item.type === action.payload.type)
      );
      
      const newTotal = calculateTotal(newItems);
      
      // Guardar el carrito actualizado en localStorage
      localStorage.setItem('cart', JSON.stringify({
        items: newItems,
        total: newTotal
      }));
      
      return {
        items: newItems,
        total: newTotal
      };
    }
    
    case CART_ACTIONS.UPDATE_QUANTITY: {
      const { id, type, quantity } = action.payload;
      
      if (quantity <= 0) {
        // Si la cantidad es 0 o menor, eliminar el item
        return cartReducer(state, { 
          type: CART_ACTIONS.REMOVE_FROM_CART, 
          payload: { id, type } 
        });
      }
      
      const newItems = state.items.map(item => {
        if (item.id === id && item.type === type) {
          return { ...item, quantity };
        }
        return item;
      });
      
      const newTotal = calculateTotal(newItems);
      
      // Guardar el carrito actualizado en localStorage
      localStorage.setItem('cart', JSON.stringify({
        items: newItems,
        total: newTotal
      }));
      
      return {
        items: newItems,
        total: newTotal
      };
    }
    
    case CART_ACTIONS.CLEAR_CART: {
      // Limpiar el carrito en localStorage
      localStorage.removeItem('cart');
      
      return initialState;
    }
    
    case CART_ACTIONS.SET_CART: {
      const { items } = action.payload;
      const total = calculateTotal(items);
      
      return {
        items,
        total
      };
    }
    
    default:
      return state;
  }
};

// Proveedor del contexto
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const [isCartVisible, setIsCartVisible] = useState(false);
  const { user, hasUserPurchasedCourse } = useAuth();
  
  // Cargar el carrito desde localStorage al iniciar
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        
        // Validar que el carrito almacenado tenga la estructura correcta
        if (parsedCart && Array.isArray(parsedCart.items)) {
          dispatch({ 
            type: CART_ACTIONS.SET_CART, 
            payload: { items: parsedCart.items } 
          });
        }
      } catch (error) {
        console.error('Error al cargar el carrito desde localStorage:', error);
        localStorage.removeItem('cart');
      }
    }
  }, []);
  
  // Verificar en cada renderizado si el usuario ya ha comprado alguno de los cursos en el carrito
  useEffect(() => {
    if (user && state.items.length > 0) {
      // Filtrar cursos que el usuario ya haya comprado
      const updatedItems = state.items.filter(item => {
        if (item.type === 'course') {
          // Si el usuario ya compró el curso, eliminarlo del carrito
          if (hasUserPurchasedCourse(item.id)) {
            toast.info(`"${item.title}" ya está en tu biblioteca, se ha eliminado del carrito.`);
            return false;
          }
        }
        return true;
      });
      
      // Actualizar el carrito si se eliminaron items
      if (updatedItems.length !== state.items.length) {
        dispatch({ 
          type: CART_ACTIONS.SET_CART, 
          payload: { items: updatedItems } 
        });
      }
    }
  }, [user, state.items, hasUserPurchasedCourse]);
  
  // Actualizar total cuando cambian los items
  useEffect(() => {
    if (state.total !== calculateTotal(state.items)) {
      const newTotal = calculateTotal(state.items);
      
      // Guardar el carrito actualizado en localStorage
      localStorage.setItem('cart', JSON.stringify({
        items: state.items,
        total: newTotal
      }));
    }
  }, [state.items, state.total]);
  
  // Función para agregar un curso al carrito
  const addCourseToCart = async (courseId) => {
    if (!user) {
      toast.error('Debes iniciar sesión para agregar cursos al carrito');
      return { success: false };
    }
    
    try {
      const { success, error, alreadyPurchased, item } = await coursesService.addCourseToCart(courseId, user.id);
      
      if (alreadyPurchased) {
        toast.info('Ya has comprado este curso. Puedes acceder a él desde tu biblioteca.');
        return { success: false };
      }
      
      if (error) {
        toast.error(error.message || 'Error al agregar el curso al carrito');
        return { success: false };
      }
      
      if (success && item) {
        dispatch({ type: CART_ACTIONS.ADD_TO_CART, payload: item });
        setIsCartVisible(true);
        toast.success(`"${item.title}" agregado al carrito`);
        return { success: true };
      }
    } catch (error) {
      console.error('Error al agregar curso al carrito:', error);
      toast.error('Ocurrió un error al agregar el curso al carrito');
      return { success: false };
    }
  };
  
  // Función para agregar un item genérico al carrito
  const addToCart = (item) => {
    dispatch({ type: CART_ACTIONS.ADD_TO_CART, payload: item });
    setIsCartVisible(true);
    toast.success(`"${item.title}" agregado al carrito`);
  };
  
  // Función para actualizar la cantidad de un item
  const updateQuantity = (id, type, quantity) => {
    dispatch({ 
      type: CART_ACTIONS.UPDATE_QUANTITY, 
      payload: { id, type, quantity: parseInt(quantity, 10) } 
    });
  };
  
  // Función para eliminar un item del carrito
  const removeFromCart = (id, type) => {
    const itemToRemove = state.items.find(item => item.id === id && item.type === type);
    
    if (itemToRemove) {
      dispatch({ type: CART_ACTIONS.REMOVE_FROM_CART, payload: { id, type } });
      toast.success(`"${itemToRemove.title}" eliminado del carrito`);
    }
  };
  
  // Función para limpiar el carrito
  const clearCart = () => {
    dispatch({ type: CART_ACTIONS.CLEAR_CART });
  };
  
  // Función para procesar el pago
  const checkout = async (paymentMethod) => {
    if (!user) {
      toast.error('Debes iniciar sesión para realizar el pago');
      return { success: false };
    }
    
    if (state.items.length === 0) {
      toast.error('El carrito está vacío');
      return { success: false };
    }
    
    try {
      // Aquí implementarías la lógica para procesar el pago según el método seleccionado
      // (PayPal, transferencia bancaria, etc.)
      
      // Simulación de procesamiento de pago exitoso
      const transactionDetails = {
        method: paymentMethod,
        amount: state.total,
        timestamp: new Date().toISOString(),
        invoiceUrl: `/dashboard/compras`
      };
      
      // Procesar cada item según su tipo
      for (const item of state.items) {
        if (item.type === 'course') {
          const { success, error, purchaseId } = await coursesService.purchaseCourse(
            item.id, 
            user.id, 
            transactionDetails
          );
          
          if (!success) {
            console.error(`Error al procesar la compra del curso ${item.id}:`, error);
            // Seguir intentando con los demás items en lugar de abortar todo el proceso
          }
        }
        // Implementar lógica para otros tipos de productos (ebooks, tokens, etc.)
      }
      
      // Limpiar el carrito después de un pago exitoso
      clearCart();
      
      return { 
        success: true, 
        message: 'Pago procesado correctamente', 
        transactionId: `tr-${Date.now()}`
      };
    } catch (error) {
      console.error('Error al procesar el pago:', error);
      toast.error('Error al procesar el pago. Inténtalo de nuevo más tarde.');
      return { success: false, error };
    }
  };
  
  // Alternar la visibilidad del carrito
  const toggleCartVisibility = () => {
    setIsCartVisible(!isCartVisible);
  };
  
  // Valores a proporcionar en el contexto
  const value = {
    items: state.items,
    total: state.total,
    itemCount: state.items.reduce((count, item) => count + (item.quantity || 1), 0),
    isCartVisible,
    setIsCartVisible,
    addToCart,
    addCourseToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    checkout,
    toggleCartVisibility
  };
  
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// Hook personalizado para usar el carrito
export const useCart = () => useContext(CartContext);
