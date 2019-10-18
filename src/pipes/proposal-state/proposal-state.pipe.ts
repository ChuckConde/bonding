import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'proposalState',
    pure: true
})
export class ProposalStatePipe implements PipeTransform {
  transform(value: string): string {
    switch(value) {
      case 'CREATED':
        return 'Propuesta creada';
      
      case 'PENDING_ACCEPT':
        return 'Recibo enviado';

      case 'ACCEPTED':
        return 'Propuesta aceptada';

      case 'PENDING_DELIVERED_APROVAL':
        return 'Pend. confirmación envío';

      case 'DELIVERED_APROVAL':
        return 'Envío confirmado'

      case 'PENDING_PAYMENT_APROVAL':
        return 'Pend. confirmación cobro';

      case 'PAYMENT_APROVAL':
        return 'Cobro confirmado'

      case 'PENDING_COMMISSION_PAID':
        return 'Pend. confirmación comisión';

      case 'COMMISSION_PAID':
        return 'Comisión cobrada';

      case 'FINALIZED':
        return 'Finalizada';
        
      default:
        return value;
    }
  }
}
