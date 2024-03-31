import { useLocation } from "react-router-dom";
import ChatNavbar from "./ChatNavbar";
import FixedNavbar from "./FixedNavbar";
import ProblemSearchNavbar from "./ProblemSearchNavbar";
import RegularNavbar from "./RegularNav";

const Navbar: React.FC = () => {
  const location = useLocation();

  switch (true) { // Switch on true to allow for conditional checks
    case location.pathname.includes('math-app/chat'):
      return <ChatNavbar />;
    case location.pathname == '/math-app/search':
      return <ProblemSearchNavbar />
    case location.pathname.includes('/math-app'):
      return <FixedNavbar />;
    default:
      return <RegularNavbar />;
  }
};

export default Navbar;
