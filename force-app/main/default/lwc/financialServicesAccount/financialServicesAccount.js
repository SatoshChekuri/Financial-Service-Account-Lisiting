import { LightningElement,track } from 'lwc';	
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getAccountDetails from '@salesforce/apex/FinancialServicesController.getFinancialServicesData';
const actions = [       
    { label: 'Edit', name: 'edit' }
];
export default class FinancialServicesAccount extends LightningElement {
    
    @track columns = [ { label: 'Account Name',
                        type: 'url',
                        fieldName: 'recordUrl',
                        typeAttributes: {label: { fieldName: 'name' }, 
                        target: '_blank'},
                         sortable: "true"},
                  { label: 'Account Owner', fieldName: 'ownerName'},
                  { label: 'Phone', fieldName: 'phone', type: 'phone'},
                  { label: 'Website', fieldName: 'website', type: 'url'},
                  { label: 'Annual Revenue', fieldName: 'annualRevenue', type: 'currency'},
                  { type: 'action', typeAttributes: { rowActions: actions, menuAlignment: 'left' } } ];
    @track sortBy;
    @track sortDirection;
    @track searchKey = '';
    @track accountDetails = [];
    @track showData = false;
    @track error;
    @track recordId;
    @track showEditForm=false;
    @track objectApiName='Account';
    connectedCallback(){
        this.getAccountData();
    }

    getAccountData(){
        getAccountDetails({searchKey:this.searchKey})
        .then(result => {
            this.accountDetails = result;
            if(this.accountDetails.length>0){
                this.showData = true;
            }else{
                this.showData = false;
            }
            console.log('this.accountDetails:::'+JSON.stringify(this.accountDetails));
        })
        .catch(error => {
            this.error = error;
        });
    }

    doSorting(event) {
        this.sortBy = event.detail.fieldName;//'name'
        console.log('this.sortBy:::'+this.sortBy);
        this.sortDirection = event.detail.sortDirection;
        this.sortData(this.sortBy, this.sortDirection);
    }

    sortData(fieldname, direction) {
        let parseData = JSON.parse(JSON.stringify(this.accountDetails));
        // Return the value stored in the field
        let keyValue = (a) => {
            return a[fieldname];
        };
        // cheking reverse direction
        let isReverse = direction === 'asc' ? 1: -1;
        // sorting data
        parseData.sort((x, y) => {
            x = keyValue(x) ? keyValue(x) : ''; // handling null values
            y = keyValue(y) ? keyValue(y) : '';
            // sorting values based on direction
            return isReverse * ((x > y) - (y > x));
        });
        this.accountDetails = parseData;
    }   
    
    searchKeySet(event){
        this.searchKey = event.target.value;
    }

    handleRowActions(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;
        this.recordId = row.id;
        console.log('row::::'+JSON.stringify(row));
        this.showEditForm = true;
    }

    handleSuccess(){
        this.showEditForm = false;
        const event = new ShowToastEvent({
            title: 'Success',
            message:'Record has been updated successfully',
            variant: 'success',
        });
        this.dispatchEvent(event);
        this.getAccountData();
        
    }
}