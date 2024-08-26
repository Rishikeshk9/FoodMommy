'use client';
import { createContext, useCallback, useMemo, useContext } from 'react';
import { getFoodItems } from '../../_actions/postAction';
import { getUserItems, updateUserPreferences } from '../../_actions/userAction';
import { getGroupItems, getGroupById } from '../../_actions/groupAction';
import { getVoteItems, getVotesByGroup } from '../../_actions/voteAction';
import { useSession } from 'next-auth/react';

export const AppContext = createContext(null);

export default function GlobalStore({ children }) {
  const { data: session } = useSession();

  const fetchFoodItems = useCallback(async (id) => {
    console.log('FETCHING FOOD ITEMS');
    const data = await getFoodItems(id);
    console.log(data);
    return data;
  }, []);

  const fetchUserItems = useCallback(async (id) => {
    console.log('FETCHING USER ITEMS');
    const data = await getUserItems(id);
    console.log(data);
    return data;
  }, []);

  const fetchGroupItems = useCallback(async () => {
    console.log('FETCHING GROUP ITEMS');
    const data = await getGroupItems();
    console.log(typeof data);
    return data;
  }, []);

  const fetchVoteItems = useCallback(async () => {
    console.log('FETCHING VOTE ITEMS');
    return await getVoteItems();
  }, []);

  const fetchGroupById = useCallback(async (groupId) => {
    console.log('FETCHING GROUP BY ID');
    return await getGroupById(groupId);
  }, []);

  const fetchVotesByGroup = useCallback(async (groupId) => {
    console.log('FETCHING VOTES BY GROUP');
    const data = await getVotesByGroup(groupId);
    console.log(data);
    return data;
  }, []);

  const saveUserPreferences = useCallback(async (userId, preferences) => {
    try {
      const result = await updateUserPreferences(userId, preferences);
      console.log('User preferences saved:', result);
      console.log('SAVING USER PREFERENCES');
      return result;
    } catch (error) {
      console.error('Error saving user preferences:', error);
      throw error;
    }
  }, []);

  const contextValue = useMemo(
    () => ({
      session,
      fetchFoodItems,
      fetchUserItems,
      fetchGroupItems,
      fetchVoteItems,
      fetchGroupById,
      fetchVotesByGroup,
      saveUserPreferences,
    }),
    [
      session,
      fetchFoodItems,
      fetchUserItems,
      fetchGroupItems,
      fetchVoteItems,
      fetchGroupById,
      fetchVotesByGroup,
      saveUserPreferences,
    ]
  );

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
}

export function useGlobalContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useGlobalContext must be used within a GlobalStore');
  }
  return context;
}
