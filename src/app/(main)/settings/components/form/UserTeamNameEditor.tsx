'use client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useUpdateUser } from '@/lib/hooks/useUpdateUser';
import { setUser } from '@/lib/slices/user';
import { RootState } from '@/lib/store';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, SaveAllIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { z } from 'zod';

const teamNameSchema = z.object({
  team_name: z.string().min(1, { message: "Team name is required" }),
});

type TeamNameFormValues = z.infer<typeof teamNameSchema>;

export default function TeamNameEditor() {
  const currentUser = useSelector((state: RootState) => state.currentUser);
  const dispatch = useDispatch();
  const { updateUser, loading } = useUpdateUser();

  const form = useForm<TeamNameFormValues>({
    resolver: zodResolver(teamNameSchema),
    defaultValues: {
      team_name: currentUser?.team_name || '',
    },
  });

  const onSubmit = async (values: TeamNameFormValues) => {
    if (!currentUser?.id) {
      toast.error("Missing user ID");
      return;
    }

    try {
      const updatedUser = {
        ...currentUser,
        team_name: values.team_name,
      };

      await updateUser(updatedUser);
      dispatch(setUser(updatedUser));
      toast.success("Team name updated!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save team name");
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4 w-full"
      >
        <FormField
          control={form.control}
          name="team_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Team Name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Enter your team name"
                  className="w-full rounded border-b-2 border-t-none border-x-none outline-none shadow-none"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={loading}
          className="flex items-center justify-center gap-2 rounded-full w-full"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <SaveAllIcon />
              Save My Details
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
