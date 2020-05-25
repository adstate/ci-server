import React from 'react';
import {Link} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import './Footer.scss';

const Footer: React.FC = () => {
    const { t } = useTranslation();

    return (
        <div className="footer">
            <div className="footer__content">
                <div className="footer__links">
                    <Link className="link" to="#">{t('footer.support')}</Link>
                    <Link className="link" to="#">{t('footer.learning')}</Link>
                </div>
                <p className="footer__copyright text text_link">© {t('footer.copyright')}</p>
            </div>
        </div>
    )
}

export default Footer;
