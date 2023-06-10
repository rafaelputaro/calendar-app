import React, {useEffect}  from 'react';
import {useSelector}  from 'react-redux';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate
}  from 'react-router-dom';
import {LoginScreen}  from '../components/auth/LoginScreen';
import {CalendarScreen}   from '../components/calendar/CalendarScreen';
import {useDispatch}  from 'react-redux';
import {startChecking} from '../actions/auth';
import {PublicRoute}  from './PublicRoute';
import {PrivateRoute}  from './PrivateRoute';

export const AppRouter = () => {
  const dispatch = useDispatch();
  const {checking, uid} = useSelector(state => state.auth);
  useEffect(() => {
    dispatch(startChecking());
  }, [dispatch]);
  if(checking) {
    return <h5>Espere..</h5>;
  }
  return (
    <Router>
        <div>
            <Routes>
                <Route 
                  exact path="/login" 
                  element={
                            <PublicRoute
                              component={LoginScreen}
                              isAuthenticated={!!uid}
                            />
                          }
                />
                <Route 
                  exact path="/" 
                  element={
                            <PrivateRoute
                              component={CalendarScreen}
                              isAuthenticated={!!uid}
                            />}/>
                <Route path='*' element={<Navigate to ='/login'/>}/>
            </Routes>
        </div>
    </Router>
  )
}