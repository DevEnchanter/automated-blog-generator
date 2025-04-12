import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { TextInput, PasswordInput, Button, Paper, Title, Text, Container, Group } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useAuthStore } from '../../store/auth';
import type { LoginCredentials } from '../../types/auth';

export function LoginForm() {
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const login = useAuthStore(state => state.login);

    const form = useForm<LoginCredentials>({
        initialValues: {
            email: '',
            password: '',
        },
        validate: {
            email: (value) => {
                if (!value) return 'Email is required';
                if (!/^\S+@\S+$/.test(value)) return 'Invalid email';
                return null;
            },
            password: (value) => (!value ? 'Password is required' : null),
        },
    });

    const handleSubmit = async (values: LoginCredentials) => {
        try {
            setError('');
            await login(values);
            navigate('/dashboard');
        } catch (err) {
            setError('Invalid email or password');
        }
    };

    return (
        <Container size={420} my={40}>
            <Title ta="center">
                Welcome back!
            </Title>
            <Text c="dimmed" size="sm" ta="center" mt={5}>
                Enter your credentials to continue
            </Text>

            <Paper withBorder shadow="md" p={30} mt={30} radius="md">
                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <TextInput
                        label="Email"
                        placeholder="your@email.com"
                        required
                        {...form.getInputProps('email')}
                    />
                    <PasswordInput
                        label="Password"
                        placeholder="Your password"
                        required
                        mt="md"
                        {...form.getInputProps('password')}
                    />
                    <Group justify="flex-end" mt="md">
                        <Text component={Link} to="/forgot-password" size="sm" c="blue" style={{ textDecoration: 'none' }}>
                            Forgot password?
                        </Text>
                    </Group>
                    {error && (
                        <Text c="red" size="sm" mt="sm">
                            {error}
                        </Text>
                    )}
                    <Button fullWidth mt="xl" type="submit">
                        Sign in
                    </Button>
                </form>
                <Text ta="center" mt="md">
                    Don't have an account?{' '}
                    <Text component={Link} to="/register" c="blue" style={{ textDecoration: 'none' }}>
                        Register here
                    </Text>
                </Text>
            </Paper>
        </Container>
    );
} 