import { Component, Inject, ViewChild, AfterViewInit, ViewEncapsulation, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { extend, isNullOrUndefined, createElement, L10n, remove, Internationalization, } from '@syncfusion/ej2-base';
import { FormGroup } from '@angular/forms';
import { DropDownList, MultiSelectChangeEventArgs } from '@syncfusion/ej2-dropdowns';
import { Button, CheckBox } from '@syncfusion/ej2-buttons';
import { DateTimePicker, ChangeEventArgs} from '@syncfusion/ej2-calendars';
import { ItemModel } from '@syncfusion/ej2-angular-navigations';
import { QuickPopups } from '@syncfusion/ej2-schedule/src/schedule/popups/quick-popups';
import { ghmData, dcaData, tegnaData } from '../data';
import {
  ScheduleComponent,
  DragAndDropService,
  TimelineViewsService,
  EventRenderedArgs,
  GroupModel,
  EventSettingsModel,
  ResizeService,
  CurrentAction,
  View,
  RenderCellEventArgs,
  PopupOpenEventArgs,
  ActionEventArgs,
  ToolbarActionArgs,
  WorkHoursModel,
  ExportOptions,
  TimeScaleModel,
  EJ2Instance
} from '@syncfusion/ej2-angular-schedule';
import { DataManager, Query, UrlAdaptor, Predicate } from '@syncfusion/ej2-data';
import { from } from 'rxjs';
import { DataSourceService } from '../data-source.service';
import { Key } from 'protractor';

L10n.load({
  'en-US': {
      schedule: {
          saveButton: 'Add JOB',
          cancelButton: 'Close',
          deleteButton: 'Remove',
          newEvent: 'NEW JOB',
      },
  }
});

@Component({
  selector: 'app-schedulers',
  templateUrl: './schedulers.component.html',
  styleUrls: ['./schedulers.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [TimelineViewsService, ResizeService, DragAndDropService]
})
export class SchedulersComponent implements OnInit {

  @ViewChild('scheduleObject', {static: false}) public scheduleObject;

  // tslint:disable-next-line:no-input-rename
  @Input('isReadOnly') public userScheduler;

  // tslint:disable-next-line:no-input-rename
  @Input('isReadOnly') public adminScheduler;

  @ViewChild('orderForm', {static: true}) public orderForm: FormGroup;

  constructor(public dataService: DataSourceService) {
    (QuickPopups.prototype as any).applyFormValidation = () => { };
  }

  public flag = false;
  public checkWaterMark = 'Select Employee Name';
  public selectedDate: Date;
  public rowAutoHeight = true;
  public showHeaderBar = true;
  public showQuickInfo = false;
  public allowMultiple = false;
  public allowDragAndDrop = false;
  public allowResizing = false;
  // tslint:disable-next-line:ban-types
  public isReadOnly: Boolean;
  public currentView: View = 'TimelineDay';
  public timeScale: TimeScaleModel = { enable: true, interval: 60, slotCount: 2 };
  public email: string;
  public userName: string;
  public data;
  public dataQuery;
  public endtimehour;
  public startend: any;
  public startDate: any;
  public endDate: any;
  // tslint:disable-next-line:ban-types
  public leave: Boolean = true;
  public exportToExcel: any;
  public currentEventId: number;
  public endInput: HTMLInputElement;
  public dropDownListEndTime: DropDownList;
  public scheduleObj: ScheduleComponent;
  public eventSettings: EventSettingsModel;
  public empFields = { text: 'text', value: 'id' };
  public corporateFields = { text: 'corporateText', value: 'Id' };
  public levelFields = { text: 'levelText', value: 'Id' };
  public statusFields = { text: 'statusText', value: 'Id' };
  public checkFields = { text: 'text', value: 'id' };
  public mode: string;
  public filterPlaceholder: string;
  public popHeight: string = "350px";
  public resources: Object[] = [];

  // tslint:disable-next-line:ban-types
  public orderData: Object = [];
  public group: GroupModel = {
      enableCompactView: false,
      resources: ['scheduler'],
      allowGroupEdit: true
  };

  public StatusData = [

    { statusText: '1. Yet To Start', Id: 'Yet-To-Start' },
    { statusText: '2. In Progress', Id: 'In-Progress' },
    { statusText: '3. Carry Over', Id: 'Carry-Over' },
    { statusText: '4. Creative Review', Id: 'Creative-Review' },
    { statusText: '5. Complete', Id: 'Complete' },
    { statusText: '6. Waiting for Clarification', Id: 'Waiting-for-Clarification' },
    { statusText: '7. Break', Id: 'Break' },
    { statusText: '8. QC Done', Id: 'Qc-Done' }
  ];

  public corporateData = [

    { corporateText: '1. GHM', Id: 'GHM' },
    { corporateText: '2. DCA', Id: 'DCA' },
    { corporateText: '3. TEGNA', Id: 'TEGNA' },
    { corporateText: '4. DUDA', Id: 'DUDA' }
  ];
  public levelData = [
    { levelText: '1. 5', Id: '5' },
    { levelText: '2. 10', Id: '10' },
    { levelText: '3. 15', Id: '15' },
    { levelText: '4. 25', Id: '25' },
    { levelText: '5. 35', Id: '35' },
    { levelText: '6. 45', Id: '45' },
    { levelText: '7. 60', Id: '60' },
    { levelText: '8. 90', Id: '90' },
    { levelText: '9. 110', Id: '110' },
    { levelText: '10. 130', Id: '130' },
    { levelText: '11. 150', Id: '150' },
    { levelText: '12. 170', Id: '170' },
    { levelText: '13. 190', Id: '190' },
    { levelText: '14. 210', Id: '210' },
    { levelText: '15. 230', Id: '230' },
    { levelText: '16. 250', Id: '250' },
    { levelText: '17. 280', Id: '280' },
    { levelText: '18. 300', Id: '300' }
  ];

  public resourceDataSource = this.dataService.getUsersData();

  private dataManager: DataManager = new DataManager({
    url: 'https://workassist.herokuapp.com/getdata',
    crudUrl: 'https://workassist.herokuapp.com/batchdata',
    // tslint:disable-next-line:new-parens
    adaptor: new UrlAdaptor
  });
  /*____________________**____________________*/
  public dateParser(data: string) {
    return new Date(data);
  }
  /*____________________**____________________*/
  public check(data: any): void {
    if (!isNullOrUndefined(data.groupIndex)) {
        return this.scheduleObject.getResourcesByIndex(data.groupIndex).resourceData.Id;
    } else {
      return data.EmployeeId;
    }
  }
  /*____________________**____________________*/
  public startDateParser(data: string) {
    if (isNullOrUndefined(this.startDate) && !isNullOrUndefined(data)) {
      return new Date(data);
    } else if (!isNullOrUndefined(this.startDate)) {
      return new Date(this.startDate);
    }
  }
  /*____________________**____________________*/
  public endDateParser(data: string) {
    if (isNullOrUndefined(this.endDate) && !isNullOrUndefined(data)) {
      return new Date(data);
    } else if (!isNullOrUndefined(this.endDate)) {
      return new Date(this.endDate);
    }
  }
  /*____________________**____________________*/
  public onDateChange(args: ChangeEventArgs) {
    if (!isNullOrUndefined(args.event)) {
      if (args.element.id === 'StartTime') {
        this.startDate = args.value;
      } else if (args.element.id === 'EndTime') {
        this.endDate = args.value;
        console.log(this.endDate);
      }
    }
  }
  /*____________________**____________________*/
  public onChangeResource(args: MultiSelectChangeEventArgs): void {
    this.scheduleObject.resources[0].dataSource = this.resourceDataSource;
    let resourcePredicate;
    // tslint:disable-next-line:prefer-for-of
    for (let a = 0; a < args.value.length; a++) {
      const predicate = new Predicate('id', 'lessthan', args.value[a]);
      resourcePredicate = resourcePredicate ? resourcePredicate.or(predicate) : predicate;
    }
    const resourceQuery = resourcePredicate ? new Query().where(resourcePredicate) : new Query();
    this.scheduleObject.resources[0].query = resourceQuery;
    this.flag = true;
  }
  /*____________________**____________________*/
  public onDataBinding(args: any) {
    // check the resource count
    if ((this.scheduleObject.resourceCollection[0].dataSource as any).length === 0 && this.flag ) {
      // Render default scheduler to prevent script error.
      this.scheduleObject.group.resources = [];
      this.scheduleObject.refresh();
      this.flag = false;
    } else if (
      (this.scheduleObject.resourceCollection[0].dataSource as any).length > 0 &&
      this.flag
    ) {
      this.scheduleObject.group.resources = ['scheduler'];
      this.scheduleObject.refresh();
      this.flag = false;
    }
  }
  /*____________________**____________________*/
  public onChange(args: ChangeEventArgs): void {
    if (args.element.id === 'Level') {

      const endtimehour = args.value;
      const startElement: DateTimePicker = ((
        document.querySelector('#StartTime') as HTMLElement) as EJ2Instance)
        .ej2_instances[0] as DateTimePicker;

      const endElement: DateTimePicker = ((
        document.querySelector('#EndTime') as HTMLElement) as EJ2Instance)
        .ej2_instances[0] as DateTimePicker;
      /* */

      const startDate = startElement.value;
      const endDate = endElement.value;

      // const difference = start.getTime() - endDate.getTime(); // This will give difference in milliseconds
      // const resultInMinutes = Math.round(difference / 60000);

      // this.getDataDiff(startDate, endDate);

      this.endDateParser.bind(this.endDate = new Date(new Date(new Date(startDate)
      .getTime()).setMinutes(endDate.getMinutes() + Number(endtimehour))));
      console.log(endDate);
    }
  }
  /*____________________**____________________*/
  public getDataDiff(startDate, endDate) {
    const diff = endDate.getTime() - startDate.getTime();
    const days = Math.floor(diff / (60 * 60 * 24 * 1000));
    const hours = Math.floor(diff / (60 * 60 * 1000)) - (days * 24);
    const minutes = Math.floor(diff / (60 * 1000)) - ((days * 24 * 60) + (hours * 60));
    const seconds = Math.floor(diff / 1000) - ((days * 24 * 60 * 60) + (hours * 60 * 60) + (minutes * 60));
    return { day: days, hour: hours, minute: minutes, second: seconds };
  }
  /*____________________**____________________*/
  public OnEventRendered(args: EventRenderedArgs): void {
    switch (args.data.Status) {
      case 'Yet-To-Start':
          (args.element as HTMLElement).style.backgroundColor = 'rgb(181, 24, 121)';
          break;
      case 'In-Progress':
          (args.element as HTMLElement).style.backgroundColor = 'rgb(134, 188, 37)';
          break;
      case 'Carry-Over':
          (args.element as HTMLElement).style.backgroundColor = 'rgb(238, 118, 36)';
          break;
      case 'Creative-Review':
          (args.element as HTMLElement).style.backgroundColor = '#0CAA41';
          break;
      case 'Complete':
          (args.element as HTMLElement).style.backgroundColor = 'gray';
          break;
      case 'Break':
          (args.element as HTMLElement).style.backgroundColor = 'rgb(104, 33, 192)';
          break;
      case 'Waiting-for-Clarification':
          (args.element as HTMLElement).style.backgroundColor = 'rgb(136, 218, 222)';
          break;
      case 'Qc-Done':
          (args.element as HTMLElement).style.backgroundColor = 'rgb(74, 74, 73)';
          break;
      case '8':
          (args.element as HTMLElement).style.backgroundColor = 'teal';
          (args.element as HTMLElement).style.textAlign = 'center';
          this.leave = true;
          break;
     }
  }
  /*____________________**____________________*/
  public onRenderCell(args: RenderCellEventArgs): void {
    if (args.element.classList.contains('e-work-cells')) {
        if (args.date < new Date(2020, 2, 21, 0, 0)) {
            args.element.setAttribute('aria-readonly', 'true');
            args.element.classList.add('e-read-only-cells');
        }
    }
    if (args.elementType === 'emptyCells' && args.element.classList.contains('e-resource-left-td')) {
        const target: HTMLElement = args.element.querySelector('.e-resource-text') as HTMLElement;
        target.innerHTML = '<div class="name">Names</div><div class="type">Employee ID</div>';
    }
  }
  /*____________________**____________________*/
  public onPopupOpen(args: PopupOpenEventArgs): void {
    if (args.type === 'Editor') {
          this.orderData = Object.assign({}, args.data);
          // this.getDataDiff(new Date(this.startDate), new Date(this.endDate));
          // let endDate: HTMLInputElement = args.element.querySelector('#Level') as HTMLInputElement;
          // console.log(endDate);

          /*
           let startElement: HTMLInputElement = args.element.querySelector('#StartTime') as HTMLInputElement;
            if (!startElement.classList.contains('e-datetimepicker')) {
                new DateTimePicker({ value: new Date(startElement.value) || new Date() }, startElement);
                console.log(startElement.value);
                this.startDate = startElement.value;
            }
           let endElement: HTMLInputElement = args.element.querySelector('#EndTime') as HTMLInputElement;
            if (!endElement.classList.contains('e-datetimepicker')) {
                new DateTimePicker({ value: new Date(endElement.value) || new Date() }, endElement);
                console.log(endElement.value);
                this.endDate = endElement.value;
            }
            */


          if (this.adminScheduler === false) {
            const resourceElement1: HTMLInputElement = args.element.querySelector('#EndTime') as HTMLInputElement;
            // resourceElement1.disabled = true;

          } else if (this.userScheduler === false) {
            const resourceElement2: HTMLInputElement = args.element.querySelector('#EndTime') as HTMLInputElement;
            // resourceElement2.hidden = true;
          }
          const resourceElement: HTMLInputElement = args.element.querySelector('#EmployeeId') as HTMLInputElement;
          // resourceElement.setAttribute('name', 'EmployeeId');

          const statusElement: HTMLInputElement = args.element.querySelector('#Status') as HTMLInputElement;
          // statusElement.setAttribute('name', 'Status');

         // const endElement: HTMLInputElement = args.element.querySelector('#EndTime') as HTMLInputElement;

          // tslint:disable-next-line:max-line-length
          // tslint:disable-next-line:one-variable-per-declaration
          // const endElement: DateTimePicker = (document.querySelector('#EndTime') as any);
          // tslint:disable-next-line:no-unused-expression
          // console.log(endElement);
    }

  }
  /*____________________**____________________*/
  public onActionBegin(args: any): void {
    if (args.requestType === 'eventCreate') {
      this.currentEventId = args.data[0].Id;
      args.data[0].CreateBy = this.email;
      args.data[0].UserName = this.userName;
      args.data[0].IsBlock = this.leave ? false : true;
    }
    if (args.requestType === 'toolbarItemRendering') {
      const queryLog: ItemModel = {
        align: 'Left',
        showTextOn: 'Both',
        prefixIcon: 'e-icon-schedule-excel-export',
        text: 'Work assists log',
        cssClass: 'e-excel-export',
        click: this.clicklog.bind(this)
      };
      const exportItem: ItemModel = {
          align: 'Right',
          showTextOn: 'Both',
          prefixIcon: 'e-icon-schedule-excel-export',
          text: 'Excel Export',
          cssClass: 'e-excel-export',
          click: this.onExportClick.bind(this)
        };
      args.items.push(exportItem);
      args.items.push(queryLog);
      }
  }
  /*____________________**____________________*/
  public clicklog(): void {
     window.open('https://docs.google.com/forms/d/e/1FAIpQLSfX90RB4RLLLUd2XCTN80ee8R1CDQPYnVrWhT6_AMCZHPH4Ww/viewform', '_blank');
  }
  /*____________________**____________________*/
  public onExportClick(): void {
      const exportValues: ExportOptions = { fields: ['Id', 'EmployeeId', 'Subject', 'StartTime', 'EndTime'] };
      this.scheduleObject.exportToExcel(exportValues);
    }
  /*____________________**____________________*/

  // custom code start
  // tslint:disable-next-line:ban-types
  public generateCalendarData(): Object[] {
    return [...ghmData, ...dcaData, ...tegnaData];
  }

  // custom code end
  public ngOnInit() {
      this.selectedDate = new Date();
      this.resources = this.resourceDataSource;
      this.mode = "CheckBox";
      this.filterPlaceholder = "Search Employee Name";
      // tslint:disable-next-line:max-line-length
      this.email = 'ukaruppaiyan@gmail.com'; // Here we used static email address for your reference. Kindly map your currently logined user email to achieve your scenario.
      // tslint:disable-next-line:max-line-length
      this.userName = 'Karuppaiyan'; // Here we used static user name for your reference. Kindly map your currently logined username to achieve your scenario.
      this.data =  { Name: this.userName, Email: this.email, IsBlock: this.leave};
      this.dataQuery = new Query().addParams('tokens', this.data as any);
      this.eventSettings = { dataSource: this.dataManager, query: this.dataQuery,
          allowAdding: this.userScheduler || this.adminScheduler,
          allowEditing: this.userScheduler ? false : true,
          allowDeleting: this.userScheduler || this.adminScheduler
      };
     }
  }
