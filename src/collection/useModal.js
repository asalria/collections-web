import { useState,useEffect } from 'react';

const useModal = () => {
  const [isShowing, setIsShowing] = useState(false);
  const [isToast, setIsToast] = useState(false);


  function toggle() {
    setIsShowing(!isShowing);

  }
  
  function toggleToast(){
    setIsShowing(!isShowing);
        setIsToast(true);
  }



  return {
    isShowing,
    isToast,
    toggle,
    toggleToast
  }
};

export default useModal;