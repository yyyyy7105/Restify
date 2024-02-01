import { BsFillCCircleFill } from 'react-icons/bs';

function Footer() {
    return (
        <footer>
            <p className="text-center fixed-bottom footer-head mb-0" style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                <BsFillCCircleFill className='me-1' />2023 Copyright: Group-2239
            </p>
        </footer>
    );
}

export default Footer;