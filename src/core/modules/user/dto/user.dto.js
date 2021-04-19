export const CreateDto = body => ({
    email: body.email,
    password: body.password,
    gender: body.gender,
    address: body.address,
    facebook: body.facebook,
    roles: body.roles,
    profile: {
        firstName: body.firstName,
        lastName: body.lastName,
        birthday: body.birthday,
        hometown: body.hometown,
        phone: body.phone,
        university: body.university,
    }
});
