import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {useHistory} from 'react-router-dom';
import PropTypes from 'prop-types';
import ClassNames from 'classnames';
import {Build, Loader, Button} from 'components';
import {fetchBuilds, buildsUpdateOffset, buildsClearState} from '../../actions/builds';


const BuildList = ({builds, getBuilds, pending, offset, load_more, updateOffset, clearBuilds}) => {

    const [limit, setLimit] = useState(10);

    const history = useHistory();

    useEffect(() => {
        if (builds.length <= 2) {
            clearBuilds();
            getBuilds({offset: offset, limit: limit});
        }
    }, []);

    if (pending !== false && offset === 0) {
        return <Loader/>;
    }

    const clickHandler = (event) => {  
        if (event.target.closest('.build')) {
            const buildId = event.target.closest('.build').dataset.id;
            history.push(`/build/${buildId}`);
        }
    }

    const loadMoreBuilds = (offset) => {
        updateOffset(offset);
        getBuilds({offset: offset, limit: limit});
    }

    return (
        <div className="section">
            <div className="layout__container" onClick={clickHandler}>
                {
                    builds.map(build => {
                        return <Build key={build.buildNumber} data={build}></Build>
                    })
                }

                <div className="section__footer section__footer_align_left">
                    {
                        (builds.length >= limit && load_more === false) ?
                        <Button className="section__button" size="s" onClick={() => loadMoreBuilds(offset + limit)}>
                            Show more
                        </Button>
                        : null
                    }

                </div>    
            </div>
        </div>
    );
}

const mapStateToProps = state => ({
    builds: state.builds.items,
    offset: state.builds.offset,
    pending: state.builds.pending,
    load_more: state.builds.load_more
});
  
const mapDispatchToProps = dispatch => ({
    getBuilds: (params) => dispatch(fetchBuilds(params)),
    updateOffset: (offset) => dispatch(buildsUpdateOffset(offset)),
    clearBuilds: () => dispatch(buildsClearState())
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(BuildList);
