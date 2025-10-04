'use client';
import { setUser } from '@/lib/slices/user';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';
import { updateUserApi } from '../../../services/updateUser';
import { UserState } from '@/types/api/user';

export function useUpdateUser() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  // accept updated user as argument
  const updateUser = async (userToUpdate: UserState) => {
    if (!userToUpdate.id) {
      toast.error('Missing user id');
      return null;
    }

    setLoading(true);

    try {
      // send to server
      const updated = await updateUserApi(userToUpdate);

      // update store with server response
      dispatch(setUser(updated));

      
      toast.success('User updated successfully!');

      return updated;
    } catch (err) {
      toast.error('Failed to update user: ' + (err || 'Unknown error'));
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { updateUser, loading };
}
