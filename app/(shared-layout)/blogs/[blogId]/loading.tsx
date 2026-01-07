import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

const loading = () => {
  return (
    <div className='max-w-3xl mx-auto py-8 px-4'>
        <Skeleton className='w-24 h-10 mb-10'/>
        <Skeleton className='w-full h-110 rounded-xl mb-8'/>

        <div className='space-y-4'>
            <Skeleton className='w-3/4 h-12'/>
            <Skeleton className='w-32 h-4'/>
        </div>

        <div className='mt-8 space-y-2'>
            <Skeleton className='w-full h-4'/>
            <Skeleton className='w-full h-4'/>
            <Skeleton className='w-2/3 h-4'/>
        </div>
    </div>
  )
}

export default loading