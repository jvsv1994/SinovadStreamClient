
import { AfterViewInit, Component, Input} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MyErrorStateMatcher } from 'src/app/modules/shared/error-matcher/custom-error-state-matcher';
import { SnackBarService } from 'src/app/modules/shared/services/snack-bar.service';
import { SnackBarType } from 'src/app/modules/shared/components/custom-snack-bar/custom-snack-bar.component';
import { RoleService } from '../../services/role.service';
import { Role } from '../../models/role.model';

@Component({
  selector: 'app-role-form',
  templateUrl: './role-form.component.html',
  styleUrls: ['./role-form.component.scss']
})
export class RoleFormComponent implements AfterViewInit{

  @Input() role:Role;
  roleFormGroup:FormGroup;
  showLoading:boolean=false;
  matcher = new MyErrorStateMatcher();

  constructor(
    private formBuilder: FormBuilder,
    private activeModal: NgbActiveModal,
    private snackbarService:SnackBarService,
    private roleService:RoleService) {

    }

    public ngAfterViewInit(){
      this.roleFormGroup = this.formBuilder.group({
        name: new FormControl(this.role.Name, [Validators.required]),
        enabled:new FormControl(this.role.Enabled)
      });
    }

    public saveItem(){
      if(this.roleFormGroup.valid)
      {
        this.showLoading=true;
        var role:Role=JSON.parse(JSON.stringify(this.role));
        role.Name=this.roleFormGroup.value.name;
        role.Enabled=this.roleFormGroup.value.enabled;
        this.roleService.saveItem(role).then((response) => {
          this.showLoading=false;
          this.role=undefined;
          this.snackbarService.showSnackBar("Se guardo el rol satisfactoriamente",SnackBarType.Success);
          this.activeModal.close();
        },error=>{
          this.showLoading=false;
          this.snackbarService.showSnackBar(error,SnackBarType.Error);
        });
      }else{
        this.roleFormGroup.markAllAsTouched();
      }
    }

    public closeModal(){
      this.activeModal.dismiss();
    }

}
