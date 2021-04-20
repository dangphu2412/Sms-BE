export const CreateDto = body => ({
    email: body.email,
    password: body.password,
    fingerprint: body.fingerprint,
    status: body.status,
    profile: {
        firstName: body.profile.firstName,
        lastName: body.profile.lastName,
        birthday: body.profile.birthday,
        phone: body.profile.phone,
        hometown: body.profile.hometown,
        gender: body.gender,
        facebook: body.facebook,
        universityId: body.profile.universityId,
    }
});
