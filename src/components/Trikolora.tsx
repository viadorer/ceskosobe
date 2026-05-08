export function Trikolora() {
  return (
    <div className="flex items-center space-x-1">
      <div className="w-12 h-[2px] bg-cz-bg" />
      <div className="w-12 h-[2px] bg-cz-blue" />
      <div className="w-12 h-[2px] bg-cz-red" />
    </div>
  );
}

export function TrikoloraCentered() {
  return (
    <div className="flex items-center justify-center space-x-1">
      <div className="w-12 h-[2px] bg-gray-100" />
      <div className="w-12 h-[2px] bg-cz-blue" />
      <div className="w-12 h-[2px] bg-cz-red" />
    </div>
  );
}
