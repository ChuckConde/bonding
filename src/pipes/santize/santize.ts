import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml, SafeResourceUrl, SafeScript, SafeStyle, SafeUrl } from '@angular/platform-browser';

@Pipe({ name: 'sanitize' })

export class SanitizePipe implements PipeTransform {

    constructor(private sanitized: DomSanitizer) { }

    public transform(value, args): SafeHtml | SafeStyle | SafeScript | SafeUrl | SafeResourceUrl {

        if (value) {
            switch (args.toLowerCase()) {
                case 'url':
                    return this.sanitized.bypassSecurityTrustUrl(value);
                case 'resource':
                    return this.sanitized.bypassSecurityTrustResourceUrl(value);
                case 'script':
                    return this.sanitized.bypassSecurityTrustScript(value);
                case 'style':
                    return this.sanitized.bypassSecurityTrustStyle(value);
                case 'html':
                    return this.sanitized.bypassSecurityTrustHtml(value);
                default:
                    throw new Error(`Unable to bypass security for invalid type: ${args.toLowerCase()}`);
            }
        } else {
            return 'Nothing to Display';
        }

    }
}
