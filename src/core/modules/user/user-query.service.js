import { BadRequestException } from 'packages/httpException';
import { FilterSign } from 'packages/restBuilder/enum';
import { FieldUtils } from 'packages/restBuilder/modules/utils';

class UserQueryServiceImpl {
    static SPECIALIZED_GROUP_NAME_FIELD = 'specializedGroup.name';

    static BIRTH_DAY_FIELD = 'profile.birthday';

    static BIRTH_DAY_MONTH_COLUMN = 'birthdayMonth';

    /**
     *
     * @param {Record<string, 1 | 0>} selectedFields
     * @param {import('packages/restBuilder/modules/query/filter.query').FilterQuery} filterQuery
     * @param {import('packages/restBuilder/modules/query/sort.query').SortQuery} sortQuery
     */
    modifyQueryWithBirthDayMonth(selectedFields, filterQuery, sortQuery) {
        if (filterQuery.getQuery().birthdayMonth || sortQuery.getQuery().birthdayMonth) {
            Object.assign(selectedFields, {
                birthdayMonth: FieldUtils.buildMonth(UserQueryServiceImpl.BIRTH_DAY_FIELD)
            });
        }

        if (filterQuery.getQuery().birthdayMonth) {
            const birthdayMonth = filterQuery.getValue(UserQueryServiceImpl.BIRTH_DAY_MONTH_COLUMN, FilterSign.$eq);

            if (!birthdayMonth) {
                throw new BadRequestException(`Filter birthdayMonth must use ${FilterSign.$eq} signature`);
            }

            filterQuery.addFilter(
                UserQueryServiceImpl.BIRTH_DAY_MONTH_COLUMN,
                FilterSign.$eq,
                Number.parseInt(birthdayMonth, 10)
            );
        }

        if (sortQuery.getQuery().birthdayMonth) {
            const birthdayMonthSortValue = sortQuery.getQuery().birthdayMonth;
            sortQuery.addSort(
                UserQueryServiceImpl.BIRTH_DAY_MONTH_COLUMN,
                birthdayMonthSortValue
            );
        }
    }

    /**
     *
     * @param {import('packages/restBuilder/modules/query/filter.query').FilterQuery} filterQuery
     * @param {import('packages/restBuilder/modules/query/sort.query').SortQuery} sortQuery
     */
    modifyQueryWithSpecializedGroupName(filterQuery, sortQuery) {
        if (filterQuery.getQuery()[UserQueryServiceImpl.SPECIALIZED_GROUP_NAME_FIELD]) {
            filterQuery.getQuery()[UserQueryServiceImpl.SPECIALIZED_GROUP_NAME_FIELD] = {
                $eq: filterQuery.getQuery()[UserQueryServiceImpl.SPECIALIZED_GROUP_NAME_FIELD][FilterSign.$eq]
            };
        }

        if (sortQuery.getQuery()[UserQueryServiceImpl.SPECIALIZED_GROUP_NAME_FIELD]) {
            sortQuery.getQuery()[UserQueryServiceImpl.SPECIALIZED_GROUP_NAME_FIELD] = sortQuery
                .getQuery()[UserQueryServiceImpl.SPECIALIZED_GROUP_NAME_FIELD];
        }
    }
}

export const UserQueryService = new UserQueryServiceImpl();
