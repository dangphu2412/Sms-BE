import { UniversityModel } from 'core/modules/university/university.model';

export class UniversitySeeder {
    static async run() {
        const sampleUniversityData = [
            {
                fullName: 'Đại học Bách Khoa - Đại học Đà Nẵng',
                shortName: 'DUT'
            },
            {
                fullName: 'Đại học Kinh Tế - Đại học Đà Nẵng',
                shortName: 'DUE'
            },
            {
                fullName: 'Đại học Ngoại Ngữ - Đại học Đà Nẵng',
                shortName: 'DUT'
            },
            {
                fullName: 'Đại học Sư Phạm - Đại học Đà Nẵng',
                shortName: 'UED'
            },
            {
                fullName: 'Đại học Sư Phạm Kỹ Thuật - Đại học Đà Nẵng',
                shortName: 'UTE'
            },
            {
                fullName: 'Viện nghiên cứu và đào tạo Việt Anh - Đại học Đà Nẵng',
                shortName: 'VNUK'
            },
            {
                fullName: 'Khoa Y Dược - Đại học Đà Nẵng',
                shortName: 'SMP'
            },
            {
                fullName: 'Đại học Thể Dục Thể Thao - Đại học Đà Nẵng',
                shortName: 'DSU'
            },
            {
                fullName: 'Đại học Duy Tân',
                shortName: 'DTU'
            },
            {
                fullName: 'Đại học Kiến Trúc',
                shortName: 'DAU'
            },
            {
                fullName: 'Đại học Đông Á',
                shortName: 'DAU'
            },
            {
                fullName: 'Đại học FPT',
                shortName: 'FPTU'
            },
        ];
        return UniversityModel.insertMany(sampleUniversityData);
    }
}
