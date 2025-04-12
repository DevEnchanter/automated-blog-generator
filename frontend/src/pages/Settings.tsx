import { Container, Title, Paper, TextInput, Button, Stack, PasswordInput, Divider, Text, Group } from '@mantine/core';
import { useForm } from '@mantine/form';

export function Settings() {
    const form = useForm({
        initialValues: {
            email: '',
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        },
        validate: {
            email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
            newPassword: (value) => (value.length < 6 ? 'Password must be at least 6 characters' : null),
            confirmPassword: (value, values) =>
                value !== values.newPassword ? 'Passwords do not match' : null,
        },
    });

    const handleUpdateEmail = (values: { email: string }) => {
        // TODO: Implement email update
        console.log('Update email:', values.email);
    };

    const handleUpdatePassword = (values: { currentPassword: string; newPassword: string }) => {
        // TODO: Implement password update
        console.log('Update password:', values);
    };

    return (
        <Container size="sm" py="xl">
            <Title order={2} mb="xl">Settings</Title>

            <Paper shadow="sm" p="xl" radius="md" mb="xl">
                <Title order={3} mb="lg">Email Settings</Title>
                <form onSubmit={form.onSubmit(handleUpdateEmail)}>
                    <Stack>
                        <TextInput
                            label="New Email"
                            placeholder="Enter new email"
                            {...form.getInputProps('email')}
                        />
                        <Button type="submit">Update Email</Button>
                    </Stack>
                </form>
            </Paper>

            <Paper shadow="sm" p="xl" radius="md">
                <Title order={3} mb="lg">Password Settings</Title>
                <form onSubmit={form.onSubmit(handleUpdatePassword)}>
                    <Stack>
                        <PasswordInput
                            label="Current Password"
                            placeholder="Enter current password"
                            {...form.getInputProps('currentPassword')}
                        />
                        <PasswordInput
                            label="New Password"
                            placeholder="Enter new password"
                            {...form.getInputProps('newPassword')}
                        />
                        <PasswordInput
                            label="Confirm New Password"
                            placeholder="Confirm new password"
                            {...form.getInputProps('confirmPassword')}
                        />
                        <Button type="submit">Update Password</Button>
                    </Stack>
                </form>
            </Paper>

            <Paper shadow="sm" p="xl" radius="md" mt="xl" withBorder>
                <Group justify="space-between" align="center">
                    <div>
                        <Title order={3} c="red">Danger Zone</Title>
                        <Text size="sm" c="dimmed">Delete your account and all associated data</Text>
                    </div>
                    <Button color="red">Delete Account</Button>
                </Group>
            </Paper>
        </Container>
    );
} 