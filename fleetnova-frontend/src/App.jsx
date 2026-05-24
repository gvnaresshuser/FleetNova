import {

  BrowserRouter,
  Routes,
  Route,
  Navigate,

} from 'react-router-dom';

import { Toaster } from 'react-hot-toast';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/dashboard/Dashboard';
import Vehicles from './pages/vehicles/Vehicles';
import Drivers from './pages/drivers/Drivers';
import Analytics from './pages/analytics/Analytics';
import LiveTracking from './pages/tracking/LiveTracking';
import Login from './pages/auth/Login';
import ProtectedRoute from './routes/ProtectedRoute';
import LoadingBar from 'react-top-loading-bar';
import Orders from './pages/orders/Orders';
import TrackOrder from './pages/orders/TrackOrder';

import {
  useState,
} from 'react';
function App() {
  const [progress, setProgress] = useState(0);
  const startLoading = () => {

    setProgress(30);

    setTimeout(() => {

      setProgress(100);

    }, 400);

  };
  return (

    <BrowserRouter>

      <Toaster position="top-right" />
      <LoadingBar
        color="#1E3A8A"
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
      />
      <Routes>

        {/* LOGIN */}

        <Route
          path="/login"
          element={<Login />}
        />

        {/* PROTECTED ROUTES */}

        <Route
          path="/"
          element={

            <ProtectedRoute>

              <MainLayout />             

            </ProtectedRoute>

          }
        >

          <Route
            path="/track-order/:id"
            element={
              <TrackOrder
                startLoading={startLoading}
              />
            }
          />

          <Route
            index
            element={<Navigate to="/dashboard" />}
          />

          <Route
            path="/dashboard"
            element={<Dashboard startLoading={startLoading} />}
          />

          <Route
            path="/vehicles"
            element={<Vehicles startLoading={startLoading} />}
          />

          <Route
            path="/drivers"
            element={<Drivers startLoading={startLoading} />}
          />

          <Route
            path="/tracking"
            element={<LiveTracking startLoading={startLoading} />}
          />

          <Route
            path="/analytics"
            element={<Analytics startLoading={startLoading} />}
          />

          <Route
            path="/orders"
            element={
              <Orders
                startLoading={startLoading}
              />
            }
          />

        </Route>

      </Routes>

    </BrowserRouter>

  );

}

export default App;