import { BcryptService } from '../../utils';

export default class UserSeeder {
	constructor(db) {
		this.db = db;
	}

	async run() {
		const userCollection = this.db.collection('users');
		const sampleUserData = [];
		for (let i = 1; i <= 20; i += 1) {
			sampleUserData.push({
				email: `user${i}@gmail.com`,
				password: BcryptService.hash('123456'),
				createdAt: new Date(),
				updatedAt: new Date(),
				deletedAt: null,
			});
		}
		await userCollection.deleteMany();
		await userCollection.insertMany(sampleUserData);
	}
}
