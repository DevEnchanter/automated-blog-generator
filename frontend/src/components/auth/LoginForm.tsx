import { useState } from 'react';
import { TextInput, PasswordInput, Button, Group, Stack, Text, Anchor, Container, Paper } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/auth';

interface LoginFormValues {
    email: string;
    password: string;
}

export function LoginForm() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const login = useAuthStore((state) => state.login);

    const form = useForm<LoginFormValues>({
        initialValues: {
            email: '',
            password: '',
        },
        validate: {
            email: (value) => (!value ? 'Email is required' : null),
            password: (value) => (!value ? 'Password is required' : null),
        },
    });

    const handleSubmit = async (values: LoginFormValues) => {
        try {
            setLoading(true);
            setError('');
            await login(values.email, values.password);
            notifications.show({
                title: 'Success',
                message: 'Logged in successfully',
                color: 'green',
            });
            navigate('/create-blog');
        } catch (error: any) {
            console.error('Login error:', error);
            setError(error?.response?.data?.detail || 'Failed to log in. Please check your credentials.');
            notifications.show({
                title: 'Error',
                message: error?.response?.data?.detail || 'Failed to log in. Please check your credentials.',
                color: 'red',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container size="sm">
            <Paper shadow="md" p="xl" mt="xl">
                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <Stack gap="md">
                        <Text size="xl" fw={500}>Welcome back</Text>
                        
                        {error && (
                            <Text c="red" size="sm">
                                {error}
                            </Text>
                        )}
                        
                        <TextInput
                            required
                            label="Email"
                            placeholder="your@email.com"
                            {...form.getInputProps('email')}
                        />

                        <PasswordInput
                            required
                            label="Password"
                            placeholder="Your password"
                            {...form.getInputProps('password')}
                        />

                        <Group justify="space-between" align="center">
                            <Anchor component={Link} to="/forgot-password" size="sm">
                                Forgot password?
                            </Anchor>
                            <Anchor component={Link} to="/register" size="sm">
                                Don't have an account? Register
                            </Anchor>
                        </Group>

                        <Button type="submit" loading={loading}>
                            Sign in
                        </Button>
                    </Stack>
                </form>
            </Paper>
        </Container>
    );
} 