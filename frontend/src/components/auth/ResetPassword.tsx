import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { PasswordInput, Button, Paper, Title, Text, Container } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useAuthStore } from '../../store/auth';

interface ResetPasswordForm {
    password: string;
    confirmPassword: string;
}

export function ResetPassword() {
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const resetPassword = useAuthStore(state => state.resetPassword);

    const form = useForm<ResetPasswordForm>({
        initialValues: {
            password: '',
            confirmPassword: '',
        },
        validate: {
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

    const handleSubmit = async (values: ResetPasswordForm) => {
        if (!token) {
            setError('Invalid reset token');
            return;
        }

        try {
            setError('');
            setSuccess('');
            const response = await resetPassword(token, values.password);
            setSuccess(response.message);
            // Redirect to login after 2 seconds
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError('Failed to reset password. Please try again.');
        }
    };

    if (!token) {
        return (
            <Container size={420} my={40}>
                <Title ta="center" c="red">
                    Invalid Reset Link
                </Title>
                <Text c="dimmed" size="sm" ta="center" mt={5}>
                    The password reset link is invalid or has expired.
                </Text>
                <Button
                    component={Link}
                    to="/forgot-password"
                    fullWidth
                    mt="xl"
                >
                    Request New Reset Link
                </Button>
            </Container>
        );
    }

    return (
        <Container size={420} my={40}>
            <Title ta="center">
                Reset Password
            </Title>
            <Text c="dimmed" size="sm" ta="center" mt={5}>
                Enter your new password
            </Text>

            <Paper withBorder shadow="md" p={30} mt={30} radius="md">
                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <PasswordInput
                        label="New Password"
                        placeholder="Enter your new password"
                        required
                        {...form.getInputProps('password')}
                    />
                    <PasswordInput
                        label="Confirm Password"
                        placeholder="Confirm your new password"
                        required
                        mt="md"
                        {...form.getInputProps('confirmPassword')}
                    />
                    {error && (
                        <Text c="red" size="sm" mt="sm">
                            {error}
                        </Text>
                    )}
                    {success && (
                        <Text c="green" size="sm" mt="sm">
                            {success}
                        </Text>
                    )}
                    <Button fullWidth mt="xl" type="submit">
                        Reset Password
                    </Button>
                </form>
            </Paper>
        </Container>
    );
} 