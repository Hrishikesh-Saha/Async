import React from "react";
import { Skeleton } from "../ui/skeleton";

const LoadingBlogsSkeleton = () => {
  return (
    <div className="grid grid-cols-3 gap-6">
      <div className="flex flex-col space-y-3">
        <Skeleton className="h-48 w-full rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
      <div className="flex flex-col space-y-3">
        <Skeleton className="h-48 w-full rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-62.5" />
          <Skeleton className="h-4 w-50" />
        </div>
      </div>
      <div className="flex flex-col space-y-3">
        <Skeleton className="h-48 w-full rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-62.5" />
          <Skeleton className="h-4 w-50" />
        </div>
      </div>
    </div>
  );
};

export default LoadingBlogsSkeleton;
