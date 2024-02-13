import {
  createContext,
  useCallback,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { CustomToast } from '../constants/type';

type ToastContextType = (item: CustomToast) => void;

/**
 * @notice Fournisseur de contexte pour la gestion des toasts dans l'application.
 * @dev Pour afficher des toats, utiliser le hook useToast()
 */
const ToastContext = createContext<ToastContextType | undefined>(undefined);

export default ToastContext;

/**
 * @notice Fournisseur de contexte pour la gestion des toasts dans l'application.
 * @param {ReactNode} props.children - Les composants enfants à envelopper dans le contexte des toasts.
 */
export function ToastContextProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CustomToast[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (items.length) {
        setItems(items.slice(1));
      }
    }, 2000);

    return () => {
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.length, setItems]);

  const addToast = useCallback(
    (item: CustomToast) => {
      setItems([...items, item]);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [items.length, setItems]
  );

  return (
    <ToastContext.Provider value={addToast}>
      {children}
      <div className="toast toast-end">
        {items.map((item, i) => (
          <div
            key={`toast-item-${i}`}
            className={`alert alert-${String(
              item.type
            )} transition-opacity opacity-100 duration-200 max-w-80`}
          >
            <span className="max-w-60 overflow-hidden text-ellipsis truncate">
              {item.content}
            </span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
