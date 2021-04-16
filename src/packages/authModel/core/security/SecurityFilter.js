import { JwtAuthAdapter } from './JwtAuthAdapter';

export class SecurityFilter {
    filter(req, res, next) {
        JwtAuthAdapter
            .builder()
            .collectRequest(req)
            .transfer();
        return next();
    }
}
