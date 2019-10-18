import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app.module';

platformBrowserDynamic().bootstrapModule(AppModule);

/**
 * Configuration for server side connection
 *
 * @constant CONFIG
 */
export const CONFIG = {
    BASE_URL: 'https://bondingapp.com:3000',
    API_VERSION: 'api',
    GOOGLE_API_KEY: 'change me',
    GOOGLE_CLIENT_ID: 'change me',
    FACEBOOK_KEY: '305102500258287',
};
