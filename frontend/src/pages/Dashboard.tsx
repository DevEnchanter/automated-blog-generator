import { 
    Container, 
    Title, 
    Text, 
    Group, 
    Button, 
    Card, 
    SimpleGrid, 
    ThemeIcon, 
    rem, 
    useMantineTheme,
    Badge,
    Stack,
    RingProgress,
    Flex,
    Paper
} from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { 
    IconArticle, 
    IconPlus, 
    IconChartBar, 
    IconBulb, 
    IconWriting, 
    IconEye, 
    IconTrendingUp 
} from '@tabler/icons-react';

export function Dashboard() {
    const navigate = useNavigate();
    const theme = useMantineTheme();

    // Mock statistics - would come from API in real app
    const stats = {
        totalBlogs: 14,
        publishedBlogs: 8,
        draftBlogs: 6,
        totalViews: 1263,
        mostPopularCategory: 'Technology'
    };

    const recentActivity = [
        { id: 1, type: 'Created', title: 'Getting Started with React', date: '2 days ago' },
        { id: 2, type: 'Published', title: 'The Future of AI', date: '1 week ago' },
        { id: 3, type: 'Updated', title: 'Python vs JavaScript', date: '2 weeks ago' },
    ];

    const tips = [
        { icon: IconBulb, title: 'Generate Ideas', description: 'Use AI to generate blog topic ideas based on trending keywords.' },
        { icon: IconWriting, title: 'Edit Content', description: 'Always review and edit AI-generated content for accuracy and tone.' },
        { icon: IconEye, title: 'Optimize SEO', description: 'Include relevant keywords and meta descriptions for better visibility.' },
        { icon: IconTrendingUp, title: 'Post Regularly', description: 'Maintain a consistent posting schedule to build audience.' },
    ];

    return (
        <Container size="lg" py="xl">
            <Group justify="space-between" mb="xl">
                <Title order={2}>Dashboard</Title>
                <Button leftSection={<IconPlus size={16} />} onClick={() => navigate('/create-blog')}>
                    Create New Blog
                </Button>
            </Group>
            
            <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md" mb="xl">
                <Card withBorder radius="md" padding="md">
                    <Group justify="space-between">
                        <Text size="xs" c="dimmed" fw={700} tt="uppercase">
                            Total Blogs
                        </Text>
                        <ThemeIcon
                            color="gray"
                            variant="light"
                            size={38}
                            radius="md"
                        >
                            <IconArticle size="1.5rem" stroke={1.5} />
                        </ThemeIcon>
                    </Group>
                    <Group align="flex-end" gap="xs" mt={25}>
                        <Text fw={700} size="xl">{stats.totalBlogs}</Text>
                        <Text c="teal" size="sm" fw={500}>
                            +{stats.totalBlogs > 10 ? '5' : '2'} this month
                        </Text>
                    </Group>
                </Card>

                <Card withBorder radius="md" padding="md">
                    <Group justify="space-between">
                        <Text size="xs" c="dimmed" fw={700} tt="uppercase">
                            Published
                        </Text>
                        <ThemeIcon
                            color="green"
                            variant="light"
                            size={38}
                            radius="md"
                        >
                            <IconEye size="1.5rem" stroke={1.5} />
                        </ThemeIcon>
                    </Group>
                    <Group align="flex-end" gap="xs" mt={25}>
                        <Text fw={700} size="xl">{stats.publishedBlogs}</Text>
                        <Badge size="sm" color="green">
                            {Math.round((stats.publishedBlogs / stats.totalBlogs) * 100)}% of total
                        </Badge>
                    </Group>
                </Card>

                <Card withBorder radius="md" padding="md">
                    <Group justify="space-between">
                        <Text size="xs" c="dimmed" fw={700} tt="uppercase">
                            Total Views
                        </Text>
                        <ThemeIcon
                            color="blue"
                            variant="light"
                            size={38}
                            radius="md"
                        >
                            <IconChartBar size="1.5rem" stroke={1.5} />
                        </ThemeIcon>
                    </Group>
                    <Group align="flex-end" gap="xs" mt={25}>
                        <Text fw={700} size="xl">{stats.totalViews}</Text>
                        <Text c="dimmed" size="sm">
                            Lifetime
                        </Text>
                    </Group>
                </Card>
            </SimpleGrid>
            
            <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="md" mb="xl">
                <Card withBorder radius="md" padding="lg">
                    <Title order={4} mb="md">Blog Distribution</Title>
                    <Flex align="center" gap="xl">
                        <RingProgress
                            size={180}
                            thickness={18}
                            sections={[
                                { value: (stats.publishedBlogs / stats.totalBlogs) * 100, color: 'green' },
                                { value: (stats.draftBlogs / stats.totalBlogs) * 100, color: 'orange' },
                            ]}
                            label={
                                <Text ta="center" fw={700} size="xl">
                                    {stats.totalBlogs}
                                </Text>
                            }
                        />
                        <Stack gap="xs">
                            <Group gap="xs">
                                <div style={{ 
                                    width: 16, 
                                    height: 16, 
                                    backgroundColor: theme.colors.green[6], 
                                    borderRadius: '4px' 
                                }} />
                                <Text size="sm">Published ({stats.publishedBlogs})</Text>
                            </Group>
                            <Group gap="xs">
                                <div style={{ 
                                    width: 16, 
                                    height: 16, 
                                    backgroundColor: theme.colors.orange[6], 
                                    borderRadius: '4px' 
                                }} />
                                <Text size="sm">Drafts ({stats.draftBlogs})</Text>
                            </Group>
                            <Text size="sm" mt="md">
                                Most popular category: <Badge>{stats.mostPopularCategory}</Badge>
                            </Text>
                        </Stack>
                    </Flex>
                </Card>
                
                <Card withBorder radius="md" padding="lg">
                    <Title order={4} mb="md">Recent Activity</Title>
                    {recentActivity.length > 0 ? (
                        <Stack gap="sm">
                            {recentActivity.map((activity) => (
                                <Paper withBorder radius="md" p="md" key={activity.id}>
                                    <Group justify="space-between">
                                        <div>
                                            <Text size="sm" fw={500}>{activity.title}</Text>
                                            <Group gap="xs" mt={4}>
                                                <Badge size="sm" variant="light">
                                                    {activity.type}
                                                </Badge>
                                                <Text size="xs" c="dimmed">{activity.date}</Text>
                                            </Group>
                                        </div>
                                        <Button 
                                            variant="light" 
                                            size="xs"
                                            onClick={() => navigate(`/blog/${activity.id}`)}
                                        >
                                            View
                                        </Button>
                                    </Group>
                                </Paper>
                            ))}
                        </Stack>
                    ) : (
                        <Text c="dimmed">No recent activity to show.</Text>
                    )}
                </Card>
            </SimpleGrid>
            
            <Card withBorder radius="md" padding="lg">
                <Title order={4} mb="lg">Tips for Better Blogging</Title>
                <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="md">
                    {tips.map((tip, index) => (
                        <Paper withBorder radius="md" p="md" key={index}>
                            <ThemeIcon 
                                size={40} 
                                radius="md" 
                                variant="light" 
                                color="indigo"
                                mb="md"
                            >
                                <tip.icon size={20} stroke={1.5} />
                            </ThemeIcon>
                            <Text fw={500} mb={5}>{tip.title}</Text>
                            <Text size="sm" c="dimmed">{tip.description}</Text>
                        </Paper>
                    ))}
                </SimpleGrid>
            </Card>
        </Container>
    );
} 