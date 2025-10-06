'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUpdateUser } from '@/lib/hooks/useUpdateUser';
import { setUser } from '@/lib/slices/user';
import { RootState } from '@/lib/store';
import Image from 'next/image';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { avatarSeeds, avatarStyles } from '../utils/contants';

function generateAvatarUrl(seed: string, style: string) {
  return `https://api.dicebear.com/7.x/${style}/png?seed=${seed}`;
}

export default function AvatarEditor() {
  const user = useSelector((state: RootState) => state.currentUser);
  const dispatch = useDispatch();
  const { updateUser, loading } = useUpdateUser();

  const [selected, setSelected] = useState<{ style: string; seed: string } | null>(
    user.picture
      ? { style: avatarStyles[0], seed: user.picture.split('seed=')[1] } // naive extraction
      : null
  );

  const handleSelect = (style: string, seed: string) => {
    const url = generateAvatarUrl(seed, style);
    setSelected({ style, seed });
    dispatch(setUser({ ...user, picture: url })); // live store update
  };

  const handleSave = async () => {
    if (!user?.id) {
      toast.error('Missing user ID');
      return;
    }

    try {
      await updateUser(user); // send full user object with updated picture
      toast.success('Avatar saved successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to save avatar');
    }
  };

  const currentAvatarUrl = user.picture


  return (
    <div className="flex flex-col gap-4">
      {/* Avatar Picker */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="icon" className="flex items-center gap-2 bg-transparent border-none -sahdow-none">
            <Avatar className="w-12 h-12">
              {currentAvatarUrl ? (
                <AvatarImage src={currentAvatarUrl} alt={`${user.name}_avatar`} />
              ) : (
                <AvatarFallback>{user.name?.[0]}</AvatarFallback>
              )}
            </Avatar>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-2">
          <Tabs defaultValue={selected?.style || avatarStyles[0]} className="w-full">
            <TabsList className="grid grid-cols-4 gap-1 w-full">
              {avatarStyles.map(style => (
                <TabsTrigger key={style} value={style}>
                  {style}
                </TabsTrigger>
              ))}
            </TabsList>

            {avatarStyles.map(style => (
              <TabsContent key={style} value={style}>
                <ScrollArea className="h-72">
                  <div className="grid grid-cols-5 gap-2 p-1">
                    {avatarSeeds.map(seed => {
                      const isSelected = selected?.style === style && selected?.seed === seed;
                      return (
                        <button
                          key={seed}
                          type="button"
                          className={`rounded-full border-2 hover:border-primary ${isSelected ? 'border-primary' : 'border-transparent'
                            }`}
                          onClick={() => handleSelect(style, seed)}
                        >
                          <Image
                            width={40}
                            height={40}
                            src={generateAvatarUrl(seed, style)}
                            alt={seed}
                            className="w-16 h-16 rounded-full"
                          />
                        </button>
                      );
                    })}
                  </div>
                </ScrollArea>
              </TabsContent>
            ))}
          </Tabs>
        </PopoverContent>
      </Popover>

    </div>
  );
}
