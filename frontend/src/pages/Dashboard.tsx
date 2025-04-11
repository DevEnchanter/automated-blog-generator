import { Card, SimpleGrid, Text, Button, Group, Title, Paper } from '@mantine/core';
import { useNavigate } from 'react-router-dom';

export function Dashboard() {
    const navigate = useNavigate();

    // Mock data (will be replaced with real data later)
    const stats = [
        { title: 'Total Blogs', value: '12' },
        { title: 'Published', value: '8' },
        { title: 'Drafts', value: '4' },
        { title: 'Total Views', value: '1.2K' },
    ];

    const recentBlogs = [
        { id: 1, title: 'Getting Started with React', status: 'published', views: 245 },
        { id: 2, title: 'TypeScript Best Practices', status: 'draft', views: 0 },
        { id: 3, title: 'Building Modern UIs', status: 'published', views: 189 },
    ];

    return (
        <div>
            <Group justify="space-between" mb="xl">
                <Title order={2}>Dashboard</Title>
                <Button onClick={() => navigate('/create-blog')}>
                    Create New Blog
                </Button>
            </Group>

            <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="lg" mb="xl">
                {stats.map((stat) => (
                    <Card key={stat.title} withBorder padding="lg">
                        <Text size="lg" fw={500} tt="uppercase" c="dimmed">
                            {stat.title}
                        </Text>
                        <Title order={3} mt="sm">
                            {stat.value}
                        </Title>
                    </Card>
                ))}
            </SimpleGrid>

            <Paper withBorder radius="md" p="md">
                <Title order={3} mb="md">Recent Blogs</Title>
                {recentBlogs.map((blog) => (
                    <Card 
                        key={blog.id} 
                        withBorder 
                        padding="md" 
                        mb="sm"
                        style={{ cursor: 'pointer' }}
                        onClick={() => navigate(`/blog/${blog.id}`)}
                    >
                        <Group justify="space-between">
                            <div>
                                <Text fw={500}>{blog.title}</Text>
                                <Text size="sm" c="dimmed" tt="uppercase">
                                    {blog.status}
                                </Text>
                            </div>
                            <Text size="sm">{blog.views} views</Text>
                        </Group>
                    </Card>
                ))}
                <Button 
                    variant="subtle" 
                    fullWidth 
                    mt="md"
                    onClick={() => navigate('/my-blogs')}
                >
                    View All Blogs
                </Button>
            </Paper>
        </div>
    );
} 