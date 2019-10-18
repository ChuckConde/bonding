import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'pin-verify',
  templateUrl: 'pin-verify.html'
})
export class PinVerifyComponent {
	public pin;

  /**
   * @property pinChange
   * @type EventEmitter<string>
   */
  @Output() public pinChange: EventEmitter<string> = new EventEmitter<string>();

  public emitPin(): void {
    this.pinChange.emit(this.pin);
  }
}
