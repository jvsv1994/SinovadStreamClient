import {Directive, Output, EventEmitter, OnInit, ElementRef} from '@angular/core';

@Directive({
  selector: '[long-press]'
})
export class LongPressDirective implements OnInit{

  private touchTimeout: any;
  @Output() longpress = new EventEmitter();

  constructor(private elementRef: ElementRef) {}

  ngOnInit() {
    this.manageEvents();
  }

  private manageEvents(){
    let ctx=this;
    this.elementRef.nativeElement.addEventListener('pointerdown', function(event) {
      ctx.touchTimeout = setTimeout(() => {
        ctx.longpress.emit(event);
      }, 500);
    },ctx);
    this.elementRef.nativeElement.addEventListener('pointerout', function(event) {
      ctx.touchEnd();
    },ctx);
    this.elementRef.nativeElement.addEventListener('pointercancel', function(event) {
      ctx.touchEnd();
    },ctx);
    this.elementRef.nativeElement.addEventListener('pointerup', function(event) {
      ctx.touchEnd();
    },ctx);
  }

  ngAfterViewInit() {

  }

  private touchEnd():void {
    clearTimeout(this.touchTimeout);
  }

}
