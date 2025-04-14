export const Eye = ({ size }: { size: number | string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height={size}
      width={size}
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M12 4.5C7 4.5 2.73 8.11 1 12c1.73 3.89 6 7.5 11 7.5s9.27-3.61 11-7.5C21.27 8.11 17 4.5 12 4.5zm0 12c-2.49 0-4.5-2.01-4.5-4.5S9.51 7.5 12 7.5 16.5 9.51 16.5 12 14.49 16.5 12 16.5zm0-7c-1.38 0-2.5 1.12-2.5 2.5S10.62 14.5 12 14.5s2.5-1.12 2.5-2.5S13.38 9.5 12 9.5z" />
    </svg>
  );
};
