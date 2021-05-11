import { timetableDump } from '../data/init';

export default class UserSeeder {
	constructor(db) {
		this.db = db;
	}

	async run() {
		const collection = this.db.collection('timetable_settings');
    await timetableDump.map(async item => {
      await collection.update({ _id: item._id }, item, { upsert: true });
    });
	}
}
