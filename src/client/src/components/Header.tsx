import * as React from 'react';
import {Link} from 'react-router-dom';

export const Header = () =>{
    return(
       <div className="header">
           <h2 className="ui center aligned icon header">
               <i className="angle double down icon"></i>
               <Link to="/">Packages Info</Link>
               <div className="sub header">Shows installed packages from Status.real file</div>
           </h2>
       </div>
    );
};
