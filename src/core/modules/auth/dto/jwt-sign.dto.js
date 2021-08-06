export const JwtPayload = user => (
    {
        _id: user._id,
        roles: user.roles
    }
);
