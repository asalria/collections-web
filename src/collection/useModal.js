import { useState,useEffect } from 'react';

const useModal = () => {
  const [isShowing, setIsShowing] = useState(false);
  const [isToast, setIsToast] = useState(false);


  function toggle() {
    setIsShowing(!isShowing);

  }
  
  function toggleToast(){
    console.log("Hola")
    setIsToast(!isToast);
  }



  return {
    isShowing,
    isToast,
    toggle,
    toggleToast
  }
};

export default useModal;