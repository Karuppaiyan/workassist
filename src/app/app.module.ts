import { AuthguardGuard } from './authguard.guard';

import { TreeViewModule } from '@syncfusion/ej2-angular-navigations';

import { DropDownListAllModule, MultiSelectAllModule } from '@syncfusion/ej2-angular-dropdowns';

import { MaskedTextBoxModule, UploaderAllModule } from '@syncfusion/ej2-angular-inputs';

import { ToolbarAllModule, ContextMenuAllModule } from '@syncfusion/ej2-angular-navigations';

import { ButtonAllModule } from '@syncfusion/ej2-angular-buttons';

import { CheckBoxAllModule } from '@syncfusion/ej2-angular-buttons';

import { DatePickerAllModule, TimePickerAllModule, DateTimePickerAllModule } from '@syncfusion/ej2-angular-calendars';

import { NumericTextBoxAllModule } from '@syncfusion/ej2-angular-inputs';

import { ScheduleAllModule, RecurrenceEditorAllModule } from '@syncfusion/ej2-angular-schedule';

import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { LoginComponent } from './login/login.component';
import { UserComponent } from './user/user.component';
import { AdminComponent } from './admin/admin.component';
import { DataSourceService } from './data-source.service';
import { from } from 'rxjs';
import { SchedulersComponent } from './schedulers/schedulers.component';

import { Ng2SearchPipeModule } from 'ng2-search-filter';

const routes: Routes = [
    { path: 'admin', component: AdminComponent, canActivate: [AuthguardGuard] },
    { path: 'user', component: UserComponent, canActivate: [AuthguardGuard] },
    { path: 'login', component: LoginComponent },
    { path : '', component : LoginComponent}
  ];

// tslint:disable-next-line:max-line-length
@NgModule({ declarations: [ AppComponent, HeaderComponent, FooterComponent, LoginComponent, UserComponent, AdminComponent, SchedulersComponent ],
    imports: [
        CommonModule,
        HttpModule,
        ScheduleAllModule,
        RecurrenceEditorAllModule,
        NumericTextBoxAllModule,
        DatePickerAllModule,
        TimePickerAllModule,
        DateTimePickerAllModule,
        CheckBoxAllModule,
        ToolbarAllModule,
        DropDownListAllModule,
        ContextMenuAllModule,
        MaskedTextBoxModule,
        UploaderAllModule,
        MultiSelectAllModule,
        TreeViewModule,
        ButtonAllModule,
        BrowserModule,
        FormsModule,
        Ng2SearchPipeModule,
        RouterModule.forRoot(
            routes,
            { enableTracing: true } // <-- debugging purposes only
          )
    ],
    providers: [AuthguardGuard, SchedulersComponent],
    bootstrap: [AppComponent]
})
export class AppModule { }
