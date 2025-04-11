import { useState } from 'react';
import { AppShell as MantineAppShell, Burger, Group, NavLink, Title } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/auth';

interface AppShellProps {
    children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
    const [opened, setOpened] = useState(false);
    const navigate = useNavigate();
    const logout = useAuthStore(state => state.logout);
    const user = useAuthStore(state => state.user);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <MantineAppShell
            header={{ height: 60 }}
            navbar={{
                width: 300,
                breakpoint: 'sm',
                collapsed: { mobile: !opened }
            }}
            padding="md"
        >
            <MantineAppShell.Header>
                <Group h="100%" px="md" justify="space-between">
                    <Group>
                        <Burger
                            opened={opened}
                            onClick={() => setOpened(!opened)}
                            hiddenFrom="sm"
                            size="sm"
                        />
                        <Title order={3}>Blog Generator</Title>
                    </Group>
                    <Group>
                        {user?.username && (
                            <Title order={4}>Welcome, {user.username}</Title>
                        )}
                    </Group>
                </Group>
            </MantineAppShell.Header>

            <MantineAppShell.Navbar p="md">
                <NavLink
                    label="Dashboard"
                    onClick={() => navigate('/dashboard')}
                />
                <NavLink
                    label="Create Blog"
                    onClick={() => navigate('/create-blog')}
                />
                <NavLink
                    label="My Blogs"
                    onClick={() => navigate('/my-blogs')}
                />
                <NavLink
                    label="Settings"
                    onClick={() => navigate('/settings')}
                />
                <NavLink
                    label="Logout"
                    color="red"
                    onClick={handleLogout}
                />
            </MantineAppShell.Navbar>

            <MantineAppShell.Main>
                {children}
            </MantineAppShell.Main>
        </MantineAppShell>
    );
} 