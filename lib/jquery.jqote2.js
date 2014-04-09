/*
 * jQote2 - client-side Javascript templating engine
 * Copyright (C) 2010, aefxx
 * http://aefxx.com/
 *
 * Licensed under the DWTFYWT PUBLIC LICENSE v2
 * Copyright (C) 2004, Sam Hocevar
 *
 * Date: Sat, Jun 12th, 2010
 * Version: 0.9.3b
 */
(function($) {
    var JQOTE2_UNDEF_TEMPL_ERROR = 'UndefinedTemplateError',
        JQOTE2_TMPL_COMP_ERROR   = 'TemplateCompilationError',
        JQOTE2_TMPL_EXEC_ERROR   = 'TemplateExecutionError';

    var ARR  = '[object Array]',
        OBJ  = '[object Object]',
        STR  = '[object String]',
        FUNC = '[object Function]';

    var n = 1, tag = '%',
        qreg = /^[^<]*(<[\w\W]+>)[^>]*$/,
        type_of = Object.prototype.toString;

    function raise(error, ext) {
        throw ($.extend(error, ext), error);
    }

    function dotted_ns(fn) {
        var ns = [];

        if ( type_of.call(fn) !== ARR ) return false;

        for ( var i=0,l=fn.length; i < l; i++ )
            ns[i] = fn[i].id;

        return ns.length ?
            ns.sort().join('.').replace(/(\b\d+\b)\.(?:\1(\.|$))+/g, '$1$2') : false;
    }

    function lambda(tmpl, t) {
        var f, fn = [], t = t || tag,
            type = type_of.call(tmpl);

        if ( type === FUNC ){
            return [tmpl];
        }
            // return tmpl.jqote_id ? [tmpl] : false;

        if ( type !== ARR )
            return [$.jqotec(tmpl, t)];

        if ( type === ARR )
            for ( var i=0,l=tmpl.length; i < l; i++ )
                if ( f = lambda(tmpl[i], t) ) fn.push(f[0]);

        return fn.length ? fn : false;
    }

    $.fn.extend({
        jqote: function(data, t) {
            var data = type_of.call(data) === ARR ? data : [data],
                dom = '';

            this.each(function(i) {
                var fn = $.jqotec(this, t);

                for ( var j=0; j < data.length; j++ )
                    dom += fn.call(data[j], i, j, data, fn);
            });

            return dom;
        }
    });
/* 不使用的功能
    $.each({app: 'append', pre: 'prepend', sub: 'html'}, function(name, method) {
        $.fn['jqote'+name] = function(elem, data, t) {
            var ns, regexp, str = $.jqote(elem, data, t)
                $$ = !qreg.test(str) ?
                    function(str) {return $(document.createTextNode(str));} : $;

            if ( !!(ns = dotted_ns(lambda(elem))) )
                regexp = new RegExp('(^|\\.)'+ns.split('.').join('\\.(.*)?')+'(\\.|$)');

            return this.each(function() {
                var dom = $$(str);

                $(this)[method](dom);

                ( dom[0].nodeType === 3 ?
                    $(this) : dom ).trigger('jqote.'+name, [dom, regexp]);
            });
        };
    });
*/
    $.extend({
        jqote: function(elem, data, t) {
            var str = '', t = t || tag,
                fn = lambda(elem);

            if ( fn === false )
                raise(new Error('Empty or undefined template passed to $.jqote'), {type: JQOTE2_UNDEF_TEMPL_ERROR});

            data = type_of.call(data) !== ARR ?
                [data] : data;

            for ( var i=0,l=fn.length; i < l; i++ )
                for ( var j=0; j < data.length; j++ )
                    str += fn[i].call(data[j], i, j, data, fn[i]);

            return str;
        },

        jqotec: function(template, t) {
        	
        	
        	//判断浏览器版本为ie8版本以下，就使用push，否则使用+=;
			var isIe = true; // $Browser.ie && (parseInt($Browser.ie, 10) < 9);
			
            var cache, elem, tmpl, t = t || tag,
                type = type_of.call(template);

            if ( type === STR && qreg.test(template) ) {
                elem = tmpl = template;

                if ( cache = $.jqotecache[template] ) return cache;
            } else {
                elem = type === STR || template.nodeType ?
                    $(template) : template instanceof jQuery ?
                        template : null;

                if ( !elem[0] || !(tmpl = elem[0].innerHTML) )
                    raise(new Error('Empty or undefined template passed to $.jqotec'), {type: JQOTE2_UNDEF_TEMPL_ERROR});

                if ( cache = $.jqotecache[$.data(elem[0], 'jqote_id')] ) return cache;
            }
            // $Profiler.time('jqote test');
//            var start=new Date().getTime();
            
            var str = '', index, strArr = [],
                arr = tmpl.replace(/\s*<!\[CDATA\[\s*|\s*\]\]>\s*|[\r\n\t]/g, '')
                    .split('<'+t).join(t+'>\x1b')
                        .split(t+'>');
            
            
            /*************** 修改 start********************/
            // 定义两种不同的模板
            var pushTemp = [
                           'out.push("',
                           '");',
                           'out.push(',
                           ');',
                           '',
                           'var out=[];',
                           'return out.join("");'],
            strTemp = [
                        'out+="', // 0 
                        '";', // 1 加上后分号
                        'out+=', // 2
                        ';', // 3
                        '', // 4 去掉分号
                        'var out="";', // 5
                        'return out;']; // 6 去掉前分号
            // 获取模板
//            if(( new Date().getTime() - start) > 1) {
//            	$Profiler.log('p1:' +( new Date().getTime() - start));
//            	$Profiler.log(tmpl)
//            }
//            start=new Date().getTime();
            var mode = isIe ? pushTemp : strTemp;
            
            if(isIe) {
            	strArr.push('try{');
            	strArr.push(mode[5]);
            }
            for ( var m=0,l=arr.length; m < l; m++ ){
            	var temp = arr[m];
            	
            	if(temp){
//	                str += temp.charAt(0) !== '\x1b' ?
//	                    mode[0]+ temp.replace(/([^\\])?(["'])/g, '$1\\$2') + mode[1] : (temp.charAt(1) === '=' ?
//	                        mode[2] + temp.substr(2) + mode[3] : mode[4] + temp.substr(1));
//	                 
//            		var s = new Date().getTime();
	                if(temp.charAt(0) !== '\x1b') {
	                	if(isIe) {
	                		strArr.push(mode[0]);
	                		strArr.push(temp.replace(/([^\\])?(["'])/g, '$1\\$2'));
	                		strArr.push(mode[1]);
	                	} else {
	                		str += mode[0]+ temp.replace(/([^\\])?(["'])/g, '$1\\$2') + mode[1]
	                	}
	                } else {
	                	if(temp.charAt(1) === '=' ){
	                		if(isIe) {
	                			strArr.push(mode[2]);
	                			strArr.push(temp.substr(2));
	                			strArr.push(mode[3]);
		                	} else {
		                		str +=	mode[2] + temp.substr(2) + mode[3]
		                	}
	                	} else {
	                		if(isIe) {
	                			strArr.push(mode[4]);
	                			strArr.push(temp.substr(1));
		                	} else {
		                		str += mode[4] + temp.substr(1)
		                	}
	                	}
	                }
	                if(isIe) {
	                	strArr.push('\n');
	                } else {
	                	str +='\n';
	                }
//	                str +='\n';
//	                    str +=' ';
            	}
            }
            if(isIe) {
            	strArr.push(mode[6]);
            	strArr.push('}catch(e){e.type=JQOTE2_TMPL_EXEC_ERROR;e.template=arguments.callee.toString();throw e;}');
            	str = strArr.join('');
            } else {
            	str = 'try{' + mode[5] + str +mode[6] +
            	//.split("out+='';").join('')
            	//.split('var out="";out+=').join('var out=') +
            	'}catch(e){e.type=JQOTE2_TMPL_EXEC_ERROR;e.template=arguments.callee.toString();throw e;}';
            }
//            if(( new Date().getTime() - start) > 1) {
//            	$Profiler.log('p2:' +( new Date().getTime() - start));
////            	$Profiler.log(str)
//            	
//            }
//            start=new Date().getTime();
            try {
                var fn = new Function('i, j, data, fn', str);
            } catch ( e ) {
            	if(window.console && console.error){
            		// 出错会打印出错误模板的内容和错误内容
            		console.error('message : ' + e.message + '\n\n' + str);
            	}
            	raise(e, {type: JQOTE2_TMPL_COMP_ERROR});
            }
            /*************** 修改 end********************/
            index = elem instanceof jQuery ?
                $.data(elem[0], 'jqote_id', n) : elem;
//                if(( new Date().getTime() - start) > 1) {
//                	$Profiler.log('p3:' +( new Date().getTime() - start));
//                }
//            start=new Date().getTime();
            // $Profiler.timeEnd('jqote test');
            return $.jqotecache[index] = (fn.jqote_id = n++, fn);
        },

        jqotefn: function(elem) {
            var type = type_of.call(elem),
                index = type === STR && qreg.test(elem) ?
                    elem : $.data($(elem)[0], 'jqote_id');

            return $.jqotecache[index] || false;
        },

        jqotetag: function(str) {
            tag = str;
        },

        jqotecache: {}
    });
    /* 不使用的功能
    $.event.special.jqote = {
        add: function(obj) {
            var ns, handler = obj.handler,
                data = type_of.call(obj.data) !== ARR ? [obj.data] : obj.data;

            if ( !obj.namespace ) obj.namespace = 'app.pre.sub';
            if ( !data.length || !(ns = dotted_ns(lambda(data))) ) return;

            obj.handler = function(event, dom, regexp) {
                return !regexp || regexp.test(ns) ?
                    handler.apply(this, [event, dom]) : null;
            };
        }
    };
    */
})(jQuery);
