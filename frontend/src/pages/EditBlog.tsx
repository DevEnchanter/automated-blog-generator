import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Title, Paper, Button, Group, Stack, LoadingOverlay } from '@mantine/core';
import { RichTextEditor, Link } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { blogService } from '../services/blog';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import { IconArrowLeft } from '@tabler/icons-react';

export function EditBlog() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [content, setContent] = useState('');

    const { data: blog, isLoading } = useQuery({
        queryKey: ['blog', id],
        queryFn: () => blogService.getBlog(id!),
        enabled: !!id,
        onSuccess: (data) => {
            setContent(data.content);
        }
    });

    const editor = useEditor({
        extensions: [
            StarterKit,
            Link,
        ],
        content: content,
        onUpdate: ({ editor }) => {
            setContent(editor.getHTML());
        },
    });

    const updateMutation = useMutation({
        mutationFn: () => blogService.updateBlog(id!, {
            content,
            updated_at: new Date().toISOString()
        }),
        onSuccess: () => {
            notifications.show({
                title: 'Success',
                message: 'Blog updated successfully',
                color: 'green',
            });
            queryClient.invalidateQueries({ queryKey: ['blog', id] });
            queryClient.invalidateQueries({ queryKey: ['blogs'] });
        },
        onError: (error) => {
            notifications.show({
                title: 'Error',
                message: 'Failed to update blog',
                color: 'red',
            });
        },
    });

    useEffect(() => {
        if (blog) {
            editor?.commands.setContent(blog.content);
        }
    }, [blog, editor]);

    return (
        <Container size="lg">
            <LoadingOverlay visible={isLoading || updateMutation.isPending} />
            
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
                    <Stack>
                        <Title order={1}>{blog.title}</Title>
                        
                        <RichTextEditor editor={editor}>
                            <RichTextEditor.Toolbar sticky stickyOffset={60}>
                                <RichTextEditor.ControlsGroup>
                                    <RichTextEditor.Bold />
                                    <RichTextEditor.Italic />
                                    <RichTextEditor.Underline />
                                    <RichTextEditor.Strikethrough />
                                    <RichTextEditor.ClearFormatting />
                                    <RichTextEditor.Code />
                                </RichTextEditor.ControlsGroup>

                                <RichTextEditor.ControlsGroup>
                                    <RichTextEditor.H1 />
                                    <RichTextEditor.H2 />
                                    <RichTextEditor.H3 />
                                    <RichTextEditor.H4 />
                                </RichTextEditor.ControlsGroup>

                                <RichTextEditor.ControlsGroup>
                                    <RichTextEditor.Blockquote />
                                    <RichTextEditor.Hr />
                                    <RichTextEditor.BulletList />
                                    <RichTextEditor.OrderedList />
                                </RichTextEditor.ControlsGroup>

                                <RichTextEditor.ControlsGroup>
                                    <RichTextEditor.Link />
                                    <RichTextEditor.Unlink />
                                </RichTextEditor.ControlsGroup>
                            </RichTextEditor.Toolbar>

                            <RichTextEditor.Content />
                        </RichTextEditor>

                        <Group justify="flex-end" mt="md">
                            <Button
                                onClick={() => updateMutation.mutate()}
                                loading={updateMutation.isPending}
                            >
                                Save Changes
                            </Button>
                        </Group>
                    </Stack>
                </Paper>
            )}
        </Container>
    );
} 