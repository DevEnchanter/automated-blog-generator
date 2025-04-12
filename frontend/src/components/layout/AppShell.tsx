import { AppShell as MantineAppShell, Button, Group, Title } from '@mantine/core';
import { useNavigate, Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/auth';

const PUBLIC_ROUTES = ['/login', '/register', '/forgot-password', '/reset-password'];

export function AppShell() {
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated, logout } = useAuthStore();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Redirect to login if not authenticated and trying to access a protected route
    if (!isAuthenticated && !PUBLIC_ROUTES.includes(location.pathname)) {
        return <Navigate to="/login" replace />;
    }

    // Redirect to dashboard if authenticated and trying to access a public route
    if (isAuthenticated && PUBLIC_ROUTES.includes(location.pathname)) {
        return <Navigate to="/create-blog" replace />;
    }

    return (
        <MantineAppShell
            header={{ height: 60 }}
            padding="md"
        >
            <MantineAppShell.Header>
                <Group h="100%" px="md" justify="space-between">
                    <Group>
                        <Title order={3} style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
                            Blog Generator
                        </Title>
                        {isAuthenticated && (
                            <>
                                <Button variant="subtle" onClick={() => navigate('/dashboard')}>
                                    Dashboard
                                </Button>
                                <Button variant="subtle" onClick={() => navigate('/create-blog')}>
                                    Create Blog
                                </Button>
                                <Button variant="subtle" onClick={() => navigate('/my-blogs')}>
                                    My Blogs
                                </Button>
                                <Button variant="subtle" onClick={() => navigate('/settings')}>
                                    Settings
                                </Button>
                            </>
                        )}
                    </Group>
                    <Group>
                        {!isAuthenticated ? (
                            <>
                                <Button variant="subtle" onClick={() => navigate('/login')}>
                                    Login
                                </Button>
                                <Button variant="subtle" onClick={() => navigate('/register')}>
                                    Register
                                </Button>
                            </>
                        ) : (
                            <Button variant="subtle" color="red" onClick={handleLogout}>
                                Logout
                            </Button>
                        )}
                    </Group>
                </Group>
            </MantineAppShell.Header>

            <MantineAppShell.Main>
                <Outlet />
            </MantineAppShell.Main>
        </MantineAppShell>
    );
} 