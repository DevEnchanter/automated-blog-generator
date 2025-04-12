import { useState } from 'react';
import { Container, Title, Paper } from '@mantine/core';
import { RichTextEditor, Link } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { BlogGenerationForm } from '../components/blog/BlogGenerationForm';

export function CreateBlog() {
  const [generatedContent, setGeneratedContent] = useState('');

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link,
    ],
    content: generatedContent,
    onUpdate: ({ editor }) => {
      setGeneratedContent(editor.getHTML());
    },
  });

  const handleBlogGenerated = (content: string) => {
    setGeneratedContent(content);
    editor?.commands.setContent(content);
  };

  return (
    <Container size="lg">
      <Title order={2} mb="lg">Create New Blog Post</Title>
      
      <BlogGenerationForm onSuccess={handleBlogGenerated} />
      
      {generatedContent && (
        <Paper mt="xl" p="md" withBorder>
          <Title order={3} mb="md">Generated Content</Title>
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
        </Paper>
      )}
    </Container>
  );
} 