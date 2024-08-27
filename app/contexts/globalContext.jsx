'use client';
import {
  createContext,
  useCallback,
  useMemo,
  useContext,
  useState,
} from 'react';
import { getFoodItems } from '../../_actions/postAction';
import { getUserItems, updateUserPreferences } from '../../_actions/userAction';
import { getGroupItems, getGroupById } from '../../_actions/groupAction';
import { getVoteItems, getVotesByGroup } from '../../_actions/voteAction';
import { useSession } from 'next-auth/react';

export const AppContext = createContext(null);

export default function GlobalStore({ children }) {
  const { data: session } = useSession();
  const [userData, setUserData] = useState();
  const [groupItems, setGroupItems] = useState();
  const [foodItems, setFoodItems] = useState();
  const [voteItems, setVoteItems] = useState();

  const fetchFoodItems = useCallback(async (id) => {
    console.log('FETCHING FOOD ITEMS');
    const data = await getFoodItems(id);
    setFoodItems(data);
    console.log(data);
    return data;
  }, []);

  const fetchUserItems = useCallback(async (id) => {
    console.log('FETCHING USER ITEMS');
    const data = await getUserItems(id);
    setUserData(data);
    console.log(data);
    return data;
  }, []);

  const fetchGroupItems = useCallback(async (ids) => {
    console.log('FETCHING GROUP ITEMS');
    const data = await getGroupItems(ids);
    setGroupItems(data);
    console.log(data);
    return data;
  }, []);

  const fetchVoteItems = useCallback(async () => {
    console.log('FETCHING VOTE ITEMS');
    const data = await getVoteItems();
    setVoteItems(data);
    console.log(data);
    return data;
  }, []);

  const fetchGroupById = useCallback(async (groupId) => {
    console.log('FETCHING GROUP BY ID');
    return await getGroupById(groupId);
  }, []);

  const fetchVotesByGroup = useCallback(async (groupId) => {
    console.log('FETCHING VOTES BY GROUP');
    const data = await getVotesByGroup(groupId);
    setVoteItems(data);
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
      userData,
      groupItems,
      foodItems,
      voteItems,
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
      userData,
      groupItems,
      foodItems,
      voteItems,
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
