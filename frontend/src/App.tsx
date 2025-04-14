import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppShell } from './components/layout/AppShell';
import { LoginForm } from './components/auth/LoginForm';
import { RegisterForm } from './components/auth/RegisterForm';
import { ForgotPassword } from './components/auth/ForgotPassword';
import { ResetPassword } from './components/auth/ResetPassword';
import { CreateBlog } from './pages/CreateBlog';
import { MyBlogs } from './pages/MyBlogs';
import { Dashboard } from './pages/Dashboard';
import { Settings } from './pages/Settings';
import { useAuthStore } from './store/auth';
import { BlogView } from './pages/BlogView';
import { EditBlog } from './pages/EditBlog';

const queryClient = new QueryClient();

function Root() {
    const { isAuthenticated } = useAuthStore();
    return <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />;
}

export default function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <MantineProvider>
                <Notifications />
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<AppShell />}>
                            <Route index element={<Root />} />
                            <Route path="/login" element={<LoginForm />} />
                            <Route path="/register" element={<RegisterForm />} />
                            <Route path="/forgot-password" element={<ForgotPassword />} />
                            <Route path="/reset-password" element={<ResetPassword />} />
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/create-blog" element={<CreateBlog />} />
                            <Route path="/my-blogs" element={<MyBlogs />} />
                            <Route path="/settings" element={<Settings />} />
                            <Route path="/blog/:id" element={<BlogView />} />
                            <Route path="/edit-blog/:id" element={<EditBlog />} />
                        </Route>
                    </Routes>
                </BrowserRouter>
            </MantineProvider>
        </QueryClientProvider>
    );
}
