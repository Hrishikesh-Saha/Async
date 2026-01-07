"use client"
import React from 'react'
import usePresence from "@convex-dev/presence/react";
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import FacePile from "@convex-dev/presence/facepile";

interface iAppProps  {
    userId : string,
    roomId : string
}

const BlogPresence = (props : iAppProps) => {
    const presenceState = usePresence(api.presence, props.roomId, props.userId)
  return (
    <div className='flex items-center gap-2 h-6'>
        <p className='text-muted-foreground'>Viewing now : </p>
        <div className='text-black'>
            <FacePile presenceState={presenceState ?? []}/>
        </div>
    </div>
  )
}

export default BlogPresence