import { AfterViewInit, Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
    selector: '[elastic-textarea]'
})
export class ElasticDirective implements AfterViewInit {

    /**
     * store element reference of directive
     * @property target
     * @type any
     */
    public target: any;

    /**
     * @method constructor
     * @param el
     */
    constructor(public el: ElementRef) {
        this.target = el.nativeElement;
    }

    /**
     * on input event, recalcultae height of textarea
     * @method onInput
     * @param nativeElement
     */
    @HostListener('input', ['$event.target'])
    public onInput(nativeElement: any): void {
        nativeElement.style.overflow = 'hidden';
        nativeElement.style.height = 'auto';
        nativeElement.style.height = nativeElement.scrollHeight + 'px';
    }

    /**
     * after view initialises, recalcultae height of textarea
     * @method onInput
     * @param nativeElement
     */
    public ngAfterViewInit(): void {
        this.onInput(this.target);
    }
}
