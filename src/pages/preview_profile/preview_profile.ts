import { Component } from '@angular/core';
import { NavController, NavParams, Nav, AlertController, LoadingController } from 'ionic-angular';
import { MainPage } from '../main/main';
import { Storage } from '@ionic/storage';
import { IonicStorageModule } from '@ionic/Storage';
import { UserService } from "../../providers/user-service";
import { ShareProfilePage } from '../share_profile/share_profile';

import { TranslateService } from '@ngx-translate/core';
import { defaultLanguage, availableLanguages, sysOptions } from '../../app/app.constants';
@Component({
  selector: 'page-preview-profile',
  templateUrl: 'preview_profile.html'
})
export class PreviewProfilePage {
  public profile;
  email:any;
  auth_token:any;
  profileData = { first_name:'', last_name:'', gender:'', city:'', state:''};
  addressData:any;
  vitalData:any;
  personalData = { first_name:'-', phone_number:'-', birth_date:'-', gender:'-',
                    weight:'- ', height:'-', hair:'-', eye_color:'-', blood_type:'-', donor:false };;
  emergencyData:any;
  allergyData:any;
  insuranceData:any;
  medicationData:any;
  physicianData:any;
  otherinfoData:any;
  donor:string;
  age:string;

  vitalUpdated:string;
  personalUpdated:string;
  emergencyUpdated:string;
  allergyUpdated:string;
  insuranceUpdated:string;
  medicationUpdated:string;
  physicianUpdated:string;
  otherinforUpdated:string;


  profileItems: Array<{title: string, component: any, icon: string}>;
    constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public nav: Nav,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public userService: UserService,
    public storage: Storage,
    public translate: TranslateService
  ) {
    this.translate.use(sysOptions.systemLanguage);
    this.profile = this.navParams;
    this.profileItems = [
        { title: 'Vital Medical Conditions', component: MainPage, icon: 'ios-warning-outline' },
        { title: 'Personal Information', component: MainPage, icon: 'ios-contact-outline' },
        { title: 'Address', component: MainPage, icon: 'ios-home-outline' },
        { title: 'Emergency Contacts', component: MainPage, icon: 'ios-call-outline' },
        { title: 'Allergies', component: MainPage, icon: 'ios-eye-outline' },
        { title: 'Medications', component: MainPage, icon: 'ios-heart-outline' },
        { title: 'Physicians', component: MainPage, icon: 'ios-medkit-outline' },
        { title: 'Insurance Information', component: MainPage, icon: 'ios-umbrella-outline' },
        { title: 'Other Information', component: MainPage, icon: 'ios-information-circle-outline' },
        { title: 'Linked MyID Products', component: MainPage, icon: 'ios-link-outline' }
      ];
  }

  ngOnInit(){
    this.storage.get('wifi').then(val=>{
      if(val == true){
        this.gettingdata();
      }else{
        this.storage.get('previewData').then(val=>{
          this.listInformation(val);
        });
      }
    });

  }

  gettingdata(){

    console.log(this.profile);
     var profile_id = this.profile.data.person.id;
     var endValue = "/preview"
     this.storage.get('email').then(val=>{
       this.email = val;
       this.storage.get('auth_token').then(val=>{
         this.auth_token = val;
         this.userService.dataGet(this.email, this.auth_token, profile_id, endValue)
           .subscribe(
             (data) => {
              //  loading.dismiss();
               console.log("Data: ", data);
               if(data.success == false){
                 let alert = this.alertCtrl.create({
                   title: "Error", subTitle: "Get Data Error", buttons: ['OK']
                 });
                 alert.present();
                 this.navCtrl.pop();
               } else{

                 console.log(data);
                 this.storage.set('previewData', data);
                 this.listInformation(data);

             }
           });
       });
     });

  }

  listInformation(data){

    var myDate = new Date().toISOString().substring(0,4);
    this.profileData = data.profile;
    this.personalData = data.profile.person;
    this.vitalData = data.profile.vital_medical_conditions.items;
    this.emergencyData = data.profile.emergency_contacts.items;
    this.allergyData = data.profile.allergies.items;
    this.medicationData =  data.profile.medications.items;
    this.physicianData = data.profile.physicians.items;
    this.insuranceData = data.profile.insurance_informations.items;
    this.otherinfoData =  data.profile.other_informations.items;

    this.vitalUpdated =  data.profile.vital_medical_conditions.last_updated_at;
    this.personalUpdated = data.profile.person.last_updated_at;
    this.emergencyUpdated = data.profile.emergency_contacts.last_updated_at;
    this.allergyUpdated = data.profile.allergies.last_updated_at;
    this.medicationUpdated =  data.profile.medications.last_updated_at;
    this.physicianUpdated =  data.profile.physicians.last_updated_at;
    this.insuranceUpdated =  data.profile.insurance_informations.last_updated_at;
    this.otherinforUpdated = data.profile.other_informations.last_updated_at;

    if(this.personalData.donor == true){
       this.donor = "Yes";
    }else {
      this.donor = "No";
    }
    this.age = (parseInt(myDate) -  parseInt(data.profile.birth_date)).toString();
  }

  goBack(){
    console.log("goBack");
    this.nav.popToRoot()
  }

  gotoShareProfile(){
    this.navCtrl.push(ShareProfilePage, {
      profile_id: this.profile.data.person.id
    });
  }
}
