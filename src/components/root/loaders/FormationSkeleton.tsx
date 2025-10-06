import Loading from '@/app/(main)/loading'
import { Skeleton } from '@/components/ui/skeleton'
import Image from 'next/image'
import React from 'react'
function FormationSkeleton() {
  return (
    <div className='w-full h-full flex justify-center items-center p-24'>
      <Image
      src={'/loaders/tactics_loader.gif'}
      width={300}
      height={300}
      alt='tactics_loader'
      className='rotate-45'
      />
    </div>
  )
}

export default FormationSkeleton
