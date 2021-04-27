#CHANGELOG-26/4/2021
## [Structure] ☕ Seperate middleware into guard and interceptor

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
    class Repository extends RepositoryBase {
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
