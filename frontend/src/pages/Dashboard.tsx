import { Container, Title, Text, Group, Button, Paper, SimpleGrid } from '@mantine/core';
import { useNavigate } from 'react-router-dom';

export function Dashboard() {
    const navigate = useNavigate();

    return (
        <Container size="lg" py="xl">
            <Title order={2} mb="xl">Welcome to Your Dashboard</Title>
            
            <SimpleGrid cols={2} spacing="md" mb="xl">
                <Paper shadow="sm" p="xl" radius="md">
                    <Title order={3} mb="md">Quick Actions</Title>
                    <Group>
                        <Button onClick={() => navigate('/create-blog')}>Create New Blog</Button>
                        <Button variant="light" onClick={() => navigate('/my-blogs')}>View My Blogs</Button>
                    </Group>
                </Paper>
                
                <Paper shadow="sm" p="xl" radius="md">
                    <Title order={3} mb="md">Recent Activity</Title>
                    <Text c="dimmed">No recent activity to show.</Text>
                </Paper>
            </SimpleGrid>
            
            <SimpleGrid cols={2} spacing="md">
                <Paper shadow="sm" p="xl" radius="md">
                    <Title order={3} mb="md">Statistics</Title>
                    <Text>Total Blogs: 0</Text>
                    <Text>Published Blogs: 0</Text>
                    <Text>Draft Blogs: 0</Text>
                </Paper>
                
                <Paper shadow="sm" p="xl" radius="md">
                    <Title order={3} mb="md">Tips</Title>
                    <Text>• Use AI to generate blog content</Text>
                    <Text>• Edit and review before publishing</Text>
                    <Text>• Regular posting keeps readers engaged</Text>
                </Paper>
            </SimpleGrid>
        </Container>
    );
} 