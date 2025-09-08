
export async function getUserInfo({ email }) {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKENDPATH}/api/user/${email}`, {
            method: 'GET',
            credentials: 'include', // Important for sending cookie
        });

        if (!res.ok) {
            throw new Error('Failed to fetch user info');
        }

        const data = await res.json();
        return data;
    } catch (error) {
        console.error('Error fetching user info:', error);
        return null;
    }
}
