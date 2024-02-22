// SupabaseProvider.js
"use client"
import React, {useState, useEffect, createContext, useContext} from 'react';
 
import { useSupabaseInit } from '@/app/api'
import { data } from 'autoprefixer';

export const SupabaseContext = createContext('');

export default function SupabaseStore  ({ children } ){
    const supabase = useSupabaseInit();

    const [isReady, setIsReady] = useState(false);
    const [user,setUser] = useState();
    
  useEffect(() => {
    if (supabase){ setIsReady(true);
    fetchUser();};
  }, [supabase]);

  // CRUD operations
  const createUser = async (username, email) => {
    return await supabase.from('Users').insert([{ username, email }]) .select();
  };

  const addFoodItem = async (name) => {
    
    return await supabase.from('FoodItems').insert([{ name }]) .select();

  };
  const addItemToUser = async (itemId, userID, type, when) => {
    // Fetch the current user's data to access the current state of the meal plan
    let { data: userData, error: fetchError } = await supabase
      .from('Users')
      .select(type)
      .eq('email', userID) // Adjust the column name if necessary
      .single();
  
    if (fetchError) {
      console.error('Error fetching user data:', fetchError);
      return null;
    }
  
    // Ensure the user's meal plan for the given type exists and is an object
    let mealPlan = userData[type] ? JSON.parse(userData[type]) : {};
    
    // Initialize the `when` key if not already present
    if (!mealPlan[when]) {
      mealPlan[when] = {};
    }
  
    // Assuming itemId is a string representing the food item's name
    // Initialize the set for the given 'when' if it doesn't exist, otherwise add the item
    if (!mealPlan[when][itemId]) {
      mealPlan[when][itemId] = true; // Using an object to simulate a set, ensuring unique items
    }
  
    // Convert the updated meal plan back to a string for storage
    const updatedMealPlan =  mealPlan ;
  
    // Prepare the update object with the updated meal plan
    const updateObject = {};
    updateObject[type] = updatedMealPlan;
  
    // Perform the update operation
    const { data: updateData, error: updateError } = await supabase
      .from('Users')
      .update(updateObject)
      .match({ email: userID });
  
    // Handle possible errors
    if (updateError) {
      console.error('Error updating item:', updateError);
      return null;
    }
  
    return updateData;
  };
  
  

  const addFavorite = async (userId, foodItemId) => {
    return await supabase.from('UserFavorites').insert([{ user_id: userId, food_item_id: foodItemId }]) .select();
  };

  const createGroup = async (name, createdBy) => {
    return await supabase.from('Groups').insert([{ name, created_by: createdBy }]) .select();
  };

  const addUserToGroup = async (groupId, userId) => {
    return await supabase.from('GroupMembers').insert([{ group_id: groupId, user_id: userId }]) .select();
  };

  const getGroupRecommendations = async (groupId) => {
    // Implement the logic for group recommendations
  };

  const signInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      
    });
  
    if (error) {
      console.error('Error during sign-in:', error);
      return;
    }
     
    // Handle the user or session info
  };

  const fetchUser = async ()=>{


     const { data: { user } } = await supabase?.auth?.getUser()

    setUser(user);  
    return user;
  }

  const signOut = async()=>{
    const { error } = await supabase.auth.signOut()


  } 
    return (
        <SupabaseContext.Provider value={{ supabase,
          isReady,
          createUser,
          addFoodItem,
          addFavorite,
          addItemToUser,
          createGroup,
          addUserToGroup,
          getGroupRecommendations,
          signInWithGoogle,
          fetchUser,
          signOut,
          user}}>
            {children}
        </SupabaseContext.Provider>
    );
};
 

export function useSupabaseContext(){
  return useContext(SupabaseContext);
}
   
