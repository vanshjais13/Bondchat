import { Users, Search } from "lucide-react";

const SidebarSkeleton = () => {
  // Create 8 skeleton items
  const skeletonContacts = Array(8).fill(null);

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col bg-gradient-to-b from-base-100/80 to-base-100/60 backdrop-blur-xl shadow-lg transition-all duration-300">
      {/* Header */}
      <div className="border-b border-base-300 w-full p-5 bg-base-100/90">
        <div className="flex items-center gap-2">
          <Users className="w-6 h-6 text-primary animate-pulse drop-shadow-lg" />
          <span className="font-semibold hidden lg:block tracking-wide text-primary">
            Contacts
          </span>
        </div>
      </div>

      {/* Search Bar Skeleton */}
      <div className="px-3 py-3 border-b border-base-300/50">
        <div className="flex items-center gap-2 bg-base-200/50 rounded-full px-3 py-2 relative overflow-hidden">
          <Search className="w-4 h-4 text-base-400 animate-pulse" />
          <div className="skeleton h-4 flex-1 rounded bg-base-300/40 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent animate-[shimmer_1.2s_infinite]" />
          </div>
        </div>
      </div>

      {/* Skeleton Contacts */}
      <div className="overflow-y-auto w-full py-3 space-y-3 scrollbar-thin scrollbar-thumb-primary/30 hover:scrollbar-thumb-primary/50 scrollbar-track-transparent px-2">
        {skeletonContacts.map((_, idx) => (
          <div
            key={idx}
            className="w-full px-3 py-2 flex items-center gap-3 rounded-xl hover:bg-base-200/30 transition-all duration-200 relative overflow-hidden opacity-0 animate-[fadeIn_0.5s_ease-out_forwards]"
            style={{ animationDelay: `${idx * 0.08}s` }}
          >
            {/* Avatar skeleton with online indicator */}
            <div className="relative mx-auto lg:mx-0">
              <div className="skeleton size-12 rounded-full bg-base-200 shadow-inner relative overflow-hidden animate-pulse">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_1.5s_infinite]" />
                {/* Online status skeleton */}
                <div className="absolute bottom-0 right-0 size-3 bg-green-400 rounded-full border-2 border-base-100 animate-pulse shadow-sm"></div>
              </div>
            </div>

            {/* User info skeleton */}
            <div className="hidden lg:block text-left min-w-0 flex-1">
              <div className="skeleton h-4 w-28 mb-2 rounded bg-base-200 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_1.8s_infinite]" />
              </div>
              <div className="skeleton h-3 w-20 rounded bg-base-200 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_2s_infinite]" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default SidebarSkeleton;
