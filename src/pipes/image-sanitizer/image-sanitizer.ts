import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml, SafeResourceUrl, SafeScript, SafeStyle, SafeUrl } from '@angular/platform-browser';

@Pipe({ name: 'sanitizeImage' })

export class ImageSanitizerPipe implements PipeTransform {

  constructor(private sanitized: DomSanitizer) { }

  public transform(value, args): SafeHtml | SafeStyle | SafeScript | SafeUrl | SafeResourceUrl {

    const pipeArgs = args.split(':');
    for (let i = 0; i < pipeArgs.length; i++) {
      pipeArgs[i] = pipeArgs[i].trim(' ');
    }

    if (value) {
      switch (pipeArgs[0].toLowerCase()) {
        case 'url':
          return this.sanitized.bypassSecurityTrustUrl(value);
        case 'resource':
          return this.sanitized.bypassSecurityTrustResourceUrl(value);
        case 'script':
          return this.sanitized.bypassSecurityTrustScript(value);
        case 'style':
          if (value === 'url(undefined)' || value === 'url(null)') {
            switch (pipeArgs[1].toLowerCase()) {
              case 'profile':
                return 'url(./assets/imgs/general/profile.png)';
              case 'placeholder':
                return 'url(./assets/imgs/general/placeholder.png)';
            }
          } else {
            return this.sanitized.bypassSecurityTrustStyle(value);
          }
        case 'html':
          return this.sanitized.bypassSecurityTrustHtml(value);
        default:
          throw new Error(`Unable to bypass security for invalid type: ${pipeArgs[0].toLowerCase()}`);
      }
    } else {
      switch (pipeArgs[1].toLowerCase()) {
        case 'profile':
          return 'assets/imgs/general/profile.png';
        case 'placeholder':
          return 'assets/imgs/general/placeholder.png';
        default:
          return 'Nothing to Display';
      }
    }
  }
}
