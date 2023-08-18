import { useLocation } from "react-router-dom";
import DocumentToolbarNav from "./DocumentToolbarNav";
import RegularNavbar from "./RegularNav";

const Navbar: React.FC = () => {
  const location = useLocation();

  switch (true) { // Switch on true to allow for conditional checks
    case location.pathname.includes('/document/'):
      return <DocumentToolbarNav />;
    default:
      return <RegularNavbar />;
  }
};

export default Navbar;
