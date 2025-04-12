import { AppShell as MantineAppShell, UnstyledButton, Group, Text } from '@mantine/core';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/auth';
import { IconDashboard, IconPencilPlus, IconArticle, IconSettings, IconLogout } from '@tabler/icons-react';

export function AppShell({ children }: { children: React.ReactNode }) {
    const navigate = useNavigate();
    const logout = useAuthStore(state => state.logout);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <MantineAppShell
            padding="md"
            navbar={{ width: 300, breakpoint: 'sm' }}
            header={{ height: 60 }}
        >
            <MantineAppShell.Header p="xs">
                <Group justify="space-between">
                    <Text size="xl" fw={700}>Blog Generator</Text>
                </Group>
            </MantineAppShell.Header>

            <MantineAppShell.Navbar p="xs">
                <MantineAppShell.Section grow>
                    <UnstyledButton
                        component={Link}
                        to="/dashboard"
                        w="100%"
                        p="xs"
                        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                        <IconDashboard size={20} />
                        <Text>Dashboard</Text>
                    </UnstyledButton>
                    <UnstyledButton
                        component={Link}
                        to="/create-blog"
                        w="100%"
                        p="xs"
                        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                        <IconPencilPlus size={20} />
                        <Text>Create Blog</Text>
                    </UnstyledButton>
                    <UnstyledButton
                        component={Link}
                        to="/my-blogs"
                        w="100%"
                        p="xs"
                        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                        <IconArticle size={20} />
                        <Text>My Blogs</Text>
                    </UnstyledButton>
                    <UnstyledButton
                        component={Link}
                        to="/settings"
                        w="100%"
                        p="xs"
                        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                        <IconSettings size={20} />
                        <Text>Settings</Text>
                    </UnstyledButton>
                </MantineAppShell.Section>

                <MantineAppShell.Section>
                    <UnstyledButton
                        onClick={handleLogout}
                        w="100%"
                        p="xs"
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--mantine-color-red-6)' }}
                    >
                        <IconLogout size={20} />
                        <Text>Logout</Text>
                    </UnstyledButton>
                </MantineAppShell.Section>
            </MantineAppShell.Navbar>

            <MantineAppShell.Main>
                {children}
            </MantineAppShell.Main>
        </MantineAppShell>
    );
} 