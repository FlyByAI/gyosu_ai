import { Link } from 'react-router-dom';

const Footer = () => {
    const year = new Date().getFullYear();

    return (
        <div className="mt-2 py-4 text-center border-t">
            <p className="">© {year} Gyosu </p>
            <p>
                <Link to="/privacy" className="">Privacy Policy</Link>
                {" | "}
                <Link to="/terms" className="">Terms of Use</Link>
                {" | "}
                <Link to="/attributions" className="">Attributions</Link>
            </p>
        </div>
    );
};

export default Footer;
