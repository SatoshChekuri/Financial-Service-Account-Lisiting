public with sharing class FinancialServicesController {
    @AuraEnabled
    public static List<AccountDetails> getFinancialServicesData(string searchKey){
        try {
            List<AccountDetails> listAccountDetails = new List<AccountDetails>();
            string industryType='Financial Services';
            string query='SELECT Id,Name,Owner.Name,Phone,Website,AnnualRevenue FROM Account WHERE Industry=:industryType';
            if(searchKey!=''){
                string searchKeyword = '%' + searchKey + '%';
                query+= ' AND Name LIKE:searchKeyword';
            }
            List<account> listAccount = database.query(query);
            for(account acc : listAccount){
                AccountDetails ad = new AccountDetails();
                ad.id = acc.id;
                ad.name = acc.Name;
                ad.recordUrl = '/'+acc.Id;
                ad.ownerName = acc.Owner.Name;
                ad.phone = acc.Phone;
                ad.website = acc.Website;
                ad.annualRevenue = acc.AnnualRevenue;
                listAccountDetails.add(ad);                
            }
            return listAccountDetails;
        } catch (Exception e) {
            system.debug('Error Message:::'+e.getMessage());
            system.debug('Error Line number:::'+e.getLineNumber());
            return null;
            //throw new AuraHandledException(e.getMessage());
        }
    }

    public class AccountDetails{
        @AuraEnabled public string id;
        @AuraEnabled public string name;
        @AuraEnabled public string recordUrl;
        @AuraEnabled public string ownerName;
        @AuraEnabled public string phone;
        @AuraEnabled public string website;
        @AuraEnabled public Decimal annualRevenue;
        public AccountDetails(){
            this.id = '';
            this.name = '';
            this.recordUrl = '';
            this.ownerName = '';
            this.phone = '';
            this.website = '';
            this.annualRevenue = 0.0;
        }
    }
}