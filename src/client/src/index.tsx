import * as React from 'react';
import * as ReactDOM from 'react-dom';

import {App} from './components/App';

ReactDOM.render(
    <App age={1} name={'some'} />,
    document.getElementById("root"));