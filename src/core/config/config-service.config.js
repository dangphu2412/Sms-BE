import { ConfigService } from 'packages/config/config.service';

let PATH_LOOKUP = `${process.cwd()}/.env`;

ConfigService.config({
    cache: false,
    pathLookup: PATH_LOOKUP
});

PATH_LOOKUP = null;
