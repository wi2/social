import { useEffect, useState } from 'react';

/**
 * @notice Force à rafraîchir les données.
 * @dev Ce hook est utilisé pour rafraîchir les données en utilisant un intervalle de temps.
 * Il utilise le hook `useEffect` pour définir une fonction de rafraîchissement à intervalle régulier.
 * L'état local `isRefresh` indique si le rafraîchissement est en cours ou non,
 * et la fonction `refresh` permet de réinitialiser l'état `isRefresh` à `false`.
 * @returns {Object} Contient des informations sur l'état de rafraîchissement.
 *   - {boolean} isRefresh - Indique si le rafraîchissement est en cours.
 *   - {function} refresh - Fonction pour réinitialiser l'état de rafraîchissement à `false`.
 */
export default function useRefresh() {
  const [isRefresh, setIsRefresh] = useState(false);

  useEffect(() => {
    const polling = setInterval(() => {
      if (!isRefresh) {
        setIsRefresh(true);
      }
    }, 200);

    return () => {
      clearInterval(polling);
    };
  }, [isRefresh]);

  const refresh = () => {
    setIsRefresh(false);
  };

  return { isRefresh, refresh };
}
