import { useState, useEffect } from 'react';
import { Box, TextInput, Select, Button, Stack, Paper, Combobox, InputBase, useCombobox, Alert } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useMutation } from '@tanstack/react-query';
import { generateBlog, BlogGenerationParams, BlogGenerationResponse } from '../../services/blog';
import { useBlogStore } from '../../store/blogStore';
import { IconAlertCircle } from '@tabler/icons-react';

interface BlogGenerationFormProps {
  onSuccess: (content: string, title: string) => void;
}

export function BlogGenerationForm({ onSuccess }: BlogGenerationFormProps) {
  const [keywords, setKeywords] = useState<string[]>([]);
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

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

  const handleKeywordAdd = (keyword: string) => {
    if (keyword && !keywords.includes(keyword)) {
      setKeywords((current) => [...current, keyword]);
    }
  };

  const handleKeywordRemove = (keyword: string) => {
    setKeywords((current) => current.filter((k) => k !== keyword));
  };

  return (
    <Paper p="md" withBorder>
      <form onSubmit={handleSubmit}>
        <Stack>
          {generationError && (
            <Alert 
              icon={<IconAlertCircle size={16} />} 
              title="Generation Error" 
              color="red"
              variant="filled"
            >
              {generationError}
            </Alert>
          )}

          <TextInput
            required
            label="Topic"
            placeholder="Enter the main topic of your blog post"
            {...form.getInputProps('topic')}
          />

          <Select
            label="Tone"
            data={[
              { value: 'professional', label: 'Professional' },
              { value: 'casual', label: 'Casual' },
              { value: 'technical', label: 'Technical' },
              { value: 'friendly', label: 'Friendly' },
            ]}
            {...form.getInputProps('tone')}
          />

          <Select
            label="Length"
            data={[
              { value: 'short', label: 'Short (500-800 words)' },
              { value: 'medium', label: 'Medium (1000-1500 words)' },
              { value: 'long', label: 'Long (2000-2500 words)' },
            ]}
            {...form.getInputProps('length')}
          />

          <Select
            label="Target Audience"
            data={[
              { value: 'general', label: 'General' },
              { value: 'technical', label: 'Technical' },
              { value: 'business', label: 'Business' },
              { value: 'academic', label: 'Academic' },
            ]}
            {...form.getInputProps('target_audience')}
          />

          <Box>
            <InputBase
              label="Keywords"
              component="div"
            >
              <Combobox
                store={combobox}
                onOptionSubmit={handleKeywordAdd}
              >
                <Combobox.Target>
                  <TextInput
                    placeholder="Type a keyword and press Enter"
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' && event.currentTarget.value) {
                        event.preventDefault();
                        handleKeywordAdd(event.currentTarget.value);
                        event.currentTarget.value = '';
                      }
                    }}
                  />
                </Combobox.Target>
              </Combobox>
            </InputBase>
            {keywords.length > 0 && (
              <Box mt="xs">
                {keywords.map((keyword) => (
                  <Button
                    key={keyword}
                    variant="light"
                    size="xs"
                    mr="xs"
                    mb="xs"
                    onClick={() => handleKeywordRemove(keyword)}
                  >
                    {keyword} ×
                  </Button>
                ))}
              </Box>
            )}
          </Box>

          <Button 
            type="submit" 
            loading={isGenerating}
            disabled={isGenerating}
          >
            Generate Blog Post
          </Button>
        </Stack>
      </form>
    </Paper>
  );
} 