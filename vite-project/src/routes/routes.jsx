import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
} from 'react-router-dom';
import PrivateRoute from 'auth/PrivateRoute';
import { Layout } from 'layout/Layout';
import AuthenticationLayout from 'page/authentication/AuthenticationLayout';
import ForgotPassword from 'page/authentication/ForgotPassword';
import Login from 'page/authentication/Login';
import ResetPassword from 'page/authentication/ResetPassword';
import ResetPasswordSuccess from 'page/authentication/ResetPasswordSuccess';
import ErrorPage from 'page/ErrorPage';
import UserLayout from 'page/user';
import Attendance from 'page/user/Attendance';

import Dashboard from 'page/user/Dashboard';

import Task from 'page/user/Task';

import AttendanceComp from 'components/AttendanceModule/AttendancePage';
import Holiday from 'components/AttendanceModule/HolidayPage';

import Settings from 'components/AttendanceModule/SettingsPage';

import Tasks from 'page/user/Tasks';
import StageTasks from 'page/user/StageTasks';

export const routes = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route
        path="/"
        element={<Navigate to="/admin/login" />}
        errorElement={<ErrorPage />}
      />

      <Route path="admin" element={<Layout />}>
        <Route element={<AuthenticationLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password" element={<ResetPassword />} />
          <Route
            path="reset-password-success"
            element={<ResetPasswordSuccess />}
          />
        </Route>
        <Route
          element={
            <PrivateRoute>
              <UserLayout />
            </PrivateRoute>
          }>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="attendance" element={<Attendance />}>
            <Route path="" element={<AttendanceComp />} />
            <Route path="holiday" element={<Holiday />} />
            <Route path="settings" element={<Settings />} />
          </Route>
  
          <Route path="task" element={<Tasks />}>
            <Route path="" element={<Task />} />
            <Route path="stagetasks" element={<StageTasks />} />
          </Route>
      
        </Route>
      </Route>
    </>
  )
);
