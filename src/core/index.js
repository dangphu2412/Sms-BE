import 'dotenv/config';
import './config/restBuilder';
import express from 'express';
import { ApiDocument } from './config/swagger';
import { AppBundle } from './config';
import { ModuleResolver } from './api';
import { SecurityFilter } from '../packages/authModel/core/security/SecurityFilter';

const app = express();

(async () => {
    await AppBundle.builder()
        .applyAppContext(app)
        .init()
        .applyGlobalFilters([new SecurityFilter()])
        .applyResolver(ModuleResolver)
        .applySwagger(ApiDocument)
        .run();
})();

export default app;
