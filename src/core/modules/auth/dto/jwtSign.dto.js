export const JwtPayload = user => (
    {
        id: user.id,
        role: '',
        // role: user.role < - user role here
    }
);
