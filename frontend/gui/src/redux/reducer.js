import {combineReducers} from 'redux';

import user from './reducers/user';
import page from './reducers/page';
import files from './reducers/file'
import titulation from './reducers/process-titualtion';

const rootReducer = combineReducers({
    user,
    page,
    files,
    titulation,
});

export default rootReducer;