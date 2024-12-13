interface ScrollAreaProps {
  children: React.ReactNode;
  className?: string;
  maxHeight?: string;
}

export const ScrollArea = ({
  children,
  className = "",
  maxHeight = "80vh",
}: ScrollAreaProps) => {
  return (
    <div
      className={`relative overflow-auto ${className}`}
      style={{ maxHeight }}
    >
      <div
        className={`
          scrollbar-apple
          [&::-webkit-scrollbar]:w-2
          [&::-webkit-scrollbar-track]:bg-transparent
          [&::-webkit-scrollbar-thumb]:rounded-full
          [&::-webkit-scrollbar]:hidden
          hover:[&::-webkit-scrollbar]:block
          pr-2
        `}
      >
        {children}
      </div>
    </div>
  );
};
