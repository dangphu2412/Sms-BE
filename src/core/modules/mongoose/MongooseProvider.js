import { logger } from '../logger/winston';

export class MongooseProvider {
    #count = 3;

    static logger = logger;

    /**
     * @type {string}
     */
    #connectionString;

    /**
     * @type {import('mongoose')}
     */
    #mongooseInstance;

    static builder() {
        return new MongooseProvider();
    }

    setConnectionString(url) {
        this.#connectionString = url;
        return this;
    }

    setMongooseInstance(mongoose) {
        this.#mongooseInstance = mongoose;
        return this;
    }

    async connect() {
        let flag = false;
        try {
            await this.#mongooseInstance
                .connect(
                    this.#connectionString,
                    {
                        useNewUrlParser: true,
                        useUnifiedTopology: true,
                        useFindAndModify: false,
                        useCreateIndex: true
                    }
                );
            MongooseProvider.logger.info('MongoDB connection success');
            flag = true;
        } catch (error) {
            MongooseProvider.logger.error(error.message);
            this.#count -= 1;
        }
        setTimeout(() => {
            if (!flag && this.#count) return this.connect();
        }, 3000);
    }
}
