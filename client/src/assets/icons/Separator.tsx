function Separator({ size }: { size: number | string }) {
  return (
    <svg
      width={size}
      height="1"
      viewBox={`0 0 1095 1`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        opacity="0.1"
        d="M0.5 0.5H1094.5"
        stroke="#979797"
        strokeLinecap="square"
      />
    </svg>
  );
}

export default Separator;
