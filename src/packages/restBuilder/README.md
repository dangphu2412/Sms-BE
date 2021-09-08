# Rest Builder
## Document for BE developer

### Config:
* Config:
    * Config max size of query: MAX_SIZE
    * Config max page of query: MAX_PAGE
    * Config DEFAULT_PAGE or not it will get all the record
    * Config DEFAULT_SIZE or not it will get all the record
```javascript
RestBuilderConfig.config({
    MAX_SIZE: 20,
    MAX_PAGE: 100000,
    DEFAULT_PAGE: 1,
    DEFAULT_SIZE: 10
});
```
### Flow:
- https://app.diagrams.net/#G1GxBj3bNAm3G3xWw6hNIz5K70ZvBOu5a-

### Request transformer
#### Input
- Input will be formatted as below:
```typescript
interface ITransformContent {
    pagination: {
        page: number,
        size: number,
        offset: number
    },
    filters: {column: string, sign: '$eq' | '$gt' | '$like', value: string}[],
    sorts: {sort, order}[],
    search,
    main: string[],
    associates: string[]
}
```

#### Custom method
- This class provide custom method to add filter, sort, search, pagination into query then we can easily adapt it into DataPersistenceService
- Add custom sort:
  - Visit document for frontend sorting here:
```javascript
// ASC sort
reqTransformed.addSort("createdAt");
reqTransformed.addSort("profile.fullName");
// DESC sort
reqTransformed.addSort("-createdAt");
reqTransformed.addSort("-profile.fullName");
```
- Add custom filter:
  - Visit document for frontend sorting here:
```javascript
// Filter with a normal field
reqTransformed.addFilter(`username|$eq|${value}`);

/**
 * Filter with date range
 * Date in mongo does not support filter exact
 */
reqTransformed.addFilter(`createdAt|$gt|${startDate}`);
reqTransformed.addFilter(`createdAt|$lt|${endDate}`);
```
- Add custom pagination:
```javascript
/**
 * We can set page and size as we want
 */
reqTransformed.setPage(0);
reqTransformed.setSize(10);

/**
 * We can also clear page and size for not pagination
 * Or clear size for unlimited get
 */
reqTransformed.clearPage();
reqTransformed.clearSize();
```
- Add custom search:
```javascript
reqTransformed.addSearch();
```
### Data handler
#### DataPersistenceService
 - Construct with DataRepository
 - Provide useful method to adapt with request transformer like:
```typescript
interface IDataResponse<T> {
    content: T[]
    meta: {
        currentPage: number;
        currentSize: number;
        totalPage: number;
        totalRecord: number;
    }
}

interface Validator {
    validate(input): Promise<void> | void
}

getAndCount(requestTransformer: ITransformContent): [IDataResponse<T>, number]

get(requestTransformer: ITransformContent): IDataResponse<T>

getOne(requestTransformer: ITransformContent): T

create(dto: any, uniqueCondition: {column, sign, value, err}, validator: Validator): { _id }
```
#### DataRepository
- Provide method that accept Query Class to build mongo query
- Query class provide method to add filter, sort, search field into query builder

### Query Builder default

## Document for Front-end

### Pagination
- Pagination will provide query in url params to pagination
- Page and size were set default in backend as the config
```javascript
localhost:3000?page=0&size=10
localhost:3000?page=0
localhost:3000?size=10
```
### Filter
- Filter sign:
```typescript
enum FilterSign {
    $in, // In array of data
    $eq, // Equal to value
    $lt, // Greater than
    $gt, // Less than
    $s // Search query
}
```
- Query:
```javascript
localhost:3000?filter=${column}|${sign}|${value}

Example:
localhost:3000?filter=username|$eq|someName // Normal filter

localhost:3000?filter=startDate|$gt|${startDate}&filter=startDate|$lt|${startDate} // Filter with date

localhost:3000?filter=id|$in|[1,2,3] // Filter to find in array of value
```
### Sort
- Query:
- Sort direction:
```typescript
enum SortDirection {
    '+', // Increase
    '-' // Decrease
}
```

```javascript
localhost:3000?sort=${direction}${column}

Example:
localhost:3000?sort=firstName // Sort as increasing firstName
localhost:3000?sort=-firstName // Sort as decreasing firstName
```
### Search
- Just simply put the value in query search
Example:
```
localhost:3000?search=value // Search
```
