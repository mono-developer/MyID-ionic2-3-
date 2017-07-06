import { Component } from '@angular/core';
import { NavController, NavParams, Nav, LoadingController, ActionSheetController, AlertController, PopoverController } from 'ionic-angular';
import { IonAlphaScrollModule } from '../../components/ionic2-alpha-scroll';
import { Storage } from '@ionic/storage';
import {IonicStorageModule} from '@ionic/Storage';
import { UserService } from "../../providers/user-service";
import { DetailDocumentPage } from "../detail_document/detail_document";
import { PopoverContentPage } from '../popover/popover';

@Component({
  selector: 'page-documents',
  templateUrl: 'documents.html'
})
export class DocumentsPage {
  public lists:any;
  public currentPageClass: any;
  public alphaScrollItemTemplate : string;
  public alphaScrollItemTemplate1 : string;
  public triggerAlphaScrollChange: number;

  public email:any;
  public auth_token:any;
  public slug:any;
  public profile:any;
  public profile_id:any;
  public parent_id:any;
  public documents:any;
  public date_documents:any;
  public date_documents_array:any = {};
  public date_month:any=[];

  public folder_name:any;
  public checkbox_flag:any;
  public select_flag:any;
  public selected_ids :any = [];
  public sort_flag: string = "name";
  public sorted_documents: Array<{item_type: string, id: string, name: string, parent_id: string,
                                  profile_id: string, slug: string, updated_at: string, is_private:string,
                                  media_type: string, folder_id: string, file_size: string, file_size_in_bytes:string,
                                  url: string}>;

  constructor(public navCtrl: NavController, public navParams: NavParams, public nav:Nav, public loadingCtrl: LoadingController,
      public storage:Storage, public userService: UserService, public actionSheetCtrl:ActionSheetController, public alertCtrl:AlertController,
      public popOverCtrl: PopoverController) {


        this.profile = this.navParams;
        this.slug = navParams.get('slug');
        this.profile_id = navParams.get('profile_id');
        this.parent_id = navParams.get('parent_id');
    this.lists = [ {'name': 'flask'},
    {'name': 'wifi'},
    {'name': 'beer'},
    {'name': 'football'},
    {'name': 'basketball'},
    {'name': 'paper'},
    {'name': 'plane'},
    {'name': 'american'},
    {'name': 'football'},
    {'name': 'football'},
    {'name': 'football'},
    {'name': 'football'},
    {'name': 'football'},
    {'name': 'boat'},
    {'name': 'bluetooth'},
    {'name': 'build'}];

    this.currentPageClass = this;
    this.alphaScrollItemTemplate = '<div class="item-div"><ion-item (click)="currentPageClass.onItemClick(item)"><ion-icon item-left *ngIf="item.item_type==\'folder\'" name="ios-folder-outline" class="icon-style"></ion-icon><ion-icon item-left *ngIf="item.media_type==\'image\'" name="ios-image-outline" class="icon-style"></ion-icon><ion-icon item-left *ngIf="item.media_type==\'video\'" name="ios-videocam-outline" class="icon-style"></ion-icon><ion-icon item-left *ngIf="item.media_type==\'document\'" name="ios-document-outline" class="icon-style"></ion-icon><h2 style="font-size:5vw;">{{item.name}}</h2><p>{{item.file_size}}</p><ion-icon name="ios-arrow-dropdown-outline" item-right (click)="currentPageClass.moreOptions(item);"></ion-icon></ion-item></div>';

    this.alphaScrollItemTemplate1 = '<div class="item-div"><ion-checkbox item-left (ionChange)="currentPageClass.check1(item.id);"></ion-checkbox><ion-item (click)="currentPageClass.onItemClick(item)"><ion-icon item-left *ngIf="item.item_type==\'folder\'" name="ios-folder-outline" class="icon-style"></ion-icon><ion-icon item-left *ngIf="item.media_type==\'image\'" name="ios-image-outline" class="icon-style"></ion-icon><ion-icon item-left *ngIf="item.media_type==\'video\'" name="ios-videocam-outline" class="icon-style"></ion-icon><ion-icon item-left *ngIf="item.media_type==\'document\'" name="ios-document-outline" class="icon-style"></ion-icon><h2 style="font-size:5vw;">{{item.name}}</h2><p>{{item.file_size}}</p><ion-icon name="ios-arrow-dropdown-outline" item-right></ion-icon></ion-item></div>';
    this.triggerAlphaScrollChange = 0;
  }

