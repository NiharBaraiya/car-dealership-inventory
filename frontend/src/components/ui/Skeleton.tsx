export const Skeleton = ({ className = '' }: { className?: string }) => {
  return <div className={`skeleton ${className}`} aria-hidden="true" />;
};

export const VehicleCardSkeleton = () => {
  return (
    <div className="vehicle-card vehicle-card-skeleton">
      <Skeleton className="skeleton-image" />
      <div className="vehicle-card-content">
        <Skeleton className="skeleton-title" />
        <Skeleton className="skeleton-text" />
        <Skeleton className="skeleton-price" />
        <Skeleton className="skeleton-button" />
      </div>
    </div>
  );
};
