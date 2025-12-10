import { Skeleton } from "@/components/ui/skeleton";

export const TeamMemberSkeleton = () => (
  <div className="bg-card rounded-xl overflow-hidden shadow-md">
    <Skeleton className="aspect-square w-full" />
    <div className="p-6 space-y-3">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-4 w-full" />
    </div>
  </div>
);

export const TimelineSkeleton = () => (
  <div className="flex flex-col lg:flex-row items-center gap-8">
    <div className="flex-1">
      <div className="bg-card rounded-xl p-6 shadow-md space-y-3">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
    <Skeleton className="w-12 h-12 rounded-full" />
    <div className="flex-1 hidden lg:block" />
  </div>
);

export const ContentSkeleton = () => (
  <div className="glass rounded-2xl p-8 space-y-4">
    <Skeleton className="h-12 w-12 rounded-lg" />
    <Skeleton className="h-8 w-1/3" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-2/3" />
  </div>
);
