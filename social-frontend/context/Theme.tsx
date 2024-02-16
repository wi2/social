import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Theme } from '../constants/type';

interface ThemeContextType {
  theme?: Theme;
  toggleTheme?: () => void;
}

export const ThemeContext = createContext<ThemeContextType>({});

export const ThemeProvider = ({ children }: any) => {
  const [theme, setTheme] = useState(Theme.dark);
  const [isMounted, setIsMounted] = useState(false);

  // Basculer le thème
  const toggleTheme = useCallback(() => {
    const newTheme = theme === Theme.dark ? Theme.light : Theme.dark;
    localStorage.setItem('theme', newTheme);
    setTheme(newTheme);
  }, [theme]);

  // Appliquer le thème lors du chargement
  useEffect(() => {
    const storedTheme = (localStorage.getItem('theme') as Theme) || Theme.dark;
    setTheme(storedTheme);
    localStorage.setItem('theme', storedTheme);
    document.body.setAttribute('data-theme', storedTheme);
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default function useTheme() {
  return useContext(ThemeContext);
}
