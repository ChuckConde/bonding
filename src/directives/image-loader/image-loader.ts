import { Directive, ElementRef, Input, OnChanges, Renderer } from '@angular/core';
import { LoopBackAuth } from '../../sdk';
import { CONFIG } from '../../app/main';

@Directive({
  selector: '[image-loader]'
})
export class ImageLoaderDirective implements OnChanges {
  @Input('image-loader') public imageLoader: any;

  public element: any;
  private config: any = CONFIG;
  private baseUrl: string;
  private apiVersion: string;

  constructor(
    private el: ElementRef,
    private renderer: Renderer,
    public lbAuth: LoopBackAuth
  ) {
    this.baseUrl = this.config.BASE_URL;
    this.apiVersion = this.config.API_VERSION;

    this.element = el.nativeElement;
    this.element.style.backgroundImage = 'url(./assets/imgs/general/spinner.gif)';
    this.renderer.setElementStyle(this.element, 'background-size', '50px 50px');
    this.renderer.setElementStyle(this.element, 'background-position', 'center');
    this.renderer.setElementStyle(this.element, 'background-repeat', 'no-repeat');
  }

  public ngOnChanges(changes) {
    if (changes.imageLoader) {
      this._loadImage();
    }
  }

  private _loadImage() {
    const image = new Image();

    image.addEventListener('load', () => {
      this.element.style.backgroundImage = `url(${this.imageLoader ? this.imageLoader : 'assets/imgs/general/placeholder.png'})`;
      this.renderer.setElementStyle(this.element, 'background-size', 'cover');
      this.renderer.setElementStyle(this.element, 'background-color', 'none');
    });

    if (this.imageLoader && this.imageLoader.indexOf('/Containers/profile-picture-') !== -1) {
      this.imageLoader = `${this.baseUrl}/${this.apiVersion}${this.imageLoader}`;
    }

    image.src = this.imageLoader ? this.imageLoader : 'assets/imgs/general/placeholder.png';
  }
}
