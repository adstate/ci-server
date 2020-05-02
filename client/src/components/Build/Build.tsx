import React from 'react';
import ClassNames from 'classnames';
import {format} from 'date-fns';
import {ru} from 'date-fns/locale'
import './Build.scss';
import {Icon} from 'components';
import {BuildModel} from '../../../../webserver/src/models';

interface BuildProps {
    data: BuildModel;
    detailed?: boolean;
    onClick?: (data: any) => void;
}

const Build: React.FC<BuildProps> = ({data, detailed, onClick}) => {
    const buildClass: string = ClassNames(
        'build',
        {
            'build_view_details': detailed,
            'build_status_waiting': ['Waiting', 'InProgress'].includes(data.status),
            'build_status_error': ['Fail'].includes(data.status),
        }
    );

    const clickHandler = () => {
        if (onClick) {
            onClick(data);
        }
    }

    return (
        <div className={buildClass} data-id={data.id} onClick={clickHandler}>
            <div className="build__status">
                <Icon className="build__status-icon" type={data.status.toLowerCase()} size="m"/>
            </div>
            
            <div className="build__detail">
                <div className="build__content">
                    <div className="build__header">
                        <p className="build__number">#{data.buildNumber}</p>
                        <p className="build__title">{data.commitMessage}</p>
                    </div>
                    <div className="build__commit">
                        <div className="build__branch icon-text">
                            <Icon className="icon-text__icon icon-text__icon_indent-r_xs" type="commit" size="s" pseudo/>
                            <div className="icon-text__text icon-text__text_size_m">
                                <span className="build__branch-name text text_primary">{data.branchName}</span>
                                <span className="build__branch-commit text text_secondary">{data.commitHash}</span>
                            </div>
                        </div>
                        <div className="build__author icon-text">
                            <Icon className="icon-text__icon icon-text__icon_indent-r_xs" type="person" size="s" pseudo/>
                            <span className="icon-text__text icon-text__text_size_m">{data.authorName}</span>
                        </div>    
                    </div>
                </div>
            
                <div className="build__time">
                        <div className="build__datetime icon-text">
                            <Icon className="icon-text__icon icon-text__icon_indent-r_xs" type="date" size="s" pseudo/>
                            <span className="icon-text__text icon-text__text_nowrap text_pseudo">
                                { data.start ?
                                    format(new Date(data.start), 'dd MMM hh:mm', { locale: ru })
                                    : '-'
                                }
                            </span>
                        </div>
                
                    <div className="build__timer icon-text">
                        <Icon className="icon-text__icon icon-text__icon_indent-r_xs" type="timer" size="s" pseudo/>
                        <span className="icon-text__text icon-text__text_nowrap text text_pseudo">{data.duration || '-'}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Build;
