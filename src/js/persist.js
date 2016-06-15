define(function(){
    
    var isEnabled = (typeof(Storage) !== "undefined");
    var CONTACTS = "contacts";
    
    function put(key, data){
        var json = JSON.stringify(data);
        localStorage.setItem(key, json);
    }
    
    function get(key){
        var json = localStorage.getItem(key);
        return JSON.parse(json);
    }

    function putContacts(data, success, failure){
        try{
            put(CONTACTS, data);
            success();
        }catch(e){
            failure(e);
        }
    }
    
    function getContacts(success, failure){
        try{
            success(get(CONTACTS));
        }catch(e){
            failure(e);
        }
    }
    
    function findNextFreeId(contacts){
        var numId = 0;
        for(var id in contacts){
            numId = parseInt(id);
            if(typeof(contacts[numId + 1]) === "undefined") return numId + 1;
        }
        return numId + 1;
    }
    
    function getNextId(success, failure){
        getContacts(
            function successWrap(contacts){
                success(findNextFreeId(contacts));
            },
            failure
        );
    }
    
    return {
        isEnabled   : isEnabled,
        putContacts : putContacts, 
        getContacts : getContacts,
        getNextId   : getNextId
    };
});