const LoadingDots = () => {
  return (
    <div className="text-center text-lg font-medium text-gray-300 flex items-center justify-center">
      Loading
      <span className="ml-1 animate-bounce [animation-delay:0s]">.</span>
      <span className="ml-1 animate-bounce [animation-delay:0.1s]">.</span>
      <span className="ml-1 animate-bounce [animation-delay:0.2s]">.</span>
    </div>
  );
};

export default LoadingDots;
