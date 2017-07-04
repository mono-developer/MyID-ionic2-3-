import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController, NavParams, PopoverController} from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { IonicStorageModule } from '@ionic/Storage';
import { UserService } from "../../providers/user-service";
import { EditVitalConditionsAddPage } from '../edit_vital_conditions_add/edit_vital_conditions_add';
import { Flags } from "../../providers/flag";


@Component({
  selector: 'page-edit-vital-conditions',
  templateUrl: 'edit_vital_conditions.html'
})
export class EditVitalConditionsPage {

  vitalDatas: any;
  updated:string;
  email:string;
  auth_token:string;
  public profile_id;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public userService: UserService,
    public storage: Storage,
    private flagService: Flags,
    // public datepipe: Datepipe
  ) {
    this.profile_id = navParams.get("profile_id");
    this.email = "";
    this.auth_token = "";
  }

  ngOnInit(){
    this.flagService.setChangedFlag(false);
    this.gettingdata();
  }

  ionViewDidEnter(){
    if(this.flagService.getChangedFlag()){
      this.gettingdata();
    }
  }

  gettingdata(){
    let loading = this.loadingCtrl.create();
    var endValue = "/vital_medical_conditions"
    loading.present();
    this.storage.get('email').then(val=>{
      this.email = val;
      this.storage.get('auth_token').then(val=>{
        this.auth_token = val;
        this.userService.dataGet(this.email, this.auth_token, this.profile_id, endValue)
          .subscribe(
            (data) => {
              loading.dismiss();
              console.log("Vital Data: ", data);
              if(data.success == false){
                let alert = this.alertCtrl.create({
                  title: "Error", subTitle: "Get Data Error", buttons: ['OK']
                });
                alert.present();
                this.navCtrl.pop();
              } else{
                this.vitalDatas = data.vital_medical_conditions;
                this.updated = data.last_updated_at;
                console.log(this.updated);
              }
          });
      });
    });
  }

  gotoEditVitalConditionsAdd(event, vitalData){
    console.log("EditVitalConditionsAddPage");
    if (vitalData === undefined){
      this.navCtrl.push(EditVitalConditionsAddPage,{
        vitalData: null,
        profile_id: this.profile_id
      });
    }
    else{
      this.navCtrl.push(EditVitalConditionsAddPage,{
        vitalData: vitalData,
        profile_id: this.profile_id
      });
    }
  }
}
