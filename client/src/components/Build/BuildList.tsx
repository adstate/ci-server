import React, {useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {useHistory} from 'react-router-dom';
import {History} from 'history';
import {Build, Loader, Button} from 'components';
import {fetchBuilds, buildsClearState} from '../../actions/builds';


const BuildList: React.FC = () => {
    const {
        items: builds,
        offset,
        limit,
        pending,
        load_more,
        init_loaded,
      } = useSelector((state: any) => state.builds);

    const dispatch = useDispatch();
    const history: History = useHistory();

    useEffect(() => {
        if (!init_loaded) {
            dispatch(buildsClearState());
            dispatch(fetchBuilds({offset: offset, limit: limit}));
        }
    }, []);
    
    if (pending !== false && offset === 0) {
        return <Loader/>;
    }

    const buildClickHandler = (build: any) => {
        history.push(`/build/${build.id}`);
    }

    const loadMoreBuilds = () => {
        dispatch(fetchBuilds({offset: offset + limit, limit: limit}));
    }

    return (
        <div className="section">
            <div className="layout__container">
                {
                    builds.map((build: any) => {
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
