export const Bookmark = ({ size }: { size: number | string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M6 2C4.9 2 4 2.9 4 4v18l8-4 8 4V4c0-1.1-.9-2-2-2H6z" />
    </svg>
  );
};
