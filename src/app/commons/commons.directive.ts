// angular
import {AfterContentInit, Directive, ElementRef, Input, OnDestroy, Renderer2} from '@angular/core';
import {NgControl} from '@angular/forms';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
// commons
import {BusyService} from './busy.service';
import {CommonsConfig} from './commons.config';

/**
 * Prints the application version as text element.
 */
@Directive({selector: '[appVersion]'})
export class ApplicationVersionDirective implements AfterContentInit {
  private readonly version: string | number;

  constructor(
    private readonly el: ElementRef,
    private readonly renderer: Renderer2,
    private readonly conf: CommonsConfig) {
    this.version = conf.version;
  }

  ngAfterContentInit() {
    if (this.el.nativeElement && this.version) {
      const txt = this.renderer.createText(this.version.toString());
      this.renderer.appendChild(this.el.nativeElement, txt);
    }
  }
}

/**
 * Prints the application name as text element.
 */
@Directive({selector: '[appName]'})
export class ApplicationNameDirective implements AfterContentInit {
  private readonly name: string;

  constructor(
    private readonly el: ElementRef,
    private readonly renderer: Renderer2,
    private readonly conf: CommonsConfig) {
    this.name = conf.name;
  }

  ngAfterContentInit() {
    if (this.el.nativeElement && this.name) {
      const txt = this.renderer.createText(this.name);
      this.renderer.appendChild(this.el.nativeElement, txt);
    }
  }
}

/**
 * Prints a range of years.
 */
@Directive({selector: '[appFromYear]'})
export class FromYearDirective implements AfterContentInit {
  @Input() year: number;

  constructor(private readonly el: ElementRef, private readonly renderer: Renderer2) { }

  ngAfterContentInit() {
    if (this.el.nativeElement) {
      const now = new Date().getFullYear();
      const text = this.year !== now ? this.year + ' - ' + now : now;
      const node = this.renderer.createText(text.toString());
      this.renderer.appendChild(this.el.nativeElement, node);
    }
  }
}

/**
 * Enriches a component with 'busy' class depending on busy service state.
 */
@Directive({selector: '[appBusy]'})
export class BusyDirective implements OnDestroy {
  private readonly destroyed: Subject<any>;

  @Input('appBusy')
  clazz: string;

  constructor(
    private readonly el: ElementRef,
    private readonly renderer: Renderer2,
    private readonly service: BusyService) {
    this.destroyed = new Subject();
    this.service.busyness
      .pipe(takeUntil(this.destroyed))
      .subscribe(isBusy => {
        if (this.el.nativeElement) {
          if (isBusy) {
            this.renderer.addClass(this.el.nativeElement, this.clazz || 'busy');
          } else {
            this.renderer.removeClass(this.el.nativeElement, this.clazz || 'busy');
          }
        }
      });
  }

  ngOnDestroy(): void {
    this.destroyed.next();
  }

}

/**
 * Adds the file icon classes to an element depending on the mime type.
 */
@Directive({
  selector: '[appMimeIcon]'
})
export class MimeIconDirective implements AfterContentInit {
  @Input() mime: string;
  @Input() file: string;

  EXT_TO_MIME = {
    pdf: 'application/pdf',
    doc: 'application/msword',
    xls: 'application/msexcel',
    ppt: 'application/vnd.ms-powerpoint',
    pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    odt: 'application/vnd.oasis.opendocument.text',
    txt: 'text/plain',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    gif: 'image/gif',
    png: 'image/png',
    eml: 'message/rfc822'
  };
  MIME_TO_ICON = {
    'application/pdf': 'fa-file-pdf-o',
    'application/msword': 'fa-file-word-o',
    'application/msexcel': 'fa-file-excel-o',
    'application/vnd.ms-powerpoint': 'fa-file-powerpoint-o',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'fa-file-powerpoint-o',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'fa-file-word-o',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'fa-file-excel-o',
    'application/vnd.oasis.opendocument.text': 'fa-file-word-o',
    'text/plain': 'fa-file-text-o',
    'image/jpeg': 'fa-file-picture-o',
    'image/gif': 'fa-file-picture-o',
    'image/png': 'fa-file-picture-o',
    'message/rfc822': 'fa-envelope-o'
  };

  mimeToIcon(mime: string) {
    return this.MIME_TO_ICON[mime] || 'fa-file-o';
  }

  extension(file: string) {
    // kudos to http://stackoverflow.com/a/12900504
    // tslint:disable-next-line: no-bitwise
    return file.slice((file.lastIndexOf('.') - 1 >>> 0) + 2);
  }

  nameToMime(file) {
    return this.EXT_TO_MIME[this.extension(file)];
  }

  constructor(private readonly el: ElementRef, private readonly renderer: Renderer2) { }

  ngAfterContentInit() {
    if (this.el.nativeElement) {
      let icon = 'fa-file-o';
      if (this.mime) {
        icon = this.mimeToIcon(this.mime);
      } else if (this.file) {
        icon = this.mimeToIcon(this.nameToMime(this.file));
      }
      this.renderer.addClass(this.el.nativeElement, 'fa');
      this.renderer.addClass(this.el.nativeElement, icon);
    }
  }

}

/**
 * Disables a control.
 */
@Directive({
  selector: '[appDisableControl]'
})
export class DisableControlDirective {

  @Input() set disableControl(condition: boolean) {
    const action = condition ? 'disable' : 'enable';
    this.ngControl.control[action]();
  }

  constructor(private ngControl: NgControl) {
  }
}
