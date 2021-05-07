import 'dotenv/config';
import './config/restBuilder';
import express from 'express';
import { HttpExceptionFilter } from 'packages/httpException/HttpExceptionFilter';
import { SecurityFilter } from 'packages/authModel/core/security/SecurityFilter';
import { InvalidUrlFilter } from 'packages/handler/filter/InvalidUrlFilter';
import { ApiDocument } from './config/swagger';
import { AppBundle } from './config';
import { ModuleResolver } from './api';

const app = express();

(async () => {
    await AppBundle.builder()
        .applyAppContext(app)
        .init()
        .applyGlobalFilters([new SecurityFilter()])
        .applyResolver(ModuleResolver)
        .applySwagger(ApiDocument)
        .applyGlobalFilters([new HttpExceptionFilter(), new InvalidUrlFilter()])
        .run();
})();

export default app;
