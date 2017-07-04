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
  public triggerAlphaScrollChange: number;

  public email:any;
  public auth_token:any;
  public slug:any;
  public profile:any;
  public profile_id:any;
  public parent_id:any;
  public documents:any;

  public folder_name:any;
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
        this.parent_id=navParams.get('parent_id');
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
    this.alphaScrollItemTemplate = '<ion-item (click)="currentPageClass.onItemClick(item)"><ion-icon item-left *ngIf="item.item_type==\'folder\'" name="ios-folder-outline" class="icon-style"></ion-icon><ion-icon item-left *ngIf="item.media_type==\'image\'" name="ios-image-outline" class="icon-style"></ion-icon><ion-icon item-left *ngIf="item.media_type==\'video\'" name="ios-videocam-outline" class="icon-style"></ion-icon><ion-icon item-left *ngIf="item.media_type==\'document\'" name="ios-document-outline" class="icon-style"></ion-icon><h2 style="font-size:5vw;">{{item.name}}</h2><p>{{item.file_size}}</p><ion-icon name="ios-arrow-dropdown-outline" item-right></ion-icon></ion-item>';
    this.triggerAlphaScrollChange = 0;
  }

  ngOnInit(){
    this.gettingData();
  }

  gettingData(){

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
                  }
               }

               for (let i = 0; i< this.documents.length; i++){
                  for (let j = i+1; j<this.documents.length; j++){
                    if (this.documents[i].name.localeCompare(this.documents[j].name) > 0){
                      temp = this.documents[i];
                      this.documents[i] = this.documents[j];
                      this.documents[j] = temp;
                    }
                  }
               }
               console.log("get Documents:" + JSON.stringify(this.documents));
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
    let data = {'profile_id': this.profile.data.id, 'parent_id':this.parent_id};
    console.log("dataaa", data);
    let popover = this.popOverCtrl.create(PopoverContentPage, data);
    popover.present({

    });

    popover.onDidDismiss((popoverData) => {
      this.gettingData();
    })
    // let actionSheet = this.actionSheetCtrl.create({
    //
    //       title: 'Select Options',
    //       subTitle: '',
    //
    //         buttons: [
    //         {
    //           text: '<i>Upload File...</i>',
    //           handler: () => {
    //             this.uploadFile();
    //
    //           }
    //         },{
    //           text: 'Create Folder',
    //           handler: () => {
    //             console.log('SetExpiration clicked');
    //             this.createFolderName();
    //           }
    //         },{
    //           text: 'Select',
    //           handler: () => {
    //             console.log('Archive clicked');
    //
    //           }
    //         },{
    //           text: 'Sort by Date',
    //           handler: () => {
    //             console.log('Archive clicked');
    //
    //           }
    //         },{
    //           text: 'Cancel',
    //           role: 'cancel',
    //           handler: () => {
    //             console.log('Cancel clicked');
    //           }
    //         }
    //       ]
    //     });
    //     actionSheet.present();
  }

}
