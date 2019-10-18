import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Contact } from '../../sdk/index';

@Component({
  selector: 'contact-list',
  templateUrl: 'contact-list.html'
})
export class ContactListComponent {
  @Input() 
  public links: any;

  @Input() 
  public settings: {
    isAgent: boolean,
    noDataText: string,
    dateLabel: string,
    showChip?: boolean
  };

  @Output() 
  public event: EventEmitter<any> = new EventEmitter<any>();

  public emitEvent(link: any): void {
    this.event.emit(link);
  }
}
