# Authorization
## Config
```javascript
import { AuthorizationService } from 'packages/authModel/module/authorization/AuthorizationService';
import { Rules } from '../rules';

export const authorization = AuthorizationService
                                .builder(Rules);

```
- We are building instance of AuthorizationService and add rules which we have defined in rules.js
## Rules
- Authorization model is a model built based on rules
file
```javascript
export const Rules = {
    TEST_AUTHORIZATION: {
        name: 'TEST_AUTHORIZATION',
        dataPreload: 'local=UserService.mustBeAuthor()',
        policies: ['UserService.isRoleAdmin(authContext,something)']
    }
};
```

- name
- dataPreload
  - Need to specify the name of store variable then we can use it in other function context
  - Call getting data by service function 
- policies
  -  Call getting data by service function. Name of params are the same as we define with dataPreload or adding by addParams method.

## Authorization in service
- Each rule need to be specified the method to validate
in a named service of others modules
  
```javascript
    async testAuthorization() {
        const validator = authorization
            .buildValidator();

            await validator
                .addParams({
                    authContext: 'authContext',
                    something: 2
                })
                .addRules('TEST_AUTHORIZATION')
                .validate();

        /**
         * This method can retrieve local variable from
         * authorization store
         */
        const local = validator.getFromStore('local');
    }
```
- addParams method allow us to add variable with key name into validate context.
- getFromStore can get whenever local variable we execute for reuse purpose
- We can add many rules and validate once.