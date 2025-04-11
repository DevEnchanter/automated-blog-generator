import { useState } from 'react';
import { 
    Stepper, 
    Button, 
    Group, 
    TextInput, 
    Textarea, 
    Paper, 
    Title,
    Select,
    Stack,
    Text,
    LoadingOverlay,
    Notification
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useNavigate } from 'react-router-dom';
import { blogService, BlogGenerationParams } from '../services/blog';

interface BlogForm {
    title: string;
    topic: string;
    keywords: string;
    tone: string;
    length: string;
    content: string;
}

const toneOptions = [
    { value: 'professional', label: 'Professional' },
    { value: 'casual', label: 'Casual' },
    { value: 'humorous', label: 'Humorous' },
    { value: 'technical', label: 'Technical' },
    { value: 'storytelling', label: 'Storytelling' }
];

const lengthOptions = [
    { value: 'short', label: 'Short (300-500 words)' },
    { value: 'medium', label: 'Medium (500-1000 words)' },
    { value: 'long', label: 'Long (1000+ words)' }
];

export function CreateBlog() {
    const [active, setActive] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const form = useForm<BlogForm>({
        initialValues: {
            title: '',
            topic: '',
            keywords: '',
            tone: '',
            length: '',
            content: ''
        },
        validate: {
            title: (value) => (!value ? 'Title is required' : null),
            topic: (value) => (!value ? 'Topic is required' : null),
            keywords: (value) => (!value ? 'Keywords are required' : null),
            tone: (value) => (!value ? 'Tone is required' : null),
            length: (value) => (!value ? 'Length is required' : null)
        }
    });

    const handleGenerate = async (values: BlogForm) => {
        try {
            setLoading(true);
            setError(null);
            const params: BlogGenerationParams = {
                title: values.title,
                topic: values.topic,
                keywords: values.keywords,
                tone: values.tone,
                length: values.length
            };
            const content = await blogService.generateContent(params);
            form.setFieldValue('content', content);
            nextStep();
        } catch (err) {
            setError('Failed to generate blog content. Please try again.');
            console.error('Failed to generate blog:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);
            setError(null);
            await blogService.createBlog({
                title: form.values.title,
                content: form.values.content,
                status: 'published'
            });
            navigate('/my-blogs');
        } catch (err) {
            setError('Failed to save blog. Please try again.');
            console.error('Failed to save blog:', err);
        } finally {
            setLoading(false);
        }
    };

    const nextStep = () => setActive((current) => current + 1);
    const prevStep = () => setActive((current) => current - 1);

    return (
        <div style={{ position: 'relative' }}>
            <LoadingOverlay visible={loading} />
            
            <Title order={2} mb="xl">Create New Blog</Title>

            {error && (
                <Notification color="red" mb="md" onClose={() => setError(null)}>
                    {error}
                </Notification>
            )}

            <Stepper active={active} mb="xl">
                <Stepper.Step label="Blog Details" description="Set basic information">
                    <Paper withBorder p="md" mt="md">
                        <form id="blog-form" onSubmit={form.onSubmit(handleGenerate)}>
                            <Stack>
                                <TextInput
                                    label="Blog Title"
                                    placeholder="Enter a catchy title"
                                    required
                                    {...form.getInputProps('title')}
                                />
                                <TextInput
                                    label="Main Topic"
                                    placeholder="What's your blog about?"
                                    required
                                    {...form.getInputProps('topic')}
                                />
                                <TextInput
                                    label="Keywords"
                                    placeholder="Enter keywords separated by commas"
                                    required
                                    {...form.getInputProps('keywords')}
                                />
                                <Select
                                    label="Writing Tone"
                                    placeholder="Select the tone"
                                    data={toneOptions}
                                    required
                                    {...form.getInputProps('tone')}
                                />
                                <Select
                                    label="Content Length"
                                    placeholder="Select desired length"
                                    data={lengthOptions}
                                    required
                                    {...form.getInputProps('length')}
                                />
                            </Stack>
                        </form>
                    </Paper>
                </Stepper.Step>

                <Stepper.Step label="Generated Content" description="Review and edit">
                    <Paper withBorder p="md" mt="md">
                        <Stack>
                            <Text size="sm" c="dimmed">
                                Review and edit the generated content below. You can make any changes needed.
                            </Text>
                            <Textarea
                                label="Blog Content"
                                placeholder="Your blog content will appear here"
                                minRows={10}
                                autosize
                                {...form.getInputProps('content')}
                            />
                        </Stack>
                    </Paper>
                </Stepper.Step>

                <Stepper.Completed>
                    Completed! Click submit to publish your blog.
                </Stepper.Completed>
            </Stepper>

            <Group justify="flex-end" mt="xl">
                {active !== 0 && (
                    <Button variant="default" onClick={prevStep}>
                        Back
                    </Button>
                )}
                {active === 0 && (
                    <Button type="submit" form="blog-form">
                        Generate Content
                    </Button>
                )}
                {active === 1 && (
                    <Button onClick={nextStep}>
                        Continue
                    </Button>
                )}
                {active === 2 && (
                    <Button onClick={handleSubmit} color="green">
                        Publish Blog
                    </Button>
                )}
            </Group>
        </div>
    );
} 