export function EchoMark({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      aria-hidden="true"
      fill="none"
    >
      <rect width="32" height="32" fill="currentColor" className="text-foreground" />
      <g stroke="#00a8c8" strokeWidth="1.4" strokeLinecap="square">
        <path d="M12 10.6a6.4 6.4 0 0 1 0 10.8" />
        <path d="M9 7.4a10.6 10.6 0 0 1 0 17.2" />
      </g>
      <rect x="18.4" y="14.4" width="3.2" height="3.2" fill="#eef6f8" />
    </svg>
  );
}
