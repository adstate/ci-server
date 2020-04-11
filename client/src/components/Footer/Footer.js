import React from 'react';
import {Link} from 'react-router-dom';
import './Footer.scss';

const Footer = () => {
    return (
        <div className="footer">
            <div className="footer__content">
                <div className="footer__links">
                    <Link className="link" to="#">Support</Link>
                    <Link className="link" to="#">Learning</Link>
                </div>
                <p className="footer__copyright text text_link">© 2020 Your Name</p>
            </div>
        </div>
    )
}

export default Footer;