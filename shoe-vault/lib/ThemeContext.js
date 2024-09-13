"use client";  // Mark this file as a Client Component

import { createContext, useState, useEffect, useContext } from 'react';

// Create a ThemeContext
const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

// ThemeProvider that wraps the entire app
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');  // Default is light mode

  // Load theme from localStorage on initial mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  // Toggle between light and dark themes
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
