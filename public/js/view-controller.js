define(['jquery'], function($){

    var _exports = {
        view                : view,
        highlightSelected   : highlightSelected,
        highlightErrors     : highlightErrors
    };    
    
    function view(params, onload){
        $('.view').each(function(){
            var v = $(this);
            if(v.hasClass(params.name)){
                v.slideDown(500);
            }else{
                v.slideUp(100);
            }
        });
        $.get(params.url, function (response){
            var selector = '.view.' + params.name;
            render(selector, response, params); 
            if(onload) onload.call($(selector));
        });

        return _exports;
    }
    
    function error(errorMsg){
        render('.view.error', errorMsg, {});
    }
    
    function render(containerSelector, tpl, params){
        var html = compile(tpl, params);
        var container = $(containerSelector);
        if(container.length === 0){
            container = $("<div />").addClass(containerSelector.replace(/\./g," "));
            $('body').append(container);
        }
        container.html(html);
    }
    
    function compile(tpl, params){
        var compiledTpl = compileLoops(tpl, params);
        return format(compiledTpl, params);
    }
    
    function compileLoops(tpl, params){
        var loopSelector = '[data-foreach]';
        var $tpl = $(tpl);
        var $loop = $tpl.find(loopSelector).first();
        while($loop.length > 0){
            var loopParamName = $loop.data().foreach;
            if(!params.hasOwnProperty(loopParamName)) throw "Template parse error: missing loop param " + loopParamName;
            $loop.removeAttr('data-foreach');
            $loop.replaceWith(compileOneLoop($loop.get(0).outerHTML, params[loopParamName]));
            $loop = $tpl.find(loopSelector).first();
        }
        return $tpl.get(0).outerHTML;
    }
    
    function compileOneLoop(tpl, params){
        var compiled = "";
        for(var p in params){
            var singlePass = compile(tpl, params[p]);
            compiled += singlePass;
        }
        return compiled;
    }
    
    function format(txt, params){
        if(!txt) return '';
        var res = txt;
        for(var param in params){
            res = replace(res, '${'+param+'}', params[param]);
        }
        return res;
    }
    
    function highlightSelected(contactId){
        $('#contact-'+contactId).addClass('selected');
    }
    
    function highlightErrors(errors){
        for(var i in errors){
            $('[name=' + errors[i].fieldName + ']').get(0).setCustomValidity(errors[i].msg);
        }
    }
    
    function replace(text, search, replace){
        return text.split(search).join(replace);
    }

    return _exports;
});