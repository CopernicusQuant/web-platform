import type React from "react";

export default function CandleIcon({ ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M7 7v4" />
      <rect width="4" height="7" x="5" y="11" rx="1" />
      <path d="M7 18v2" />
      <path d="M15 5v2" />
      <rect width="4" height="8" x="13" y="7" rx="1" />
      <path d="M15 15v3" />
    </svg>
  );
}
