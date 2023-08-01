
import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SharedDataService } from 'src/services/shared-data.service';
import { HttpClient} from '@angular/common/http';
import { RestProviderService } from 'src/services/rest-provider.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ToastService, ToastType } from 'src/services/toast.service';
import { ParentComponent } from 'src/app/parent/parent.component';
import { HttpMethodType } from 'src/app/enums';
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
      this.modalService.open(this.modalTarget, {container:"#sinovadMainContainer",
      modalDialogClass:'modal-dialog modal-fullscreen-md-down modal-dialog-centered modal-dialog-scrollable',
      scrollable:true,backdrop:'static'}).result.then((result) => {
        this.saveItem();
      }, (reason) => {
        this.role=undefined;
      });
    }

    public saveItem(){
      if(this.roleForm.valid)
      {
        var role:Role=JSON.parse(JSON.stringify(this.role));
        role.Name=this.roleForm.value.name;
        role.Enabled=this.roleForm.value.enabled;
        let methodType=role.Id>0?HttpMethodType.PUT:HttpMethodType.POST;
        var path=role.Id>0?"/roles/Update":"/roles/Create";
        this.restProvider.executeSinovadApiService(methodType,path,role).then((response) => {
          this.role=undefined;
          this.roleService.refreshListEvent.emit(true);
        },error=>{
          this.toastService.showToast({containerId:"sinovadMainContainer",displayTime:2000,message:error,toastType:ToastType.Error});
          console.error(error);
        });
      }else{
        this.roleForm.markAllAsTouched();
      }
    }

}
