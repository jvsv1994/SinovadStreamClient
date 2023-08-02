import {Directive, Output, EventEmitter, OnInit, ElementRef} from '@angular/core';
import {v4 as uuid} from "uuid"; 

@Directive({
  selector: '[slide]'
})
export class SlideDirective implements OnInit{

  @Output() slide = new EventEmitter();
  private startClientX:number;
  private startClientY:number;
  private isSliding:boolean=false;
  private starting:boolean=false;

  constructor(private elementRef: ElementRef) {}

  ngOnInit() {
    this.manageEvents();
  }

  ngOnDestroy(){

  }

  private manageEvents(){
    let ctx=this;
    this.elementRef.nativeElement.addEventListener('touchstart', function(event) {
      let clientX=event.touches[0].clientX;
      let clientY=event.touches[0].clientY;
      ctx.startClientX=clientX;
      ctx.startClientY=clientY;
      ctx.starting=true;
    },ctx);
    this.elementRef.nativeElement.addEventListener('touchmove', function(event) {
      if(!ctx.isSliding)
      {
        if(ctx.starting)
        {
          let clientX=event.touches[0].clientX;
          let clientY=event.touches[0].clientY;
          let diffX=Math.abs(clientX-ctx.startClientX);
          let diffY=Math.abs(clientY-ctx.startClientY);
          if((diffY<=7 && diffX>0))
          {
            ctx.isSliding=true;
            ctx.slide.emit(event);
          }else{
            ctx.starting=false;
          }
        }
      }else{
        if(ctx.starting)
        {
          ctx.slide.emit(event);
        }
      }
    },ctx);
    this.elementRef.nativeElement.addEventListener('touchend', function(event) {    
        ctx.touchEnd();
    },ctx);
  }

  ngAfterViewInit() {

  }

  private touchEnd():void {
    this.isSliding=false;
    this.starting=false;
  }

}
