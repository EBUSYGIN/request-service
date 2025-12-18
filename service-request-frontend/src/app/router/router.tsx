import { createBrowserRouter, Navigate } from 'react-router';
import { RootLayout } from '../providers/RootLayout/RootLayout';
import { PrivateRoute } from '@/features/auth/ui';
import {
  LoginPage,
  RequestsPage,
  RequestDetailPage,
  ReportsPage,
  UsersPage,
} from '@/pages';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    element: <PrivateRoute />,
    children: [
      {
        path: '/',
        element: <RootLayout />,
        children: [
          {
            index: true,
            element: <Navigate to='/requests' replace />,
          },
          {
            path: 'requests',
            element: <RequestsPage />,
          },
          {
            path: 'requests/:id',
            element: <RequestDetailPage />,
          },
          {
            // Только для Менеджера
            element: <PrivateRoute allowedRoles={['Менеджер']} />,
            children: [
              {
                path: 'reports',
                element: <ReportsPage />,
              },
              {
                path: 'users',
                element: <UsersPage />,
              },
            ],
          },
        ],
      },
    ],
  },
]);
