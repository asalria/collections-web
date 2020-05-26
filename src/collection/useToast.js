import { useState,useEffect } from 'react';

const useToast = () => {
  const [isShowing, setIsShowing] = useState(false);

  function toggleToast() {
    setIsShowing(!isShowing);

  }
  



  return {
    isShowing,
    toggleToast,
  }
};

export default useToast;