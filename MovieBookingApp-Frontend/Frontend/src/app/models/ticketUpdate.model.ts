export class TicketUpdate{
    constructor(
        public movieName: string,
        public theatreName:string,
        public showTime:string,
        public tickets:number
    ){}
}