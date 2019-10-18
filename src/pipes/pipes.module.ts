import { NgModule } from '@angular/core';
import { ImageSanitizerPipe } from './image-sanitizer/image-sanitizer';
import { OrderByPipe } from './order-by/order-by';
import { SanitizePipe } from './santize/santize';
import { TimeAgoPipe } from './time-ago/time-ago';
import { DatePipe } from '@angular/common';
import { ProposalStatePipe } from './proposal-state/proposal-state.pipe';

@NgModule({
	declarations: [
		ImageSanitizerPipe,
		OrderByPipe,
    SanitizePipe,
    TimeAgoPipe,
    ProposalStatePipe
  ],
  providers: [
    DatePipe
  ],
	imports: [],
	exports: [
		ImageSanitizerPipe,
		OrderByPipe,
    SanitizePipe,
    TimeAgoPipe,
    ProposalStatePipe
	]
})
export class PipesModule { }
