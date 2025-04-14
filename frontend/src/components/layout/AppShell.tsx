import {
    AppShell as MantineAppShell,
    Button,
    Group,
    Title,
    Loader,
    Center,
    Text,
    Burger,
    Avatar,
    ActionIcon,
    Menu,
    rem,
    NavLink,
    ScrollArea,
    useMantineColorScheme
} from '@mantine/core';
import { useNavigate, Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/auth';
import { useDisclosure } from '@mantine/hooks';
import {
    IconHome,
    IconArticle,
    IconSettings,
    IconLogout,
    IconPlus,
    IconMoonStars,
    IconSun,
    IconDashboard
} from '@tabler/icons-react';
import { useState, useEffect } from 'react';

const PUBLIC_ROUTES = ['/login', '/register', '/forgot-password', '/reset-password'];

export function AppShell() {
    const navigate = useNavigate();
    const location = useLocation();
    const { colorScheme, setColorScheme } = useMantineColorScheme();
    const [opened, { toggle }] = useDisclosure();
    const { isAuthenticated, isLoading, logout, user } = useAuthStore();
    const [active, setActive] = useState(location.pathname);
    const dark = colorScheme === 'dark';

    useEffect(() => {
        setActive(location.pathname);
    }, [location.pathname]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const toggleColorScheme = () => {
        setColorScheme(dark ? 'light' : 'dark');
    };

    // Show loading state while auth is being checked
    if (isLoading) {
        return (
            <Center h="100vh">
                <Loader size="xl" />
            </Center>
        );
    }

    // Redirect to login if not authenticated and trying to access a protected route
    if (!isAuthenticated && !PUBLIC_ROUTES.includes(location.pathname)) {
        return <Navigate to="/login" replace />;
    }

    // Redirect to dashboard if authenticated and trying to access a public route
    if (isAuthenticated && PUBLIC_ROUTES.includes(location.pathname)) {
        return <Navigate to="/create-blog" replace />;
    }

    const navItems = [
        { icon: IconDashboard, label: 'Dashboard', path: '/dashboard' },
        { icon: IconPlus, label: 'Create Blog', path: '/create-blog' },
        { icon: IconArticle, label: 'My Blogs', path: '/my-blogs' },
        { icon: IconSettings, label: 'Settings', path: '/settings' },
    ];

    return (
        <MantineAppShell
            header={{ height: { base: 60, md: 70 } }}
            navbar={{
                width: { base: 250 },
                breakpoint: 'sm',
                collapsed: { mobile: !opened },
            }}
            padding="md"
        >
            <MantineAppShell.Header>
                <Group h="100%" px="md" justify="space-between">
                    <Group>
                        <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
                        <Title order={3} style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
                            Blog Generator
                        </Title>
                    </Group>
                    <Group>
                        <ActionIcon
                            variant="light"
                            onClick={toggleColorScheme}
                            size="lg"
                            radius="xl"
                        >
                            {dark ? (
                                <IconSun size={18} stroke={1.5} />
                            ) : (
                                <IconMoonStars size={18} stroke={1.5} />
                            )}
                        </ActionIcon>
                        
                        {isAuthenticated ? (
                            <Menu shadow="md" width={200} position="bottom-end">
                                <Menu.Target>
                                    <Avatar 
                                        radius="xl" 
                                        size="md" 
                                        src={user?.photoURL} 
                                        color="primary"
                                        style={{ cursor: 'pointer' }}
                                    >
                                        {user?.displayName?.charAt(0) || user?.email?.charAt(0)}
                                    </Avatar>
                                </Menu.Target>
                                <Menu.Dropdown>
                                    <Menu.Label>
                                        <Text fw={500}>{user?.displayName || user?.email}</Text>
                                    </Menu.Label>
                                    <Menu.Divider />
                                    <Menu.Item 
                                        leftSection={<IconSettings style={{ width: rem(14), height: rem(14) }} />} 
                                        onClick={() => navigate('/settings')}
                                    >
                                        Settings
                                    </Menu.Item>
                                    <Menu.Item 
                                        leftSection={<IconLogout style={{ width: rem(14), height: rem(14) }} />}
                                        onClick={handleLogout}
                                        color="red"
                                    >
                                        Logout
                                    </Menu.Item>
                                </Menu.Dropdown>
                            </Menu>
                        ) : (
                            <Group>
                                <Button variant="light" onClick={() => navigate('/login')}>
                                    Login
                                </Button>
                                <Button onClick={() => navigate('/register')}>
                                    Register
                                </Button>
                            </Group>
                        )}
                    </Group>
                </Group>
            </MantineAppShell.Header>

            {isAuthenticated && (
                <MantineAppShell.Navbar p="md">
                    <MantineAppShell.Section grow component={ScrollArea}>
                        {navItems.map((item) => (
                            <NavLink
                                key={item.path}
                                active={active === item.path}
                                label={item.label}
                                leftSection={<item.icon size="1.2rem" stroke={1.5} />}
                                onClick={() => navigate(item.path)}
                                style={{ marginBottom: '8px' }}
                            />
                        ))}
                    </MantineAppShell.Section>
                    <MantineAppShell.Section>
                        <NavLink
                            label="Logout"
                            leftSection={<IconLogout size="1.2rem" stroke={1.5} />}
                            onClick={handleLogout}
                            color="red"
                        />
                    </MantineAppShell.Section>
                </MantineAppShell.Navbar>
            )}

            <MantineAppShell.Main>
                <Outlet />
            </MantineAppShell.Main>
        </MantineAppShell>
    );
} 