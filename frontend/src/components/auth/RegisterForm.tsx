import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { TextInput, PasswordInput, Button, Paper, Title, Text, Container } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useAuthStore } from '../../store/auth';
import type { RegisterCredentials } from '../../types/auth';

export function RegisterForm() {
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const register = useAuthStore(state => state.register);

    const form = useForm<RegisterCredentials>({
        initialValues: {
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
        validate: {
            username: (value) => (!value ? 'Username is required' : null),
            email: (value) => {
                if (!value) return 'Email is required';
                if (!/^\S+@\S+$/.test(value)) return 'Invalid email';
                return null;
            },
            password: (value) => {
                if (!value) return 'Password is required';
                if (value.length < 8) return 'Password must be at least 8 characters';
                return null;
            },
            confirmPassword: (value, values) => {
                if (!value) return 'Please confirm your password';
                if (value !== values.password) return 'Passwords do not match';
                return null;
            },
        },
    });

    const handleSubmit = async (values: RegisterCredentials) => {
        try {
            setError('');
            await register(values);
            navigate('/dashboard');
        } catch (err) {
            setError('Registration failed. Please try again.');
        }
    };

    return (
        <Container size={420} my={40}>
            <Title ta="center">
                Create an account
            </Title>
            <Text c="dimmed" size="sm" ta="center" mt={5}>
                Fill in your details to get started
            </Text>

            <Paper withBorder shadow="md" p={30} mt={30} radius="md">
                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <TextInput
                        label="Username"
                        placeholder="Your username"
                        required
                        {...form.getInputProps('username')}
                    />
                    <TextInput
                        label="Email"
                        placeholder="your@email.com"
                        required
                        mt="md"
                        {...form.getInputProps('email')}
                    />
                    <PasswordInput
                        label="Password"
                        placeholder="Create a password"
                        required
                        mt="md"
                        {...form.getInputProps('password')}
                    />
                    <PasswordInput
                        label="Confirm Password"
                        placeholder="Confirm your password"
                        required
                        mt="md"
                        {...form.getInputProps('confirmPassword')}
                    />
                    {error && (
                        <Text c="red" size="sm" mt="sm">
                            {error}
                        </Text>
                    )}
                    <Button fullWidth mt="xl" type="submit">
                        Register
                    </Button>
                </form>
                <Text ta="center" mt="md">
                    Already have an account?{' '}
                    <Text component={Link} to="/login" c="blue" style={{ textDecoration: 'none' }}>
                        Sign in here
                    </Text>
                </Text>
            </Paper>
        </Container>
    );
} 