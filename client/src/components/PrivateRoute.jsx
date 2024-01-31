import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';

const PrivateRoute = ({ isCheck = false, isAdmin = false }) => {
    const { currentUser } = useSelector((state) => state.user);

    if (isCheck) {
        // Redirect to home if the user is already authenticated
        return currentUser ? <Navigate to={'/'} /> : <Outlet />;
    }

    if (isAdmin) {
        // Redirect to sign-in if not an admin or not authenticated
        return currentUser && currentUser.isAdmin ? <Outlet /> : <Navigate to={'/sign-in'} />;
    }

    // Redirect to sign-in if not authenticated
    return currentUser ? <Outlet /> : <Navigate to={'/sign-in'} />;
}

export default PrivateRoute
