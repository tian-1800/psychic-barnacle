import { useEffect, useRef } from "react";

const useInitialEffect = (effect: () => void) => {
  const initiated = useRef(false);

  useEffect(() => {
    if (!initiated.current) {
      initiated.current = true;
      effect();
    }
  }, [effect]);
};

export default useInitialEffect;
