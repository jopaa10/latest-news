export const BookmarkBorder = ({ size }: { size: string | number }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 2c-1.1 0-2 .9-2 2v18l8-4 8 4V4c0-1.1-.9-2-2-2H6z" />
    </svg>
  );
};
