import { Component, Inject, ViewChild, AfterViewInit, ViewEncapsulation, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { extend, isNullOrUndefined, createElement, L10n, remove, Internationalization, EmitType } from '@syncfusion/ej2-base';
import { FormGroup } from '@angular/forms';
import { DropDownList, MultiSelectChangeEventArgs, FilteringEventArgs, MultiSelect} from '@syncfusion/ej2-dropdowns';
import { Button, CheckBox } from '@syncfusion/ej2-buttons';
import { DateTimePicker, ChangeEventArgs} from '@syncfusion/ej2-calendars';
import { ItemModel } from '@syncfusion/ej2-angular-navigations';
import { QuickPopups } from '@syncfusion/ej2-schedule/src/schedule/popups/quick-popups';
import { ghmData, dcaData, tegnaData } from '../data';
import {
  ScheduleComponent,
  DayService,
  WeekService,
  WorkWeekService,
  MonthService,
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
import { DataManager, Query, UrlAdaptor, Predicate, WebApiAdaptor } from '@syncfusion/ej2-data';
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
  providers: [DayService, WeekService, WorkWeekService, MonthService, TimelineViewsService, ResizeService, DragAndDropService]
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
  public dayInterval: number = 3;
  public weekInterval: number = 2;
  // tslint:disable-next-line:ban-types
  public isReadOnly: Boolean;
  public currentView: View = 'Week';
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
  public dropdowns: MultiSelect;
  public scheduleObj: ScheduleComponent;
  public eventSettings: EventSettingsModel;
  public empFields = { text: 'text', value: 'id' };
  public corporateFields = { text: 'text', value: 'id' };
  public levelFields = { text: 'levelText', value: 'id' };
  public statusFields = { text: 'text', value: 'id' };
  public checkFields = { text: 'text', value: 'id' };
  public mode: string;
  public filterPlaceholder: string;
  public text: string = "Select a Coporate";
  public popHeight: string = "350px";
  public resourcesdata: Object[] = [];
  public searchText;

  // tslint:disable-next-line:ban-types
  public orderData: Object = [];
  public group: GroupModel = {
      enableCompactView: false,
      resources: ['Corporate', 'Employee'],
      allowGroupEdit: true
  };

  public StatusData = [

    { text: '1. Yet To Start', Status: 'Yet-To-Start' },
    { text: '2. In Progress', Status: 'In-Progress' },
    { text: '3. Carry Over', Status: 'Carry-Over' },
    { text: '4. Creative Review', Status: 'Creative-Review' },
    { text: '5. Complete', Status: 'Complete' },
    { text: '6. Waiting for Clarification', Status: 'Waiting-for-Clarification' },
    { text: '7. Break', Status: 'Break' },
    { text: '8. QC Done', Status: 'Qc-Done' }
  ];

  public corporateData = [

    { text: 'GROUP 1', id: 1, Expand:true},
    { text: 'GROUP 2', id: 2, Expand:true},
    { text: 'GROUP 3', id: 3, Expand:true},
    { text: 'GROUP 4', id: 4, Expand:true}
  ];
  public levelData = [
    { levelText: '1. 5', id: '5' },
    { levelText: '2. 10', id: '10' },
    { levelText: '3. 15', id: '15' },
    { levelText: '4. 25', id: '25' },
    { levelText: '5. 35', id: '35' },
    { levelText: '6. 45', id: '45' },
    { levelText: '7. 60', id: '60' },
    { levelText: '8. 90', id: '90' },
    { levelText: '9. 110', id: '110' },
    { levelText: '10. 130', id: '130' },
    { levelText: '11. 150', id: '150' },
    { levelText: '12. 170', id: '170' },
    { levelText: '13. 190', id: '190' },
    { levelText: '14. 210', id: '210' },
    { levelText: '15. 230', id: '230' },
    { levelText: '16. 250', id: '250' },
    { levelText: '17. 280', id: '280' },
    { levelText: '18. 300', id: '300' }
  ];

  public resourceDataSource = this.dataService.getUsersData();

  public resourceDataSource1: DataManager = new DataManager({
    url: 'https://api.jsonbin.io/b/5e924d47172eb6438962660e/3',
    adaptor: new WebApiAdaptor,
    crossDomain: true
  });

  private dataManager: DataManager = new DataManager({
    url: 'http://localhost:5000/GetData',
    crudUrl: 'http://localhost:5000/BatchData',
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
    this.scheduleObject.resourcesdata[0].dataSource = this.resourceDataSource;
    let resourcePredicate;
    // tslint:disable-next-line:prefer-for-of
    for (let a = 0; a < args.value.length; a++) {
      const predicate = new Predicate('id', 'equal', args.value[a]);
      resourcePredicate = resourcePredicate
      ? resourcePredicate.or(predicate)
      : predicate;
    }
    const resourceQuery = resourcePredicate ? new Query().where(resourcePredicate) : new Query();
    this.scheduleObject.resourcesdata[0].query = resourceQuery;
    this.flag = true;
  }
  /*____________________**____________________*/
 
  public onFiltering: EmitType<FilteringEventArgs>  =  (e: FilteringEventArgs) => {
    let query = new Query();
    //frame the query based on search string with filter type.
    query = (e.text != '') ? query.where('text', 'contains', e.text, true) : query;
    //pass the filter data source, filter query to updateData method.
    e.updateData(this.data, query);
  };
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

  public refresh(){
    this.scheduleObject.refresh();
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
      case 'Leave':
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
      if (this.adminScheduler === false) {
        const remov = args.element.querySelector('.e-resources-row') as HTMLElement;
        const removtime = args.element.querySelector('.e-start-end-row') as HTMLElement;
        const removtimezone = args.element.querySelector('.e-all-day-time-zone-row') as HTMLElement;
        const removeditor = args.element.querySelector('.e-editor') as HTMLElement;
        removtimezone.style.display = 'none';
        removtime.style.display = 'none';
        remov.style.display = 'none';
        removeditor.style.display = 'none';
      } else if (this.userScheduler === false) {
        const remov = args.element.querySelector('.e-resources-row') as HTMLElement;
        const removtimezone = args.element.querySelector('.e-all-day-time-zone-row') as HTMLElement;
        const removeditor = args.element.querySelector('.e-editor') as HTMLElement;
        const endhour = args.element.querySelector('.e-end-container') as HTMLElement;
        removtimezone.style.display = 'block';
        remov.style.display = 'block';
        removeditor.style.display = 'block';
        endhour.style.display = 'block';
      }

      // Create required custom elements in initial time
      if (!args.element.querySelector('.corporate-field-row')) {
          const row: HTMLElement = createElement('div', { className: 'corporate-field-row' });
          const formElement: HTMLElement = args.element.querySelector('.e-schedule-form');
          formElement.firstChild.insertBefore(row, args.element.querySelector('.e-start-end-row'));
          const container: HTMLElement = createElement('div', { className: 'corporate-field-container' });

          const inputEle: HTMLInputElement = createElement('input', {
              className: 'e-field', attrs: { name: 'Status' }
          }) as HTMLInputElement;

          container.appendChild(inputEle);
          row.appendChild(container);

          const dropDownList: DropDownList = new DropDownList({
              dataSource:this.StatusData,
              fields: { text: 'text', value: 'Status' },
              value: ((args.data) as { [key: string]: Object }).Status as string,
              floatLabelType: 'Always', placeholder: 'Status'
          });
          
          dropDownList.appendTo(inputEle);
          inputEle.setAttribute('name', 'Status');
      }
  }

if (args.type === 'QuickInfo') {
      if (args.target.classList.contains('e-work-cells') || args.target.classList.contains('e-header-cells')) {
       // this.scheduleObj.quickPopup.quickPopupHide();
        args.cancel = true;
      } else if (args.target.classList.contains('e-appointment')) {
        (args.element as HTMLElement).style.boxShadow = `1px 2px 5px 0 ${(args.target as HTMLElement).style.backgroundColor}`;
      }
}
if (args.type === 'EditEventInfo') {
  if (!args.element.querySelector('.e-popup-content-row')) {
    const row: HTMLElement = createElement('div', { className: 'e-popup-content-row' });
    const container: HTMLElement = createElement('div', { className: 'e-popup-content-container' });

    const formElement: HTMLElement = args.element.querySelector('.e-schedule-form');
    formElement.firstChild.insertBefore(row, args.element.querySelector('.e-popup-content'));

    const inputElem: HTMLInputElement = createElement('button', {
    className: 'e-field', attrs: { name: 'button'}}) as HTMLInputElement;
    inputElem.id = 'myButton';
    inputElem.innerHTML = 'Start';
    inputElem.style.background = '#4FFF8F';

    container.appendChild(inputElem);
    row.appendChild(container);
  }

}
if (args.type === 'EventContainer') {
  const eventElements: NodeListOf<HTMLElement> = args.element.querySelectorAll('.e-appointment');
  eventElements.forEach((element: HTMLElement) => {
    const colors: Array<string> = ['rgb(96, 242, 56)', 'rgb(254, 194, 0)'];
    if (colors.indexOf(element.style.backgroundColor) !== -1) {
      (element.querySelector('.e-subject') as HTMLElement).style.color = 'red';
      }
    });
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

      const corporate: ItemModel = {
        align: "Left",
        type: "Input",
        template: this.dropdowns = new MultiSelect({
          dataSource: this.corporateData,
          width: "250px",
          placeholder: 'Select Corporate',
          mode: "CheckBox",
          showDropDownIcon: true,
          showSelectAll: true,
          popupHeight: "350px",
          fields: { text: "text", value: "id" },
          change: function (args) {
            this.onChangeResource(args);
          }
        }),        
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
      // args.items.push(corporate);
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
      this.resourcesdata = this.resourceDataSource;
      this.mode = "CheckBox";
      this.filterPlaceholder = "Search Employee Name";
      // tslint:disable-next-line:max-line-length
      this.email = 'ukaruppaiyan@gmail.com'; // Here we used static email address for your reference. Kindly map your currently logined user email to achieve your scenario.
      // tslint:disable-next-line:max-line-length
      this.userName = 'Karuppaiyan'; // Here we used static user name for your reference. Kindly map your currently logined username to achieve your scenario.
      this.data =  { Name: this.userName, Email: this.email, IsBlock: this.leave};
      this.dataQuery = new Query().addParams('tokens', this.data as any);
      this.eventSettings = { dataSource: this.dataManager, query: this.dataQuery, fields: {
        id: 'Id',
        subject: { title: 'Job Number', name: 'Subject' },
        location: { title: 'Tracking Number', name: 'Tracking-Number' },
        description: { title: 'Comments', name: 'Description' },
        startTime: { title: 'From', name: 'StartTime' },
        endTime: { title: 'To', name: 'EndTime' }
        },
          allowAdding: this.userScheduler || this.adminScheduler,
          allowEditing: this.userScheduler ? false : true,
          allowDeleting: this.userScheduler || this.adminScheduler
      };
     }
  }
