import {
  Directive,
  ElementRef,
  HostListener,
  inject,
  output,
} from '@angular/core';

@Directive({
  selector: '[clickOutside]',
})
export class ClickOutsideDirective {
  private elementRef = inject(ElementRef);

  clickOutside = output<void>();

  @HostListener('document:click', ['$event.target'])
  public onClick(event: MouseEvent) {
    const clickedInside = this.elementRef.nativeElement.contains(event);
    if (!clickedInside) {
      this.clickOutside.emit();
    }
  }
}
