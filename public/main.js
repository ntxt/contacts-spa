define(["require", "persist", "view-controller", "validation", "country-list-bundle"],
    function(require, persist, viewCtrl, validation, countryList){
    
    var $self = this;
    var model = {
        views     : {
            init    : {
                title    : "Start",
                url      : "tpl/init.html",        
                provider : function(){
                    return {
                        links : ['list', 'edit'].map(mapNameToViewLink)
                    };
                },
                onload   : function(){}
            },
            list    : {
                title    : "Contact list",
                url      : "tpl/list.html",
                provider : function(){
                    return {
                        contacts : model.contacts
                    };
                },
                onload   : highlightSelected
            },
            edit    : {
                title    : "Editing", 
                url      : "tpl/edit.html",
                provider : function(){
                    var contact = getItemToEdit();
                    var options = getCountriesOptions(contact.country);
                    return merge(contact, options);
                },
                onload   : bindEditForm
            },
            error   : {
                title    : "Error",
                url      :"tpl/error.html",       
                provider : function(){
                    return {
                        msg : 'not getting the job then I guess...'
                    };
                },
                onload   : function(){}
            }
        },
        countries : countryList.countryList().getData(),
        contacts  : {},
        defaultContacts : {
            5   : {firstName : "Peppa", lastName : "Pig", email:"peppa@gmail.com", country:"PL"},
            25  : {firstName : "Donald", lastName : "Trump", email:"donald@potus.gov", country:"US"},
            11  : {firstName : "Jimi", lastName : "Hendrix", email:"jimi@gmail.com", country:"TO"}
        }
    };
    
    function init(){
        if(persist.isEnabled){
            persist.getContacts(
                onDataReady,
                displayError
            );
        }else{
            displayError("Local storage is not available");
        }
        window.onhashchange = onHashChange;
    }
    
    function onDataReady(contacts){
        model.contacts = contacts || model.defaultContacts;
        addIndicesAsIds(model.contacts);
        var params = parseHash();
        if( params.name === "" ) params = parseHash('#init');
        handleViewParams(params);                            
    }
    
    function addIndicesAsIds(hash){
        for(var index in hash) hash[index].id = index;
    }
    
    function highlightSelected(){
        var selectedId = (arguments.length === 0) ? parseHash().id : arguments[0];
        viewCtrl.highlightSelected(selectedId);
    }
    

    
    function displayError(e){
        var msg = (e instanceof Error) ?
            e.message + " in file: " + e.fileName + ", line: " + e.lineNumber + ".\n " + e.stack :
            e;
        viewCtrl.view(merge(model.views.error, {msg : msg}));
    }
    
    function onHashChange(e){
        var params = parseHash();
        handleViewParams(params);
    }
    
    function handleViewParams(params){
        if(!hasView(params.name)){
            displayError("Cannot display " + params.name + " - not found");
        }else{
            var view = model.views[params.name];
            viewCtrl.view(
                merge(params, view, view.provider.call($self)),
                view.onload
            );
        }
    }
    
    function hasView(name){
        return model.views.hasOwnProperty(name);
    }
    
    function merge(/*a, b, c...*/){
        var p, res = {}, i = 0, c = arguments.length;
        for(i; i < c; i++){
            var obj = arguments[i];
            for(p in obj) if (obj.hasOwnProperty(p)) res[p] = obj[p];
        }
        return res;
    }    
    
    function mapNameToViewLink(item, index, arr){
        return {
            name  : item,
            title : model.views[item].title
        };
    }
    
    function getItemToEdit(){
        return model.contacts[parseHash().id] || newContact();
    }
    
    function newContact(){
        return {id:0, firstName:'', lastName:'', email:'', country:''};
    }
    
    function getCountriesOptions(selectedCode){                
        var options = model.countries.map(function(item, index, arr){
            return {
                code: item.code,
                name: item.name,
                selected: (item.code === selectedCode) ? 'selected' : ''
            };
        });
        return {countries : options};
    }
    
    function parseHash(){
        var hash = (arguments.length === 0) ?
            location.hash.substring(1) :
            arguments[0].substring(1);
        var parts = hash.split('/');
        var viewName = parts[0];
        var itemId = parseInt(parts[1]) || "";
        return {name:viewName, id:itemId};
    }
    
    function bindEditForm(){
        $(this).find('form')
            .bind('submit', handleSubmit)
            .bind('reset', handleReset)
            .find('#deleteBtn')
              .click(handleDelete);
        $('form').find('input,select').change(function(){
            this.setCustomValidity('');
        });
    }
    
    function handleSubmit(e){
        e.preventDefault();
        var contact = {};
        $(this).find('input,select').each(function(){
            var $input = $(this);
            contact[$input.attr("name")] = $input.val();            
        });
        var valResult = validation.check(contact);
        if(valResult.isOK){
            saveContact(
                contact, 
                function onSaveSuccess(id){location.hash = "list/" + id;}, 
                displayError
            );
        }else{
            viewCtrl.highlightErrors(valResult.errors);
        }
    }
    
    function saveContact(contact, success, failure){
        if(!contact.id || contact.id < 1) 
            persist.getNextId(doSave, failure);
        else
            doSave(contact.id);
        
        function doSave(newId) {
            contact.id = "" + ((typeof newId === "undefined") ? contact.id : newId);
            model.contacts[contact.id] = contact;
            persist.putContacts(
                model.contacts,
                function(){success(contact.id);},
                failure
            );
        }
    }
    
    function handleReset(e){
        e.preventDefault();
        location.hash = 'list';     
    }
    
    function handleDelete(e){
        e.preventDefault();
        var id = $(this).val();
        var contact = model.contacts[id];
        if(confirm("Delete " + contact.firstName + " " + contact.lastName + "?")){
            delete model.contacts[id];
            persist.putContacts(
                model.contacts,
                function(){location.hash = "list";},
                displayError
            );        
        }
    }
    
    return {
        init : init
    };
});