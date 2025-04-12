import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { TextInput, Button, Paper, Title, Text, Container, Box, CopyButton, Group } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useAuthStore } from '../../store/auth';

interface ForgotPasswordForm {
    email: string;
}

export function ForgotPassword() {
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [resetToken, setResetToken] = useState<string>();
    const navigate = useNavigate();
    const requestPasswordReset = useAuthStore(state => state.requestPasswordReset);

    const form = useForm<ForgotPasswordForm>({
        initialValues: {
            email: '',
        },
        validate: {
            email: (value) => {
                if (!value) return 'Email is required';
                if (!/^\S+@\S+$/.test(value)) return 'Invalid email';
                return null;
            },
        },
    });

    const handleSubmit = async (values: ForgotPasswordForm) => {
        try {
            setError('');
            setSuccess('');
            const response = await requestPasswordReset(values.email);
            setSuccess(response.message);
            if (response.token) {
                setResetToken(response.token);
            }
        } catch (err) {
            setError('Failed to process request. Please try again.');
        }
    };

    const resetLink = resetToken ? `/reset-password?token=${resetToken}` : '';

    return (
        <Container size={420} my={40}>
            <Title ta="center">
                Forgot Password
            </Title>
            <Text c="dimmed" size="sm" ta="center" mt={5}>
                Enter your email to reset your password
            </Text>

            <Paper withBorder shadow="md" p={30} mt={30} radius="md">
                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <TextInput
                        label="Email"
                        placeholder="your@email.com"
                        required
                        {...form.getInputProps('email')}
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
                    {resetToken && (
                        <Box mt="md" p="md" style={{ backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                            <Text size="sm" fw={500}>
                                Development Mode: Reset Password Instructions
                            </Text>
                            <Text size="sm" mt="xs">
                                Click the link below to reset your password:
                            </Text>
                            <Group mt="xs">
                                <Text
                                    component={Link}
                                    to={resetLink}
                                    c="blue"
                                    style={{ wordBreak: 'break-all' }}
                                >
                                    Reset Password Link
                                </Text>
                                <CopyButton value={window.location.origin + resetLink}>
                                    {({ copied, copy }) => (
                                        <Button variant="light" size="xs" onClick={copy}>
                                            {copied ? 'Copied' : 'Copy Link'}
                                        </Button>
                                    )}
                                </CopyButton>
                            </Group>
                            <Text size="sm" mt="sm" c="dimmed">
                                Token: {resetToken}
                            </Text>
                        </Box>
                    )}
                    <Button fullWidth mt="xl" type="submit">
                        Reset Password
                    </Button>
                </form>
                <Text ta="center" mt="md">
                    Remember your password?{' '}
                    <Text component={Link} to="/login" c="blue" style={{ textDecoration: 'none' }}>
                        Back to login
                    </Text>
                </Text>
            </Paper>
        </Container>
    );
} 