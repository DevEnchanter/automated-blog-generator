import { useState, useEffect } from 'react';
import {
  Container,
  Title,
  Card,
  Button,
  Group,
  Stack,
  Alert,
  TextInput,
  Flex,
  Text,
  Tabs,
  Badge,
  Divider,
  ActionIcon,
  Tooltip,
  Grid,
  Box,
} from '@mantine/core';
import { RichTextEditor, Link } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { BlogGenerationForm } from '../components/blog/BlogGenerationForm';
import { blogService } from '../services/blog';
import { useMutation } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import { useNavigate } from 'react-router-dom';
import { useBlogStore } from '../store/blogStore';
import {
  IconAlertCircle,
  IconPhotoPlus,
  IconSettings,
  IconEye,
  IconDeviceFloppy,
  IconFileUpload,
  IconPencil,
  IconRobot,
  IconClock,
  IconEdit,
} from '@tabler/icons-react';

export function CreateBlog() {
  const [generatedContent, setGeneratedContent] = useState('');
  const [generatedTitle, setGeneratedTitle] = useState('');
  const [activeTab, setActiveTab] = useState<string>('generate');
  const [readingTime, setReadingTime] = useState(0);
  const navigate = useNavigate();

  const {
    currentDraft,
    setCurrentDraft,
    clearCurrentDraft,
    addRecentBlog,
  } = useBlogStore();

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link,
    ],
    content: generatedContent,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setGeneratedContent(html);
      
      // Calculate reading time
      const words = html.replace(/<[^>]*>/g, '').split(/\s+/).length;
      setReadingTime(Math.ceil(words / 200));
      
      // Auto-save draft
      setCurrentDraft({
        title: generatedTitle,
        content: html,
        status: 'draft',
      });
    },
  });

  // Load draft if exists
  useEffect(() => {
    if (currentDraft) {
      setGeneratedContent(currentDraft.content || '');
      setGeneratedTitle(currentDraft.title || '');
      editor?.commands.setContent(currentDraft.content || '');
    }
  }, []);

  useEffect(() => {
    // Switch to edit tab when content is generated
    if (generatedContent && activeTab === 'generate') {
      setActiveTab('edit');
    }
  }, [generatedContent]);

  const handleBlogGenerated = (content: string, title: string) => {
    setGeneratedContent(content);
    setGeneratedTitle(title);
    editor?.commands.setContent(content);
    
    // Calculate reading time
    const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    setReadingTime(Math.ceil(words / 200));
    
    // Save as draft
    setCurrentDraft({
      title,
      content,
      status: 'draft',
    });
  };

  const saveMutation = useMutation({
    mutationFn: () => {
      return blogService.createBlog({
        title: generatedTitle,
        content: generatedContent,
        status: 'draft',
        meta_description: '',
        tags: [],
        estimated_read_time: readingTime,
      });
    },
    onSuccess: (savedBlog) => {
      notifications.show({
        title: 'Success',
        message: 'Blog saved as draft',
        color: 'green',
      });
      addRecentBlog(savedBlog);
      clearCurrentDraft();
      navigate('/my-blogs');
    },
    onError: (error) => {
      console.error('Failed to save blog:', error);
      notifications.show({
        title: 'Error',
        message: 'Failed to save blog',
        color: 'red',
      });
    },
  });

  const publishMutation = useMutation({
    mutationFn: () => {
      return blogService.createBlog({
        title: generatedTitle,
        content: generatedContent,
        status: 'published',
        meta_description: '',
        tags: [],
        estimated_read_time: readingTime,
      });
    },
    onSuccess: (savedBlog) => {
      notifications.show({
        title: 'Success',
        message: 'Blog published successfully',
        color: 'green',
      });
      addRecentBlog(savedBlog);
      clearCurrentDraft();
      navigate('/my-blogs');
    },
    onError: (error) => {
      console.error('Failed to publish blog:', error);
      notifications.show({
        title: 'Error',
        message: 'Failed to publish blog',
        color: 'red',
      });
    },
  });

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGeneratedTitle(e.target.value);
    setCurrentDraft({
      title: e.target.value,
      content: generatedContent,
      status: 'draft',
    });
  };

  const handleTabChange = (value: string | null) => {
    if (value) {
      setActiveTab(value);
    }
  };

  return (
    <Container size="xl" pt="md" pb="xl">
      <Group justify="space-between" mb="md">
        <Title order={2}>Create New Blog Post</Title>
        
        <Group>
          {generatedContent && (
            <>
              <Badge size="lg" variant="light" color="blue">
                <Group gap={4}>
                  <IconClock size={14} />
                  <Text size="xs">{readingTime} min read</Text>
                </Group>
              </Badge>
              
              <Tooltip label="Preview">
                <ActionIcon variant="light" size="lg" radius="md" color="gray">
                  <IconEye size={18} />
                </ActionIcon>
              </Tooltip>
              
              <Tooltip label="SEO Settings">
                <ActionIcon variant="light" size="lg" radius="md" color="gray">
                  <IconSettings size={18} />
                </ActionIcon>
              </Tooltip>
            </>
          )}
        </Group>
      </Group>
      
      <Tabs value={activeTab} onChange={handleTabChange}>
        <Tabs.List mb="md">
          <Tabs.Tab value="generate" leftSection={<IconRobot size={16} />}>
            Generate Content
          </Tabs.Tab>
          <Tabs.Tab 
            value="edit" 
            leftSection={<IconEdit size={16} />}
            disabled={!generatedContent}
          >
            Edit Content
          </Tabs.Tab>
        </Tabs.List>
        
        <Tabs.Panel value="generate">
          <BlogGenerationForm onSuccess={handleBlogGenerated} />
        </Tabs.Panel>
        
        <Tabs.Panel value="edit">
          {generatedContent ? (
            <Grid gutter="md">
              <Grid.Col span={{ base: 12, md: 8 }}>
                <Card withBorder shadow="sm" padding="lg" radius="md">
                  <Stack gap="md">
                    <TextInput
                      placeholder="Enter blog title"
                      label="Blog Title"
                      size="lg"
                      required
                      value={generatedTitle}
                      onChange={handleTitleChange}
                      styles={{
                        input: {
                          fontSize: '1.5rem',
                          fontWeight: 600,
                          fontFamily: 'Poppins, sans-serif',
                        },
                      }}
                    />
                    
                    <Divider />
                    
                    <Box>
                      <Text fw={500} mb="xs">Blog Content</Text>
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

                        <RichTextEditor.Content mih={400} />
                      </RichTextEditor>
                    </Box>
                  </Stack>
                </Card>
              </Grid.Col>
              
              <Grid.Col span={{ base: 12, md: 4 }}>
                <Stack>
                  <Card withBorder shadow="sm" padding="md" radius="md">
                    <Title order={5} mb="md">Actions</Title>
                    <Stack gap="sm">
                      <Button
                        fullWidth
                        variant="filled"
                        leftSection={<IconDeviceFloppy size={16} />}
                        onClick={() => saveMutation.mutate()}
                        loading={saveMutation.isPending}
                        disabled={!generatedTitle || !generatedContent}
                      >
                        Save as Draft
                      </Button>
                      
                      <Button
                        fullWidth
                        variant="light"
                        color="green"
                        leftSection={<IconFileUpload size={16} />}
                        onClick={() => publishMutation.mutate()}
                        loading={publishMutation.isPending}
                        disabled={!generatedTitle || !generatedContent}
                      >
                        Publish
                      </Button>
                      
                      <Button
                        fullWidth
                        variant="subtle"
                        leftSection={<IconEye size={16} />}
                      >
                        Preview
                      </Button>
                    </Stack>
                  </Card>
                  
                  <Card withBorder shadow="sm" padding="md" radius="md">
                    <Title order={5} mb="md">Media</Title>
                    <Button
                      fullWidth
                      variant="default"
                      leftSection={<IconPhotoPlus size={16} />}
                    >
                      Add Featured Image
                    </Button>
                  </Card>
                </Stack>
              </Grid.Col>
            </Grid>
          ) : (
            <Card withBorder shadow="sm" padding="lg" radius="md">
              <Flex direction="column" align="center" gap="md" py="xl">
                <IconPencil size={48} stroke={1.5} opacity={0.3} />
                <Text fw={500} size="lg" c="dimmed">No content to edit yet</Text>
                <Button
                  variant="light"
                  onClick={() => setActiveTab('generate')}
                >
                  Generate Content First
                </Button>
              </Flex>
            </Card>
          )}
        </Tabs.Panel>
      </Tabs>
    </Container>
  );
} 