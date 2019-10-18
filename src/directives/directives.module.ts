import { NgModule } from '@angular/core';
import { ColorLuminanceDirective } from './color-luminance/color-luminance';
import { ElasticDirective } from './elastic/elastic';
import { ImageLoaderDirective } from './image-loader/image-loader';
import { KeyboardAttachDirective } from './keyboard-attach/keyboard-attach';
import { LimitToDirective } from './limit-to/limit-to';
import { PasswordDirective } from './password/password';

@NgModule({
    declarations: [
        ColorLuminanceDirective,
        LimitToDirective,
        KeyboardAttachDirective,
        ElasticDirective,
        ImageLoaderDirective,
        PasswordDirective
    ],
    imports: [

    ],
    exports: [
        ColorLuminanceDirective,
        LimitToDirective,
        KeyboardAttachDirective,
        ElasticDirective,
        ImageLoaderDirective,
        PasswordDirective
    ]
})
export class DirectivesModule { }
