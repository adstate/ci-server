import React, {useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {useHistory} from 'react-router-dom';
import ClassNames from 'classnames';
import {Build, Loader, Button} from 'components';
import {fetchBuilds, buildsUpdateOffset, buildsClearState} from '../../actions/builds';


const BuildList = () => {
    const builds = useSelector(state => state.builds.items);
    const offset = useSelector(state => state.builds.offset);
    const pending = useSelector(state => state.builds.pending);
    const load_more = useSelector(state => state.builds.load_more);
    const init_loaded = useSelector(state => state.builds.init_loaded);

    const dispatch = useDispatch();
    const getBuilds = (params) => dispatch(fetchBuilds(params));
    const updateOffset = (offset) => dispatch(buildsUpdateOffset(offset));
    const clearBuilds = () => dispatch(buildsClearState());
    
    const [limit, setLimit] = useState(10);

    const history = useHistory();

    useEffect(() => {
        if (!init_loaded) {
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
                        (builds.length >= limit && load_more === false) &&
                        <Button className="section__button" size="s" onClick={() => loadMoreBuilds(offset + limit)}>
                            Show more
                        </Button>
                    }

                </div>    
            </div>
        </div>
    );
}

export default BuildList;
