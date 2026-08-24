import { Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppDataProvider } from './context/AppDataContext';
import { NotificationProvider } from './context/NotificationContext';
import { ToastProvider } from './components/Toast/ToastContext';
import { AppShell } from './components/AppShell/AppShell';
import { RoleGuard } from './components/RoleGuard/RoleGuard';

import { Login } from './pages/Login/Login';
import { Dashboard } from './pages/Dashboard/Dashboard';
import { Profile } from './pages/Profile/Profile';
import { SubAssociationInfo } from './pages/SubAssociationInfo/SubAssociationInfo';
import { ActivitiesList } from './pages/Activities/ActivitiesList';
import { ActivityDetail } from './pages/Activities/ActivityDetail';
import { ActivityForm } from './pages/Activities/ActivityForm';
import { MembersList } from './pages/Members/MembersList';
import { MemberDetail } from './pages/Members/MemberDetail';
import { Badges } from './pages/Badges/Badges';
import { Feedback } from './pages/Feedback/Feedback';
import { ForumList } from './pages/Forum/ForumList';
import { ForumDetail } from './pages/Forum/ForumDetail';
import { ForumCreate } from './pages/Forum/ForumCreate';
import { ForumModeration } from './pages/Forum/ForumModeration';
import { Quota } from './pages/Quota/Quota';
import { Funds } from './pages/Funds/Funds';
import { Documents } from './pages/Documents/Documents';
import { Admin } from './pages/Admin/Admin';
import { NotFound } from './pages/NotFound/NotFound';

function AppRoutes() {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Login />} />
      </Routes>
    );
  }

  return (
    <AppShell>
      <Routes>
        <Route path="/login" element={<Dashboard />} />
        <Route path="/" element={<Dashboard />} />

        <Route
          path="/profile"
          element={
            <RoleGuard allow={['member', 'bch']}>
              <Profile />
            </RoleGuard>
          }
        />
        <Route
          path="/sub-association"
          element={
            <RoleGuard permission="view-association-info">
              <SubAssociationInfo />
            </RoleGuard>
          }
        />

        <Route
          path="/activities"
          element={
            <RoleGuard permission="view-activities">
              <ActivitiesList />
            </RoleGuard>
          }
        />
        <Route
          path="/activities/new"
          element={
            <RoleGuard permission="manage-activities">
              <ActivityForm />
            </RoleGuard>
          }
        />
        <Route
          path="/activities/:id/edit"
          element={
            <RoleGuard permission="manage-activities">
              <ActivityForm />
            </RoleGuard>
          }
        />
        <Route
          path="/activities/:id"
          element={
            <RoleGuard permission="view-activities">
              <ActivityDetail />
            </RoleGuard>
          }
        />

        <Route
          path="/members"
          element={
            <RoleGuard permission="view-members">
              <MembersList />
            </RoleGuard>
          }
        />
        <Route
          path="/members/:id"
          element={
            <RoleGuard permission="view-members">
              <MemberDetail />
            </RoleGuard>
          }
        />

        <Route
          path="/badges"
          element={
            <RoleGuard permission="view-badges">
              <Badges />
            </RoleGuard>
          }
        />

        <Route
          path="/feedback"
          element={
            <RoleGuard permission="view-own-feedback">
              <Feedback />
            </RoleGuard>
          }
        />

        <Route
          path="/forum"
          element={
            <RoleGuard permission="view-forum">
              <ForumList />
            </RoleGuard>
          }
        />
        <Route
          path="/forum/moderation"
          element={
            <RoleGuard permission="moderate-posts">
              <ForumModeration />
            </RoleGuard>
          }
        />
        <Route
          path="/forum/new"
          element={
            <RoleGuard permission="create-post">
              <ForumCreate />
            </RoleGuard>
          }
        />
        <Route
          path="/forum/:id"
          element={
            <RoleGuard permission="view-forum">
              <ForumDetail />
            </RoleGuard>
          }
        />

        <Route
          path="/quota"
          element={
            <RoleGuard permission="manage-quota">
              <Quota />
            </RoleGuard>
          }
        />
        <Route
          path="/funds"
          element={
            <RoleGuard permission="view-funds">
              <Funds />
            </RoleGuard>
          }
        />
        <Route
          path="/documents"
          element={
            <RoleGuard permission="generate-documents">
              <Documents />
            </RoleGuard>
          }
        />

        <Route
          path="/admin"
          element={
            <RoleGuard allow={['admin']}>
              <Admin />
            </RoleGuard>
          }
        />

        <Route path="/403" element={<NotFound />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AppShell>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppDataProvider>
        <NotificationProvider>
          <ToastProvider>
            <AppRoutes />
          </ToastProvider>
        </NotificationProvider>
      </AppDataProvider>
    </AuthProvider>
  );
}

export default App;