  ngOnInit(){
    this.gettingData();
  }

  gettingData(){
    this.documents = [];
    this.date_documents = [];
    let loading = this.loadingCtrl.create();
    loading.present();

    this.storage.get('email').then(val=>{
      this.email = val;
      this.storage.get('auth_token').then(val=>{
        this.auth_token = val;
        if (this.profile.data.id == undefined){
          this.profile.data.id = this.profile_id;
        }
        this.userService.getDocuments(this.email, this.auth_token, this.profile.data.id, this.slug)
          .subscribe(
            (data) => {
              loading.dismiss();
              if(data.success == false){
                console.log("get Documents:" + JSON.stringify(this.profile));
             }else{

               this.documents = data.items;
               this.date_documents = data.items;
               let name1, name2: string;
               let temp:any;

               for (let k=0; k<this.documents.length; k++){

                 if (this.documents[k].item_type == "document"){
                     let temp_document = {"item_type": "", "id": 0, "name": "", "profile_id": 0,
                           "media_type": "", "folder_id": null, "file_size": 0, "file_size_in_bytes":0,
                                 "updated_at":"", "url": "", "is_private": false};
                     temp_document.item_type = this.documents[k].item_type;
                     temp_document.id = this.documents[k].id;
                     temp_document.name = this.documents[k].file_name;
                     temp_document.profile_id = this.documents[k].profile_id;
                     temp_document.media_type = this.documents[k].media_type;
                     temp_document.folder_id = this.documents[k].folder_id;
                     temp_document.file_size = this.documents[k].file_size;
                     temp_document.file_size_in_bytes = this.documents[k].file_size_in_bytes;
                     temp_document.updated_at = this.documents[k].updated_at;
                     temp_document.url = this.documents[k].url;
                     temp_document.is_private = this.documents[k].is_private;

                     this.documents[k] = temp_document;
                     this.date_documents[k] = temp_document;
                  }
               }

               if (this.sort_flag == 'name'){
                 for (let i = 0; i< this.documents.length; i++){
                    for (let j = i+1; j<this.documents.length; j++){
                      if (this.documents[i].name.localeCompare(this.documents[j].name) > 0){
                        temp = this.documents[i];
                        this.documents[i] = this.documents[j];
                        this.documents[j] = temp;
                      }
                    }
                 }
               }


               if (this.sort_flag == 'date'){
                 for (let i = 0; i< this.date_documents.length; i++){
                    for (let j = i+1; j<this.date_documents.length; j++){
                      if (this.date_documents[i].updated_at.localeCompare(this.date_documents[j].updated_at) < 0){
                        temp = this.date_documents[i];
                        this.date_documents[i] = this.date_documents[j];
                        this.date_documents[j] = temp;
                      }
                    }
                 }

                 for (let i=0; i<this.date_documents.length; i++){
                   let temp_date_month = this.date_documents[i].updated_at.substr(0, 7);
                   if (this.date_month.indexOf(temp_date_month) == -1){
                     this.date_month.push(temp_date_month);
                   }
                 }

                 for (let i= 0; i<this.date_month.length; i++){
                   this.date_documents_array[this.date_month[i]] = [];
                   for (let j=0; j< this.date_documents.length;j++){
                     if (this.date_documents[j].updated_at.includes(this.date_month[i])){
                       this.date_documents_array[this.date_month[i]].push(this.date_documents[j])
                     }
                   }
                 }
               }


               console.log("get Documents:" + JSON.stringify(this.date_documents_array));
             }
            },
            (data) => {
              loading.dismiss();
            });
      });
    });
  }

