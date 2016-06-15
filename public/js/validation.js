define([], function(){

    var rules = {
        firstName : [
            {
                msg   : 'First name needs to have at least one letter (A-Z)',
                check : atLeastOneLetter
            },
            {
                msg   : 'First name can be of 60 characters length at max',
                check : maxLength60
            },            
            {
                msg   : 'First name can contain only letters and a dash.',
                check : onlyLettersWithAdash
            }],
        lastName : [   
            {
                msg   : 'Last name needs to have at least one letter (A-Z)',
                check : atLeastOneLetter
            },
            {
                msg   : 'Last name can be of 60 characters maximum length.',
                check : maxLength60
            },          
            {
                msg   : 'Last name can contain only letters and a dash.',
                check : onlyLettersWithAdash
            }],   
        email : [  
            {
                msg   : 'Email is required.',
                check : isNonBlank
            }, 
            {
                msg   : 'Missing @ in the email address.',
                check : needsAtSign
            }, 
            {
                msg   : 'The email address domain can contain only letters, digits, dots and  (the part after @).',
                check : domainName
            },
            {  
                msg   : 'Check the email part before @ sign',
                check : mailboxName
            }],
        country : [    
            {
                msg   : 'Country is required. Please select one from the dropdown.',
                check : isNonBlank
            }]
    };
    
    function atLeastOneLetter(txt){
        return (typeof txt === "string" && /[a-z]+/i.test(txt));
    }
    
    function onlyLettersWithAdash(txt){
        return (typeof txt === "string" && /[a-z]+(\-[a-z])?/i.test(txt));
    }
    
    function maxLength60(txt){
        return (typeof txt === "string" && /[a-z\-]{0,60}/i.test(txt));
    }    
    
    function isNonBlank(txt){
        return (typeof txt === "string" && /[\S]+/i.test(txt));
    }

    function needsAtSign(txt){
        return (typeof txt === "string" && /@/i.test(txt));
    }    
    
    function domainName(txt){
        return (typeof txt === "string" && /@((?!-)[a-z0-9-]{1,63}\.)+[a-z]{2,13}\s*$/i.test(txt));
    }

    function mailboxName(txt){
        return (typeof txt === "string" && /\s*\S+@/i.test(txt));
    }
    
    function check(contact){
        var errors = [];
        for(var inputName in rules){
            var iRules =  rules[inputName];
            for(var i in iRules){
                var rule = iRules[i];
                if(!rule.check(contact[inputName])){
                    errors.push(getError(inputName, rule.msg));
                    break;
                }
            }
        }
        return {
            isOK    : errors.length === 0,
            errors  : errors
        };
    }
    
    function getError(fieldName, errorMsg){
        return {fieldName:fieldName, msg:errorMsg};
    }

    return {check : check};
});