#CHANGELOG-26/4/2021
## [Structure] ☕ Separate middleware into guard and interceptor

- Change middlewares into two layers: Interceptor and Guard:
    - Interceptor implement method intercept with params as a normal middleware:
      ```javascript
      // Example:
      export class ExampleInterceptor {
          intercept(req, res, next) {
              // Do stuff here for intercepting request
          }
      }
      ```
    - Guard implement method canActive which return boolean
      ```javascript
      // Example:
      export class ExampleGuard {
          canActive(req) {
              // Do stuff here for intercepting request
              return true;
          }
      }
      ```
- How this work in the resolver:
    ```javascript
    export const ExampleResolver = Module.builder()
        .addPrefix({
            prefixPath: '/example',
            tag: 'example',
            module: 'ExampleModule'
        })
        .register([
            {
                route: '/:id',
                method: 'get',
                params: [ObjectId],
                interceptors: [new ExampleInterceptor()],
                guards: [new ExampleGuard()],
                controller: ExampleController.findOne
            }
        ]);

    ```
- Repository layer:
  - This layer will be responsible for writing query to database
  - We will improve RepositoryBase which will contains several usual method
  - Below is an example of how to implement repository.
    ```javascript
    class Repository extends BaseRepository {
        constructor() {
            super(ExampleModel);
        }

        findOneByEmail(email, fields = []) {
            return this.model.findOne({ email }).select(fields);
        }
    }

    export const ExampleRepository = new Repository();

    ```
- RequestFormation change name into RequestTransformer

#CHANGELOG-28/4/2021
## [Structure]: ☕ Improve response of success api

- Changes response api format
- All response of core will based on HttpResponse class.
- HttpResponse class will have some method that support build
not only valid response but also the failed response.
```javascript
export class HttpResponse {
    status;

    data;

    constructor(status, data) {
        this.status = status;
        this.data = data;
    }

    toResponse(res) {
        return res.status(this.status).json(this.data);
    }
}
```
- Basically, the base handler will automatically call method toResponse and
passing response from express params here.
- Every sub method build class based on HttpResponse
will have some specific case on status and data.
```javascript
    import { UserService } from '../../../modules/user/service/user.service';
    import { RequestTransformer } from '../../../../packages/restBuilder/core/requestTransformer';
    import SearchUserSchema from '../query/searchUser.schema.json';
    import { Pageable, PageableMeta } from '../../../../packages/restBuilder/core/pageable';
    import { CreateUserDto } from '../../../modules/user/dto/createUser.dto';
    import { ValidHttpResponse } from '../../../../packages/handler/response/validHttp.response';

    class Controller {
        constructor() {
            this.service = UserService;
        }

        createOne = async req => {
            const data = await this.service.createOne(CreateUserDto(req.body));
            return ValidHttpResponse.toCreatedResponse(data);
        }

        findOne = async req => {
            const data = await this.service.findOne(req.params);
            return ValidHttpResponse.toOkResponse(data);
        }

        patchOne = async req => {
            await this.service.patchOne(req.params, req.body);
            return ValidHttpResponse.toNoContentResponse();
        }
    }
```

#CHANGELOG-14/5/2021

## [Structure] ☕ Authentication and authorization

- [Authentication](./src/packages/authModel/module/authentication/README.md)

- [Authorization](./src/packages/authModel/module/authorization/README.md)

#CHANGELOG-17/5/2021
## [Structure] Introduce Optional class
```javascript
Optional
    .of(getSomeData())
    .throwIfPresent(new DuplicateException('Something is not existed'));
```
- Below is an example of Optional class. Optional support that we can create a reference to variable and then validate them with built-in function of class
- There are some useful function that we re now supporting:
```javascript
Optional
    // First we need to take a reference to that data by calling of
    .of(getSomeData())
    // This function will now validate both not null and has not been deleted yet
    .throwIfPresent(new Error())
    // This function will now validate null or has been deleted yet
    .throwIfNotPresent(new Error())
    // Throw error if record is not null
    .throwIfNullable(new Error())
    // Throw error if record is null
    .throwIfExist(new Error())
    // We can get that data which we pass in from beginning
    .get();
```

#CHANGELOG-28/5/2021
## [Structure] ☕ Apply mogp for migrating, seeding, rollback data into project
- Add file mogp.config.json into our project with config as example file
- Have scripts for running migration, seeding, rollback in package.json.

#CHANGELOG-10/6/2021

## [Structure] ☕ Apply simple role authorization to api
- With simple class SpecificRoleGuard and UnionRoleGuard which will be applied into guards
- For reuse purpose so we do have RoleDomain that will provide method to validate role
