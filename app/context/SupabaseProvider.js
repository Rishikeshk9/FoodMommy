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
    if (supabase) {
      setIsReady(true);
      fetchUser();
    }
  }, [supabase]);

  // CRUD operations

  // Create a new user profile in the database only if it doesn't exist
  const createUser = async (userId) => {
    // First, check if the user already exists in the profiles table
    const { data: existingUser, error: fetchError } = await supabase
        .from('profiles')
        .select()
        .eq('id', userId)
        .maybeSingle(); // Use maybeSingle() to expect 0 or 1 record

    // Handle any errors during the fetch operation
    if (fetchError) {
        console.error('Error checking for existing user:', fetchError);
        return { error: fetchError };
    }

    // If the user already exists, return a message or handle as needed
    if (existingUser) {
        return { error: new Error('User already exists.') };
    }

    // If the user does not exist, proceed to insert the new user record
    const { data, error: insertError } = await supabase
        .from('profiles')
        .insert([{ id: userId }])
        .single(); // Use single() if inserting one record to return just that record

    // Handle any errors during the insert operation
    if (insertError) {
        console.error('Error creating new user:', insertError);
        return { error: insertError };
    }

    // Return the newly created user data
    return { data };
};

  const addFoodItem = async (name) => {
    
    return await supabase.from('FoodItems').insert([{ name }]) .select();

  };

  const fetchAllFoodItems = async()=>{
 
    return await supabase?.from('fooditems').select();
  }

  const fetchUserPreferences = async (userID) => {
    try {
        // Fetch user's meal preferences along with food item details
        const { data: preferences, error } = await supabase
            .from('usermealpreferences')
            .select(`
                preference_id,
                meal_type,
                time_of_week,
                fooditems (food_name)
            `)
            .eq('user_id', userID);

        if (error) {
            console.error('Error fetching user preferences:', error);
            return null;
        }

        

        return preferences;
    } catch (error) {
        console.error('An error occurred while fetching user preferences:', error);
        return null;
    }
};

  
  const addItemToUser = async (foodItemId, userID, type, when) => {
    // Input validation remains the same...

    // Attempt to fetch existing preference
    // Adjusted to check for existing food item preference
    let { data: existingPreference, error: fetchError } = await supabase
        .from('usermealpreferences')
        .select('*')
        .eq('user_id', userID)
        .eq('food_item_id', foodItemId) // Now checking against food_item_id
        .eq('meal_type', type)
        .eq('time_of_week', when)
        .maybeSingle(); // Adjusted method for potential null result without throwing an error

    if (fetchError) {
        console.error('Error fetching user meal preference:', fetchError);
        return null;
    }

    // If no existing preference, insert new
    if (!existingPreference) {
        const { data: insertData, error: insertError } = await supabase
            .from('usermealpreferences')
            .insert([
                { user_id: userID, food_item_id: foodItemId, meal_type: type, time_of_week: when }
            ]);
        if (insertError) {
            console.error('Error inserting user meal preference:', insertError);
            return null;
        }
        return insertData;
    }
    // If existing preference found, consider how to handle (update, ignore, or error out)
    // Handling depends on app logic (e.g., are multiple entries for the same meal type & time allowed?)
};

  

  const addFavorite = async (userId, foodItemId) => {
    return await supabase.from('UserFavorites').insert([{ user_id: userId, food_item_id: foodItemId }]) .select();
  };

  const createGroup = async (name) => {
 
    return await supabase?.from('groups').insert([{  group_name: name, created_by:  user?.id }]) .select();
  };

  const fetchAllGroupsImMemberOf = async (userId) => {
    return await supabase?.from('groupmemberships').select('groups (group_name,group_id)').eq('user_id', userId);
  }

  const fetchAllGroups = async () => {
    return await supabase?.from('groups').select('*');
  }


  const addUserToGroup = async (groupId) => {
    // First, check if the user is already a member of the group
    const { data: existingMembership, error: membershipError } = await supabase
        .from('groupmemberships')
        .select()
        .eq('group_id', groupId)
        .eq('user_id', user?.id)
        .maybeSingle(); // Use maybeSingle() if you expect 0 or 1 record

    // Handle any errors during the check
    if (membershipError) {
        console.error('Error checking group membership:', membershipError);
        return { error: membershipError };
    }

    // If the user is already a member, return or handle as needed
    if (existingMembership) {
        return { error: new Error('User is already a member of the group.') };
    }

    // If the user is not already a member, proceed to add them to the group
    const { data, error } = await supabase
        .from('groupmemberships')
        .insert([{ group_id: groupId, user_id: user?.id }]);

    // Handle any errors during the insert operation
    if (error) {
        console.error('Error adding user to group:', error);
        return { error };
    }

    // Return success data or other confirmation as needed
    return { data, error };
};


  const getGroupRecommendations = async (groupId) => {
    // Implement the logic for group recommendations
  };

  const signInWithGoogle = async () => {
     await supabase.auth.signInWithOAuth({
      provider: 'google',
      
    }).then (data=>{console.log(data);
      let user = fetchUser();
      console.log(user);
      createUser(user?.id);
    }).catch(error=>{console.error(error);});

      
    // createUser(data?.user?.id);
  
    if (error) {
      console.error('Error during sign-in:', error);
      return;
    }
     
    // Handle the user or session info
  };

  const fetchUser = async ()=>{


     const { data: { user } } = await supabase?.auth?.getUser();

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
          fetchUserPreferences,
          fetchUser,
          fetchAllGroupsImMemberOf,
          signOut,
          fetchAllFoodItems,
          fetchAllGroups,
          user}}>
            {children}
        </SupabaseContext.Provider>
    );
};
 

export function useSupabaseContext(){
  return useContext(SupabaseContext);
}
   
