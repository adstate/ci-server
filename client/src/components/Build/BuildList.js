import React, {useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {useHistory} from 'react-router-dom';
import {Build, Loader, Button} from 'components';
import {fetchBuilds, buildsClearState} from '../../actions/builds';


const BuildList = () => {
    const {
        items: builds,
        offset,
        limit,
        pending,
        load_more,
        init_loaded,
      } = useSelector(state => state.builds);

    const dispatch = useDispatch();
    const history = useHistory();

    useEffect(() => {
        if (!init_loaded) {
            dispatch(buildsClearState());
            dispatch(fetchBuilds({offset: offset, limit: limit}));
        }
    }, []);
    
    if (pending !== false && offset === 0) {
        return <Loader/>;
    }

    const buildClickHandler = (build) => {
        history.push(`/build/${build.id}`);
    }

    const loadMoreBuilds = () => {
        dispatch(fetchBuilds({offset: offset + limit, limit: limit}));
    }

    return (
        <div className="section">
            <div className="layout__container">
                {
                    builds.map(build => {
                        return <Build key={build.buildNumber} data={build} onClick={buildClickHandler}></Build>
                    })
                }

                <div className="section__footer section__footer_align_left">
                    {
                        (builds.length >= limit && load_more === false) &&
                        <Button className="section__button" size="s" onClick={loadMoreBuilds}>
                            Show more
                        </Button>
                    }

                </div>    
            </div>
        </div>
    );
}

export default BuildList;
