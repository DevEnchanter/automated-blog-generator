import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Title, Paper, Text, Group, Button, LoadingOverlay } from '@mantine/core';
import { blogService } from '../services/blog';
import { useQuery } from '@tanstack/react-query';
import { IconArrowLeft } from '@tabler/icons-react';

export function BlogView() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const { data: blog, isLoading } = useQuery({
        queryKey: ['blog', id],
        queryFn: () => blogService.getBlog(id!),
        enabled: !!id
    });

    return (
        <Container size="lg">
            <LoadingOverlay visible={isLoading} />
            
            <Group mb="xl">
                <Button
                    variant="subtle"
                    leftSection={<IconArrowLeft size={16} />}
                    onClick={() => navigate('/my-blogs')}
                >
                    Back to My Blogs
                </Button>
            </Group>

            {blog && (
                <Paper p="xl" withBorder>
                    <Title order={1} mb="md">{blog.title}</Title>
                    
                    <Text size="sm" c="dimmed" mb="xl">
                        Created: {new Date(blog.created_at).toLocaleDateString()}
                        {blog.updated_at !== blog.created_at && 
                            ` • Updated: ${new Date(blog.updated_at).toLocaleDateString()}`}
                    </Text>

                    <div dangerouslySetInnerHTML={{ __html: blog.content }} />
                </Paper>
            )}
        </Container>
    );
} 