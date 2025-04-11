import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import { LoginForm } from './components/auth/LoginForm';
import { RegisterForm } from './components/auth/RegisterForm';
import { Dashboard } from './pages/Dashboard';
import { CreateBlog } from './pages/CreateBlog';
import { AppShell } from './components/layout/AppShell';
import { useAuthStore } from './store/auth';

function PrivateRoute({ children }: { children: React.ReactNode }) {
    const isAuthenticated = useAuthStore(state => state.isAuthenticated);
    return isAuthenticated ? (
        <AppShell>{children}</AppShell>
    ) : (
        <Navigate to="/login" />
    );
}

function App() {
    return (
        <MantineProvider>
            <Router>
                <Routes>
                    <Route path="/login" element={<LoginForm />} />
                    <Route path="/register" element={<RegisterForm />} />
                    <Route
                        path="/dashboard"
                        element={
                            <PrivateRoute>
                                <Dashboard />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/create-blog"
                        element={
                            <PrivateRoute>
                                <CreateBlog />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/my-blogs"
                        element={
                            <PrivateRoute>
                                <div>My Blogs (Coming Soon)</div>
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/settings"
                        element={
                            <PrivateRoute>
                                <div>Settings (Coming Soon)</div>
                            </PrivateRoute>
                        }
                    />
                    <Route path="/" element={<Navigate to="/login" />} />
                </Routes>
            </Router>
        </MantineProvider>
    );
}

export default App;
