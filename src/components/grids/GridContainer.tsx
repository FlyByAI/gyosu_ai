interface GridContainerProps {
  left: React.ReactNode;
  right: React.ReactNode;
}


function GridContainer({ left, right }: GridContainerProps) {
  return (
    <div className="grid grid-cols-5 gap-4 py-4">
      <div className="col-span-3 flex flex-col space-y-4">
        {left}
      </div>
      <div className="col-span-2 flex flex-col space-y-4">
        {right}
      </div>
    </div>
  );
}

export default GridContainer;
