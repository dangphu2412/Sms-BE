import { activityDump } from '../data/init';

export default class UserSeeder {
	constructor(db) {
		this.db = db;
	}

	async run() {
		const collection = this.db.collection('activities');
    await activityDump.map(async item => {
      await collection.update({ _id: item._id }, item, { upsert: true });
    });
	}
}
