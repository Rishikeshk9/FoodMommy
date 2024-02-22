import React from "react"; 
import Navbar from "./components/Navbar";
import SupabaseProvider from "./context/SupabaseProvider";
 
export default function Index  ({ children }) {
  return (
     <> 
      {children} 
     </>
  );
};
