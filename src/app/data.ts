import { EventRenderedArgs, View } from '@syncfusion/ej2-schedule';
/**
 * Schedule datasource
 */
/*
let msPerDay: number = 86400000;
let msPerHour: number = 3600000;
let currentTime: number = new Date().setMinutes(0, 0, 0);
export let readonlyEventsData: Object[] = [
    {
        Id: 1,
        Subject: 'Project Workflow Analysis',
        StartTime: new Date(currentTime + msPerDay * -2 + msPerHour * 2),
        EndTime: new Date(currentTime + msPerDay * -2 + msPerHour * 4),
        IsReadonly: true
    }, {
        Id: 2,
        Subject: 'Project Requirement Planning',
        StartTime: new Date(currentTime + msPerDay * -1 + msPerHour * 2),
        EndTime: new Date(currentTime + msPerDay * -1 + msPerHour * 4),
        IsReadonly: true
    }
];
export function applyCategoryColor(args: EventRenderedArgs, currentView: View): void {
    let categoryColor: string = args.data.CategoryColor as string;
    if (!args.element || !categoryColor) {
        return;
    }
    if (currentView === 'Agenda') {
        (args.element.firstChild as HTMLElement).style.borderLeftColor = categoryColor;
    } else {
        args.element.style.backgroundColor = categoryColor;
    }
}
export function generateObject(start: number = new Date(2017, 6, 1).getTime(), end: number = new Date(2019, 10, 8).getTime()): Object[] {
    let data: Object[] = [];
    let names: string[] = [
        'Story Time for Kids', 'Camping with Turtles', 'Wildlife Warriors', 'Parrot Talk', 'Birds of Prey', 'Croco World',
        'Venomous Snake Hunt', 'Face Painting & Drawing events', 'Pony Rides', 'Feed the Giants', 'Jungle Treasure Hunt',
        'Endangered Species Program', 'Black Cockatoos Playtime', 'Walk with Jungle King', 'Trained Climbers', 'Playtime with Chimpanzees',
        'Meet a small Mammal', 'Amazon Fish Feeding', 'Elephant Ride'
    ];
    let dayCount: number = 1000 * 60 * 60;
    for (let a: number = start, id: number = 1; a < end; a += (dayCount * 24) * 2) {
        let count: number = Math.floor((Math.random() * 9) + 1);
        for (let b: number = 0; b < count; b++) {
            let hour: number = Math.floor(Math.random() * 100) % 24;
            let minutes: number = Math.round((Math.floor(Math.random() * 100) % 60) / 5) * 5;
            let nCount: number = Math.floor(Math.random() * names.length);
            let startDate: Date = new Date(new Date(a).setHours(hour, minutes));
            let endDate: Date = new Date(startDate.getTime() + (dayCount * 2.5));
            data.push({
                Id: id,
                Subject: names[nCount],
                StartTime: startDate,
                EndTime: endDate,
                IsAllDay: (id % 10) ? false : true
            });
            id++;
        }
    }
    return data;
}

export let roomData: Object[] = [
    {
        Id: 1,
        Subject: 'Board Meeting',
        Description: 'Meeting to discuss business goal of 2018.',
        StartTime: new Date(2019, 10, 14, 9, 0),
        EndTime: new Date(2019, 10, 14, 11, 0),
        RoomId: 1
    },
    {
        Id: 2,
        Subject: 'Training session on JSP',
        Description: 'Knowledge sharing on JSP topics.',
        StartTime: new Date(2019, 10, 14, 15, 0),
        EndTime: new Date(2019, 10, 14, 17, 0),
        RoomId: 5
    },
    {
        Id: 3,
        Subject: 'Sprint Planning with Team members',
        Description: 'Planning tasks for sprint.',
        StartTime: new Date(2019, 10, 14, 9, 30),
        EndTime: new Date(2019, 10, 14, 11, 0),
        RoomId: 3
    },
    {
        Id: 4,
        Subject: 'Meeting with Client',
        Description: 'Customer meeting to discuss features.',
        StartTime: new Date(2019, 10, 14, 11, 0),
        EndTime: new Date(2019, 10, 14, 13, 0),
        RoomId: 4
    },
    {
        Id: 5,
        Subject: 'Support Meeting with Managers',
        Description: 'Meeting to discuss support plan.',
        StartTime: new Date(2019, 10, 14, 16, 0),
        EndTime: new Date(2019, 10, 14, 17, 30),
        RoomId: 5
    },
    {
        Id: 6, Subject: 'Client Meeting',
        Description: 'Meeting to discuss client requirements.',
        StartTime: new Date(2019, 10, 14, 10, 30),
        EndTime: new Date(2019, 10, 14, 13, 0),
        RoomId: 6
    },
    {
        Id: 7,
        Subject: 'Appraisal Meeting',
        Description: 'Meeting to discuss employee appraisals.',
        StartTime: new Date(2019, 10, 14, 15, 0),
        EndTime: new Date(2019, 10, 14, 16, 30),
        RoomId: 7
    },
    {
        Id: 8,
        Subject: 'HR Meeting',
        Description: 'Meeting to discuss HR plans.',
        StartTime: new Date(2019, 10, 14, 8, 0),
        EndTime: new Date(2019, 10, 14, 9, 0),
        RoomId: 4
    }
];*/
export let ghmData = [
    {
        id: 1,
        Subject: 'Blocked Testing',
        StartTime: '2020-03-20T04:00:00.000Z',
        EndTime: '2020-03-20T06:00:00.000Z',
        Status: 'In-Progress',
        IsAllDay: false,
        EmployeeId: 1,
        IsBlock: false
    }
];
export let dcaData = [
    {
        id: 2,
        Subject: 'Blocked Testing',
        StartTime: '2020-03-20T08:00:00.000Z',
        EndTime: '2020-03-20T09:00:00.000Z',
        Status: 'In-Progress',
        IsAllDay: false,
        EmployeeId: 2,
        IsBlock: false
    }
];
export let tegnaData = [
    {
        id: 3,
        Subject: 'Blocked Testing',
        StartTime: '2020-03-20T08:00:00.000Z',
        EndTime: '2020-03-20T09:00:00.000Z',
        Status: 'In-Progress',
        IsAllDay: false,
        EmployeeId: 3,
        IsBlock: false
    }
];
// tslint:disable-next-line:ban-types
export let blackData: Object[] = [
    {
        id: 1,
        Subject: 'Blocked Testing',
        StartTime: '2020-02-013T04:00:00.000Z',
        EndTime: '2020-02-013T06:00:00.000Z',
        IsAllDay: false,
        DoctorId: 1,
        IsBlock: true
    }
];
// tslint:disable-next-line:ban-types
export let usersData: Object[] = [
    {
        text: 'test_1',
        id: 1,
        CorporateGroupId:1,
        type: '123'
    },
{
        text: 'test_2',
        id: 2,
        CorporateGroupId:1,
        type: '123'
    },
{
        text: 'test_3',
        id: 3,
        CorporateGroupId:1,
        type: '123'
    },
{
        text: 'test_4',
        id: 4,
        CorporateGroupId:1,
        type: '123'
    },
{
        text: 'test_5',
        id: 5,
        CorporateGroupId:1,
        type: '123'
    },
{
        text: 'Sangeetha TC',
        id: 36,
        CorporateGroupId:2,
        type: 'TC2942'
    },
{
        text: 'Buvaneshwari Meena N K',
        id: 38,
        CorporateGroupId:2,
        type: '2723'
    },
{
        text: 'Ravi R',
        id: 40,
        CorporateGroupId:2,
        type: '1586'
    },
{
        text: 'Krish Karthik',
        id: 47,
        CorporateGroupId:2,
        type: '2410'
    },
{
        text: 'Raksha',
        id: 48,
        CorporateGroupId:2,
        type: '2922'
    },
{
        text: 'Jayvarsha C',
        id: 49,
        CorporateGroupId:2,
        type: 'C171'
    },
{
        text: 'Logesh Venkatesan',
        id: 51,
        CorporateGroupId:2,
        type: '3063'
    },
{
        text: 'Thiruselvan',
        id: 52,
        CorporateGroupId:2,
        type: '2014'
    },
{
        text: 'Karthikeyan S',
        id: 53,
        CorporateGroupId:2,
        type: '3064'
    },
{
        text: 'Usha M',
        id: 54,
        CorporateGroupId:2,
        type: '1122'
    },
{
        text: 'Akshyaa',
        id: 55,
        CorporateGroupId:2,
        type: '3027'
    },
{
        text: 'Chandru Haribabu AC',
        id: 61,
        CorporateGroupId:3,
        type: 'AC2699'
    },
{
        text: 'Keerthana',
        id: 62,
        CorporateGroupId:3,
        type: '2683'
    },
{
        text: 'Siva',
        id: 63,
        CorporateGroupId:3,
        type: '2441'
    },
{
        text: 'Pravin Raj D',
        id: 65,
        CorporateGroupId:3,
        type: '1640'
    },
{
        text: 'Mohana Priya',
        id: 66,
        CorporateGroupId:3,
        type: '2687'
    },
{
        text: 'Venkatesh',
        id: 67,
        CorporateGroupId:3,
        type: '1809'
    },
{
        text: 'test',
        id: 78,
        CorporateGroupId:4,
        type: '123'
    },
{
        text: 'test',
        id: 79,
        CorporateGroupId:4,
        type: '123'
    },
{
        text: 'test',
        id: 80,
        CorporateGroupId:4,
        type: '123'
    },
{
        text: 'test',
        id: 81,
        CorporateGroupId:4,
        type: '123'
    }

];
