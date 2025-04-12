import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LoginForm } from './components/auth/LoginForm';
import { RegisterForm } from './components/auth/RegisterForm';
import { ForgotPassword } from './components/auth/ForgotPassword';
import { ResetPassword } from './components/auth/ResetPassword';
import { Dashboard } from './pages/Dashboard';
import { CreateBlog } from './pages/CreateBlog';
import { MyBlogs } from './pages/MyBlogs';
import { AppShell } from './components/layout/AppShell';
import { useAuthStore } from './store/auth';

const queryClient = new QueryClient();

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
        <QueryClientProvider client={queryClient}>
            <MantineProvider>
                <Router>
                    <Routes>
                        <Route path="/login" element={<LoginForm />} />
                        <Route path="/register" element={<RegisterForm />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />
                        <Route path="/reset-password" element={<ResetPassword />} />
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
                                    <MyBlogs />
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
        </QueryClientProvider>
    );
}

export default App;
