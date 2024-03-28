interface GridContainer3x3Props {
  children: React.ReactNode;
}

function GridContainer3x3({ children }: GridContainer3x3Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4 p-4">
      {children}
    </div>
  );
}

export default GridContainer3x3;