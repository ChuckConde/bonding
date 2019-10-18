import {Pipe, PipeTransform} from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
    name: 'timeAgo',
    pure: true
})
export class TimeAgoPipe implements PipeTransform {
  constructor(private datePipe: DatePipe) {}

  transform(value: any, args?: any): any {
    if (value) {
      const seconds = Math.floor((+new Date() - +new Date(value)) / 1000);
      
      switch (true) {
        case seconds < 59:
          return 'Justo ahora';
        
        case seconds < 3599:
          return (Math.floor(seconds / 60) !== 1) ? Math.floor(seconds / 60) + ' minutos' : '1 minuto';
        
        case seconds < 86400:
          return (Math.floor(seconds / 3600) !== 1) ? Math.floor(seconds / 3600) + ' horas' : '1 hora';

        case seconds <= 604800:
          return (Math.floor(seconds / 86400) !== 1) ? Math.floor(seconds / 86400) + ' días' : '1 día';

        case seconds > 604800:
          return this.datePipe.transform(value, 'dd/MM/yyyy');
      }
    }

    return value;
  }
}
