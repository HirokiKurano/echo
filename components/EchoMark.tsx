export function EchoMark({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    >
      <path d="M14 11.2a6.2 6.2 0 0 1 0 9.6" />
      <path d="M11.2 8.2a10.4 10.4 0 0 1 0 15.6" />
      <path d="M8.4 5.4a14.4 14.4 0 0 1 0 21.2" />
      <circle cx="19.4" cy="16" r="2.1" fill="currentColor" stroke="none" />
    </svg>
  );
}
