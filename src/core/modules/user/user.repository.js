import { DataRepository } from 'packages/restBuilder/core/dataHandler/data.repository';
import { UserModel } from './model/user.model';

class UserRepositoryImpl extends DataRepository {
    constructor() {
        super(UserModel);
    }

    getAvailableByEmail(email) {
        return this.findOne({ email, deletedAt: null });
    }

    getByEmail(email) {
        return this.findOne({ email });
    }

    getDetailById(id) {
        return this.model.findById(id,
            ['_id', 'email', 'profile', 'status', 'avatar'],
            { timestamps: true });
    }

    getAvailableByEmails(emails) {
        return this.model.find({ email: { $in: emails } }, 'email');
    }

    getOverviewRootAggregate(selectedFields, associates, filterQuery, sortQuery) {
        return this.emptyAggregate()
            .setAssociates(associates)
            .addUnwind('specializedGroup')
            .setSelectedFields(selectedFields)
            .addFilter(filterQuery)
            .addSort(sortQuery);
    }

    getDetectingPasswordInfo(id) {
        return this.repository.model.findById(
            id,
            '_id password remainingLoginTimes isPasswordChanged',
            {
                deletedAt: {
                    $eq: null
                }
            }
        );
    }

    /**
     * 
     * @param {import('packages/restBuilder/core/queryBuilder/aggregateBuilder').AggregateBuilder} rootAggregate 
     * @param {*} reqTransformed 
     * @returns {[import('packages/restBuilder/core/queryBuilder/aggregateBuilder').AggregateBuilder, import('packages/restBuilder/core/queryBuilder/aggregateBuilder').AggregateBuilder]}
     */
    toResultAndTotalBuilder(rootAggregate, reqTransformed) {
        return [
            this.fromAggregate(rootAggregate)
                .addOffsetAndLimit(
                    reqTransformed.content.pagination.offset,
                    reqTransformed.content.pagination.size
                ),
            this.fromAggregate(rootAggregate)
                .addCount('total')
        ];
    }
}

export const UserRepository = new UserRepositoryImpl();
