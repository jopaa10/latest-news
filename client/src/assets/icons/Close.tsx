export const Close = ({ fill = "red" }: { fill?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      aria-hidden="true"
      role="img"
      fill={fill ? fill : `currentColor`}
    >
      <path
        d="M6 18L18 6M6 6l12 12"
        stroke={fill}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
};
