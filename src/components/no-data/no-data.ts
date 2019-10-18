import { Component, EventEmitter, Input, Output } from '@angular/core';

export class NoDataOptions {
  public image: string;
  public text: string;
}

export class NoDataButton {
  public text: string; 
  public color: string;
}

@Component({
  selector: 'no-data',
  templateUrl: 'no-data.html'
})
export class NoDataComponent {
  @Input() 
  public options: NoDataOptions;
  
  @Input() 
  public button: NoDataButton;
  
  @Output() 
  public event: EventEmitter<void> = new EventEmitter<void>();

  constructor() {
    const defaults: NoDataOptions = {
      image: 'box',
      text: 'No hay información para mostrar.'
    };

    this.options = Object.assign(defaults, this.options);
  }

  public onClick(): void {
    this.event.emit();
  }
}