  goBack(){
    console.log("goBack");
    this.nav.popToRoot()
  }

  onItemClick(item, profile_id) {
    console.log("item: " + JSON.stringify(item));

    if (item.item_type == "folder"){
      this.navCtrl.push(DocumentsPage, {
        slug: item.slug,
        profile_id: item.profile_id,
        parent_id: item.id
      });
    }
    else{
      this.navCtrl.push(DetailDocumentPage, {
        url: item.url
      });
    }
  }

  selectOptions(){
    let data = {'profile_id': this.profile.data.id, 'parent_id':this.parent_id, 'sort_flag':this.sort_flag};
    console.log("dataaa", data);
    let popover = this.popOverCtrl.create(PopoverContentPage, data);
    popover.present({

    });

    popover.onDidDismiss((popoverData) => {
      if (popoverData=='1'){
        this.checkbox_flag = 1;
        this.selected_ids = [];
        console.log(this.checkbox_flag);
      }
      else if (popoverData == 'name'){
        this.sort_flag = popoverData;
        this.gettingData();
      }
      else if (popoverData == 'date'){
        this.sort_flag = popoverData;
        this.gettingData();
      }
      else{
        this.gettingData();
      }
    })
  }

  cancelSelect(){
    this.checkbox_flag = 0;
  }

  check1(id){
    let index = this.selected_ids.indexOf(id);
    if(index > -1){
      this.selected_ids.splice(index, 1);
    }
    else{
      this.selected_ids.push(id);
    }

    console.log(this.selected_ids);
  }

  deleteItems(){
    if (this.selected_ids.length > 0){
      let loading = this.loadingCtrl.create();
      loading.present();

      this.storage.get('email').then(val=>{
        this.email = val;
        this.storage.get('auth_token').then(val=>{
          this.auth_token = val;
          if (this.profile.data.id == undefined){
            this.profile.data.id = this.profile_id;
          }
          this.userService.deleteDocuments(this.email, this.auth_token, this.profile.data.id, this.selected_ids)
            .subscribe(
              (data) => {
                if(data.success == false){
                  console.log("get Documents:" + JSON.stringify(this.profile));
               }else{

               }
               this.userService.deleteFolders(this.email, this.auth_token, this.profile.data.id, this.selected_ids)
                 .subscribe(
                   (data) => {
                     loading.dismiss();
                     if(data.success == false){
                       console.log("get Documents:" + JSON.stringify(data));
                    }else{

                    }
                    this.gettingData();
                    this.checkbox_flag = 0;
                   },
                   (data) => {
                     loading.dismiss();
                     console.log("get Documents:" + JSON.stringify(data));
                   });
              },
              (data) => {
                loading.dismiss();
              });
        });
      });
    }
  }

  moreOptions(item){
    if (item.item_type == 'folder'){
      let actionSheet = this.actionSheetCtrl.create({
            title: item.name ,
            subTitle:"",
            buttons: [
              {
                text: 'Share Folder',
                handler: () => {

                }
              },{
                text: 'Rename Folder',
                handler: () => {

                }
              },{
                text: 'Move Folder',
                handler: () => {

                }
              },{
                text: 'Delete Folder',
                role: 'destructive',
                handler: () => {

                }
              },{
                text: 'Cancel',
                role: 'cancel',
                handler: () => {
                  console.log('Cancel clicked');
                }
              }
            ]
          });
        actionSheet.present();
    }
    else{
      let actionSheet = this.actionSheetCtrl.create({
            title: item.name ,
            subTitle:"",
            buttons: [
              {
                text: 'Share File',
                handler: () => {

                }
              },{
                text: 'Rename File',
                handler: () => {

                }
              },{
                text: 'Move File',
                handler: () => {

                }
              },{
                text: 'Delete File',
                role: 'destructive',
                handler: () => {

                }
              },{
                text: 'Cancel',
                role: 'cancel',
                handler: () => {

                }
              }
            ]
          });
        actionSheet.present();
    }
  }
}
