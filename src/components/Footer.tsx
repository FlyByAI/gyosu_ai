import { Link } from 'react-router-dom';

const Footer = () => {
    const year = new Date().getFullYear();

    return (
        <div className="mt-2 py-4 text-center border-t dark:border-gray-700">
            <p className="dark:text-white">© {year} Gyosu </p>
            <p>
                <Link to="/privacy" className="dark:text-white">Privacy Policy</Link>
                {" | "}
                <Link to="/terms" className="dark:text-white">Terms of Use</Link>
                {" | "}
                <Link to="/attributions" className="dark:text-white">Attributions</Link>
            </p>
        </div>
    );
};

export default Footer;
