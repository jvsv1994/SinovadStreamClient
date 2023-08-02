
import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SharedDataService } from 'src/app/shared/services/shared-data.service';
import { HttpClient} from '@angular/common/http';
import { RestProviderService } from 'src/app/shared/services/rest-provider.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ToastService, ToastType } from 'src/app/shared/services/toast.service';
import { ParentComponent } from 'src/app/parent/parent.component';
import { Role } from '../shared/role.model';
import { RoleService } from '../shared/role.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-role-form',
  templateUrl: './role-form.page.html',
  styleUrls: ['./role-form.page.scss']
})
export class RoleFormPage extends ParentComponent implements OnInit,OnDestroy {

  role:Role;
  @ViewChild('modalTarget') modalTarget: ElementRef;
  roleForm:FormGroup;
  showModalSubscription$:Subscription;
  modalRef:NgbModalRef;
  showLoading:boolean=false;

  constructor(
    private ref:ChangeDetectorRef,
    private roleService:RoleService,
    private toastService:ToastService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    public restProvider: RestProviderService,
    public http: HttpClient,
    public domSanitizer: DomSanitizer,
    public sharedData: SharedDataService) {
      super(restProvider,domSanitizer,sharedData)
    }

    ngOnInit(): void {
      this.showModalSubscription$=this.roleService.showModalEvent.subscribe(role=>{
        this.displayModalRol(role);
      });
    }

    ngOnDestroy(): void {
      this.showModalSubscription$.unsubscribe();
    }

    private displayModalRol(role:Role){
      this.role=role;
      this.roleForm = this.formBuilder.group({
        name: new FormControl(this.role.Name),
        enabled:new FormControl(this.role.Enabled)
      });
      this.ref.detectChanges();
      this.modalRef= this.modalService.open(this.modalTarget, {container:"#sinovadMainContainer",
      modalDialogClass:'modal-dialog modal-fullscreen-md-down modal-dialog-centered modal-dialog-scrollable',
      scrollable:true,backdrop:'static'});
    }

    public saveItem(){
      if(this.roleForm.valid)
      {
        this.showLoading=true;
        var role:Role=JSON.parse(JSON.stringify(this.role));
        role.Name=this.roleForm.value.name;
        role.Enabled=this.roleForm.value.enabled;
        this.roleService.saveItem(role).then((response) => {
          this.showLoading=false;
          this.role=undefined;
          this.toastService.showToast({message:"Se guardo el rol satisfactoriamente",toastType:ToastType.Success});
          this.modalRef.close();
        },error=>{
          this.showLoading=false;
          this.toastService.showToast({message:error,toastType:ToastType.Error});
        });
      }else{
        this.roleForm.markAllAsTouched();
      }
    }

    public closeModal(){
      this.modalRef.close();
    }

}
