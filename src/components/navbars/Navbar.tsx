import { useLocation } from "react-router-dom";
import DocumentToolbarNav from "./DocumentToolbarNav";
import RegularNavbar from "./RegularNav";
import FixedNavbar from "./FixedNavbar";

const Navbar: React.FC = () => {
  const location = useLocation();

  switch (true) { // Switch on true to allow for conditional checks
    case location.pathname.includes('/document/'):
      return <DocumentToolbarNav />;
    case location.pathname == '/math-app' || location.pathname.includes('/math-app/bank'):
      return <FixedNavbar />;
    default:
      return <RegularNavbar />;
  }
};

export default Navbar;
