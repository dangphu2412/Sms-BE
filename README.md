# THIS IS TEMPLATE RESTFUL API FOR MONGOOSE

## Setup
### Environment
- Install nodejs
- First create .env file by this command
```bash
cp .env.example ./.env
```
- Config environment variables:
    - Configure mongodb connection string (DATABASE_URL in env file).
    - In this case: DATABASE_URL=mongodb://username:password@host:port/database?options
    - Set NODE_ENV in .env file(default is development environment)

## Start project
### With npm:
- To run project on development:
```bash
npm dev
```

- To run project on production:

```bash
npm start
```
### With yarn:
- To run project on development:
```bash
yarn dev
```

- To run project on production:

```bash
yarn start
```
## Packages of project
#### [Rest Builder](src/packages/restBuilder/README.md)