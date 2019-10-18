import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app.module';

platformBrowserDynamic().bootstrapModule(AppModule);

/**
 * Configuration for server side connection
 *
 * @constant CONFIG
 */
export const CONFIG = {
    BASE_URL: 'http://bondingapp.com:3000',
    // BASE_URL: 'http://localhost:3000',
    WEB_URL: 'https://web.bondingapp.com',
    API_VERSION: 'api',
    GOOGLE_API_KEY: 'change me',
    GOOGLE_CLIENT_ID: '667610269058-a8tfllq3em6jfdgrphorjndh4o5492ed.apps.googleusercontent.com',
    // GOOGLE_CLIENT_ID: '667610269058-fsm7ci6ql4t4qhk822sgbkc18md6g5bb.apps.googleusercontent.com',
    FACEBOOK_KEY: '305102500258287',
};
