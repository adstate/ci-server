import React from 'react';
import PropTypes from 'prop-types';
import ClassNames from 'classnames';
import { format, formatDistance, formatRelative, subDays } from 'date-fns';
import { ru } from 'date-fns/locale'

import './Build.scss';
import {Icon} from 'components';


const Build = ({data, detailed, status}) => {

    const buildClass = ClassNames(
        'build',
        {
            'build_view_details': detailed,
            'build_status_waiting': ['Waiting', 'InProgress'].includes(data.status),
            'build_status_error': ['Fail'].includes(data.status),
        }
    );

    return (
        <div className={buildClass} data-id={data.id}>
            <div className="build__status">
                <Icon className="build__status-icon" type={data.status.toLowerCase()} size="m" />
            </div>
            
            <div className="build__detail">
                <div className="build__content">
                    <div className="build__header">
                        <p className="build__number">#{data.buildNumber}</p>
                        <p className="build__title">{data.commitMessage}</p>
                    </div>
                    <div className="build__commit">
                        <div className="build__branch icon-text">
                            <span className="icon icon_size_s icon_type_commit icon_pseudo icon-text__icon icon-text__icon_indent-r_xs"></span>
                            <div className="icon-text__text icon-text__text_size_m">
                                <span className="build__branch-name text text_primary">{data.branchName}</span>
                                <span className="build__branch-commit text text_secondary">{data.commitHash}</span>
                            </div>
                        </div>
                        <div className="build__author icon-text">
                            <span className="icon icon_size_s icon_type_person icon_pseudo icon-text__icon icon-text__icon_indent-r_xs"></span>
                            <span className="icon-text__text icon-text__text_size_m">{data.authorName}</span>
                        </div>    
                    </div>
                </div>
            
                <div className="build__time">
                        <div className="build__datetime icon-text">
                            <span className="icon icon_pseudo icon_type_date icon_size_s  icon-text__icon_indent-r_xs"></span>
                            <span className="icon-text__text icon-text__text_nowrap text_pseudo">
                                { data.start ?
                                    format(new Date(data.start), 'dd MMM hh:mm', { locale: ru })
                                    : '-'
                                }
                            </span>
                        </div>
                
                    <div className="build__timer icon-text">
                        <span className="icon icon_pseudo icon_type_timer icon_size_s icon-text__icon icon-text__icon_indent-r_xs"></span>
                        <span className="icon-text__text icon-text__text_nowrap text text_pseudo">{data.duration || '-'}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

Build.propTypes = {
    status: PropTypes.string,
    detailed: PropTypes.bool
}

Build.defaultProps = {
    status: 'success',
    detailed: false
}

export default Build;