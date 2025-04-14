import { useState, useEffect } from 'react';
import {
  Box,
  TextInput,
  Select,
  Button,
  Stack,
  Card,
  Combobox,
  InputBase,
  useCombobox,
  Alert,
  Title,
  Text,
  Group,
  Badge,
  TagsInput,
  Chip,
  Divider,
  Grid,
  ThemeIcon,
  Textarea,
  Tooltip,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useMutation } from '@tanstack/react-query';
import { generateBlog, BlogGenerationParams, BlogGenerationResponse } from '../../services/blog';
import { useBlogStore } from '../../store/blogStore';
import {
  IconAlertCircle,
  IconBrain,
  IconVocabulary,
  IconBulb,
  IconUsers,
  IconMessageCircle,
  IconRuler,
  IconArticle,
} from '@tabler/icons-react';

interface BlogGenerationFormProps {
  onSuccess: (content: string, title: string) => void;
}

export function BlogGenerationForm({ onSuccess }: BlogGenerationFormProps) {
  const [keywords, setKeywords] = useState<string[]>([]);

  const {
    isGenerating,
    generationError,
    setGenerationStatus,
    cacheGeneration,
    getCachedGeneration,
  } = useBlogStore();

  const form = useForm({
    initialValues: {
      topic: '',
      tone: 'professional',
      length: 'medium',
      target_audience: 'general',
      additional_instructions: '',
    },
    validate: {
      topic: (value) => (!value ? 'Topic is required' : null),
    },
  });

  // Check for cached generation when form values change
  useEffect(() => {
    const params = {
      ...form.values,
      keywords,
    };
    const cached = getCachedGeneration(params);
    if (cached) {
      onSuccess(cached.content, cached.title);
    }
  }, [form.values, keywords]);

  const generateMutation = useMutation<BlogGenerationResponse, Error, BlogGenerationParams>({
    mutationFn: generateBlog,
    onMutate: () => {
      setGenerationStatus(true);
    },
    onSuccess: (data) => {
      setGenerationStatus(false);
      notifications.show({
        title: 'Success',
        message: 'Blog post generated successfully',
        color: 'green',
      });
      cacheGeneration({ ...form.values, keywords }, data);
      onSuccess(data.content, data.title);
    },
    onError: (error) => {
      setGenerationStatus(false, error.message);
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to generate blog post',
        color: 'red',
      });
    },
  });

  const handleSubmit = form.onSubmit((values) => {
    const params = {
      ...values,
      keywords,
    };
    
    // Check cache first
    const cached = getCachedGeneration(params);
    if (cached) {
      onSuccess(cached.content, cached.title);
      return;
    }

    // If not in cache, generate new content
    generateMutation.mutate(params);
  });

  const toneOptions = [
    { value: 'professional', label: 'Professional', description: 'Formal, business-oriented tone', icon: IconMessageCircle },
    { value: 'casual', label: 'Casual', description: 'Relaxed, conversational style', icon: IconMessageCircle },
    { value: 'technical', label: 'Technical', description: 'Detailed, precise language', icon: IconMessageCircle },
    { value: 'friendly', label: 'Friendly', description: 'Warm, approachable voice', icon: IconMessageCircle },
  ];

  const lengthOptions = [
    { value: 'short', label: 'Short', description: '500-800 words', icon: IconRuler },
    { value: 'medium', label: 'Medium', description: '1000-1500 words', icon: IconRuler },
    { value: 'long', label: 'Long', description: '2000-2500 words', icon: IconRuler },
  ];

  const audienceOptions = [
    { value: 'general', label: 'General', description: 'For everyone', icon: IconUsers },
    { value: 'technical', label: 'Technical', description: 'For tech-savvy readers', icon: IconUsers },
    { value: 'business', label: 'Business', description: 'For professionals', icon: IconUsers },
    { value: 'academic', label: 'Academic', description: 'For scholarly audiences', icon: IconUsers },
  ];

  return (
    <Card withBorder shadow="sm" p="lg">
      <Title order={4} mb="md">AI Blog Generator</Title>
      <Text size="sm" c="dimmed" mb="lg">
        Fill in the details below to generate a professional blog post using AI.
      </Text>

      {generationError && (
        <Alert 
          icon={<IconAlertCircle size={16} />} 
          title="Generation Error" 
          color="red"
          variant="filled"
          mb="md"
        >
          {generationError}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Grid gutter="lg">
          <Grid.Col span={{ base: 12, md: 8 }}>
            <Stack gap="md">
              <TextInput
                required
                label="Topic"
                description="What is your blog post about?"
                placeholder="Enter the main topic of your blog post"
                leftSection={<IconBulb size={16} />}
                {...form.getInputProps('topic')}
              />

              <TagsInput
                label="Keywords"
                description="Add relevant keywords to improve generation (press Enter after each)"
                placeholder="Enter keywords and press Enter"
                leftSection={<IconVocabulary size={16} />}
                value={keywords}
                onChange={setKeywords}
                maxTags={10}
                clearable
              />

              <Textarea
                label="Additional Instructions"
                description="Any specific instructions for the AI?"
                placeholder="E.g., Include case studies, focus on latest trends, etc."
                autosize
                minRows={3}
                maxRows={5}
                {...form.getInputProps('additional_instructions')}
              />
            </Stack>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 4 }}>
            <Stack gap="md">
              <Select
                label="Tone"
                description="How should the content sound?"
                placeholder="Select a tone"
                data={toneOptions.map(option => ({
                  value: option.value,
                  label: option.label,
                }))}
                {...form.getInputProps('tone')}
              />

              <Select
                label="Length"
                description="How long should the blog be?"
                placeholder="Select a length"
                data={lengthOptions.map(option => ({
                  value: option.value,
                  label: `${option.label} (${option.description})`,
                }))}
                {...form.getInputProps('length')}
              />

              <Select
                label="Target Audience"
                description="Who are you writing for?"
                placeholder="Select an audience"
                data={audienceOptions.map(option => ({
                  value: option.value,
                  label: `${option.label} (${option.description})`,
                }))}
                {...form.getInputProps('target_audience')}
              />
            </Stack>
          </Grid.Col>
        </Grid>

        <Divider my="lg" />

        <Group justify="flex-end">
          <Button 
            type="submit" 
            loading={isGenerating}
            disabled={isGenerating || !form.values.topic}
            leftSection={<IconBrain size={16} />}
            size="md"
          >
            {isGenerating ? 'Generating...' : 'Generate Blog Post'}
          </Button>
        </Group>
      </form>
    </Card>
  );
} 