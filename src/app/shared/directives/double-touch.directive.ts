import {Directive, Output, EventEmitter, OnInit, ElementRef} from '@angular/core';

@Directive({
  selector: '[double-touch]'
})
export class DoubleTouchDirective implements OnInit{

  @Output() doubletouch = new EventEmitter();
  lastTouch: Date;
  blockOutputEvents:boolean=false;

  constructor(private elementRef: ElementRef) {}

  ngOnInit() {
    this.lastTouch = new Date();
    this.setDirectiveEvents();
  }

  private setDirectiveEvents(){
    let ctx=this;
    this.elementRef.nativeElement.addEventListener('touchend', function(event) {
      let currentTouchTmp=new Date();
      if((currentTouchTmp.getTime() - ctx.lastTouch.getTime())<500 && !ctx.blockOutputEvents){
        ctx.doubletouch.emit(event);
        ctx.blockOutputEvents=true;
        setTimeout(() => {
          ctx.blockOutputEvents=false;
        }, 1500);
      }
      ctx.lastTouch=currentTouchTmp;
    },ctx);
  }
}
