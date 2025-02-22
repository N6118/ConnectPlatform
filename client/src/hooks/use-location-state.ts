import { useLocation } from "wouter";

export function useLocationState<T>() {
  const [location] = useLocation();
  
  // Access the state from the location object
  const state = (window as any).history.state;
  
  return state as T;
} 