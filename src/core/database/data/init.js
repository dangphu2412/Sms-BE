import { Types } from 'mongoose';

const { ObjectId } = Types;
export const activityDump = [
    {
        _id: new ObjectId('609398e16b84f24d556d32c1'),
        name: 'Chuyên môn',
        isActive: true,
        createdAt: Date('2021-05-06T07:25:28.024Z'),
        updatedAt: Date('2021-05-06T07:25:28.024Z'),
    },
    {
        _id: new ObjectId('609398e13b84f24d556d32c1'),
        name: 'Dự án',
        isActive: true,
        createdAt: Date('2021-05-06T07:25:28.024Z'),
        updatedAt: Date('2021-05-06T07:25:28.024Z'),
    },
    {
        _id: new ObjectId('609398e16b84f24d556d32d1'),
        name: 'Đào tạo',
        isActive: true,
        createdAt: Date('2021-05-06T07:25:28.024Z'),
        updatedAt: Date('2021-05-06T07:25:28.024Z'),
    },
    {
        _id: new ObjectId('609397e16b84f24d556d32c1'),
        name: 'Khác',
        isActive: true,
        createdAt: Date('2021-05-06T07:25:28.024Z'),
        updatedAt: Date('2021-05-06T07:25:28.024Z'),
    },
];

export const timetableDump = [
    {
        _id: new ObjectId('609398e16b84f24d556d32c2'),
        isActive: true,
        name: 'Buổi tối',
        startTime: '19:00',
        endTime: '21:00',
        createdAt: Date('2021-05-06T07:25:28.024Z'),
        updatedAt: Date('2021-05-06T07:25:28.024Z'),
    },
    {
        _id: new ObjectId('609398e17b84f24d556d32c1'),
        isActive: true,
        name: 'Buổi chiều',
        startTime: '19:00',
        endTime: '21:00',
        createdAt: Date('2021-05-06T07:25:28.024Z'),
        updatedAt: Date('2021-05-06T07:25:28.024Z'),
    },
    {
        _id: new ObjectId('609398e16b84f24d546d32c1'),
        isActive: true,
        name: 'Buổi sáng',
        startTime: '07:00',
        endTime: '11:00',
        createdAt: Date('2021-05-06T07:25:28.024Z'),
        updatedAt: Date('2021-05-06T07:25:28.024Z'),
    },
];
