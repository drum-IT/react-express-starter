import React, { Component } from "react";
import { Route, Redirect } from "react-router-dom";

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      props.match.params.token && props.match.params.email ? (
        <Component {...props} />
      ) : (
        <Redirect to="/login" />
      )
    }
  />
);

// class PrivateRoute extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       auth: false
//     };
//   }
//   render() {
//     return (
//       <Route
//         {...this.props}
//         render={props =>
//           this.state.auth === true ? (
//             <Component {...props} />
//           ) : (
//             <Redirect to="/login" />
//           )
//         }
//       />
//     );
//   }
// }

export default PrivateRoute;
