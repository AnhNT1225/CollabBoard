import { useState, useEffect } from "react";
export const useSingleAndDoubleClick = (
	actionSimpleClick,
	actionDoubleClick,
	delay = 250
) => {
	const [click, setClick] = useState(0);

	useEffect(() => {
		const timer = setTimeout(() => {
			// simple click
			if (click === 1) actionSimpleClick();
			setClick(0);
		}, delay);

		// the duration between this click and the previous one
		// is less than the value of delay = double-click
		if (click === 2) actionDoubleClick();

		return () => clearTimeout(timer);
	}, [click]);

	return () => setClick((prev) => prev + 1);
};


// Hook
export function useLocalStorage(key, initialValue) {
	// State to store our value
	// Pass initial state function to useState so logic is only executed once
	const [storedValue, setStoredValue] = useState(() => {
	  try {
		// Get from local storage by key
		const item = window.localStorage.getItem(key);
		// Parse stored json or if none return initialValue
		return item ? JSON.parse(item) : initialValue;
	  } catch (error) {
		// If error also return initialValue
		console.log(error);
		return initialValue;
	  }
	});
	// Return a wrapped version of useState's setter function that ...
	// ... persists the new value to localStorage.
	const setValue = (value) => {
	  try {
		// Allow value to be a function so we have same API as useState
		const valueToStore =
		  value instanceof Function ? value(storedValue) : value;
		// Save state
		setStoredValue(valueToStore);
		// Save to local storage
		window.localStorage.setItem(key, JSON.stringify(valueToStore));
	  } catch (error) {
		// A more advanced implementation would handle the error case
		console.log(error);
	  }
	};
	return [storedValue, setValue];
  }