import { Link } from 'react-router-dom';

const Footer = () => {
    const year = new Date().getFullYear();

    return (
        <div className="mt-2 py-4 text-center border-t dark:border-gray-700">
            <p className="dark:text-gray-300">© {year} Gyosu </p>
            <p>
                <Link to="/privacy" className="dark:text-gray-300">Privacy Policy</Link>
                {" | "}
                <Link to="/terms" className="dark:text-gray-300">Terms of Use</Link>
                {" | "}
                <Link to="/attributions" className="dark:text-gray-300">Attributions</Link>
            </p>
        </div>
    );
};

export default Footer;
