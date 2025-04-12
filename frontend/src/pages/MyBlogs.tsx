import { useState } from 'react';
import { 
    Table,
    Group,
    Title,
    Text,
    Button,
    Menu,
    ActionIcon,
    TextInput,
    Select,
    Paper,
    Modal,
    Stack,
    LoadingOverlay,
    Badge
} from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { blogService, BlogPost } from '../services/blog';
import { IconDots, IconPencil, IconTrash, IconEye, IconSearch } from '@tabler/icons-react';

export function MyBlogs() {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string | null>(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [blogToDelete, setBlogToDelete] = useState<BlogPost | null>(null);
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    // Fetch blogs
    const { data: blogs = [], isLoading } = useQuery({
        queryKey: ['blogs'],
        queryFn: blogService.getMyBlogs
    });

    // Delete blog mutation
    const deleteMutation = useMutation({
        mutationFn: (id: string) => blogService.deleteBlog(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['blogs'] });
            setDeleteModalOpen(false);
            setBlogToDelete(null);
        }
    });

    // Filter and sort blogs
    const filteredBlogs = blogs.filter(blog => {
        const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = !statusFilter || blog.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const handleDelete = (blog: BlogPost) => {
        setBlogToDelete(blog);
        setDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (blogToDelete) {
            await deleteMutation.mutateAsync(blogToDelete.id);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div style={{ position: 'relative' }}>
            <LoadingOverlay visible={isLoading || deleteMutation.isPending} />

            <Group justify="space-between" mb="xl">
                <Title order={2}>My Blogs</Title>
                <Button onClick={() => navigate('/create-blog')}>
                    Create New Blog
                </Button>
            </Group>

            <Paper withBorder p="md" mb="xl">
                <Group>
                    <TextInput
                        placeholder="Search blogs..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        leftSection={<IconSearch size={16} />}
                        style={{ flex: 1 }}
                    />
                    <Select
                        placeholder="Filter by status"
                        value={statusFilter}
                        onChange={setStatusFilter}
                        data={[
                            { value: '', label: 'All' },
                            { value: 'draft', label: 'Drafts' },
                            { value: 'published', label: 'Published' }
                        ]}
                        style={{ width: 200 }}
                    />
                </Group>
            </Paper>

            <Paper withBorder>
                <Table>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>Title</Table.Th>
                            <Table.Th>Status</Table.Th>
                            <Table.Th>Views</Table.Th>
                            <Table.Th>Created</Table.Th>
                            <Table.Th>Updated</Table.Th>
                            <Table.Th>Actions</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {filteredBlogs.map((blog) => (
                            <Table.Tr key={blog.id}>
                                <Table.Td>
                                    <Text fw={500}>{blog.title}</Text>
                                </Table.Td>
                                <Table.Td>
                                    <Badge 
                                        color={blog.status === 'published' ? 'green' : 'yellow'}
                                    >
                                        {blog.status}
                                    </Badge>
                                </Table.Td>
                                <Table.Td>{blog.views}</Table.Td>
                                <Table.Td>{formatDate(blog.created_at)}</Table.Td>
                                <Table.Td>{formatDate(blog.updated_at)}</Table.Td>
                                <Table.Td>
                                    <Group gap="xs">
                                        <ActionIcon
                                            variant="subtle"
                                            onClick={() => navigate(`/blog/${blog.id}`)}
                                        >
                                            <IconEye size={16} />
                                        </ActionIcon>
                                        <ActionIcon
                                            variant="subtle"
                                            onClick={() => navigate(`/edit-blog/${blog.id}`)}
                                        >
                                            <IconPencil size={16} />
                                        </ActionIcon>
                                        <ActionIcon
                                            variant="subtle"
                                            color="red"
                                            onClick={() => handleDelete(blog)}
                                        >
                                            <IconTrash size={16} />
                                        </ActionIcon>
                                    </Group>
                                </Table.Td>
                            </Table.Tr>
                        ))}
                        {filteredBlogs.length === 0 && (
                            <Table.Tr>
                                <Table.Td colSpan={6}>
                                    <Text ta="center" c="dimmed" py="xl">
                                        No blogs found. Create your first blog post!
                                    </Text>
                                </Table.Td>
                            </Table.Tr>
                        )}
                    </Table.Tbody>
                </Table>
            </Paper>

            <Modal
                opened={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                title="Delete Blog"
                centered
            >
                <Stack>
                    <Text>
                        Are you sure you want to delete "{blogToDelete?.title}"? 
                        This action cannot be undone.
                    </Text>
                    <Group justify="flex-end">
                        <Button 
                            variant="default" 
                            onClick={() => setDeleteModalOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button 
                            color="red" 
                            onClick={confirmDelete}
                            loading={deleteMutation.isPending}
                        >
                            Delete
                        </Button>
                    </Group>
                </Stack>
            </Modal>
        </div>
    );
} 