import React from 'react';
import {Link} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import './Footer.scss';

const Footer: React.FC = () => {
    const { t, i18n } = useTranslation();

    const changeLanguage = (lng: string) => {
      i18n.changeLanguage(lng);
    };

    return (
        <div className="footer">
            <div className="footer__content">
                <div className="footer__links">
                    <Link className="link" to="#">{t('footer.support')}</Link>
                    <Link className="link" to="#">{t('footer.learning')}</Link>
                    { i18n.language == 'en' && <Link className="link" to="#" onClick={() => changeLanguage('ru')}>Русская версия</Link>}
                    { i18n.language == 'ru' && <Link className="link" to="#" onClick={() => changeLanguage('en')}>English version</Link>}
                </div>
                <p className="footer__copyright text text_link">© {t('footer.copyright')}</p>
            </div>
        </div>
    )
}

export default Footer;
