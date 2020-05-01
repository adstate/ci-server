import React from 'react';
import {useHistory} from 'react-router-dom';
import { History } from 'history';
import './Header.scss';

interface HeaderProps {
    title: string;
}

const Header: React.FC<HeaderProps> = (props) => {
    const history: History = useHistory();
    const linkClickHandler = () => history.push('/');

    return (
        <div className="header">
            <div className="header__content">
                <h1 className="header__title text text_link" onClick={linkClickHandler}>{props.title}</h1>
                {props.children}
            </div>
        </div>
    )
}


export default Header;
