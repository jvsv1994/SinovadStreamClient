import {Directive, Output, EventEmitter, ElementRef, HostListener, OnInit} from '@angular/core';

@Directive({
  selector: '[clickOutside]'
})
export class ClickOutsideDirective implements OnInit{

  constructor(private elementRef: ElementRef) { }

    @Output() clickOutside = new EventEmitter<Event>();


    ngOnInit(): void {
    }

    ngAfterViewInit(){

    }

    @HostListener('window:click', ['$event', '$event.target'])
    public onClick(event: Event, targetElement: HTMLElement): void {
        if (!targetElement) {
            return;
        }
        const clickedInside = this.elementRef.nativeElement.contains(targetElement);
        if (!clickedInside) {
            this.clickOutside.emit(event);
        }
    }



    @HostListener('contextmenu') onContextMenu() {
      console.log("contextmenu");
    }

}
