import SendGridMailService from '@sendgrid/mail';
import { ConfigService } from 'packages/config/config.service';

SendGridMailService.setApiKey(ConfigService.getSingleton().get('SENDGRID_API_KEY'));

export { SendGridMailService };
