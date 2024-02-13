import { useContext } from 'react';
import { CustomToastType } from '../constants/type';
import ToastContext from '../components/Toast';

/**
 * @notice Gérer l'affichage des messages du toast.
 * @returns {Object} Afficher différents types de toasts.
 *   - {function} toastError - Affiche un toast de type erreur.
 *   - {function} toastInfo - Affiche un toast de type information.
 *   - {function} toastWarning - Affiche un toast de type avertissement.
 *   - {function} toastSuccess - Affiche un toast de type succès.
 */
export default function useToasts() {
  const addToast = useContext(ToastContext);

  return {
    toastError: (content: string) => {
      addToast?.({ type: CustomToastType.error, content });
    },
    toastInfo: (content: string) => {
      addToast?.({ type: CustomToastType.info, content });
    },
    toastWarning: (content: string) => {
      addToast?.({ type: CustomToastType.warning, content });
    },
    toastSuccess: (content: string) => {
      addToast?.({ type: CustomToastType.success, content });
    },
  };
}
