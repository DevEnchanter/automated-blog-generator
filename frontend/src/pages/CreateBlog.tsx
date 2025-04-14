import { useState, useEffect } from 'react';
import { Container, Title, Paper, Button, Group, Stack, Alert } from '@mantine/core';
import { RichTextEditor, Link } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { BlogGenerationForm } from '../components/blog/BlogGenerationForm';
import { blogService } from '../services/blog';
import { useMutation } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import { useNavigate } from 'react-router-dom';
import { useBlogStore } from '../store/blogStore';
import { IconAlertCircle } from '@tabler/icons-react';

export function CreateBlog() {
  const [generatedContent, setGeneratedContent] = useState('');
  const [generatedTitle, setGeneratedTitle] = useState('');
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
      setGeneratedContent(editor.getHTML());
      // Auto-save draft
      setCurrentDraft({
        title: generatedTitle,
        content: editor.getHTML(),
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

  const handleBlogGenerated = (content: string, title: string) => {
    setGeneratedContent(content);
    setGeneratedTitle(title);
    editor?.commands.setContent(content);
    // Save as draft
    setCurrentDraft({
      title,
      content,
      status: 'draft',
    });
  };

  const saveMutation = useMutation({
    mutationFn: () => {
      console.log('Saving blog with data:', {
        title: generatedTitle,
        content: generatedContent,
        status: 'draft',
        meta_description: '',
        tags: [],
        estimated_read_time: Math.ceil(generatedContent.split(' ').length / 200),
      });
      return blogService.createBlog({
        title: generatedTitle,
        content: generatedContent,
        status: 'draft',
        meta_description: '',
        tags: [],
        estimated_read_time: Math.ceil(generatedContent.split(' ').length / 200),
      });
    },
    onSuccess: (savedBlog) => {
      console.log('Blog saved successfully:', savedBlog);
      notifications.show({
        title: 'Success',
        message: 'Blog saved successfully',
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

  return (
    <Container size="lg">
      <Title order={2} mb="lg">Create New Blog Post</Title>
      
      <BlogGenerationForm onSuccess={handleBlogGenerated} />
      
      {generatedContent && (
        <Paper mt="xl" p="md" withBorder>
          <Stack>
            <Title order={3}>{generatedTitle}</Title>
            
            <Title order={4} mb="md">Generated Content</Title>
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
                onClick={() => saveMutation.mutate()}
                loading={saveMutation.isPending}
                disabled={!generatedTitle || !generatedContent}
              >
                Save as Draft
              </Button>
            </Group>
          </Stack>
        </Paper>
      )}
    </Container>
  );
} 