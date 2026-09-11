export function SparkMark({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      aria-hidden="true"
      fill="currentColor"
    >
      <path d="M16 2.2 17.35 14.4 29.8 16 17.35 17.6 16 29.8 14.65 17.6 2.2 16 14.65 14.4Z" />
    </svg>
  );
}