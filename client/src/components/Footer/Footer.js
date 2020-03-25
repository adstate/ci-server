import React from 'react';
import './Footer.scss';

import Link from '../Link/Link';

const Footer = () => {
    return (
        <div className="footer">
            <div className="footer__content">
                <div className="footer__links">
                    <Link href="#">Support</Link>
                    <Link href="#">Learning</Link>
                </div>
                <p className="footer__copyright text text_link">© 2020 Your Name</p>
            </div>
        </div>
    )
}

export default Footer;