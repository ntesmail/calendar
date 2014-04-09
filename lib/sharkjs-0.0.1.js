/*! sharkjs - v0.0.1 - 2014-04-04
* http://sharkjs.org
* Copyright (c) 2014 ; Licensed  */
/*! shark - v0.0.1 - 2013-09-05
* http://sharkjs.org
* Copyright (c) 2013 ; Licensed  */
(function(){
    /**
     * @fileOverview 组件库base
     */
    // noconflict
    if(window.shark){
        window._shark = window.shark;
    }
    var shark = window.shark = {
        smiley:true,
        ver:"1.0.0",
        date:"2012-05-24"
    };
    // 属性的复制
    // copy from easyjs >> http://easyjs.org
    shark.mixin = function( target, source, override, whitelist ){
        if( !target || !source ) return;
        if( override === undefined ){
            override = true;
        }

        var prop, len, i,
            _mix = function( prop ){
                if( override === true || !(prop in target) ){
                    target[ prop ] = source[ prop ];
                }
            };            
        
        if( whitelist && (len = whitelist.length) ){
            for( i = len; i; ){
                prop = whitelist[--i];
                if( prop in source ){
                    _mix( prop );
                }
            }
        }
        else{
            for( prop in source ){
                _mix( prop );
            }
        }
        
        return target;
    };
    // uid seed
    shark.uuid = 0;
    // uid
    shark.uid = function(_prefix){
        return (_prefix || "_shark_") + this.uuid++;
    };

    shark.mixin(shark,{
        escapeHTML : function (_html) {
            if (!_html) {
                return '';
            }
            return _html.replace(/[\u0000]/g, "").replace(/&/g, '&amp;').replace(/>/g, '&gt;').replace(/</g, '&lt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
        },
        /**
         * 获取字符串长度
         * @param {string} _str 字符串
         * @return {int} 长度 
         */
        getStringLength : function(_str){
            var a = 0; //预期计数：中文2字节，英文1字节
            var i = 0; //循环计数
            for (i = 0; i < _str.length; i++) {
                if (_str.charCodeAt(i) > 255) {
                    a += 2; //按照预期计数增加2
                }
                else {
                    a++;
                }
            }
            return a;
        }
    });
    
    // Expose shark as an AMD module
    if ( typeof define === "function" && define.amd && define.amd.shark ) {
        // 还依赖jqote,默认包含在jquery里
        define( "shark", ["jQuery"], function () { return shark; } );
    }
})();

/**
 * 检查用
 */
(function(){
    /**
     * 检查是否是number
     * @param  {object} val  检查的参数
     * @param  {string} name 名称
     * @return {void}      
     */
    shark.checkNumber = function(val, name){
        if(typeof val != 'number') {
            throw new Error(name + ' should be number, but is:' + (typeof val));
        }
    };
    /**
     * 检查是否是function
     * @param  {object} val  检查的参数
     * @param  {string} name 名称
     * @return {void}      
     */
    shark.checkFunction = function(val, name){
        if(typeof val != 'function') {
            throw new Error(name + ' should be function, but is:' + (typeof val));
        }
    };
    /**
     * 检查是否是空字符串
     * @param  {object} val  检查的参数
     * @param  {string} name 名称
     * @return {boolean}      true 如果是空字符串或者未定义
     */
    shark.isEmptyString = function(val){
        if(typeof val == 'undefined' || value === null || val === '' || val.length == 0) {
            return true;
        }
        return false;
    };
    shark.tool = {
        /**
         * Replace chars &, >, <, ", ' with html entities. 手动转义html，防止script注入
         * To disable function set settings: filter_data=false, filter_params=false
         * @param {string} string
         * @return {string}
         * @static
         */
        escapeHTML: function(_html) {
            if (!_html) {
                return '';
            }

            if (typeof _html == "number") {
                _html = _html.toString();
            }

            return _html.replace(/[\u0000]/g, "").replace(/&/g, '&amp;').replace(/>/g, '&gt;').replace(/</g, '&lt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
        },
        /**
         * 截取中文
         * @param {string} _str 字符串
         * @param {int} _len 最大长度
         * @param {boolean} reverse 是否反向的
         * @return {string} 截取后的字符串
         */
        cutOffStr: function(_str, _len, reverse) {
            if (!_len) {
                return '';
            }
            if (typeof _str == 'undefined') {
                return _str;
            }
            if (reverse) {
                _str = _str.split('').reverse().join('');
            }
            var a = 0; //预期计数：中文2字节，英文1字节
            var i = 0; //循环计数
            var cn = 0; //循环计数
            var temp = ''; //临时字串
            for (i = 0; i < _str.length; i++) {
                if (_str.charCodeAt(i) > 255) {
                    a += 2; //按照预期计数增加2
                } else {
                    a++;
                }
                //如果增加计数后长度大于限定长度，就直接返回临时字符串
                if (a > _len) {
                    temp += "..";
                    if (reverse) {
                        temp = temp.split('').reverse().join('');
                    }
                    return temp;
                }
                temp += _str.charAt(i); //将当前内容加到临时字符串
            }
            if (reverse) {
                _str = _str.split('').reverse().join('');
            }
            return _str; //如果全部是单字节字符，就直接返回源字符串
        },
        format : function (another, _varParam) {
            if(another){
                var args = arguments;
                if(/\{\d+\}/.test(another)){
                    another = another.replace(/\{(\d+)\}/g,function(_input,_i){
                        return args[parseInt(_i,10)+1];
                    });
                }
            }
            return another;
        },
        /**
         * Remove dom节点
         * @param  {[type]} container [description]
         * @return {void}
         */
        remove : function(container) {
            // 销毁组件先
            shark.factory.destroyInContainer(container);
            container.remove();
        },
        /**
         * Empty dom节点
         * @param  {[type]} container [description]
         * @return {[type]}   container        [description]
         */
        empty : function(container) {
            // 销毁组件先
            shark.factory.destroyInContainer(container);
            container.empty();
            return container;
        },
        /**
         * 隐藏dom
         * @param  {[type]} container [description]
         * @return {[type]}           [description]
         */
        hide : function(container) {
            container.addClass('f-hide');
        },
        /**
         * 显示dom
         * @param  {[type]} container [description]
         * @return {[type]}           [description]
         */
        show : function(container) {
            container.removeClass('f-hide');
        },
        /**
         * 当前是否显示状态
         * @param  {[type]}  container [description]
         * @return {Boolean}           [description]
         */
        isVisible : function(container) {
            return !container.hasClass('f-hide');
        }
    };
})();

(function(){

    function initHl(hl){
        if(hl == 'zh_CN') {
            /**
            * @fileOverview 国际化资源，中文
            * @requires i18n
            */
            var lang = {
                close : "关闭",
                // #calendar
                week : "日,一,二,三,四,五,六",
                month : "1月,2月,3月,4月,5月,6月,7月,8月,9月,10月,11月,12月",
                year : "{0}年",
                day : "{0}日",
                hour : "{0}时",
                minute : "{0}分",
                colon : '：',
                // dialogbox
                dialogbox_ok : "确&nbsp;&nbsp;定",
                dialogbox_cancel : "取&nbsp;&nbsp;消",
                loading : '加载中',
                revoke : '撤销',
                preview_real : '实际大小',
                preview_auto : '自适应',
                preview_rotate : '旋转',
                preview_down : '下载',
                preview_send : '发送',
                preview_newwin : '新窗口打开',
                preview_original : '原图',
                preview_error : '图片加载失败',
                date_qiantian : '前天',
                date_zuotian : '昨天',
                date_jintian : '今天',
                date_mingtian : '明天',
                date_houtian : '后天',
                date_linceng : '凌晨',
                date_zaoshang : '早上',
                date_zhongwu : '中午',
                date_xiawu : '下午',
                date_wanshang : '晚上'
            };
            shark.i18n["zh_CN"] = lang;
        } else if(hl == 'zh_TW') {
            /**
            * @fileOverview 国际化资源，中文
            * @requires i18n
            */
            var lang = {
                close : "關閉",
                // #calendar
                week : "日,一,二,三,四,五,六",
                month : "1月,2月,3月,4月,5月,6月,7月,8月,9月,10月,11月,12月",
                year : "{0}年",
                day : "{0}日",
                hour : "{0}时",
                minute : "{0}分",
                colon : '：',
                // dialogbox
                dialogbox_ok : "確&nbsp;&nbsp;定",
                dialogbox_cancel : "取&nbsp;&nbsp;消",
                loading : '加载中',
                revoke : '撤销',
                preview_real : '实际大小',
                preview_auto : '自适应',
                preview_rotate : '旋转',
                preview_down : '下载',
                preview_send : '发送',
                preview_newwin : '新窗口打开',
                preview_original : '原图',
                preview_error : '图片加载失败',
                date_qiantian : '前天',
                date_zuotian : '昨天',
                date_jintian : '今天',
                date_mingtian : '明天',
                date_houtian : '後天',
                date_linceng : '凌晨',
                date_zaoshang : '早上',
                date_zhongwu : '中午',
                date_xiawu : '下午',
                date_wanshang : '晚上'
            };
            shark.i18n["zh_TW"] = lang;
        } else if(hl == 'en_US') {
            /**
            * @fileOverview 国际化资源，英文
            * @requires i18n
            */
            var lang = {
                close : "close",
                // #calendar
                week : "Sun,Mon,Tue,Wed,Thu,FRI,Sat",
                month : "Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec",
                year : "{0}",
                day : "{0}",
                hour : "{0}",
                minute : "{0}",        
                colon : ':',
                // dialogbox
                dialogbox_ok : "O&nbsp;&nbsp;K",
                dialogbox_cancel : "Cancel",
                loading : 'Loading',
                revoke : 'Revoke',
                preview_real : 'Real size',
                preview_auto : 'Auto',
                preview_rotate : 'Rotate',
                preview_down : 'Download',
                preview_send : 'Send',
                preview_newwin : 'New window',
                preview_original : 'Original',
                preview_error : 'Load in error',
                date_qiantian: 'the day before yesterday', 
                date_zuotian: 'yesterday', 
                date_jintian: 'today', 
                date_mingtian: 'tomorrow',
                date_houtian: 'day after tomorrow', 
                date_linceng: 'morning', 
                date_zaoshang: 'morning', 
                date_zhongwu: 'noon',
                date_xiawu: 'afternoon', 
                date_wanshang: 'night'
            };
            shark.i18n["en_US"] = lang;
        }
    };


    /**
     * @fileOverview 组件相关的配置类
     * @type {Object}
     */
    // 
    shark.initConfig = function(_configs){
        this.config = {
            hl : "zh_CN",
            debug : false,
            autoTest : false,
            // type Function
            analytics : null
        };
        shark.mixin(this.config, _configs);
        // 设置当前语言项
        if(this.config.hl){
            shark.i18n["current"] = this.config.hl;
        }

        // 语言
        initHl(shark.i18n["current"]);
        // namespace
        if(this.config.namespace){
            for(var prop in shark){
                var Clazz = shark[prop];
                var clazzName = Clazz.prototype && Clazz.prototype.clazzName || Clazz.clazzName;
                if(clazzName){
                    this.config.namespace[clazzName] = Clazz;
                }
            }
        }
    };
    //
})();

(function(){

    /**
    * @fileOverview 国际化资源，英文
    * @requires i18n
    */
    var i18n = {
        current : "zh_CN",// 默认中文
        /**
         * 国际化资源串
         * @param  {string} _key      资源串的key值
         * @param  {object.n} _varParam 可变参数，如果还有参数，作为key后面参数传入
         * @return {string}           被翻译之后的字符串
         */
        trans : function(_key,_varParam){
            var another = this[this.current][_key];
            return shark.tool.format(another, _varParam);
        }
    };
    
    shark.i18n = i18n;
})();

!function(){
    var ie, firefox, chrome, opera, safari;
    // 浏览器嗅探，包括support
    var detection = {
        init : function () {
            var ua = window.navigator.userAgent;
            var matcher;
            // 使用正则表达式在userAgent中提取浏览器版本信息
            (matcher = ua.match(/MSIE ([\d.]+)/)) ? ie = matcher[1] :
                (matcher = ua.match(/Firefox\/([\d.]+)/)) ? firefox = matcher[1] :
                (matcher = ua.match(/Chrome\/([\d.]+)/)) ? chrome = matcher[1] :
                (matcher = ua.match(/Opera.([\d.]+)/)) ? opera = matcher[1] :
                (matcher = ua.match(/Version\/([\d.]+).*Safari/)) ? safari = matcher[1] : 0;
            if(matcher && matcher[1]){
                this.version = matcher[1].split('.');
            }else{
                if(/trident/i.test(ua)){
                    ie = 11;
                }
            }
        },
        isFirefox : function() {
            return !!firefox;
        },
        isIE : function(){
            return !!ie;
        },
        isIE6 : function(){
            var ie6 = ie && parseInt(ie) == 6;
            this.isIE6 = function () {
                return ie6;
            }
            return ie6;
        },
        isIE7 : function(){
            var ie7 = ie && parseInt(ie) == 7;
            this.isIE7 = function () {
                return ie7;
            }
            return ie7;
        },
        isIE67 : function(){
            var ie7 = ie && parseInt(ie) <= 7;
            this.isIE67 = function () {
                return ie7;
            }
            return ie7;
        },
        isIE678 : function(){
            var ie7 = ie && parseInt(ie) <= 8;
            this.isIE678 = function () {
                return ie7;
            }
            return ie7;
        }
    };
    // 初始化
    detection.init();
    shark.detection = detection;
}();

!function(){
    /**
     * @fileOverview 
     * 组件工厂，提供组件的查询和操作接口，包括了一个内部的Class类
     * 管理组件的生命周期
     * @author  hite
     * @version 1.0
     * @date    2013-01-09
     * @return  {void}   无
     */
    // modified by mars.js written by mayunchao
    var Class = {};
    Class.Object = function() {
        this.init();
        return this;
    };
    Class.Object.prototype = {
        init: function() {
        }
    };

    var parent = function() {
        var caller = arguments.callee.caller;
        var name = caller._name;
        var parent = caller._owner._parent;
        var superMethod = parent ? parent.prototype[name] : null;
        if(superMethod) {
            return superMethod.apply(this, arguments);
        } else {
            throw new Error('The parent method "' + name + '" is not exist.');
        }
    };

    var wrap = function(fn, name, owner) {
        fn._name = name;
        fn._owner = owner;
        return fn;
    };
    //
    Class.create = function(superClassName, properties) {
        var clz = function() {
            if (clz._prototyping) return this;
            if(this.init) {
                this.init.apply(this, arguments);
            }
            return this;
        };
        //
        var superClass;
        if(superClassName) {
            superClass = superClassName;
        } else {
            superClass = Class.Object;
        }
        superClass._prototyping = true;
        clz.prototype = new superClass();
        delete superClass._prototyping;
        //
        clz._parent = superClass;
        clz.prototype.parent = parent;
        //
        for (var key in properties) {
            var value = properties[key];
            if(typeof value == "function") {
                value = wrap(value, key, clz);
            }
            clz.prototype[key] = value;
        }
        //
        clz.constructor = Class.create;
        clz.prototype.constructor = clz;
        //
        return clz;
    };
    // modified end;
    /**
     * 组件工厂，单例
     * @class factory
     * @type {Object}
     */
    var factory = /** @lends factory */{
        _count : 0,
        //保留 id和组件的对应，
        _bigbang :{},
        _exposed : {},// 被export的类
        create: function(_properties){
            return Class.create(null,_properties);
        },
        /**
         * 继承，目前支持单个继承
         * @author  hite
         * @version 1.0
         * @date    2013-05-28
         * @param   {array|string}   _dependencies 依赖的父组件，只需要传入名称。如Container，不需要传入命名空间
         * @param   {object}   _properties   新的属性列表。
         * @return  {Object}                 新的组件类
         */
        extend:function(_dependencies,_properties){
            var denps = [_dependencies];
            var extendee = null;
            // 暂时不支持多重支持
            for(var i=0;i<1;i++){
                extendee = this.clazz(denps[i]);
            }
            if(extendee==null){
                throw new Error("superClass not existed");
            }
            // extendee.push(_properties);
            return Class.create(extendee,_properties);
        },
        /**
         * 将组件暴露为外部组件,clazz自定义属性等 
         * @author  hite
         * @version 1.0
         * @date    2013-05-28
         * @param   {string}   _widgetName 外部对象，用来引用内部的对象。 
         * @param   {object}   _clazz      实际上要暴露给外部的对象
         */
        define:function(_widgetName,_clazz){
            shark[_widgetName] = _clazz;
            // 保存此 组件的调用名称，供反省使用
            if(typeof _clazz == "function"){
                shark[_widgetName].prototype.clazzName = _widgetName;
            }else{
                 shark[_widgetName].clazzName = _widgetName;
            }
            // 保证在initconfig执行之后的异步对象也属于namespace
            if(shark.config && shark.config.namespace) {
                shark.config.namespace[_widgetName] = shark[_widgetName];
            }
        },
        /**
         * 根据组件名称字符串获取组件的类对象
         * @author  hite
         * @version 1.0
         * @date    2013-05-28
         * @param   {string}   _widgetName 组件的名称
         * @return  {object}               组件类
         */
        clazz:function(_widgetName){
            var ns = shark;
            if(typeof _widgetName == "function"){
                return _widgetName;
            }
            return ns[_widgetName];
        },
        /**
         * 判断实例是否是该组件名称的实例
         * @author  hite
         * @version 1.0
         * @date    2013-05-28
         * @param   {object}   _instance   组件的实例
         * @param   {string}   _widgetName 组件名称
         * @return  {boolean}               true或者false
         */
        isInstance:function(_instance,_widgetName){
            return _instance instanceof this.clazz(_widgetName);
        },
        /**
         * 将组件保存到组件池中 
         * @author  hite
         * @version 1.0
         * @date    2013-05-28
         * @param   {string}   _id   保存组件的key
         * @param   {widget}   _ctrl 组件实例
         */
        store:function(_id,_ctrl){
           this._bigbang[_id] = _ctrl;
        },
        /**
         * 将组件从件池中 剔除
         * @author  hite
         * @version 1.0
         * @date    2013-05-28
         * @param   {string}   _id   保存组件的key
         */
        unStore:function(_id){
           delete this._bigbang[_id];
        },
        destroyAll: function(){
            for(var id in this._bigbang){
                this._bigbang[id].destroy();
            }
        },
        /**
         * 销毁容器里面的所有组件
         */
        destroyInContainer: function(container){
            var that = this;
            // if(container.hasClass('js-widget')) {
            //     that._destroyWidgets(container.attr('id'));
            // }
            if(container) {
                var widgets = container.find('.js-widget');
                for (var i = 0; i < widgets.length; i++) {
                    try {
                        that._destroyWidgets(widgets[i].id);
                    } catch(ex) {
                        // ignore
                    }
                }
                widgets = null;
            }
            container = null;
        },
        _destroyWidgets : function(id){
            var that = this;
            if(id) {
                var wids = id.split('|');
                for (var i = 0; i < wids.length; i++) {
                    var widget = that.retrive(wids[i]);
                    if(widget) {
                        widget.destroy();
                    }
                }
            }
        },
        /**
         * 根据id，从组件池里获取组件实例
         * @author  hite
         * @version 1.0
         * @date    2013-05-28
         * @param   {string}   _id 组件保存时的id
         * @return  {widget}       组件实例
         */
        retrive:function(_id){
           return this._bigbang[_id];
        },
        getCount : function(){
            var count = 0;
            for(var key in this._bigbang) {
                count ++;
            }
            return count;
        },
        appendContents : function(dom, content) {
            var contents = shark.factory.formatData(content);
            for (var i = 0; i < contents.length; i++) {
                dom.append(contents[i]);
            };
        },
        formatData : function(content) {
            var inputs = $.makeArray(content);
            var outputs = [];
            for (var i = 0; i < inputs.length; i++) {
               outputs.push(shark.factory.__formatData(inputs[i]));
            };
            return outputs;
        },
        __formatData : function(input) {
            // 字符串
            if(typeof input === 'string') {
                return $(input);
            } else {
                if(shark.factory.isInstance(input, 'Widget')) {
                    return input.getEle();
                } else {
                    return input;
                }
            }
        },
        /**
         * 检查组件销毁
         */
        checkWidgets : function() {
            if(shark.config.debug) {
                var count = 0;
                for(var key in this._bigbang) {
                    var obj = this._bigbang[key];
                    if(!obj.$domNode) {
                        count ++;
                        // $Profiler.error(obj.clazzName + '.' + obj.getID());
                        $Profiler.error(obj);
                        // obj.destroy();
                    } else {
                        var id = obj.$domNode.attr('id');
                        if(!document.getElementById(id)) {
                            count ++;
                            $Profiler.error(obj);
                        }
                    }
                }
                if(count === 0) {
                    $Profiler.error('组件销毁的不错，当前：' + this.getCount());
                }
            }
        }
    };
    // 
    factory.define("factory",factory);    
}();


(function(){
    /**
     * @fileOverview 和数据相关的类，包括数据提供者，数据监听者，数据保持者
     */
    var pEventKey = "ondatasourcechanged";
    //
    var DataProvider  = shark.factory.create(/** @lends DataProvider# */{
        // 旧数据，用于和新数据比较，以自动触发组件的更新
        _oldDataSource:null,
        /**
         * 数据提供者，数据源的管理功能.提供基本的get，set方法。
         * 初始化一个数据提供者时，支持数据和组件绑定
         * @author  hite
         * @version 1.0
         * @date    2013-05-20
         * @constructor
         * @constructs  
         * @example
         *  new DataProvider({},new Widget());
         * @param   {object}   _data 数据源
         * @param   {Widget}   _ctrl 和数据绑定的组件
         */
        init:function(_data,_ctrl){
            this.ctrl = _ctrl;
            this.set(_data);
        },
        /**
         * 获取数据源接口
         * @author  hite
         * @version 1.0
         * @date    2013-05-24
         * @return  {object}   数据源
         */
        get:function(){
            return this._oldDataSource;
        },
        /**
         * 设置数据提供者的数据源者，<br/>
         * 如果和组件绑定了，并且组件提供有update接口，或者是setDirty接口，调用执行。
         * @author  hite
         * @version 1.0
         * @date    2013-05-24
         * @param   {object}   _data 新的数据源
         */
        set:function(_data){
            var _ctrl = this.ctrl;
            //TODO compare wether the datasource really has changed;
            if(this._oldDataSource && _ctrl){
                this._oldDataSource = _data;
                if(typeof _ctrl.update === "function"){
                    _ctrl.update();
                }else if(typeof _ctrl.setDirty === "function"){
                    _ctrl.setDirty(true);
                }
            }else{
                this._oldDataSource = _data;
            }
        },
        destroy:function(){
            this._oldDataSource = null;
            this.ctrl = null;
            // this.unbind(pEventKey);
        }
    });

    shark.factory.define("DataProvider",DataProvider);
    //
    var pTypeOf = Object.prototype.toString;
    var ARR  = '[object Array]',
        OBJ  = '[object Object]',
        STR  = '[object String]',
        FUNC = '[object Function]';
       //
    /**
     * 数据操作辅助类
     * @class DataHelper
     * @type {Object}
     */
    var DataHelper  = /** @lends DataHelper# */{
        /**
         * 判断是否两个对象是等价的，不包括对原始数据类型比较,
         * 在没有key的情况下退化为对原始数据的比较
         * @author  hite
         * @version 1.0
         * @date    2013-02-19
         * @param   {object}   _object1 [description]
         * @param   {object}   _object2 [description]
         * @param   {string/array}   _key     对象的key值,可选参数
         * @return  {boolean}            是否相同
         */
        equals:function(_object1,_object2,_key){
            if(_key==null){
                return this.deepEquals(_object2 , _object1);
            }else{
                if(_object2 != null && _object1 != null){
                    return _object2[_key] == _object1[_key];
                }
            }
        },
        /**
         * 判断数据是否深度相同.<br/>
         * 如果有一个对象是null，则返回false，如果是==运算是true，返回true，否则检测是否是对象，
         * 对象的相同使用toJson之后的字符串对比。
         * @author  hite
         * @version 1.0
         * @date    2013-05-24
         * @param   {object}   obj1 对象1
         * @param   {object}   obj2 对象2
         * @return  {boolean}        是否相同
         */
        deepEquals:function(obj1, obj2) {
            if(obj1 == undefined || obj2 == undefined) return false;
            // 
            if(obj1 == obj2 ) return true;

            if(pTypeOf.call(obj1) == OBJ && pTypeOf.call(obj2) == OBJ){
                return $.toJSON(obj2) == $.toJSON(obj1);
            }
            return false;
        }
    };
    shark.factory.define("DataHelper",DataHelper);


})();


(function(){
    /**
     * @fileOverview 提供跨浏览器的css属性兼容
     */
    /**
     * 辅助类。对css支持不完整的浏览器css功能增强
     * 1.最大高度，最小高度
     * 2.最大宽度，最小宽度
     * 3.fix布局
     * @static
     * @class  cssHelper
     * @example
     *  JY.cssHelper.fixed(input,{top:100});
     * @type {type}
     */
    var cssHelper = /** @lends cssHelper# */{
        /**
         * 最大高度，ie6使用overflow和height实现，其他浏览器使用原生
         * @author  hite
         * @version 1.0
         * @date    2013-05-20
         * @param   {object}   _element 要使用此样式的节点
         * @param   {number}   _height  数值
         */
        maxHeight:function(_element,_height){
            if(_height <=0) {
                return;
            }
            var ele = $(_element);
            if(shark.detection.isIE6()){
                // if(ele.get(0).scrollHeight>_height){
                    ele.css({"height":_height});
                // }else{
                //     ele.css({"height":"auto"});
                // }
            }else{
                ele.css("max-height",_height);
            }
        },
        maxWrapWidth : function(_element,_width){
            this.maxWidth(_element, _width);
        },
        /**
         * 最大宽度，ie6使用overflow和_width实现，其他浏览器使用原生
         * @author  hite
         * @version 1.0
         * @date    2013-05-20
         * @param   {object}   _element 要使用此样式的节点
         * @param   {number}   _width  数值
         */
        maxWidth:function(_element,_width){
            if(_width <=0) {
                return;
            }
            var ele = $(_element);
        
            if(shark.detection.isIE6()){
                // if(ele.get(0).scrollWidth>_width){
                    ele.css({"width":_width});
                // }
            }else{
                ele.css("max-width",_width);
            }
        },
        /**
         * 最小高度，ie6使用height实现，其他浏览器使用原生
         * @author  hite
         * @version 1.0
         * @date    2013-05-20
         * @param   {object}   _element 要使用此样式的节点
         * @param   {number}   _height  数值
         */
        minHeight:function(_element,_height){
            if(_height <=0) {
                return;
            }
            var ele = $(_element);
            if(shark.detection.isIE6()){
                ele.css({"height":_height});
            }else{
                ele.css("min-height",_height);
            }
        },
        /**
         * 最小宽度，ie6使用width实现，其他浏览器使用原生
         * @author  hite
         * @version 1.0
         * @date    2013-05-20
         * @param   {object}   _element 要使用此样式的节点
         * @param   {number}   _width  数值
         */
        minWidth:function(_element,_width){
            if(_width <=0) {
                return;
            }
            var ele = $(_element);
        
            if(shark.detection.isIE6()){
                ele.css({"width":_width});
            }else{
                ele.css("min-width",_width);
            }
        },
        /**
         * 为size，特殊设置的字体大小。
         *  & .f-size-default{font-size: 12px;}
         *  & .f-size-middle{font-size: 14px;}
         *  & .f-size-large{font-size: 16px;}
         *  & .f-size-vlarge{font-size: 18px;}
         *  & .f-size-huge{font-size: 20px;}
         * @author  hero
         * @version 1.0
         * @date    2013-11-05
         * @param   {object}   _element 要使用此样式的节点
         * @param   {number}   _size  大小
         */
        size:function(_element,_size){
            if(!_size) {
                return;
            }
            if($.inArray(_size, ['middle', 'large', 'vlarge', 'huge']) != -1) {
                $(_element).addClass('f-size-' + _size);
            } else {
                // $Profiler.error('not valid _size: ' + _size + ', shoule be middle|large|vlarge|huge');
            }
        },
        /**
         * 为size，特殊设置的字体大小。
         *    .f-padding-default{padding-bottom: 0;}
         *    .f-padding-middle{padding-bottom: 5px;}
         *    .f-padding-large{padding-bottom: 10px;}
         *    .f-padding-vlarge{padding-bottom: 15px;}
         *    .f-padding-huge{padding-bottom: 20px;}
         * @author  hero
         * @version 1.0
         * @date    2013-11-05
         * @param   {object}   _element 要使用此样式的节点
         * @param   {number}   _size  大小
         */
        padding:function(_element,_size){
            if(!_size) {
                return;
            }
            if($.inArray(_size, ['middle', 'large', 'vlarge', 'huge']) != -1) {
                $(_element).addClass('f-padding-' + _size);
            } else {
                // $Profiler.error('not valid padding: ' + _size + ', shoule be middle|large|vlarge|huge');
            }
        },
        /**
         * 为size，特殊设置的字体大小。
         *  & .m-wrap-huge{height: 50px;}
         * @author  hero
         * @version 1.0
         * @date    2013-11-05
         * @param   {object}   _element 要使用此样式的节点
         * @param   {number}   _size  大小
         */
        wrapsize:function(_element,_size){
            if(!_size) {
                return;
            }
            // 支持small 在弹窗中的一些button
            //  huge
            if($.inArray(_size, ['small', 'large', 'huge']) != -1) {
                $(_element).addClass('m-wrap-' + _size);
            } else {
                // $Profiler.error('not valid wrapsize: ' + _size + ', shoule be small|large|huge');
            }
        },
        /**
         * 为size，特殊设置的字体大小。
         *  & .f-txt-default{color: #000;}  重置默认 
         *  & .f-txt-impt{color: #d74b00;}  重点提示 
         *  & .f-txt-tip{color: #10880d;} 
         *  & .f-txt-err{color: #c30;}     出错 
         *  & .f-txt-assist{color: #999;}  辅助说明 
         *  & .f-txt-weak{color: #666;}  弱化文字 
         * @author  hero
         * @version 1.0
         * @date    2013-11-05
         * @param   {object}   _element 要使用此样式的节点
         * @param   {number}   _size  大小
         */
        color:function(_element,_color){
            if(!_color) {
                return;
            }

            if($.inArray(_color, ['default', 'impt', 'err', 'warn', 'assist', 'tip', 'weak']) != -1) {
                $(_element).addClass('f-txt-' + _color);
            } else {
                // $Profiler.error('not valid _color: ' + _color + ', shoule be impt|err|warn|assist|tip|weak');
            }
        },
        /**
         * weight 加粗
         *  & .f-fw-bold  加粗
         * @author  hero
         * @version 1.0
         * @date    2013-11-05
         * @param   {object}   _element 要使用此样式的节点
         * @param   {number}   _size  大小
         */
        weight:function(_element,_weight){
            if(!_weight) {
                return;
            }

            if($.inArray(_weight, ['bold']) != -1) {
                $(_element).addClass('f-fw-' + _weight);
            } else {
                // $Profiler.error('not valid _weight: ' + _weight + ', shoule be bold');
            }
        },
        /**
         * 支持fixed布局
         * @author  hite
         * @version 1.0
         * @date    2013-05-20
         * @param   {object}   _element 要fixed定位的元素
         * @param   {object}   _options 定位参数，包括<br/>
         *                              {number}:top 默认14px<br/>
         *                              {number}:bottom 默认20px<br/>
         *                              {number}:left 默认20px<br/>
         *                              {number}:right 默认15px<br/>
         */
        fixed:function(_element,_options){
            this.setFixed(_element,_options);
        },
        /**
         * @deprecated 请使用fixed接口
         * @version 1.0
         * @date    2013-01-23
         */
        setFixed:function(_element,_options){
            var position = _options.position || 'right bottom';
            var _setPos = function(){
                var _styles = {};
                if(shark.detection.isIE6()){
                    _styles.position = "absolute";
                }else{
                    _styles.position = 'fixed';
                }
                if(position.indexOf('top') !== -1)      {_styles.top = '14px';}
                if(position.indexOf('left') !== -1)         {_styles.left = '20px';}
                if(position.indexOf('right') !== -1)    {_styles.right = '15px';}
                if(position.indexOf('bottom') !== -1)   {_styles.bottom = '20px';}
                _element.css(_styles);
            };
            _setPos();
        },
        /**
         * 获取class名称
         */
        getPrefix : function(icoClass){
            var prefixs = [
               'file-s',
               'file',
               'icon-editor-s',
               'icon-editor',
               'icon-mail',
               'icon-normal',
               'icon-step',
               'icon'
            ];
            for (var i = 0; i < prefixs.length; i++) {
                // 加上-
                if(icoClass.indexOf(prefixs[i] + '-') == 0) {
                    return 'w-' + prefixs[i];
                }
            }
            throw new Error('not defined class: ' + icoClass);
        }
    };
    shark.factory.define("cssHelper",cssHelper);
})();

!function(){
    /**
     * @fileOverview 辅助类，协助组件停靠
     */
    /**
     * 停靠组件。提供了,
     * 停靠的元素和触发停靠的元素之间有两种关系，
     * 一种是两个同级dom结构；一种是被停靠的元素是dom的直接子节点;
     *     1.内部停靠,如居中停靠等
     *     2.外部上下停靠
     *     3.外部左右停靠
     * @type {Object}
     * @class dock
     * @example
     *  JY.dock.dockV(ctrls.timePicker, calendar.getEle(), 'bottom middle');
     */
    var dockHelper = /** @lends dock# */{
        /** 
         * 获取window的位置信息,当出现滚动条的时候,top,left是负值。
         * @author  hite
         * @version 1.0
         * @date    2013-05-24
         * @return  {object}   位置对象，结构{top:1,left:2}
         */
        getWinPosition:function(){
            if(this._lastWinPosition) return this._lastWinPosition;

            if(shark.detection.ie){
                var positionTop = document.documentElement.scrollTop*(-1);
                var positionLeft = document.documentElement.scrollLeft*(-1);
            }else{
                var position = $("html").position();
                var positionTop = position.top;
                var positionLeft = position.left;
            }
            return this._lastWinPosition = {top:positionTop,left:positionLeft};
        },
        /**
         * 获取当前窗口可见部分尺寸信息
         * @author  hite
         * @version 1.0
         * @date    2013-05-24
         * @return  {object}   尺寸对象，结构是{width:1,height:1}
         */
        getWinSize:function(){
            if(this._lastWinSize) {
                return this._lastWinSize;
            }
            //
            var docEle = document.documentElement;
            if(shark.detection.ie){
                var a = docEle.offsetWidth;
                var b = docEle.offsetHeight;
            } else{
                var a = docEle.clientWidth;
                var b = docEle.clientHeight;
            }
            return this._lastWinSize = {width:a,height:b};
        },
        /**
         * 获取的相对指定offsetParent的偏移
         * @method  default text
         * @author  hite
         * @version 1.0
         * @date    2012-10-11
         */
        getPosition:function(_element,_offsetParent){
            var ele = _element;
            if(_offsetParent == null){
                return $(ele).position();
            }
            var p1 = $(ele).position();
            var p2 = $(_offsetParent).position();
            return {
                left:p1.left-p2.left,
                top:p1.top-p2.top
            }
        },
        _init:function(){
            //TODO 处理resize事件
        },
        /**
         * 内部停靠，可以指定 停靠的位置，如top,left,middle,center,bottom,right等
         * <br/>默认为middle,center.
         * @example .dockIn(ship,{ axis: "middle,center", positionFix : {x : 0, y:0}});
         * @author  hite
         * @version 1.0
         * @date    2012-3-27
         * @param   {object|jqueryObject}  ship  被停靠的元素。
         * @param   {object}  settings 停靠参数，如位置大小等,包括:<br/>
         *                              {string}:axis 停靠方位，
         *                              {dom}: dock 停靠的父元素
         *                              {object}:positionFix  x:1,y:1
         *                                  位置修正，两个方向
         * @return  {void}            无返回值
         */
        dockIn:function(ship,settings){
            var that = this;
            
            if(!ship) {
                throw new Error('dockIn.ship required');
            }
            var x_axis = 'center';
            var y_axis = 'middle';
            if(settings.axis) {
                var matches = settings.axis.match(new RegExp('(left|center|right)'));
                if(matches && matches.length > 0) {
                    x_axis = matches[0];
                }
                var matches = settings.axis.match(new RegExp('(bottom|middle|top)'));
                if(matches && matches.length > 0) {
                    y_axis = matches[0];
                }
            }
            
            var finalLeft = 0;
            var finalTop = 0;

            var dock = settings.dock ? $(settings.dock) : $(document.body);
            // dock
            var dockWidth = dock.outerWidth();
            var dockHeight = dock.outerHeight();

            // 待定位元素
            var shipWidth = ship.outerWidth();
            var shipHeight = ship.outerHeight();

            if(x_axis == 'center'){
                finalLeft = (dockWidth - shipWidth)/2;
            }else if(x_axis == "right"){
                finalLeft = dockWidth - shipWidth;
            } else if(x_axis == 'left') {
                finalLeft = 0;
            }

            if(y_axis == 'middle'){
                finalTop = (dockHeight - shipHeight)/2;
            }else if(y_axis == "bottom"){
                finalTop = dockHeight - shipHeight;
            } else if(y_axis == 'top') {
                finalTop = 0;
            }

            // 左右调节
            var positionFix = $.extend({x:0,y:0}, settings.positionFix);
            // 修正两个位置
            finalLeft += positionFix.x;
            finalTop += positionFix.y;

            ship.offset({left:finalLeft, top : finalTop});
            // $Profiler.log('dockIn position: [' + x_axis +','+ y_axis + ']');
            // $Profiler.log('final position: [' + finalLeft +','+ finalTop + ']');
        },
        /**
         * 居中显示，属于dockIn的特例。sttings的position是"middle,center"
         * @example .dockMC(dock,ship)
         * @author  hite
         * @version 1.0
         * @see  dockIn
         * @return  {void}            无返回值        
         */
        dockMC:function(_target,_element,_settings){
            throw new Error('用到了？联系hero');
            var dock = _target, ship = _element;
            var settings = $.extend({position:"middle,center"},_settings);
            this.dockIn(dock,ship,settings);
        },
        /**
         * 滚动条的叠加，firefox特殊处理
         * @param  {Dom} ele 找到全部的滚动条
         */
        getTotalScrollTop : function(ele){
            var scrollTop = 0;
            // body，统一不计算scrollTop，不同浏览器现在返回的值不一致，实际上不应该计算
            if(ele.get(0).tagName == 'BODY') {
                return 0;
            }
            // 绝对定位的元素，不应该计算scrollTop
            if(ele.css('position') != 'absolute') {
                scrollTop = ele.scrollTop();
            }
            var parEle = ele.parent();
            if(parEle && parEle.get(0)) {
                // 有父节点，网上追溯
                return scrollTop + this.getTotalScrollTop(parEle);
            } else {
                return scrollTop;
            }
        },
        /**
         * 计算可以显示ele的区域的宽度，找到overflow hidden的模块
         */
        _getWidthContainer : function(ele, offsetParent){
            var tag = ele.get(0);
            if(!tag) {
                return $(document.body);
            }
            if(tag && tag.tagName == 'BODY') {
                return ele;
            }
            // 看ele是不是在offsetparent里面
            var outofParent = (tag == offsetParent.get(0)) || $.contains(ele, offsetParent);
            
            if(outofParent && ele.css('overflow-x') == 'hidden') {
                return ele;
            }

            return this._getWidthContainer(ele.parent(), offsetParent);
        },
        /**
         * 计算可以显示ele的区域的高度，找到overflow hidden的模块
         */
        _getHeightContainer : function(ele, offsetParent){
            var tag = ele.get(0);
            if(!tag) {
                return $(document.body);
            }
            if(tag && tag.tagName == 'BODY') {
                return ele;
            }
            // 看ele是不是在offsetparent里面
            var outofParent = (tag == offsetParent.get(0)) || $.contains(ele, offsetParent);
            
            if(outofParent && ele.css('overflow-y') == 'hidden') {
                return ele;
            }

            return this._getHeightContainer(ele.parent(), offsetParent);
        },
        /**
         * 计算可以显示ele的区域的宽度，找到overflow hidden的模块
         */
        getScrollContainer : function(ele){
            var tag = ele.get(0);
            if(!tag) {
                return $(document.body);
            }
            if(tag && tag.tagName == 'BODY') {
                return ele;
            }
            var _parent = ele.parent();
            if(_parent) {
                if(_parent.hasClass('f-scroll-y')) {
                    return _parent;
                }
                // 找到最近的出滚动条的容器
                // var overflowY = _parent.css('overflow-y');
                // if(overflowY == 'auto' || overflowY == 'scroll') {
                //     if(_parent.get(0).tagName == 'DIV') {
                //         return _parent;
                //     }
                // }
            }
            return this.getScrollContainer(_parent);
        },
        /**
         * 水平方向优先级 默认 左对齐，右对齐，居中
         * 垂直方向优先级 默认 下方，上方，中间
         * 如果有指定了axis，则按axis使用
         *
         * 注意：dock和ship，需要在同一个offsetParent容器中
         * 
         * @example JY.dock.dockV(ctrls.timePicker, calendar.getEle(), 'bottom middle');
         * @author  hite
         * @version 1.0
         * @date    2012-3-27
         * @param   {object|jqueryObject}  dock  相对的对象
         * @param   {object|jqueryObject}  ship  需要定位的元素
         * @param   {object}  settings 停靠参数，如位置大小等,包括:<br/>
         *                              {string}:axis 被停靠元素和停靠元素水平方向对齐的轴，
         *                                  支持水平参数left,center,right.
         *                                  支持垂直参数bottom,middle,top
         *                                  <br/>
         *                              {x,y} : position
         *                              {object}:positionFix  x:1,y:1
         *                                  位置修正，两个方向
         * @return  {void}            无返回值 
         */
        dockV:function(dock,ship,settings){
            var that = this;
            
            var x_axis = '';
            var y_axis = '';
            if(settings.axis) {
                var matches = settings.axis.match(new RegExp('(left|center|right)'));
                if(matches && matches.length > 0) {
                    x_axis = matches[0];
                }
                var matches = settings.axis.match(new RegExp('(bottom|middle|top)'));
                if(matches && matches.length > 0) {
                    y_axis = matches[0];
                }
            }
            var dockOffset = dock.offset();
            var dockWidth= dock.outerWidth();
            var dockHeight= dock.outerHeight();

            // offsetparent
            var offsetParent = ship.offsetParent();

            // 固定定位,用于右键菜单
            if(settings.position) {
                dockWidth = 0;
                dockHeight = 0;
                dockOffset = settings.position;
            }

            // 在iframe里面的时候，修正位置
            if(settings.iframe) {
                var iframeOffset = settings.iframe.offset();
                dockOffset.top = dockOffset.top + iframeOffset.top;
                dockOffset.left = dockOffset.left + iframeOffset.left;
            }

            // 待定位元素
            var shipWidth = ship.outerWidth();
            var shipHeight = ship.outerHeight();

            // 相对定位父元素相对的位置
            var offsetParentOffset = offsetParent.offset();
            var parentLeft = offsetParentOffset.left;
            var parentTop = offsetParentOffset.top;

            if(!x_axis) {
                var container = that._getWidthContainer(ship, offsetParent);
                var containerOffset = container.offset()
                var containerWidth = container.width();
                // $Profiler.log('容器宽:' + (dockOffset.left + containerWidth));
                // $Profiler.log('看右边够不够宽:' + (dockOffset.left + shipWidth));
                // $Profiler.log('看左边够不够宽:' + (dockOffset.left + dockWidth - shipWidth));
                // 看右边够不够宽
                if(dockOffset.left + shipWidth < containerOffset.left + containerWidth) {
                    x_axis = 'left';
                } else if(dockOffset.left + dockWidth - shipWidth > containerOffset.left) {
                    x_axis = 'right';
                } else {
                    // x_axis = 'right';
                    x_axis = 'center';
                }
            }

            // 要考虑计算滚动条的位置
            if(!y_axis) {
                var container = that._getHeightContainer(ship, offsetParent);
                var containerOffset = container.offset()
                var containerHeight = container.height();
                // $Profiler.log('容器高:' + (containerHeight));
                // $Profiler.log('看下边够不够高:' + (dockOffset.top + dockHeight + shipHeight));
                // $Profiler.log('看上边够不够高:' + (dockOffset.top - shipHeight));
                // 看高度够不够
                if(dockOffset.top + dockHeight + shipHeight < containerOffset.top + containerHeight) {
                    y_axis = 'bottom';
                } else if(dockOffset.top - shipHeight> containerOffset.top) {
                    y_axis = 'top';
                } else {
                    // y_axis = 'top';
                    y_axis = 'middle';
                }
            }
            // $Profiler.log('dockV position: [' + x_axis +','+ y_axis + ']');

            var finalLeft = 0;
            if(x_axis == 'left') {
                finalLeft = dockOffset.left;
            } else if(x_axis == 'right') {
                finalLeft = dockOffset.left + dockWidth - shipWidth;
            } else if(x_axis == 'center') {
                finalLeft = dockOffset.left - (shipWidth - dockWidth) / 2;
            }

            finalLeft -= parentLeft;

            // 像素的border
            var fixBorder = 1;
            var finalTop = 0;
            if(y_axis == 'bottom') {
                finalTop = dockOffset.top + dockHeight;
                finalTop -= fixBorder;
            } else if(y_axis == 'top') {
                finalTop = dockOffset.top - shipHeight;
                finalTop += fixBorder;
            } else if(y_axis == 'middle') {
                finalTop = dockOffset.top - (shipHeight - dockHeight) / 2;
            }
            finalTop -= parentTop;

            // $Profiler.log('position before fix: [' + finalLeft +','+ finalTop + ']');

            // 修正滚动条
            var topScroll = that.getTotalScrollTop(ship);
            // $Profiler.log('topScroll: ' + topScroll);
            finalTop += topScroll;
            // 左右调节
            var positionFix = $.extend({x:0,y:0}, settings.positionFix);
            // $Profiler.log('positionFix', positionFix);
            // 修正两个位置
            finalLeft += positionFix.x;
            finalTop += positionFix.y;

            // ship.position({left:finalLeft, top : finalTop});
            ship.css('left', finalLeft + 'px');
            ship.css('top', finalTop + 'px');
            // $Profiler.log('position after fix: [' + finalLeft +','+ finalTop + ']');
        },
        /**
         * 平行方向停靠,优先选择向右，如果右边和左边空间都不够，选择左边
         * 先确定左右，再确定上下.
         * @example JY.dock.dockH(ctrls.timePicker, calendar.getEle());
         * @author  hite
         * @version 1.0
         * @date    2012-3-27
         * @param   {object|jqueryObject}  _target   要容纳被停靠的元素的容器
         * @param   {object|jqueryObject}  _element  被停靠的元素。
         * @param   {object}  _settings 停靠参数，如位置大小等,包括:<br/>
         *                              {string}:axis 被停靠元素和停靠元素水平方向对齐的轴，
         *                                  支持水平参数left,center,right.
         *                                  支持垂直参数bottom,middle,top
         *                              {object}:positionFix 对当前定位的修正，容许在个别情况对标准的定位进行修正，以达到某些特殊效果，如右键菜单。<br/>
         *                                  <b>需要注意的是，这个修正是来自按照右下的位置停靠计算的偏移量。
         * @return  {void}            无返回值 
         */
        dockH:function(dock,ship,settings){
            var that = this;
            // TODO 看看去掉这个限制有没有问题
            // if(dock.offsetParent().get(0) != ship.offsetParent().get(0)) {
            //     $Profiler.log(dock, ship);
            //     throw new Error('dockH > dock and ship should has same offsetParent');
            // }
            var x_axis = '';
            var y_axis = '';
            if(settings.axis) {
                var matches = settings.axis.match(new RegExp('(left|center|right)'));
                if(matches && matches.length > 0) {
                    x_axis = matches[0];
                }
                var matches = settings.axis.match(new RegExp('(bottom|middle|top)'));
                if(matches && matches.length > 0) {
                    y_axis = matches[0];
                }
            }
            var dockOffset = dock.offset();
            var dockWidth= dock.outerWidth();
            var dockHeight= dock.outerHeight();

            // offsetparent
            var offsetParent = ship.offsetParent();

            var offsetParentOffset = offsetParent.offset();
            var parentLeft = offsetParentOffset.left;
            var parentTop = offsetParentOffset.top;

            // 待定位元素
            var shipWidth = ship.outerWidth();
            var shipHeight = ship.outerHeight();

            if(!x_axis) {
                var container = that._getWidthContainer(ship, offsetParent);
                var containerOffset = container.offset()
                var containerWidth = container.width();
                // $Profiler.log('容器宽:' + (dockOffset.left + containerWidth));
                // $Profiler.log('看右边够不够宽:' + (dockOffset.left + dockWidth + shipWidth));
                // $Profiler.log('看左边够不够宽:' + (dockOffset.left + dockWidth));
                // 看右边够不够宽
                if(dockOffset.left + dockWidth + shipWidth < containerOffset.left + containerWidth) {
                    x_axis = 'left';
                } else if(dockOffset.left + dockWidth > containerOffset.left) {
                    x_axis = 'right';
                } else {
                    x_axis = 'center';
                }
            }

            // 要考虑计算滚动条的位置
            if(!y_axis) {
                var container = that._getHeightContainer(ship, offsetParent);
                var containerOffset = container.offset()
                var containerHeight = container.height();
                // $Profiler.log('容器高:' + (containerHeight));
                // $Profiler.log('看下边够不够高:' + (dockOffset.top + dockHeight + shipHeight));
                // $Profiler.log('看上边够不够高:' + (dockOffset.top - shipHeight));
                // 看高度够不够
                if(dockOffset.top + shipHeight < containerOffset.top + containerHeight) {
                    y_axis = 'bottom';
                } else if(dockOffset.top + dockHeight - shipHeight> containerOffset.top) {
                    y_axis = 'top';
                } else {
                    y_axis = 'middle';
                }
            }
            // $Profiler.log('dockH position: [' + x_axis +','+ y_axis + ']');

            // 计算定位的位置
            var finalLeft = 0;
            if(x_axis == 'left') {
                finalLeft = dockOffset.left + dockWidth;
            } else if(x_axis == 'right') {
                finalLeft = dockOffset.left - shipWidth;
            } else if(x_axis == 'center') {
                finalLeft = dockOffset.left - (shipWidth - dockWidth) / 2;
            }
            finalLeft -= parentLeft;

            var finalTop = 0;
            if(y_axis == 'bottom') {
                finalTop = dockOffset.top;
            } else if(y_axis == 'top') {
                finalTop = dockOffset.top + dockHeight - shipHeight;
            } else if(y_axis == 'middle') {
                finalTop = dockOffset.top - (shipHeight - dockHeight) / 2;
            }
            finalTop -= parentTop;
            
            // 修正滚动条
            var topScroll = that.getTotalScrollTop(ship);
            // $Profiler.log('topScroll: ' + topScroll);
            finalTop += topScroll;
            // 左右调节
            var positionFix = $.extend({x:0,y:0}, settings.positionFix);
            // 修正两个位置
            finalLeft += positionFix.x;
            finalTop += positionFix.y;

            ship.css('left', finalLeft + 'px');
            ship.css('top', finalTop + 'px');

            // $Profiler.log('final position: [' + finalLeft +','+ finalTop + ']');
        },
        /**
         * 辅助类，判断ele1,ele2是否是同级节点
         * @author  hite
         * @version 1.0
         * @date    2013-05-24
         */
        isSibling:function(_ele1,_ele2){
            return $(_ele1).parent().children().index(_ele2)>-1;
        },
        /**
         * 判断第一个参数是否是第二个参数的父节点。
         * @author  hite
         * @version 1.0
         * @date    2013-05-24
         * @param   {object}   _parent 假设中的父节点
         * @param   {object}   _child  假设中的子节点
         * @return  {boolean}           如果_
         */
        isParent: function(_parent,_child){
            return $(_parent).children().index($(_child))>-1;
        },
        /**
         * 根据鼠标位置定位
         * @param {Dom} ship 需要定位的元素
         * @param {Event} event 事件
         * @return {void} 
         */
        dockAbsolute: function(ship, event, prefix){
            var that = this;
            prefix = prefix || {left: 0, top: 0};
            // debugger;
            var finalLeft = event.clientX;
            var finalTop = event.clientY;
            ship.css('position', 'absolute');
            ship.css('left', (finalLeft + prefix.left) + 'px');
            ship.css('top', (finalTop + prefix.top) + 'px');
            // ship.css('opacity', '1');
        }
    };

    shark.factory.define("dock",dockHelper);
    //
    $(window).resize(function(){
        dockHelper._lastWinPosition = null;
        dockHelper._lastWinSize = null;
    });
}();
(function(){
    var pIndex = 64;
    var pLastPopup = [];
    var pDismiss = [];
    /**
     * 弹窗相关的辅助类，管理弹出层。提供清理浮层的接口
     * @example
     * JY.popmenuHelper.add(that.door,{dismiss:function(_pop){
                that.hide();
            }});
     * @class popmenuHelper
     * @static
     * @type {Object}
     */
    var popmenuHelper = {
        /**
         * 注册 _element 为当前pop菜单
         * @author  hite
         * @version 1.0
         * @date    2012-08-04
         * @name popmenuHelper#add
         * @function
         * @param   {object}    _element  pop菜单代表的对象
         * @param   {object}    _settings 和pop菜单相关的设置，主要参数有“<br/>
         *                      {function}:dismiss 关闭弹出菜单的方式，默认是hide();<br/>
         */
        add:function(_element,_settings){
            var that = this;

            // that.clear();
            // 不能修改pSettings的值
            var settings = $.extend({}, {
                dismiss : function(pop){
                    shark.tool.hide(pop);
                    // pop.hide();
                }
            }, _settings);
            // 新出来的zindex高一点
            var ele = $(_element);
            ele.css('z-index', pIndex ++);

            pLastPopup.push(ele); 
            pDismiss.push(settings.dismiss);
        },
        /**
         * 清除所有弹出菜单
         * @author  hite
         * @function
         * @name popmenuHelper#clear
         * @version 1.0
         * @date    2012-08-04
         * @param   {object}    _site 发送点击的地点，也可以为空
         */
        clear:function(_site){
            var target= $(_site);
            for (var i = pLastPopup.length - 1; i >= 0; i--) {
                var popupEle = pLastPopup[i];
                if(shark.tool.isVisible(popupEle)) {
                    if(target.length == 0 || (target.length>0 && !$.contains(popupEle.get(0),target.get(0)))){
                        // 回调
                        try {
                            pDismiss[i](popupEle);
                        } catch(ex) {
                            // ignore
                            shark.tool.hide(popupEle);
                        }
                        // reset
                        pDismiss.splice(i, 1);
                        pLastPopup.splice(i, 1);
                    }
                } else {
                    // 正常销毁掉
                    pDismiss.splice(i, 1);
                    pLastPopup.splice(i, 1);
                }

            };
        }
    };
    // 使用mousedown来处理，所以其他需要静止
    $(document).bind("mousedown",function(event){
        shark.popmenuHelper.clear(event.target);
        
        return true;
    });

    shark.factory.define("popmenuHelper",popmenuHelper);
})();

(function(){
    var pActivePopups = [];
    
    
    var popwinHelper = {
        push : function(_win,_settings){
            pActivePopups.push(_win);
            shark.shortkey.activate(_win.getID());
        },
        peek : function(){
            var l = pActivePopups.length ; 
            if(l>0){
                return pActivePopups[pActivePopups.length-1];
            }
        },
        pop : function(){
            var win = this.peek();
            if(win){
                shark.shortkey.deactivate(win.getID());
                pActivePopups.pop();
            }
        },

        clear:function(){
            var length = pActivePopups.length;
            for (var i = 0; i < length; i++) {
                 pActivePopups[i].close();
            };
            pActivePopups = [];
        }
    };


    shark.factory.define("popwinHelper",popwinHelper);
})();

!function(){
    /**
     * 功能快捷键类。内置了shift+?快捷键，呼出快捷键帮助窗口。
     * <br/>快捷键只在非可编辑模式下有效。
     * <br/>目前可捕捉的元键有 alt,ctrl,shift。
     * <br/>特别的，对于按键不放松，设置了100ms的容差。
     * @todo 对于动态出现的dom元素没有bind事件,,可能需要手动bind
     * @type {Object}
     */
    var shortKeys  = {
        _uid: 0,
        _stack: [],
        _Jampstack: [],
        /**
         * 是否只允许栈内只有一个相同类型的快捷键绑定
         * @type {Boolean}
         */
        _one: true,
        _oneStack: {},
        // 命名空间的栈，用来解决快捷键冲突的问题
        _nsStack : [],
        /**
         * 修饰键列表
         * @type {Array}
         */
        _modifiers: [ "alt", "ctrl", "shift" ],

        /**
         * 默认命名空间
         * @type {String}
         */
        _defaultNS: "global",

        /**
         * 快捷键是否处于激活状态，全局处理，为false的时候快捷键全部不予响应
         * @type {Boolean}
         */
        isActive: true,

        /**
         * 一些常用的keycode映射
         * @type {object}
         */
        map: {
            "8": "backspace",
            "9": "tab",
            "16": "shift",
            "17": "ctrl",
            "18": "alt",
            "27": "esc",
            "33": "pageup",
            "34": "pagedown",
            "37": "left",
            "38": "up",
            "39": "right",
            "40": "down"
        },

        keyCodeMap: {
            "106": "*",
            "107": "+",
            "109": "-",
            "110": ".",
            "111": "/",
            "186": ";",
            "187": "=",
            "188": ",",
            "189": "-",
            "190": ".",
            "191": "/",
            "192": "`",
            "219": "[",
            "220": "\\",
            "221": "]",
            "222": "'"
        },

        /**
         * init方法，增加对body的keyup事件监听；
         * @return {void} 无返回值
         */
        init: function(){
            $(document).bind( 'keyup', this.onkeyboardEvent.bind(this) );
            $(document).bind( 'keydown', this.onkeyboardEvent.bind(this) );
            $(document).bind( 'keypress', this.onkeyboardEvent.bind(this) );
        },
        
        /**
         * 键盘事件统一处理
         * @param  {Event} event 
         * @return {void}       
         */
        onkeyboardEvent: function( event ){
            var type = event.type;
            // console.log(type);

            if( event.tagName == 'INPUT' || event.tagName == 'TEXTAREA') {
                if( event.which  >= 37 && event.which <= 40) {
                    return;
                }
            }

            // console.log( event.type + ":" + event.which + ":" + (event.shiftKey ? "shift" : "") );

            this.debounce(type, 100, function(){
                var which = event.which, 
                    charactor = this.map[ which ] || this.keyCodeMap[ which ] || String.fromCharCode( event.which );

                this.fire( charactor, {
                    shiftKey    : event.shiftKey,
                    altKey      : event.altKey,
                    ctrlKey     : event.ctrlKey
                },this.currentNS, type );
            }.bind(this) );
        },
        
        /**
         * 绑定快捷键
         * @description 不区分字符大小写，比如ctrl+s和ctrl+S是一样的效果
         * @param  {string}         key       响应的键值
         * @param  {function}       callback  快捷键触发回调
         * @param  {string}         type      绑定的事件类型, keydown/keyup/keypress
         * @param  {string}         namespace 命名空间，通常是模块名称等
         * 
         * @example
         * $Keyboard.bind( "R", function(){}, "keydown" );
         * $Keyboard.bind( "Shift+R", function(){}, "keyup");
         * $Keyboard.bind( "Shift+M Shift+N", function(){}, "keyup");
         * 
         * @return {void}            
         */
        bind: function( key, callback, namespace, type ){
            namespace = namespace || this.currentNS;
            
            var keys = key.split(" ");

            //如果全局只允许一个相同键+类型的快捷键，做一下处理
            //绑定之前先把相同类型的解绑
            // if( this._one ){
            //  this._findBinding( key, null, null, null, function( index ){
            //      this._stack[ index ].pause = true;
            //  }.bind(this) );
            // }
            
            for( var i = 0, l = keys.length; i < l; i++ ){
                var key = keys[i], combs = key.split( "+" ), modifiers = {};
                var mapping = this._parseKeyMapping(key);

                //按下修饰键的时候，keyup里未必捕获到会有修饰键状态(event.shiftKey)，因此统一监听keydown或者keypress
                if( mapping.modifiers.shiftKey ||  mapping.modifiers.ctrlKey || mapping.modifiers.altKey ){
                    type = type || "keydown";
                } else {
                    type = type || "keyup";
                }

                var data = $.extend( {
                    uid: this._uid++,
                    callback: callback,
                    type: type,
                    namespace: namespace,
                    pause: false
                }, mapping );

                // $Profiler.debug( 'bind', key, namespace, type );
                this._stack.push( data );
                // if( this._one ){
                //  this._oneStack[ mapping.key + $.toJson( mapping.modifiers) ].push( data.uid );
                // }
            }

        },

        /**
         * 解析出键值字符和修饰键
         * @param  {string} str 传入要绑定的键盘组合键字符串
         * @private
         * @return {object}     输出组合键字符和修饰键对象
         */
        _parseKeyMapping: function( str ){
            var combs = str.split( "+" ), modifiers = { shiftKey: false, ctrlKey: false, altKey: false };

            for( var i = 0, l = combs.length; i < l; i++ ){
                if( combs[i].toLowerCase() === "shift" ){
                    modifiers.shiftKey = true;
                } else if( combs[i].toLowerCase() === "ctrl" ){
                    modifiers.ctrlKey = true;
                } else if( combs[i].toLowerCase() === "alt" ){
                    modifiers.altKey = true;
                } else {
                    key = combs[i];
                }
            }

            return { key: key, modifiers: modifiers };
        },

        /**
         * 触发快捷键响应
         * @param  {string} charactor 键位字符
         * @param  {object} modifiers 修饰键
         * @param  {string} namespace      事件的命名空间
         * @param  {string} type      事件的类型
         * @return {void}           
         */
        fire: function( charactor, modifiers, namespace, type ){
            // console.log( charactor + ":" + namespace + ":" + type );
            for( var i = 0, l = this._stack.length; i < l; i++ ){
                var data = this._stack[i];

                if( !data ){
                    continue;
                }

                if(data.namespace !== namespace){
                    continue;
                }

                //该快捷键绑定被中断执行
                if( data.pause ){
                    continue;
                }

                //绑定的类型不匹配
                if( data.type !== type ){
                    continue;
                }

                //绑定的键值不匹配
                if( data.key.toLowerCase() !== charactor.toLowerCase() ){
                    continue;
                }

                //修饰键不匹配
                if( modifiers.shiftKey != data.modifiers.shiftKey ||  modifiers.ctrlKey != data.modifiers.ctrlKey || modifiers.altKey != data.modifiers.altKey ){
                    continue;
                }

                data.callback();
            }
        },
        
        /**
         * 查找符合条件的绑定，给解绑和暂停事件提供接口
         * @param  {string}   key        键位字符
         * @param  {function} handler    事件响应
         * @param  {string}   namespace  命名空间
         * @param  {string}   type       绑定类型
         * @param  {function} callback   回调
         * @private
         * @return {void}             
         */
        _findBinding: function( key, handler, namespace, type, callback ){
            for( var l = this._stack.length, i= l; i; i-- ){
                var data = this._stack[i - 1];

                if( key ){
                    var keyHit = false, keys = key.split(" ");
                    for( var j = 0, m = keys.length; j < m; j++ ){
                        var comb = this._parseKeyMapping( keys[j] );

                        //键值字符和修饰键完全相同，命中
                        if( comb.key === data.key 
                            && comb.modifiers.shiftKey === data.modifiers.shiftKey 
                            && comb.modifiers.ctrlKey === data.modifiers.ctrlKey 
                            && comb.modifiers.altKey === data.modifiers.altKey ){
                            keyHit = true;
                        }
                    }

                    //键值对不上
                    if( !keyHit ){
                        continue;
                    }
                }

                //回调对应不上
                if( handler && (data.callback != handler ) ){
                    continue;
                }

                //命名空间不匹配
                if( namespace && (namespace != data.namespace ) ){
                    continue;
                }

                //类型不匹配
                if( type && ( type != data.type ) ){
                    continue;
                }

                callback( i - 1 );
            }
        },

        /**
         * 解绑快捷键
         * @param  {string}   key        键位字符
         * @param  {function} handler    事件响应
         * @param  {string}   namespace  命名空间
         * @param  {string}   type       绑定类型
         * @return {void}           
         */
        unbind: function( key, handler, namespace, type ){
            // $Profiler.debug( 'unbind', key, namespace, type );
            this._findBinding( key, handler, namespace, type, function( index ){
                this._stack.splice( index, 1 );
            }.bind(this) );
        },

        /**
         * 将符合条件的事件标记为暂停
         * @param  {string}   key        键位字符
         * @param  {function} handler    事件响应
         * @param  {string}   namespace  命名空间
         * @param  {string}   type       绑定类型
         * @return {void}
         */
        pause: function( key, handler, namespace, type ){
            this._findBinding( key, handler, namespace, type, function( index ){
                this._stack[ index ].pause = true;
            }.bind(this) );
        },

        /**
         * 继续执行
         * @param  {string}   key        键位字符
         * @param  {function} handler    事件响应
         * @param  {string}   namespace  命名空间
         * @param  {string}   type       绑定类型
         * @return {void}
         */
        unpause: function( key, handler, namespace, type ){
            this._findBinding( key, handler, namespace, type, function( index ){
                this._stack[ index ].pause = false;
            }.bind(this) );
        },
        
        /**
         * 对狂按快捷键的行为进行降频处理
         * @param  {string} _key       
         * @param  {number} _threshold 
         * @param  {function} _callback  
         * @return {void}            
         */
        debounce: function( _key, _threshold, _callback ){
            var timer =  this._Jampstack[ _key ];
            if( timer ){
                window.clearTimeout(timer);
            }
            this._Jampstack[ _key ] = window.setTimeout( _callback, _threshold );
        },

        /**
         * 设置是否容许快捷键
         * @param {boolean} active true表示容许
         */
        setActive: function( active ){
            this.isActive = active;
        },

        /**
         * 获取当前是否允许快捷键
         * @return {boolean} 
         */
        getActive: function(){
            return this.isActive;
        },

        /**
         * 激活某个命名空间的快捷键
         * @param  {string} _namespace 
         * @return {void}            
         */
        activate: function( _namespace ){
            // console.log( "activate", _namespace );
            this._nsStack.push( _namespace );
            this.currentNS = _namespace;
        },

        /**
         * 注销某个命名空间的快捷键
         * @return {void} 
         */
        deactivate: function(){
            // console.log( $.toJSON(this._nsStack) + ":deactivate" );
            var ns = this._nsStack.pop();
            var l = this._nsStack.length;

            if( l > 0 ){
                this.currentNS = this._nsStack[ l - 1 ];
            }else{
                this.currentNS = this._defaultNS;
            }
        }
    };

    // 混入
    // 给键值加入了快捷的有含义的名称
    // copy from jquery-ui-custome.js
    shark.mixin(shortKeys,{
        BACKSPACE: 8,
        COMMA: 188,
        DELETE: 46,
        DOWN: 40,
        END: 35,
        ENTER: 13,
        ESCAPE: 27,
        HOME: 36,
        LEFT: 37,
        NUMPAD_ADD: 107,
        NUMPAD_DECIMAL: 110,
        NUMPAD_DIVIDE: 111,
        NUMPAD_ENTER: 108,
        NUMPAD_MULTIPLY: 106,
        NUMPAD_SUBTRACT: 109,
        PAGE_DOWN: 34,
        PAGE_UP: 33,
        PERIOD: 190,
        RIGHT: 39,
        SPACE: 32,
        TAB: 9,
        UP: 38//
    });
    $(document).ready(function() {
        // Stuff to do as soon as the DOM is ready;
        shortKeys.init();
    });

    shark.shortkey = shortKeys;
    
}();

(function(){
	/**
	 * @fileOverview 支持自动化测试，autotest=true参数时，为所有组件增加js-w-autotest-前缀的class类
	 */
	//
	var Component = shark.factory.create(/** @lends Component# */{
		/**
		 * ui组件的基类，处理和业务框架相关的逻辑，
	 	 * 包括数据集成；和框架交互
		 * <b>不能单独使用，需要被子类继承</b>
		 * @constructs
		 * @constructor
		 * @author  hite
		 * @version 1.0
		 * @date    2013-05-16
		 * @return  {object}   
		 */
		init : function(data, settings){
			var that = this;
			that.setData(data);
			// 处理cssstyleselector
			that.setSettings(settings);
		},
		/**
		 * 放的是数据，样式等
		 * @param  {object} data 数据
		 * @return {void}  
		 */
		setData : function(data){
			this.__data = $.extend({}, data);
		},
		/**
		 * 放的是数据，样式等
		 * @return {object} data 数据
		 */
		getData : function(){
			return this.__data;
		},
		/**
		 * 放的是事件，行为相关
		 * @param  {object} data 数据
		 * @return {void}  
		 */
		setSettings : function(settings){
			this.__settings = $.extend({}, settings);
		},
		/**
		 * 放的是事件，行为相关
		 * @return {object} settings 事件，行为相关
		 */
		getSettings : function(){
			return this.__settings;
		},
		/**
		 * 为业务自动化测试接口，具体逻辑口可以由具体组件来实现
		 * @author  hite
		 * @version 1.0
		 * @date    2013-05-16
		 * @return  {void}   空
		 */
		autoTest:function(){
			return '';
		},
		/**
		 * 自动化测试中，为了解决组件class名称含有特殊字符的问题的处理
		 * @author  hite			
		 * @version 1.0
		 * @date    2013-05-16
		 * @param   {string}   _val 传入的组件的名称，要使用为class名称，还需要处理下。
		 *                          这里的处理是：
		 *                          去掉<>标签；
		 *                          去掉'“;
		 *                          去掉&nbsp;;
		 *                          限定为不超过10个字。
		 * @return  {string}        可以用在class里的规划名称
		 */
		trimName:function(_val){
			if(typeof _val === 'string') {
				return _val.replace(/<.+>/g,"").replace(/['"<>]/g,"").replace(/&nbsp;/g,"").substring(0,10);
			} else {
				return _val;
			}
		},
		destroy : function() {
			var that = this;
			that.__settings = null;
			that.__data = null;
		}
	});

	shark.factory.define("Component",Component);
})();
(function(){
	/**
	 * @author hero
	 * @property {string} disableClass 默认的组件disabled类
	 * @fileOverview ui组件父类,统一管理ui的生命周期，包括添加ui的id，显示隐藏等
	 */
 	var pDisabledClass = "f-disabledmask";
 	// 组件支持可以设置的样式
 	var pSupportStyle = [
		"maxHeight",
		"minHeight",
		"maxWidth",
		"maxWrapWidth",
		"minWidth",
		// 定位
		"fixed",
		// 字体大小
		"size",
		// 字体颜色
		"color",
		// 字体weight
		"weight",
		// 容器大小
		"wrapsize",
		// padding-bottom 下边距
		"padding"
	];

	// 默认选择器,空的时候，就是组件本身
 	var pDefaultAttrSelector = {
 		// title
 		"title" : ''
 	}
	// 默认选择器,空的时候，就是组件本身
 	var pDefaultCssStyleSelector = {
 		// 最大高度
 		"maxHeight" : '',
 		// 最小高度
		"minHeight" : '',
		// text使用，最大宽度
		"maxWrapWidth":'',
		// 最大宽度
		"maxWidth" : '',
		// 最小宽度
		"minWidth" : '',
		// 定位
		"fixed" : '',
		// 字体大小
		"size" : '',
		// 字体颜色
		"color" : '',
		// 字体粗
		"weight" : '',
		// 组件的大小
		"wrapsize" : '',
		// padding-bottom 下边距
		"padding" : ''
 	};

 	var pMask = '<div class="disabledmask"></div>';
	var Widget = shark.factory.extend("Component",/** @lends Widget# */{
		// 
		/**
		 * 如果是组件要重写init，则需要显式调用Component的initialize方法；或者调用widget的init
		 * 创建的同时将组件保存到一个变量池中，供遍历组件管理
		 * * <b>不能单独使用，需要被子类继承</b>
		 * @constructs
		 * @extends {Component}
		 * @return  {object}   组件实例
		 * @param {object} data 数据，样式相关
		 *                      cssStyle 显示的样式
		 * @param {Object} settings 事件，行为相关
		 *                      cssStyleSelector
		 */
		init:function(data, settings){
			var that = this;
			var settings = $.extend({disabledCls : pDisabledClass}, settings); 
			that.parent(data, settings);
			//
			var id = shark.uid("widget_");
			that.setID(id);
			//
			shark.factory.store(id,that);
			//
			that._parent = null;
			// dom的jquery对象
			that.$domNode = null;

			that.__relatedWidgets = [];
			return that;
		},
		// 新建dom节点，需要具体widget实现
		// 返回组件的dom结构，原生dom和jquery对象都可以
		/**
		 * 创建dom对象，必须有返回dom
		 * @return {Jquery}     dom对象
		 */
		create:function(){
			return $('<div>shark.Widget</div>');
		},
		/**
		 * 添加关联组件
		 * @param  {object} w description
		 * @return {object}   description
		 */
		__addRelatedWidget : function(w) {
			this.__relatedWidgets.push(w);
		},
		/**
		 * 清除关联组件
		 * @return {object} description
		 */
		__clearRelatedWidget : function() {
			for(var i = 0, l= this.__relatedWidgets.length; i<l; i++){
				this.__relatedWidgets[i].destroy();
			}
			this.__relatedWidgets.length = 0;
		},
		/**
		 * 为组件设置id
		 * @author  hite
		 * @version 1.0
		 * @date    2013-05-16
		 * @param   {string}   _id id值，建议是以字母开头的合法id名称
		 * @return  {void}       无
		 */
		setID:function(_id){
			this._widgetID = _id;
		},
		/**
		 * 获取组件id，
		 * 	可用来作为组件相关的父亲节点id
		 * @author  hite
		 * @version 1.0
		 * @date    2013-05-16
		 * @return  {string}   id值，可能来自组件自己的id；
		 *          也可能来自程序里的其他设置
		 */
		getID:function(){
			return this._widgetID ;
		},
		/**
		 * 设置组件父节点。
		 * <b>当执行此函数之后.不会将当前的组件作为参数_ctrl的子节点</b>
		 * @author  hite
		 * @version 1.0
		 * @date    2013-05-16
		 * @param   {Object}   _ctrl 组件对象
		 * @return  {void}         无
		 */
		setParent:function(_ctrl){
			this._parent = _ctrl;
		},
		/**
		 * 获取当前组件的父节点	
		 * @author  hite
		 * @version 1.0
		 * @date    2013-05-16
		 * @return  {Object}   父节点对象
		 */
		getParent:function(){
			return this._parent;
		},
		/**
		 * 当组件新建完毕之后，调用oncreate为组件添加事件以及其他 处理
		 * 本接口用来为组件bind事件，而且这些事件是在create方法之后执行
		 * 也就是说create里执行的bind事件是在oncreate的事件之前。
		 * 	<p>widget组件为所有组件增加了mousedown,mouseup,click,mousenter,mouseleave的样式，
		 * 	在当前组件为disabled的时候，不响应此操作</p>
		 * 
		 * @private
		 * @author  hite
		 * @version 1.0
		 * @date    2013-05-16
		 * @return  {void}   无
		 */
		oncreate:function(){
		},
		/**
		 * 所有获取domNode的地方，都需要调用get$Ele,
		 * 此时初始化domNode；
		 * 只有需要看到的地方才需要处理事件，所以生产domNOde的入口都在这里。
		 * 是另一个高阶的延迟加载
		 *  <B>warning:只有执行了get$Ele函数之后，才会执行oncreate函数</B>
		 * dom的jquery对象
		 * @modified 增加选择器为update提供简单的入口 
		 * @author hite
		 * @history 增加自动化接口 2013-5-8
		 * @date 2012-5-15
		 * @author  hite
		 * @version 1.0
		 * @date    2013-05-16
		 * @param   {string}   _selector 选择当前组件dom中内部节点
		 *                               可接受空值，表示全部dom
		 * @return  {jQuery}             表示当前组件的DOM的jQuery对象
		 */
		getEle:function(_selector) {
			var that = this;
			if(that.__destroyed) {
				// $Profiler.error('getEle of a destroyed widget?' + this.clazzName);
				return null;
			}
			if(that.$domNode == null){
				// var key0 = that.clazzName + '.' + that.getID() + '.getEle';
				// var key = '  ' + key0;
				// $Profiler.time(key0);
				// 组件的调用初始化接口，接受具体数据，渲染为带具体逻辑dom
				// $Profiler.time(key + '.create');
				var dom = that.create();
				// $Profiler.timeEnd(key + '.create');
				// $Profiler.time(key + '.dom');
				if(shark.factory.isInstance(dom, 'Widget')) {
					that.$domNode = dom.getEle();
				} else if(dom instanceof jQuery) {
					that.$domNode = dom;
				} else {
					that.$domNode = $(dom);	
				}
				// $Profiler.timeEnd(key + '.dom');
				if(!that.$domNode) {
					throw new Error('must return a dom of create', that);
				}
				// oncreate了
				// $Profiler.time(key + '.oncreate');
				that.oncreate();
				// $Profiler.timeEnd(key + '.oncreate');

				// $Profiler.time(key + '.other');
				// 设置
				// TODO domshow可能show不出来，需要考虑一下
				that.ondomshow();
				// 设置cssStyle
				that.setCssStyle();
				that.setAttrs();
				// 加入组件id TODO 对已经有id组件，加到关联组件去
				var id = that.$domNode.attr('id');
				// dom中保存引用
				if(id) {
					var ids = id.split('|');
					var baseWidget = null;
					for (var i = 0; i < ids.length; i++) {
						if(ids[i].indexOf('widget_') === 0) {
							baseWidget = shark.factory.retrive(ids[i]);
							break;
						}
					};
					// 加到关联组件去
					if(baseWidget) {
						// 加到关联里面去了
						baseWidget.__addRelatedWidget(that);
					} else {
						that.$domNode.attr('id', id + '|' + that.getID());
						that.$domNode.addClass("js-widget");
					}
				} else {
					that.$domNode.attr('id', that.getID());
					that.$domNode.addClass("js-widget");
				}

				// 自动化测试接口
				if(shark.config && shark.config.autoTest){
					var name = that.autoTest();
					if(name) {
						that.trimName(name);
					}
				}
				// widgetid，r用于组件管理
				// $Profiler.timeEnd(key + '.other');
				// $Profiler.timeEnd(key0);
			}
			if(typeof _selector === 'string'){
				return that.$domNode.find(_selector);
			}
			return that.$domNode;
		},
		/**
		 * widget层的名称处理，处理完毕之后，会传入到component继续处理
		 *  为组件的dom节点最外层增加以js-autotest-widge-为前缀的className
		 * @author  hite			
		 * @version 1.0
		 * @date    2013-05-16
		 * @param   {string}   _val 传入的组件的名称
		 * @return  {void}        无
		 */
		trimName:function(_val){
			var txt = $Py.getPy(this.parent(_val)).toLowerCase();
			// this.$domNode 必须存在,
			// 因为调用自动化测试是在 get$Ele接口中的
			this.$domNode.addClass("js-autotest-widget-"+txt);
		},
		/**
		 * 统计项目
		 * @param  {[type]} dom     [description]
		 * @param  {[type]} logName [description]
		 * @return {[type]}         [description]
		 */
		analytics : function (dom, log) {
			if(typeof log != 'undefined' && typeof shark.config.analytics === 'function') {
				dom.bind('click', function (evt) {
					shark.config.analytics(log);
				});
			}
		},
		/**
		 * 组件的显示，如果是复杂组件需要重写
		 * 默认的在调用了jquery的show方法（有害），之后将visible的参数置为true。
		 * 避免在后续查询dom的isvisible消耗性能
		 * 
		 * @author  hite
		 * @version 1.0
		 * @date    2013-05-16
		 * @return  {void}        无
		 */
		show:function(){
			this.getEle().removeClass('f-hide');
			this.setVisible(true);
		},
		/**
		 * 组件的隐藏，如果是复杂组件需要重写
		 * 	默认的在调用了jquery的hide方法（有害），之后将visible的参数置为false。
		 * @author  hite
		 * @version 1.0
		 * @date    2013-05-16
		 * @return  {void}        无
		 */
		hide:function(){
			this.getEle().addClass('f-hide');
			this.setVisible(false);
		},
		/**
		 * 是否已经被销毁了
		 * @return {Boolean} [description]
		 */
		isDestroyed : function() {
			return this.__destroyed;
		},
		/**
		 * 组件的销毁函数。主要操作包括
		 * 	1.将组件从组件的变量池中移除
		 * 	2.将组件从dom中移除
		 * 	3.将domNode变量置空
		 * 	4.断开和父节点的关联
		 * 	5.visible状态置空
		 * 	
		 * @author  hite
		 * @version 1.0
		 * @date    2013-05-16
		 */
		destroy:function(){
			var that = this;
			if(that.__destroyed) {
				return;
			}
			that.__destroyed = true;
			shark.factory.unStore(this.getID());

			if(that.$domNode){
				// 如果是td的，需要同时删除掉包含的td tr容器
				if(that.$domNode.parent().prop('tagName') === 'TD') {
					that.$domNode.parent().parent().remove();
				}
				that.$domNode.unbind();
				that.$domNode.undelegate();
				that.$domNode.remove();
				shark.factory.destroyInContainer(that.$domNode);
				that.$domNode = null;

				that._parent = null;
				that._visible = null;
				// 清除关联组件
				that.__clearRelatedWidget();
				// 检查对象销毁情况
				that.parent();
			}
		},
		/**
		 * 设置样式
		 * @author  hite
		 * @version 1.0
		 * @date    2012-07-11
		 */
		setCssStyle:function(){
			var that = this;
			var data = that.getData();
			var _cssProperty = data.cssStyle;
			// 没有cssStyle需要设置
			if(!_cssProperty) {
				return;
			}
			var settings = $.extend({}, {
				cssStyleSelector : pDefaultCssStyleSelector,
				ignoreCssStyle : []
			}, that.getSettings());

			for(var key in _cssProperty){
				var _selector = settings.cssStyleSelector[key];
				var domNode = null;
				// 通过选择器获取
				if(typeof _selector == 'string' && _selector != ''){
					domNode = this.getEle(_selector);
				} else {
					domNode = this.getEle();
				}
				// 支持的
				if($.inArray(key, pSupportStyle)>-1){
					// 不在ignore里面
					if($.inArray(key, settings.ignoreCssStyle) === -1){
						shark.cssHelper[key](domNode, _cssProperty[key]);
					}
				}else{
					domNode.css(key,_cssProperty[key]);
				}
			}
		},
		/**
		 * 设置属性
		 */
		setAttrs : function(){
			var that = this;
			var data = that.getData();
			// attrs
			var _attrProperty = data.attrs;
			if(!_attrProperty) {
				return;
			}
			var settings = $.extend({}, {attrSelector : pDefaultAttrSelector}, that.getSettings());

			for(var key in _attrProperty){
				var _selector = settings.attrSelector[key];
				if(typeof _selector != 'undefined') {
					var domNode = null;
					// 通过选择器获取
					if(typeof _selector == 'string' && _selector != ''){
						domNode = this.getEle(_selector);
					} else {
						domNode = this.getEle();
					}
					domNode.attr(key, data[key]);
				}
			}
		},
		/**
		 * 垂直方向，将目标组件停靠到_target代表的dom节点位置，具体参数见_settings
		 * @author  hite
		 * @version 1.0
		 * @see _dock
		 * @date    2013-05-16
		 * @param   {object}   _target   要停靠，挂靠的组件
		 * @param   {object}   _settings 停靠的具体参数，常见的如<br/>
		 *                               {string}:root 代表计算位置时的，共同目标。解决<br/>
		 *                               				1.弹窗被下面节点遮挡的问题<br/>
		 *                               				2.弹窗弹出后，不随着主体滚动的问题<br/>
		 *                               {string}:axis 停靠的位置，left表示左对齐；right表示右对齐
		 */
		dockV:function(_target,_settings){
			this._dock("V",_target,_settings);
		},
		/**
		 * 水平方向，将目标组件停靠到_target代表的dom节点位置，具体参数见_settings
		 * @author  hite
		 * @version 1.0
		 * @see _dock
		 * @date    2013-05-16
		 * @param   {object}   _target   要停靠，挂靠的组件
		 * @param   {object}   _settings 停靠的具体参数，常见的如<br/>
		 *                               {string}:root 代表计算位置时的，共同目标。解决<br/>
		 *                               				1.弹窗被下面节点遮挡的问题<br/>
		 *                               				2.弹窗弹出后，不随着主体滚动的问题<br/>
		 *                               {string}:axis 停靠的位置，left表示左对齐；right表示右对齐
		 */
		dockH:function(_target,_settings){
			this._dock("H",_target,_settings);
		},
		dockIn:function(_container,_settings){
			var domNode = this.getEle();
			shark.dock["dockIn"](_container,domNode,_settings);
		},
		/**
		 * 将目标组件停靠到_target代表的dom节点位置，具体参数见_settings
		 * @author  hite
		 * @version 1.0
		 * @date    2013-05-16
		 * @private
		 * @param   {string}   _type     停靠方向，H表示水平，V表示垂直
		 * @param   {object}   _target   要停靠，挂靠的组件
		 * @param   {object}   _settings 停靠的具体参数，常见的如<br/>
		 *                               {string}:root 代表计算位置时的，共同目标。解决<br/>
		 *                               				1.弹窗被下面节点遮挡的问题<br/>
		 *                               				2.弹窗弹出后，不随着主体滚动的问题<br/>
		 *                               {string}:axis 停靠的位置，left表示左对齐；right表示右对齐
		 */
		_dock:function(_type,_target,_settings){
			var domNode = this.getEle();
			var settings = _settings || {};
			var root = settings.root;
			if(root){
				root.append(domNode);
			}else{
				_target.after(domNode);
			}
			shark.dock["dock"+_type](_target,domNode,settings);
		},
		/**
		 * 设置可见性
		 * 	
		 * @author  hite
		 * @version 1.0
		 * @protected
		 * @date    2013-05-16
		 * @param   {boolean}   _visible 是否可见
		 */
		setVisible:function(_visible){
			this._visible = _visible;
		},
		/**
		 * 用于UI是否显示的探测
		 * @author  hite
		 * @version 1.0
		 * @date    2013-05-16
		 * @return  {boolean}   是否可见
		 */
		isVisible:function(){
			if(this._visible === true) {
				return true;
			}
			if(this.$domNode) {
				if(this.$domNode.hasClass('f-hidden')) {
					return false;
				}
				return !this.$domNode.hasClass("f-hide");
			}
			return false;
		},
		/**
		 * Placeholder占位函数
		 * 当组件需要在被添加到流中，拥有尺寸后需要做的操作
		 * 	写在这个借口之中。
		 * @private
		 * @author  hite
		 * @version 1.0
		 * @date    2013-05-16
		 */
		ondomshow:function(dom){
		},
		/**
		 * disable组件，使不响应click,mouseover等事件
		 * @author  hite
		 * @version 1.0
		 * @date    2013-05-16
		 */
		disable:function(){
			if(!this.isDisabled()) {
				this.getEle().addClass(this.getSettings().disabledCls);
				// 加上mask
				this.getEle().append(pMask);
			}
		},
		/**
		 * 取消disable组件，使恢复响应click,mouseover等事件
		 * @author  hite
		 * @version 1.0
		 * @date    2013-05-16
		 */
		enable:function(){
			if(this.isDisabled()) {
				this.getEle().removeClass(this.getSettings().disabledCls);
				this.getEle('>.disabledmask').remove();
			}
		},
		/**
		 * 检测是否处于disabled状态
		 * @author  hite
		 * @version 1.0
		 * @date    2013-05-16
		 * @return  {boolean}   是否是disabled状态
		 */
		isDisabled:function(){
			return this.getEle().hasClass(this.getSettings().disabledCls);
		}
	});
	
	shark.factory.define("Widget",Widget);

})();


(function(){
	/**
	 * @fileOverview 容器类组件父类,统一管理内部的组件，包括组件的遍历,转化为表单提交元素等
	 * @type {type}
	 */
	var Container = shark.factory.extend('Widget',/** @lends Container# */{
		
		// 如果是组件要重写init，则需要显式调用Component的initialize方法；或者调用widget的init
		/**
		 * Container类。可以包含其他组件，提供基本的add，insert方法。管理子节点，渲染和销毁的统筹。<br/>
		 * 一般不会自己调用，而是被其他具体的组件来继承
		 * <p style="color:red">其中最重要的初始化了widget的ele属性，保存当前节点；settings,当前组件的行为参数</p>
		 * @author  hite
		 * @version 1.0
		 * @constructor
		 * @constructs
		 * @extends {Widget}
		 * @date    2013-05-20
		 * @param   {object}   _wrap    包含子组件的容器 
		 * @param   {object}   _settings container的行为参数，包括<br/>
		 *                               {string}:wrapSelector 容器内部组件放组件的直接容器。
		 */
		init:function(_wrap, _data, _settings){
			var that = this;

			// children
			that.__children = [];
			/**
			 * @property {object} ele widget的ele属性
			 */
			that.setWrap(_wrap);
			// wrapSelector
			/**
			 * @property {object} settings 行为参数
			 */
			var data = $.extend({}, _data);
			var settings = $.extend({}, _settings);
			that.parent(data, settings);
			// container的新接口
		},
		setWrap : function(wrap){
			this.__wrap = $(wrap || '<div></div>');
		},
		getWrap : function(){
			return this.__wrap;
		},
		create:function(){
			return this.getWrap();
		},
        _insert:function(_func,_selector,_obj){
        	var that = this;
            var ele = _obj, root;
            if(shark.factory.isInstance(ele, 'Widget')){
                ele.setParent(that);
                that.__children.push(ele);
                ele = ele.getEle();
            } else {
            	// 如果不是组件，封装成组件加到children
            	// that.__children.push(new shark.MyWidget(ele));
            }
            if(_selector){
                root = that.getEle(_selector);
            }else{
                root = that.getEle();
            }
            //如果是tbody，则用tr td包一下
            if(root.prop('tagName') === 'TBODY') {
                // 加上tr和td
                root.append('<tr><td></td></tr>');
                root = root.children('tr:last').children('td');
            }
            root[_func||"append"](ele);
        },
		/**
		 * @name Container#positionFunc
		 * @description  Container的支持的接口，包括"after","before","append","prepend",用法同jquery接口
		 */
		after:function(_selector,_obj){
			this._insert("after",_selector,_obj);
		},
		before:function(_selector,_obj){
			this._insert("before",_selector,_obj);
		},
		append:function(_selector,_obj){
			this._insert("append",_selector,_obj);
		},
		prepend:function(_selector,_obj){
			this._insert("prepend",_selector,_obj);
		},
		/**
		 * 添加一个子节点，参数是组件，位置是直接添加都最后面。
		 * @author  hite
		 * @version 1.0
		 * @date    2013-05-20
		 * @param   {Widget}   _ctrl 子组件
		 * @param {string} _selector 选择器
		 */
		addChild:function(_ctrl, _selector){
			var _selector = _selector || this.getSettings().wrapSelector;
			this._insert("append", _selector, _ctrl);
		},
		/**
		 * 从children移除节点
		 * @param  {object} _ctrl description
		 * @return {object}       description
		 */
		removeChild : function(_ctrl){
			for(var i=0;i<this.__children.length;i++){
				if(this.__children[i] == _ctrl) {
					this.__children.splice(i,1);
					break;
				}
			}
		},
		/**
		 * 批量设置子组件
		 * @author  hite
		 * @version 1.0
		 * @date    2013-05-20
		 * @param   {array}   __children 组件的数组
		 * @param {string} _selector 选择器
		 */
		setChildren:function(__children, _selector){
			this.empty();

			var l = __children;
			for(var i=0;i<l.length;i++){
				this.addChild(l[i], _selector);
			}
			this.__children = __children;
		},
		/**
		 * 获取所有container的子节点，数组
		 * @author  hite
		 * @version 1.0
		 * @date    2013-05-20
		 * @return  {array}   所有组件的数组
		 */
		getChildren:function(){
			return this.__children;
		},
		/**
		 * 根据子组件在父容器里的顺序，获取组件实例
		 * @author  hite
		 * @version 1.0
		 * @date    2013-05-20
		 * @param   {number}   _index 顺序，从0开始
		 * @return  {Widget}             组件实例，如果没有找到返回undefined
		 * @throws {undefined} If 没有找到
		 */
		findChildByIndex:function(_index){
			return this.__children[_index];
		},
		/**
		 * 当dom被append到文档流中时,执行和组件相关的函数
		 * @author  hite
		 * @version 1.0
		 * @date    2013-02-19
		 * @protected
		 */
		ondomshow:function(){
			var children = this.getChildren();
			for(var i = 0,l= children.length;i<l;i++){
				children[i].ondomshow();
			}
			this.parent();
		},
		/**
		 * 清空所有子组件，销毁。为后续更新内容做准备，避免内存消耗。
		 * @author  hite
		 * @version 1.0
		 * @date    2013-05-20
		 */
		empty:function(){
			for(var i = 0,l=this.__children.length;i<l;i++){
				this.__children[i].destroy();
			}
			this.__children.length = 0;
		},

		destroy:function(){
			var that = this;
			that.empty();
			that.__wrap = null;
			// 如果外部有代理的事件，需要额外的处理
			that.parent();
		}
	});

	shark.factory.define("Container",Container);
})();


!function(){
	/**
	 * @fileOverview 将任意元素包装为组件，使拥有组件的行为。
	 */
	
	var MyWidget = shark.factory.extend("Widget",/** @lends MyWidget# */{
		/**
		 * 自定义组件类,适合任意结构的组件,
		 * 保持对widget的继承的同时，可以使用任意结构
		 * @extends {Widget}
		 * @constructor
		 * @constructs
		 * @param {object} _ele 被包装的元素
		 */
		init:function(_ele){
			var that = this;
			that.parent();
			if(typeof _ele == 'string') {
				_ele = '<div>' + _ele + '</div>';
			}
			that._ele = _ele;
		},
		create:function(){
			return $(this._ele);
		},
		destroy : function() {
			this._ele = null;
			this.parent();
		}
	});

	shark.factory.define("MyWidget",MyWidget);
}();



!function(){
	/**
	 * @fileOverview 占位符组件
	 * 为传入的dom增加placeholder功能
	 * @type {Object}
	 */
	var pDefaults = {position:"left,center"};
	var pInitedFlag = "jy_w_placeholder_inited";
	//
	var Placeholder = shark.factory.extend("Widget", /** @lends Placeholder# */{
		/**
		 * 	<b>必须和具体的input的组件联合使用,不能单独使用</b>
		 *	<b>必须要new 完毕之后要 调用show函数</b>
		 * 
		 * 输入框提示占位符。使用额外的span实现.
		 * 在支持placeholder的现代浏览器下，使用原生的placeholder行为，此时placeholder的行为因浏览器而已<br/>
		 * 不支持的使用js模拟，其中placeholder行为为：当获取点击之后，自动focus，并且placeholder样式变化，到输入框里有字符的时候，消失；<br/>
		 * 提示的停靠默认为左上，也可以居中，适合于textarea；
		 * <p style="color:red;">特别的，此组件并不干扰input标签的getvalue，无缝接入</p>
		 * <br/>只对不支持placeholder的浏览器实现此方法
		 * 
		 * @example new JY.Placehoder("input");
		 * @author  hite
		 * @version 1.0							
		 * @date    2012-4-28	
		 * @constructs
		 * @constructor
		 * @extends {Widget}
		 * @param   {object/string}  inputer 包含了input元素的dom
		 * @param   {string}    		_placeholder 默认提示语言
		 * @param   {object} _settings 控制placeholder显示的参数,比较重要的包括：
		 *                           {object}position: placeholder显示的位置，默认显示左中，
		 *                           		但是对于textaera来说应该是左上。
		 * @history  Modified at 2012-12-17：增加的_settings参数，用来控制位置等参数
		 * @return  {dom}             				dom对象
		 */
		init:function(inputer, _placeholder, _settings){
			var that = this;
			var data = {
				inputer : $(inputer),
				placeholder : _placeholder
			};
			var settings = $.extend(data,pDefaults,_settings);

			that.parent(data, settings);
			// 需要预显示
			that.show();
		},
		// 不能在create里调用get$Ele,BIG Attention;
		create:function(){
			var that = this;

			// 当已经初始化过之后，就不需要再执行，connect和绑定事件。
			// 处理多次bind的事件
			// 只需要执行,更新label的方法
			var txt = that.getData().placeholder;
			// create dom structure
			var placeholder = $('<span class="placeholder">' + txt + '</span>');
            // placeholder.text(txt);

			var inputer = that.getData().inputer;
			inputer.after(placeholder);
            // 用配置的数据

			return placeholder;
		},
		/**
		 * 修改当前组件的placeholder属性
		 * @author  hite
		 * @version 1.0
		 * @date    2012-07-20
		 * @param   {string}    _txt  新的placeholder文案
		 */
		updatePlaceholder:function(_txt){
			// 这里有个大陷阱,不能在create里调用get$Ele
			// create dom structure
			this._updatePlaceholder(_txt);
		},
		_updatePlaceholder:function(_txt){
			this.getEle().text(_txt);

			this._checkPlacehoder();
		},
        /**
         * 更新内容
         */
        setValue : function(_val){
            var input = this.getData().inputer;
            input.val(_val);
            this._checkPlacehoder(_val);
        },
        getValue : function(){
			return this.getData().inputer.val();
        },
        focus : function() {
        	this.getData().inputer.focus();
        },
        blur : function() {
        	this.getData().inputer.blur();
        },
        select : function() {
        	this.getData().inputer.select();
        },
		oncreate:function(){
			var that = this;
			var input = that.getData().inputer,
				placeholder = that.getEle();

			input.focus(function(event){
				that._checkPlacehoder();
				return true;
			}).keydown(function(event){
				that.hide();
				return true;
			}).keyup(function(event){
				that._checkPlacehoder();
				return true;
			}).blur(function(event){
				that._checkPlacehoder();
				return true;
			});
			//
			placeholder.click(function(event){
				input.focus();
				return true;
			});

			setTimeout(function() {
				that._checkPlacehoder();
			}, 50);
		},
		_checkPlacehoder : function(_val) {
			var that = this;
			if(that._updateTimeout) {
				clearTimeout(that._updateTimeout);
				that._updateTimeout = 0;
			}
			that._updateTimeout = setTimeout(function() {
				var val = typeof _val === 'undefined' ? that.getData().inputer.val() : _val;
				if(val.length > 0){
					that.hide();
				}else{
					that.show();
				}
			}, 100);
		},
		destroy : function() {
			var that = this;
			if(that._updateTimeout) {
				clearTimeout(that._updateTimeout);
			}
			that.parent();
		}
	});

	shark.factory.define("Placeholder",Placeholder);
}();



!function(){
	/**
	 * @fileOverview 弹窗的容器
	 * @type {type}
	 */
	// 动画 TODO
	// var pTmpl = '<div class="m-lst <%=this.animated?"ani-transform-y":""%> <%=this.clsName||""%>"></div>';
    var pTmpl = 
    	'<div class="m-menuwrap <%=this.animated?"":""%> <%=this.clsName||""%>">\
            <table>\
                <tbody>\
                </tbody>\
            </table>\
        </div>'; 
	var PopupWrap = shark.factory.extend("Container",/** @lends PopupWrap# */{
		/**
		 * 弹出层的容器，包含有动画和尺寸控制。
		 * 子节点可以是任意组件和节点。
		 * 其它接口详见@see Container
		 * @author  hite
		 * @version 1.0
		 * @date    2013-05-28
		 * @extends {Container}
		 * @constructor
		 * @param   {object}   _data 数据源,数据结构。<br/>
		 *                           {string}:clsName 自定义样式名
		 */
		init:function(_data){
			var that = this;
			var dom = $($.jqote(pTmpl, $.extend({animated:true},_data)));
			// 正文选择器
			that.parent(dom, {}, {wrapSelector : '>table>tbody'});
		}
	});

	shark.factory.define("PopupWrap",PopupWrap);
}();



//
//$Toolbar = shark.factory.clazz("Toolbar").getInstance();








!function(){

	/**
	 * @fileOverview 表单域的父类，提供和设置数据集，和值的接口，一般这些接口都在form中提交，组件位于表单当中
	 * @type {type}
	 * @class Field 
	 */
	var Field = shark.factory.extend("Widget",/** @lends Field# */{
		/**
		 * 暂时缺少响应的验证机制，
		 * @TODO 更丰富的验证类型
		 * 验证是否为合法输入。
		 */
		isValid:function(){
			return true;
		}
	});

	shark.factory.define("Field",Field);
}();


(function(){
    /**
     * @fileOverview 下划线容器。
     */
    // 下划线的容器

    var Line = shark.factory.extend("Widget",/** @lends Line# */{
        /**
         * 下划线的容器
         * @author  hero
         * @version 1.0
         * @constructs
         * @constructor
         * @extends {Widget}
         * @date    2013-05-80
         * @param   {widget}   element   加到element         
         */
        init:function(html, settings){
            this.html = html;
            this.settings = $.extend({clsName : 'linecnt1'}, settings);
            this.parent();
        },
        /**
         * 容器
         * @return {dom} 容器
         */
        create : function () {
            var line = $('<div></div>');
            line.addClass(this.settings.clsName);
            line.append(this.html);
            return line;
        },
        /** 
         * 默认把element加进去
         * @protected
         */
        oncreate:function(){
            var that = this;
            that.parent();
        }
    });
    //
    shark.factory.define("Line",Line);

    // 弹窗中用到的

    var LineCnt1 = function (html, settings) {
        var settings = $.extend({clsName : 'linecnt1'}, settings);
        return new shark.Line(html, settings);
    }
    shark.factory.define("LineCnt1",LineCnt1);

    var LineCnt2 = function (html, settings) {
        var settings = $.extend({clsName : 'linecnt2'}, settings);
        return new shark.Line(html, settings);
    }
    shark.factory.define("LineCnt2",LineCnt2);

    var LineTip1 = function (html, settings) {
        var settings = $.extend({clsName : 'linetip1'}, settings);
        return new shark.Line(html, settings);
    }
    shark.factory.define("LineTip1",LineTip1);

    var LineTip2 = function (html, settings) {
        var settings = $.extend({clsName : 'linetip2'}, settings);
        return new shark.Line(html, settings);
    }
    shark.factory.define("LineTip2",LineTip2);

    // 设置中用到
    var LineTxt = function(html, settings){
        var settings = $.extend({clsName : 'linetxt'}, settings);
        return new shark.Line(html, settings);
    }
    shark.factory.define("LineTxt",LineTxt);
    var FmtTip = function(html, settings){
        var settings = $.extend({clsName : 'fmt-tip'}, settings);
        return new shark.Line(html, settings);
    }
    shark.factory.define("FmtTip",FmtTip);

})();

(function(){
    var pTmpl = '<div class="m-hrz f-cb <%=this.clsName||""%>"></div>'
    /**
     * @fileOverview 横线容器。
     */
    // 下划线的容器

    var HrzLine = shark.factory.extend("Container",/** @lends HrzLine# */{
        /**
         * 下划线的容器
         * @author  hero
         * @version 1.0
         * @constructs
         * @constructor
         * @extends {Widget}
         * @date    2013-05-80
         * @param   {widget}   element   加到element         
         */
        init:function(data, settings){
            var data = $.extend({clsName : ''}, data);
            this.parent($($.jqote(pTmpl, data)), data, settings);
        },
        /** 
         * 默认把element加进去
         * @protected
         */
        oncreate:function(){
            var that = this;
            that.parent();
        }
    });
    //
    shark.factory.define("HrzLine",HrzLine);
})();

(function(){
    /**
     * @fileOverview 基础的按钮组件，包括使用现有dom节点和使用数据源创建标准按钮2种方式。
     */
    var pWrapTmpl = '<div class="m-wrap <%if(this.wrapClsName){%> <%=this.wrapClsName%><%}%>" title="<%=this.title||""%>" ></div>';
    /**
     * active的默认className
     * @const
     * @name PrimitiveButton#
     * @type {String}
     */
    var pActiveClass = "js-active", pUndergoing = "js-undergoing";
    var pFocusClass = "js-focus";
    /**
     * Hover的默认className
     * @const
     * @name PrimitiveButton#
     * @type {String}
     */
    var pHoverClass = "js-hover";

    var PrimitiveButton = shark.factory.extend("Widget",/** @lends PrimitiveButton# */{
        /**
         * 原始的button，需要使用页面本身存在的dom节点创建。区别于和数据源新建的组件<br/>
         * button包装类，（dds=disabled double submit）
         * 为所有需要防止多次点击和二次提交，增加预防处理.
         * <br/>在点击了具有dds属性后有默认遮罩，被点击的按钮也有相应的样式反馈，表明正在提交
         *     默认的需要防止二次提交的submit按钮；有dds属性的input,button,a标签
         * <p style="color:red;font-weight:bold;">
         *  _settings参数中的clsPrefix是个非常非常重要的数据，
         *  用来定制不同样式按钮的click，hover等事件的样式
         * </p>
         * @example
         *  var newBtn = new JY.PrimitiveButton('<a href="javascript:;" hidefocus="true">新建分组</a>',{
                onclick:function(event){
                    newBtn.hide();
                    newGroupBtn.show();
                    newGroupIpt.trigger("focus");
                    return true;
                }
            });
         * @author  hite
         * @version 1.0
         * @constructs
         * @constructor
         * @extends {Widget}
         * @date    2013-05-80
         * @param   {html/dom/jqueryObject}   _button   要赋予button行为的dom元素
         * 
         * @param   {object}   _settings 行为参数，包括<br/>
         *                               {function}:onclick button的onclick事件<br/>
         *                               {string}:clsPrefix 对不同的按钮允许在对外层增加一个className来定制此组件。<br/>
         */
        init:function(_button, _data, _settings){
            /**
             * 当前保有事件的dom元素
             * @property {object} ele [description]
             */
            var data = $.extend({
                element : _button
            }, _data);
            var settings = $.extend({
                wrapTmpl : pWrapTmpl,
                // 默认是第一个子节点，因为有wrap
                wrapSelector : '>:first',
                onclick:function(){
                    return true;
                }
            },_settings);

            this.parent(data, settings);
        },
        create:function(){
            var element = this.getData().element;
            this.getData().element = null;
            if(this.getSettings().wrapTmpl) {
                // 加上wrap
                var wrap = $($.jqote(this.getSettings().wrapTmpl, this.getData()));
                wrap.append(element);
                return  wrap;
            }
            return element;
        },
        _getButton : function(){
            if(!this.__button) {
                if(this.getSettings().wrapTmpl) {
                    this.__button = this.getEle(this.getSettings().wrapSelector);
                } else {
                    this.__button = this.getEle();
                }
            }
            return this.__button;
        },
        /**
         * 实际宽度
         */
        getWidth : function(){
            return this.getEle(this.getSettings().wrapSelector).get(0).clientWidth;
        },
        /** 
         * 默认为dds属性的所有元素增加点击事件 ,被点击的按钮也有相应的样式反馈，表明正在提交
         * 组件初始化，应该只需要为特定区域实例化，不用每次都为整个文档更新
         * 目前各个模块的切换都是局部的dom刷新
         * @protected
         */
        oncreate:function(){
            var that = this;
            that.parent();
            var settings = that.getSettings();
            var data = that.getData();
            var domNode = that._getButton();
            //
            domNode.click(function(event){
                // 修复点击之后，回车多次出访click的问题。
                //@Attention 暂时回退
                // window.setTimeout(function(){
                //  domNode.blur();
                // },0);
                that._toggleSelected();

                return settings.onclick(event,that);
            });
            //
            domNode.bind("mousedown mouseup mouseout",function(event){
                var active = pActiveClass;
                if(settings.clsPrefix){
                    active = settings.clsPrefix + "-active";
                }
                if(event.type === "mouseout"){
                    $(this).removeClass(active);
                }else{
                    $(this).toggleClass(active);
                }
                return true;
            });
            // 增加键盘操作
            domNode.bind("keydown", function(e) {
                var code = e.keyCode;
                // 13 = 回车, 
                if (code === 13) {
                    if(settings.accessType === "mousedown"){
                        domNode.mousedown();
                    }else{
                        domNode.click();
                    }
                }
            });
            //
            if(settings.clsPrefix){
                domNode.addClass(settings.clsPrefix);
            }
            // 选中状态
            if(data.selectedClsName) {
                if(data.selected) {
                    domNode.addClass(data.selectedClsName);
                }
            }
            // 统计
            that.analytics(domNode, data.log);
        },
        /**
         * 反选选中状态
         */
        _toggleSelected : function() {
            var that = this;
            var data = that.getData();

            if(data.selectedClsName) {
                var domNode = that._getButton();
                if(data.selected) {
                    domNode.removeClass(data.selectedClsName);
                } else {
                    domNode.addClass(data.selectedClsName);
                }

                data.selected = !data.selected;
            }
        },
        /**
         * 一直处于active状态，不会去掉active
         * @param  {boolean} isActive 是否处于active
         * @return {void}        
         */
        active: function(isActive){
            var that = this;
            this.__active = isActive;
            var domNode = that._getButton();
            var active = pFocusClass;
            if(that.getSettings().clsPrefix){
                active = that.getSettings().clsPrefix + "-focus";
            }
            if(isActive){
                domNode.addClass(active);
            }else{
                domNode.removeClass(active);
            }
        },
        /**
         * 是否处于active状态
         * @return {Boolean} 
         */
        isActive: function(){
            return !!this.__active;
        },
        /**
         * 聚焦
         * @return {void} 
         */
        focus : function(){
            this._getButton().focus();
        },
        destroy : function() {
            this.__button = null;
            this.parent();
        }
    });
    //
    shark.factory.define("PrimitiveButton",PrimitiveButton);

    //
    // 通用普通按钮的模版
    var pBaseButtonTmpl = '<a href="javascript:;" hidefocus="true" class="<%=this.baseClsName||"w-button"%> f-ribs <%=this.clsName||""%>">\
                            <%if(this.leftIcon){%><span class="<%=this.leftIcon%>"></span><%}%>\
                            <span class="txt js-txt"><%=this.name%></span>\
                            <%if(this.rightIcon){%><span class="<%=this.rightIcon%>"></span><%}%>\
                    </a>';

    // 纯图标链接型按钮
    var pIconLinkTmpl = '<a href="javascript:;" hidefocus="true" class="w-clk w-clk-onlyicon f-ribs <%=this.clsName||""%>">\
                            <span class="<%=this.leftIcon%> js-icon-txt"><%=this.name || ""%></span>\
                        </a>';

    // 普通链接，没有hover的边框等
    // 纯图标
    var pIconTmpl = '<a href="javascript:;" hidefocus="true" class="f-ribs <%=this.leftIcon%>"></a>';

    // 头像
    var pAvatarTmpl = '<span class="w-avatar <%=this.clsName||""%>"><img src="<%=this.img%>" alt="" class="img"></span>';

    // 默认的组件数据
    var pDefaultsData = {
        clsName:"",
        baseClsName : "w-button",
        icoClass:""
    };
    // 默认选择器,空的时候，就是组件本身
    var Button = shark.factory.extend("PrimitiveButton",/** @lends Button# */{
        /**
         * 最普通的按钮.
         * @author  hite
         * @version 1.0
         * @date    2013-05-80
         * @constructor
         * @constructs
         * @example
         * @extends {PrimitiveButton}
         * @param   {object}   _data     数据源,数据格式见<br/>
         *                               {string}:name 按钮的文案<br/>
         *                               {string}:icoClass 用来定制按钮的多样化图标<br/>
         *                               {string}:className 自定义button样式
         *                               {boolean}:underLine 是否含有下划线
         *                               {boolean}:selected 是否有选中状态
         *                               {boolean}:selectable 是否支持选中状态
         * @param   {object}   _settings 组件行为参数
         *                               {function}:onclick button的onclick事件<br/>
         *                               {string}:tmpl button的模板，容许自定义，但是需要对组件有足够的了解<br/>
         *                               {string}:clsPrefix 对不同的按钮允许在对外层增加一个className来定制此组件。默认为w-button<br/>
         */
        init:function(_data,_settings){
            var that = this;
            // pDefaults不能改变
            var data = $.extend({},pDefaultsData, _data);
            var settings = $.extend({}, {
                clsPrefix :"w-button",
                tmpl : pBaseButtonTmpl,
                cssStyleSelector : {
                    // 字体大小
                    "size" : '.js-txt',
                    // 字体颜色
                    "color" : '.js-txt',
                    // 组件的大小
                    "wrapsize" : ''
                }
            }, _settings);
            // 自动补全icon前缀
            if(data.icoClass) {
                data.icoClass = shark.cssHelper.getPrefix(data.icoClass) + ' ' + data.icoClass;
            } 
            if(data.leftIcon) {
                data.leftIcon = shark.cssHelper.getPrefix(data.leftIcon) + ' ' + data.leftIcon;
            } else {
                // 没有的时候，左侧icon使用icoClass
                data.leftIcon = data.icoClass;
            }

            if(data.rightIcon) {
                data.rightIcon = shark.cssHelper.getPrefix(data.rightIcon) + ' ' + data.rightIcon;
            }

            var html = $($.jqote(settings.tmpl, data));
            this.parent(html, data, settings);
        },
        /**
         * 自动测试接口，目前看起来还不是很有用。
         * @author  hite
         * @version 1.0
         * @date    2013-05-80
         */
        autoTest:function(){
            var val = this.getValue();
            return val.name;
        },
        /**
         * 设置 按钮显示的文案
         * @author  hite
         * @version 1.0
         * @date    2013-05-20
         * @param   {string}   _txt 文案，可接受html字符串
         */
        setText:function(_txt){
            this.getEle(".js-txt").html(_txt);
        },
        getText:function(){
            return this.getEle(".js-txt").html();
        },
        /**
         * 设置 按钮显示的文案
         * @author  hite
         * @version 1.0
         * @date    2013-05-20
         * @param   {string}   _txt 文案，可接受html字符串
         */
        setIconText:function(_txt){
            this.getEle(".js-icon-txt").html(_txt);
        },
        getIconText:function(){
            return this.getEle(".js-icon-txt").html();
        },
        /**
         * 获取当前按钮的数据源
         * @author  hite
         * @version 1.0
         * @date    2013-05-20
         * @return  {object}   生成组件的数据源
         */
        getValue:function(){
            return this.getData();
        },
        destroy:function(){
            if(this.__hoverTip){
                this.__hoverTip.destroy();
                this.__hoverTip = null;
                this.setTip = null;
                this.getTip = null;
            }
            this.parent();
        }
    });
    shark.factory.define("Button",Button);
    /**
     * Button的扩展。确定类按钮，颜色较深，多见于弹窗
     * @class OKButton
     * @see Button
     * @author  hite
     * @version 1.0
     * @date    2013-05-20
     * @return  {Button}             OKButton组件对象
     */
    var okButton = function(_data,_settings){
        return new Button($.extend({clsName : 'w-button-submit'},_data),$.extend({
            clsPrefix:"w-button-submit"
        }, _settings));
    };
    shark.factory.define("OKButton",okButton);
    /**
     * Button的扩展。取消类按钮，颜色较浅，多见于弹窗
     * @class CancelButton
     * @see Button
     * @author  hite
     * @version 1.0
     * @date    2013-05-20
     * @return  {Button}             CancelButton组件对象
     */
    var cancelButton = function(_data,_settings){
        return new Button($.extend({clsName : 'w-button-cancel'},_data),$.extend({
            clsPrefix:"w-button-cancel"
        }, _settings));
    };
    shark.factory.define("CancelButton",cancelButton);
    /**
     * Button的扩展。右侧有三角图标的按钮，多用于弹出多级菜单
     * @class SplitButton
     * @see Button
     * @author  hite
     * @version 1.0
     * @date    2013-05-20
     * @return  {Button}             SplitButton组件对象
     */
    var splitButton = function(_data,_settings){
        // 固定右边按钮
        var data = $.extend({rightIcon : 'icon-arrow-down'}, _data);
        var settings = $.extend({},_settings);
        return new Button(data, settings);
    };
    shark.factory.define("SplitButton",splitButton);
    /**
     * 纯icon的按钮
     * @class IconButton
     */
    var iconButton = function(_data, _settings){
        var data = $.extend({clsName : 'w-clk-icon'}, _data);
        var settings = $.extend({clsPrefix:'w-clk-icon'},_settings);
        return new Button(data, settings);
    };
    shark.factory.define("IconButton",iconButton);
    /**
     * 纯链接的按钮
     * @class LinkButton
     */
    var linkButton = function(_data,_settings){
        var data = $.extend({baseClsName : 'w-clk'}, _data);
        var settings = $.extend({clsPrefix:'w-clk'},_settings);
        return new Button(data, settings);
    };
    shark.factory.define("LinkButton",linkButton);
    /**
     * 纯图标链接的按钮
     * @class LinkButton
     */
    var IconLinkButton = function(_data,_settings){
        return new Button(_data, $.extend({clsPrefix:'w-clk-onlyicon', tmpl:pIconLinkTmpl},_settings));
    };
    shark.factory.define("IconLinkButton",IconLinkButton);

    /**
     * Button的扩展。背景色很重，视为强调的按钮。多见于发送邮件之类的主要操作按钮
     * @class StrongButton
     * @see Button
     * @author  hite
     * @version 1.0
     * @date    2013-05-20
     * @return  {Button}             StrongButton组件对象
     */
    var strongButton = function(_data,_settings){
        return new Button($.extend({},_data), $.extend({clsPrefix:"w-button-emp"},_settings));
    };
    shark.factory.define("StrongButton",strongButton);
    /**
     * Button的扩展。为表单元素的样式，右侧有三角图标,链接的形式
     * @class SelectorLinkButton
     * @see Button
     * @author  hite
     * @version 1.0
     * @date    2013-05-20
     * @return  {Button}             SelectorButton组件对象
     */
    var selectorLinkButton = function(_data,_settings){
        var data = $.extend({baseClsName : 'w-clk', rightIcon : 'icon-arrow-down'}, _data);
        var settings = $.extend({clsPrefix:'w-clk-select'},_settings);

        return new Button(data, settings);
    };
    shark.factory.define("SelectorLinkButton",selectorLinkButton);

    /**
     * Button的扩展。为表单元素的样式，右侧有三角图标。多见于触发下拉菜单的按钮.
     * @class SelectorButton
     * @see Button
     * @author  hite
     * @version 1.0
     * @date    2013-05-20
     * @return  {Button}             SelectorButton组件对象
     */
    var selectorButton = function(_data,_settings){
        var data = $.extend({rightIcon : 'icon-arrow-down'}, _data);
        var settings = $.extend({clsPrefix:'w-button-select'},_settings);

        return new Button(data, settings);
    };
    shark.factory.define("SelectorButton",selectorButton);

    /**
     * Avatar 头像.
     * @class SelectorButton
     * @see Button
     * @author  hite
     * @version 1.0
     * @date    2013-05-20
     * @return  {Button}             SelectorButton组件对象
     */
    var avatar = function(_data,_settings){
        return new Button($.extend({}, _data), $.extend({clsPrefix : 'w-avatar', tmpl:pAvatarTmpl},_settings));
    };
    shark.factory.define("Avatar",avatar);

    /**
     * 普通的链接，没有hover效果
     * @param {object} _data     [description]
     * @param {object} _settings [description]
     */
    var Link = function(_data,_settings){
        var data = $.extend({baseClsName : 'w-linkicon'}, _data);
        var settings = $.extend({clsPrefix:'w-linkicon'},_settings);
        return new Button(data, settings);
    };
    shark.factory.define("Link",Link);

    /**
     * 纯icon，没有hover效果
     * @deprecated 使用shark.Link 替代，待删除
     * @class Icon
     */
    var icon = function(_data, _settings){
        return new Link(_data, _settings);
    };
    shark.factory.define("Icon",icon);

})();

(function(){

    // 工具栏中的已经设置后的按钮
    var pHasSetTmpl = '<div class="w-hasset js-hasset">\
        <span class="text js-txt"><%=this.name || ""%></span>\
        <span class="w-icon icon-selected"></span>\
        <a href="javascript:;" hidefocus="true" class="w-icon icon-close js-close" title="点击关闭"></a>\
    </div>';
    var HasSet = shark.factory.extend("Button",/** @lends Button# */{
        init:function(_data,_settings){
            var that = this;

            that.parent(_data, $.extend({tmpl:pHasSetTmpl, clsPrefix : 'w-hasset'},_settings));
        },
        oncreate : function(){
            var that = this;
            that.parent();
            that.getEle('.js-close').bind('click', function (evt) {
                // 点击click
                that.getSettings().onclose();
                that.__hoverTip.close();
            });

            that.__hoverTip = new shark.HoverMenu(that.getEle(), function(){
                var PPnl = new shark.PPnl({clsName : 'm-ppnl-hovertips m-ppnl-hovertips-singleline'});
                PPnl.addChild(new shark.Text({html : that.getTip()}));
                return PPnl;
            }, {direction:"V"});
        },
        setTip : function(tip){
            // 设置tip
            this.getData().tip = tip;
        },
        getTip : function(){
            // 设置tip
            return this.getData().tip;
        },
        destroy : function(){
            this.__hoverTip.destroy();
            this.parent();
        }

    });


    shark.factory.define("HasSet",HasSet);
})();

!function(){

    var PrimitiveTightInput = shark.factory.extend("Widget", /**@lends PrimitiveTightInput# */{
        /**
         * 使用已有的dom生成，tightInput组件；
         * @author  hero
         * @version 1.0
         * @date    2012-4-18
         * @constructor
         * @extends {Field}
         * @param   {object}    data 数据
         *                          {string} label 左侧的label
         *                          {string} clsName 特殊样式,加载m-ipt上
         *                          {string} wrapClsName 加载wrap上的样式
         *                          {boolean} fixWidth 是否水平排列，固定宽度，默认不固定
         *                          {string} tmpl 模版
         * @param   {object}    settings 行为参数
         */
        init:function(data, settings){
            var that = this;
            var data  = $.extend({label : '', hasColon : true, fixWidth : false},data);
            var settings = $.extend({
                // 子节点
                wrapSelector : '>:first'
            },settings);

            if(!data.tmpl) {
                throw new Error('PrimitiveTightInput.init data.tmpl required');
            }
            
            that.parent(data, settings);
        },
        /**
         * dom创建
         * 
         * @return {Dom}        dom对象
         */
        create:function(){
            var that = this;

            var dom = $($.jqote(that.getData().tmpl, that.getData()));

            if(dom.hasClass('js-error-wrap')) {
                that._errorWrap = dom;
            } else {
                that._errorWrap = dom.find('.js-error-wrap');
            }
            return dom;
        },
        /**
         * 添加子节点
         * @param  {ele} ele description
         * @return {object}     description
         */
        appendChild : function (ele) {
            this.getEle('.js-ipt-inner').append(ele);
        },
        /**
         * 事件绑定
         */
        oncreate : function(){
            // 错误信息相关的
            this.parent();
        },
        /**
         * 显示tip
         * @param  {string} txt 显示tip
         * @return {object}     description
         */
        showError : function (txt) {
            var that = this;
            // 显示错误信息
            that._errorWrap.addClass('m-wrap-err f-ani-flash');
            that.getEle('.js-errorTip').html(txt);
        },
        /**
         * 隐藏tip
         * @param  {string} txt 显示tip
         * @return {object}     description
         */
        hideError : function () {
            var that = this;
            // 隐藏错误信息
            that._errorWrap.removeClass('m-wrap-err f-ani-flash');
            
            that.getEle('.js-errorTip').html('');
        },
        destroy : function(){
            var that = this;
            that._errorWrap = null;
            that.parent();
        }
    });

    shark.factory.define("PrimitiveTightInput",PrimitiveTightInput);
}();

!function(){

    /**
     * @fileOverview 
     * 有label和操作组件，错误提示的组件
     * 标题和输入框在一起，在一个输入框内部
     * error时候，m-wrap 上加 m-wrap-err，同时show js-errorTip
     */
    var pInputContainerTmpl = '<div class="m-wrap <%if(this.wrapClsName){%><%=this.wrapClsName%><%}%> js-error-wrap">\
            <div class="m-ipt<%if(this.icoClass){%> m-ipt-act<%}%><%if(this.clsName){%> <%=this.clsName%><%}%> f-cb">\
                <%if(this.label){%><div class="ipt-label"><%=this.label%></div><%}%>\
                <div class="ipt-value js-ipt-inner">\
                    <div class="ipt-tip js-errorTip"></div>\
                </div>\
                <%if(this.icoClass){%><div class="ipt-action js-ipt-action">\
                    <a href="javascript:;" hidefocus="true" class="<%=this.icoClass%>"></a>\
                </div><%}%>\
            </div>\
        </div>';
        // 含有button的input而且控制按钮的disabled状态
    var pInputButtonContainerTmpl = 
    '<div class="m-hrz f-cb">\
        <div class="m-wrap <%if(this.wrapClsName){%><%=this.wrapClsName%><%}%> js-error-wrap">\
            <div class="m-ipt <%if(this.clsName){%><%=this.clsName%><%}%> f-cb">\
                <%if(this.label){%><div class="ipt-label"><%=this.label%></div><%}%>\
                <div class="ipt-value js-ipt-inner">\
                    <div class="ipt-tip js-errorTip"></div>\
                </div>\
            </div>\
        </div>\
    </div>';
    var pInputTmpl = '<div class="w-ipt "><input type="<%=this.type%>" class="value js-input" <%if(this.title){%>title="<%=this.title%>"<%}%>>\
                    </div>';
    var pTextAreaTmpl = '<div class="w-textarea">\
        <textarea class="value js-input"  <%if(this.title){%>title="<%=this.title%>"<%}%>></textarea>\
        </div>';
    var TightInput = shark.factory.extend("PrimitiveTightInput", /**@lends TightInput# */{
        /**
         * 使用数据新建TightInput组件
         * @author  hite
         * @version 1.0
         * @date    2013-05-28
         * @constructs
         * @constructor
         * @extends {PrimitiveTightInput}
         * 
         * @param   {object}   data   数据源。<br/>
         *                                  {string}:label 输入框前面的提示问题 <br/>
         *                                  {string}:placeholder 输入框里的placeholder<br/>
         *                                  {string}:title 鼠标悬浮在input上的title<br/>
         *                                  {string}:type input的类型，默认是text，支持password等。<br/>
         *                                  {string}:value 初始值，默认为空<br/>
         *                                  {string}:icoClass 右侧的操作图标
         *                                  {string}:okButton 确定按钮 name,点击的时候执行onenter
         *                                  {string}:okButtonClsName 确定按钮的样式
         *                                  {string}:cancelButton 取消按钮 name,点击的时候执行destroy
         *                                  其他详见 PrimitiveTightInput
         * @param   {object}   settings 参数.
         *                              {boolean} enterKeySupported 支持enter
         *                              {function} onblur  失去焦点
         *                              {function} onenter 按下Enter键的时候
         *                              {function} onfocus 聚焦input
         *                              {function} onkeyup input的keyup
         *                              {function} oniconclick icon的click
         *                              {function} oncancel 取消的时候
         */
        init:function(_data, _settings){
            var that = this;
            var settings = $.extend({
                enterKeySupported : true,
                onblur : function (value) {},
                oncancel :function (value) {}}, {
                    cssStyleSelector : {
                        // 字体大小
                        "size" : '.js-input,.placeholder',
                        // 字体颜色
                        "color" : '.js-input',
                        // 组件的大小
                        "wrapsize" : ''
                    }
                }, _settings);
            var data = $.extend({label : '', title : '', value : '', type : 'text', okButtonClsName : 'w-button-emp'},_data);

            if(data.icoClass) {
                data.icoClass = shark.cssHelper.getPrefix(data.icoClass) + ' ' + data.icoClass;
            } 
            // 有按钮
            if(data.okButton || data.cancelButton) {
                data.tmpl = pInputButtonContainerTmpl;
                settings.wrapSelector = '>:first>:first';
                settings.cssStyleSelector.wrapsize = '>:first';
            } else {
                data.tmpl = pInputContainerTmpl;
            }
            
            that.parent(data, settings);
        },
        create:function(){
            var that = this;
            var data = that.getData();
            var settings = that.getSettings();

            var domNode = that.parent();
            var pTmpl = pInputTmpl;
            if(data.inputType === 'textarea'){
                pTmpl = pTextAreaTmpl;
            }
            var html = $.jqote(pTmpl, data)
            // 添加到父容器中，并且把父类的容器作为自己的容器
            domNode.find('.js-ipt-inner').prepend($(html));

            // 跟着input的wrapsize一起走
            var wrapsize = '';
            if(data.cssStyle && data.cssStyle.wrapsize) {
                wrapsize = data.cssStyle.wrapsize;
            }
            if(data.okButton) {
                that.okButton = new shark.Button({
                    cssStyle : {
                        wrapsize : wrapsize
                    },
                    clsName : data.okButtonClsName,
                    name: data.okButton
                },{
                    onclick: function(){
                        settings.onenter(that._input.val(), that);   
                    }
                });
                // 没有内容的时候，禁用
                if(!data.value) {
                    that.okButton.disable();    
                }
                
                domNode.append(that.okButton.getEle());
            }
            if(data.cancelButton) {
                that.cancelButton = new shark.Button({
                    cssStyle : {
                        wrapsize : wrapsize
                    },
                    name: data.cancelButton
                },{
                    onclick: function(){
                        settings.oncancel(that._input.val(), that);   
                    }
                });
                // 默认禁用
                domNode.append(that.cancelButton.getEle());
            }
            that._input = domNode.find(".js-input");

            var placeholder = data.placeholder;
            if(placeholder) {
                that._placeholder = new shark.Placeholder(that._input, placeholder);
            }

            // 处理
            if(data.value) {
                if(that._placeholder){
                    that._placeholder.setValue(data.value);
                } else {
                    that._input.val(data.value);
                }

                if(that.okButton) {
                    if(data.value != '') {
                        that.okButton.enable();
                    } else {
                        that.okButton.disable();
                    }
                }
            }
            return domNode;
        },
        getActionIcon : function(){
            return this.getEle('.js-ipt-action a');
        },
        oncreate : function(){
            var that = this;
            that.parent();
            var data = that.getData();
            var settings = that.getSettings();

            var domNode = that.getEle();

            // 绑定error选择
            that._input.bind('keyup', function(evt){
                // 修改的时候，隐藏errror
                that.hideError();
                var val = that._input.val();
                if(settings.onkeyup){
                    settings.onkeyup(val, that);
                }
                if(data.inputType != 'textarea' && evt.keyCode == 13 && settings.onenter && settings.enterKeySupported) {
                    // 触发回车的效果
                    settings.onenter(val, that);
                }
                if(that.okButton) {
                    if(val != '') {
                        that.okButton.enable();
                    } else {
                        that.okButton.disable();
                    }
                }
            });
            if(settings.onfocus){
                that._input.bind('focus', function(evt){
                    // 修改的时候，隐藏errror
                    settings.onfocus(that._input.val(), that);
                });
            }
            if(settings.onblur){
                that._input.bind('blur', function (evt) {
                    settings.onblur(that._input.val(), that);
                });
            }
        },
        /**
         * focus
         * @author  Len
         * @version 1.0
         * @date    2013-05-28
         * @return  {void}
         */
        focus: function(){
            var that = this;
            setTimeout(function(){
                if(that._placeholder){
                    that._placeholder.focus();
                } else {
                    that._input.focus();
                }
            }, 50);
        },
        blur : function() {
            var that = this;
            if(that._placeholder){
                that._placeholder.blur();
            } else {
                that._input.blur();
            }

        },
        /**
         * 全选input
         * @author  Len
         * @version 1.0
         * @date    2013-05-28
         * @return  {void}
         */
        select: function(){
            var that = this;
            setTimeout(function(){
                if(that._placeholder){
                    that._placeholder.select();
                } else {
                    that._input.select();
                }
            }, 50);
            
        },
        /**
         * 获取input的value值
         * @author  hite
         * @version 1.0
         * @date    2013-05-28
         * @return  {string}   input的value值
         */
        getValue:function(){
            var that = this;
            if(that._placeholder){
                return that._placeholder.getValue();
            } else {
                return that._input.val();
            }
        },
        disable : function(){
            var that = this;
            that.parent();
        },
        enable : function(){
            var that = this;
            that.parent();
        },
        /**
         * 设置input的value值
         * @author  hite
         * @version 1.0
         * @date    2013-05-28
         * @param   {string}   _value 需要设置input的value值
         * 
         */
        setValue:function(_value){
            var that = this;
            if(that._placeholder){
                that._placeholder.setValue(_value);
            } else {
                that._input.val(_value);
            }
            // 修改的时候，隐藏errror
            that.hideError();
            if(that.getSettings().onkeyup){
                that.getSettings().onkeyup(_value, that);
            }

            if(that.okButton) {
                if(_value != '') {
                    that.okButton.enable();
                } else {
                    that.okButton.disable();
                }
            }
        },
        updatePlaceholder: function(_placeholder){
            var that = this;
            that._placeholder.updatePlaceholder(_placeholder);
        },
        getInput : function(){
            return this._input;
        },
        destroy:function(){
            var that = this;
            
            if(that.okButton) {
                that.okButton.destroy();
                that.okButton = null;
            }

            if(that.cancelButton) {
                that.cancelButton.destroy();
                that.cancelButton = null;
            }

            if(that._placeholder) {
                that._placeholder.destroy();
                that._placeholder = null;
            }
            that._input = null;
            that.parent();
        }
    });

    shark.factory.define("TightInput",TightInput);

}();


!function(){

    var EditSelector = shark.factory.extend("Container", /**@lends EditSelector# */{
        /**
         * 使用数据新建EditSelector组件
         * @author  hero
         * @version 1.0
         * @date    2013-10-20
         * @constructs
         * @extends {PrimitiveTightInput}
         * 
         * @param   {object}   _data   数据源。<br/>
         *                                  其他参数参见selector
         *                                  其他详见 PrimitiveTightInput
         *                                  {string}:clsName
         * @param   {object}   _settings 参数.
         *                               onblur : function
         *                               
         */
        init:function(data, settings){
            var that = this;
            var defaultSettings = {
                onchange : function(){},
                onclick : function(){},
                ontriggerclick: function(){}
            };
            // @modifyed by zhuxiaohua 2014/02/26 添加ontriggerclick的支持
            var settings = $.extend(defaultSettings, settings);
            // 默认值
            var data = $.extend({},data);
            that._hrz = new shark.HrzLine();
            that.parent(that._hrz.getEle(), data, settings);
        },
        oncreate : function(){
            var that = this;
            that.parent();
            var data = that.getData();
            var settings = that.getSettings();

            var selectData = $.extend({}, data);
            selectData.extraChildrenGenerator = function(){
                var menulist = new shark.MenuList({
                    list:[{
                        name : '自定义',
                        value : '自定义'
                    }]
                },{
                    onclick : function(evt, ctrl){
                        // 到编辑页面
                        that._inputer.show();
                        if(that._inputer.getValue() == '') {
                            that._inputer.setValue('自定义');
                        }
                        // 应该不是这个自定义了
                        that._inputer.select();

                        that._selector.close();
                        that._selector2.close();
                        that._dropmenu.close();
                        // 自定义的时候，selector2取消选中项
                        that._selector2.setValue({});
                        that._selector.hide();
                        that._dropmenu.hide();

                        settings.onclick(evt, ctrl);
                        return true;
                    }
                });
                return menulist;
            };

            that._selector = new shark.Selector(selectData, settings);

            var inputData = $.extend({icoClass:'icon-arrow-down'}, data);
            that._inputer = new shark.TightInput(inputData, settings);
            that.addChild(that._selector);
            that.addChild(that._inputer);

            var trigger = that._inputer.getActionIcon();
            var settings2 = $.extend({}, settings, {trigger : trigger});
            var onchange = settings2.onchange;
            settings2.onchange = function(evt, ctrl){
                var name = ctrl.getValue().name;
                that._selector.show();
                // 选中了之后，设置selector的值，同步一下
                that._selector.setValue(ctrl.getValue());
                that._inputer.hide();
                onchange(evt, ctrl);
            };

            var selectData2 = $.extend({}, {docker : that._inputer.getEle()}, selectData);

            // docker，修改定位元素
            that._selector2 = new shark.Selector(selectData2, settings2);
            that._selector2.show();

            

            // 加一个自定义的时候的dropmenu,只负责切换到 that._selector 显示，或者到 that._inputer 编辑
            that._trigger3 = new shark.SelectorLinkButton({name : data.value, cssStyle : data.btnCssStyle});
            var selectData3 = $.extend({}, selectData);
            var settings3 = {trigger : that._trigger3.getEle()};
            settings3.onclick = function(evt, ctrl){
                var value = ctrl.getData();

                that._selector.show();
                that._selector.setValue(value);

                // 关闭自己
                that._dropmenu.close();
                that._dropmenu.hide();
                onchange(evt, ctrl);
            };

            that._dropmenu = new shark.DropMenu(selectData3, settings3);

            that.addChild(that._dropmenu);

            that._dropmenu.show();

            // that._inputer.hide();
            // 有值，直接进入编辑状态，没有的时候选择


            // @modifyec by zhuxiaohua 2014/02/26
            // 添加按钮的点击响应，通讯录用
            trigger.click(function(evt){
                settings.ontriggerclick(evt);
            });
            that._selector.getTrigger()._getButton().click(function(evt){
                settings.ontriggerclick(evt);
            });
            that._trigger3._getButton().click(function(evt){
                settings.ontriggerclick(evt);
            });


            if(data.value) {
                if(data.isValueEdit) {
                    that._dropmenu.hide();
                    that._selector.hide();
                } else {
                    that._dropmenu.show();
                    that._selector.hide();
                    that._inputer.hide();
                }
            } else {
                that._selector.show();
                that._inputer.hide();
                that._dropmenu.hide();
            }
        },
        destroy:function(){
            var that = this;
            if(that._selector) {
                that._selector.destroy();
                that._selector = null;
            }
            if(that._selector2) {
                that._selector2.destroy();
                that._selector2 = null;
            }
            if(that._dropmenu) {
                that._dropmenu.destroy();
                that._dropmenu = null;
            }
            if(that._inputer) {
                that._inputer.destroy();
                that._inputer = null;
            }
            if(that._trigger3) {
                that._trigger3.destroy();
                that._trigger3 = null;
            }
            if(that._hrz) {
                that._hrz.destroy();
                that._hrz = null;
            }
            that.parent();
        },
        getInput : function(){
            return this._inputer;
        },
        /**
         * 获取当前的值
         * 如果input显示的，返回input的值，或者返回select显示的值
         * @return {object} description
         */
        getValue : function () {
            var that = this;
            // 可编辑状态
            if(that._inputer.isVisible()) {
                return that._inputer.getValue();
            } else {
                return that._selector.getValue().value;
            }
        },
        /**
         * 激活当前组件
         * @param {boolean} isActive 是否激活
         * @return {object} description
         */
        active : function(isActive) {
            this._selector.getTrigger().active(isActive);
            this._trigger3.active(isActive);
        },
        /**
         * 获取当前的ui类型
         * @return {object} description
         */
        getMode : function() {
            var that = this;
            if(that._inputer.isVisible()) {
                return 'input';
            } else {
                return 'selector';
            }
        }
    });
    shark.factory.define("EditSelector",EditSelector);
}();

!function(){
    /**
     * @fileOverview 下拉菜单，selector按钮，hoverMenu，ContextMenu的基类。
     * @author  hite
     * @version 1.0
     * @date 2012-4-1
     */
    var PrimitiveDropMenu = shark.factory.extend("Widget",/** @lends PrimitiveDropMenu# */{
        /**
         * <p>使用现有的节点新建dropmenu组件，区别于使用数据源新建组件</p>
         * 下拉按钮用于提供仿select控件，如果element不存在，则寻找和target同级的有dropMenuTo的元素作为element;
         * <br/>提供了弹出层和触发按钮停靠的对齐接口。默认右对齐
         * 支持两种定位，左靠齐和右靠齐；<br/>
         * 当在弹出菜单以外点击时，所有菜单消失；<br/>
         * 弹出菜单中输入状态下是不会菜单消失的，除此之外点击button和其他地方都会让他消失；<br/>
         * 支持弹窗菜单上面的弹出菜单的嵌套
         *  <b>对数据和控件的bind，使用延迟绑定，只有在用户点击的时候，才初始化此次绑定
         * @example new PrimitiveDropMenu(docks,ship,{"axis":"right"})
         * @author  hite
         * @constructor
         * @constructs
         * @extends {Widget}
         * @version 1.0
         * @date    2012-3-27
         * @param   {object}  _target   触发弹出的控件，常见的有按钮，图片
         * @param   {object}  data  弹出的菜单或者获取弹出菜单的回调函数
         *                                   {widget} trigger 触发的对象
         *                                   {widget} docker dock的对象，默认是trigger
         *                                   {function|dom} target 弹出目标
         * @param   {object}  _settings 控制弹出菜单各个属性的参数<br/>
         *                              {strint}:triggerType 触发弹窗出现的方式。目前支持3种，click,hover,rightClick。<br/>
         *                                  contextMenu 表示 右键触发；hover 表示 鼠标悬浮出现；默认为点击触发。<br/>
         *                              {strint}:direction 弹窗停靠的方式。垂直停靠，还是水平停靠，默认为垂直停靠。<br/>
         *                              {string}:axis 垂直停靠或者水平垂直时。对齐的轴，详见dock注释{@see Dock}<br/>
         *                              {string}:root Dock使用参数，详见详见dock注释{@see Dock}<br/>
         *                              {iframe} docker所在的iframe
         *                              {number}:hideDelay 当hover触发时，hoverout之后延迟消失的时间，单位为ms。<br/>
         *                              {number}:showDelay 当hover触发时，hoverin之后延迟出现的时间，单位为ms。<br/>
         *                              {boolean}:once 是否每次都执行生成弹窗菜单的接口。<br/>
         *                                  一般情况下，如果是弹出层的节点，只会执行一次，下次点击的时候，会直接使用缓存里的。<br/>
         *                                  但是当弹出层里的内容，如何和环境相关，会变化的时候。可能需要每次都重新生成，这时候设置once=false；
         *                                  设置once=true表示只需要生成一次，下次直接使用，包括定位<br/>
         *                              {function}:onpopshow 当获取到组件已经被添加到dom里，和样式相关的渲染完成之后，详见events注释<br/>
         *                              {function}:onpopclose 当弹出层被关闭时，执行的函数.详见events注释<br/>
         */
        init:function(_data,_settings){
            var that = this;
            var data = $.extend({
                trigger : null,
                docker : null,
                target : null
            }, _data);
            var settings = $.extend({
                triggerType : 'mousedown',
                direction:"V",
                once:true
            }, _settings);
            that.parent(data, settings);
        },
        create:function(){
            var that = this;
            // 强制转换为func
            var doorFunc = that.getData().target;
            var settings  = that.getSettings();

            if(typeof doorFunc!=="function"){
                doorFunc = function(_ctrl){
                    return that.getData().target;
                }
            }
            // TODO 闭包问题
            var hingerSettings = {
                dock:function(_wall,_door){
                    // 判断是否在文档流中
                    // 如果有指定的停靠点，则append到指定停靠点，负责作为兄弟节点
                    if(_door.parent().length==0){
                        // 需要选择合适的位置来插入
                        if(!settings.root){
                            settings.root = shark.dock.getScrollContainer(_wall);
                        }
                        $(settings.root).append(_door);
                    }
                },
                show:function(_wall,_door,_fix){
                    // 选中
                    // 显示出来之后才能获取到尺寸
                    _door.addClass('f-hidden');

                    _door.show();
                    //
                    if(settings.onpopshow){
                        /**
                         * 当弹出层显示时，执行的回调
                         * @event
                         * @name PrimitiveDropMenu#onpopshow
                         * @example
                         * onpopshow:function(_pop,_ctrl){
                        }
                         * @param {object|widget} _door 出现的弹出层
                         * @param {Widget} _ctrl 当前dropmenu组件实例
                         */
                        settings.onpopshow(_door,that);
                    }
                    _door.removeClass('f-hidden');

                    // 渲染css，因为css会影响尺寸的
                    // // positionFix容许 对定位的进行修正，如解决右键菜单定位
                    // 修正的值以右下为标准计算
                    shark.dock["dock"+settings.direction](
                        _wall,
                        _door,
                        {
                            axis:settings.axis,
                            root:settings.root,
                            iframe : settings.iframe,
                            position:_fix.position,
                            positionFix:_fix.positionFix
                        });
                },
                hide:function(_wall,_door){
                    // 之前执行onpopclose方法。如果return false，中断此次close事件。
                    if(settings.onpopclose && settings.onpopclose(_door,that)===false){
                        return ;
                    }
                    _door.addClass('f-hidden');
                    // 使用hide替换
                },
                once:settings.once,
                root:settings.root
            };

            var HingerClass = null;
            if(settings.triggerType == "hover"){
                HingerClass = shark.HoverTrigger;   
                hingerSettings.showDelay = settings.showDelay;
                hingerSettings.hideDelay = settings.hideDelay;
            } else if(settings.triggerType == "contextMenu"){
                HingerClass = shark.ContextMenuTrigger;
            } else {
                HingerClass = shark.Hinger;
            }
            var ele = that.getData().trigger;
            // 触发方式，默认是mousedown
            hingerSettings.triggerType = settings.triggerType;
            // 清除其他的dropmenu
            hingerSettings.clearOther = settings.clearOther;
            if(settings.positionFix) {
                hingerSettings.positionFix = settings.positionFix;
            }
            if(settings.onbeforeshow) {
                hingerSettings.onbeforeshow = settings.onbeforeshow;
            }
            that.hinger = new HingerClass(
                {
                    trigger : ele,
                    docker : that.getData().docker,
                    target : doorFunc
                },
                hingerSettings
            );
            if(shark.factory.isInstance(ele, 'Widget')) {
                return ele.getEle();
            }
            return ele;
        },
        /**
         * 手动将组件置为dirty状态。这样下次执行弹出层动作的时候会再次执行创建弹出层函数。
         * @author  hite
         * @version 1.0
         * @date    2013-05-24
         * @param   {boolean}   _dirty 是否状态已经变脏，true表示组件已经失效，需要重新绘制。
         */
        setDirty:function(_dirty){
            var that = this;
            if(that.hinger){
                that.hinger.setDirty(_dirty);
            }
            that._dirty = _dirty;
        },
        /**
         * 手动关闭弹出菜单.<br/>
         * @author  hite
         * @version 1.0
         * @date    2012-07-28
         */
        close:function(){
            if(this.hinger){
                this.hinger.hide();
            }
        },
        destroy:function(){
            var that = this;
            if(that.closeTimer){
                window.clearTimeout(that.closeTimer);
                that.closeTimer = null;
            }
            var data = that.getData();
            if(data && data.trigger && shark.factory.isInstance(data.trigger, 'Widget')) {
                data.trigger.destroy();
            }

            if(that.hinger){
                that.hinger.destroy();
                that.hinger = null;
            }
            that.parent();
        },
        getDoor : function(){
            if(this.hinger) {
                return this.hinger.getDoor();
            }
        }
    });
    
    shark.factory.define("PrimitiveDropMenu",PrimitiveDropMenu);
    // 
    var DropMenu = shark.factory.extend("PrimitiveDropMenu",/** @lends DropMenu# */{
        /**
         * 使用数据源来创建组件。通常的，使用一个标准的button来触发一个标准的弹窗。
         * @author  hite
         * @version 1.0
         * @date    2013-05-24
         * @constructs
         * @constructor
         * @extends {PrimitiveDropMenu}
         * @param   {object}   _data     生成组件的数据源，数据结构为,<br/>
         *                               {object}:btnCssStyle 按钮的样式
         *                               {object}:cssStyle 自定义的弹出层样式<br/>
         *                               {string}:name 如果使用标准的button，这个值表示用来新建按钮，显示为按钮的文案<br/>
         *                               {string}:title 标签说明性的文字
         *                               {string}: titleIcoClass title的icon
         *                               {string}:wrapClassName 弹出层最外边的元素的自定义样式，通常用来控制弹出层的整体样式<br/>
         *                               {function}:childrenGenerator 异步获取被弹出层，数据源的接口，详见events注释<br/>
         *                               {function}:dataGenerator 获取数据的函数和list的结构一样
         *                               {function}:extraChildrenGenerator 最后加的玩意
         *                               {array} : list 数据
         *                               {array} : group 多组list
         * @param   {object}   _settings 组件的行为参数，<br/>
         *                               {Widget}:trigger 自定义触发按钮，如果不传入，使用默认的splitButton；
         *                               {iframe} : iframe dock所在iframe
         *                               {function} : onclick 点击
         *                               {function} : onselectchange select change的时候，Selector的时候使用
         *                               {function} : onhoverchange hover有变化
         *                               {boolean} : once false的时候会每次都更新
         */
        init:function(_data, _settings){
            var that = this;

            var settings = $.extend({},_settings);
            var data = $.extend({},_data);

            if(!settings.trigger) {
                var BtnClz = data.isClk ? shark.SelectorLinkButton : shark.SplitButton;

                // 默认使用splitbutton
                var button = new BtnClz({
                    name:data.name,
                    wrapClsName: data.wrapClsName,
                    cssStyle: data.btnCssStyle
                });
                var trigger = button;
            } else {
                var trigger = settings.trigger;
            }
            // 保存
            that.setTrigger(trigger);

            data = $.extend({}, data, {
                trigger : trigger, 
                target : that._getTarget.bind(that)
            });

            that.parent(data, settings);
        },
        _getTarget : function() {
            var that = this;

            if(that.wrap) {
                that.wrap.destroy();
                that.wrap = null;
            }

            var data = that.getData();
            // popupwrap上不要加cssStyle了
            var wrap = new shark.PopupWrap({clsName:data.wrapClassName});
            //
            that.wrap = wrap;
            that.getMenuList();

            
            // 加到wrap里面去
            for (var i = 0; i < that.ctrlChildren.length; i++) {
                if(i > 0) {
                    wrap.addChild(new shark.Seperator());
                }
                wrap.addChild(that.ctrlChildren[i]);
            };

            // 形成级联
            wrap.setParent(that);
            // 重新刷新过
            that.setDirty(false);
            //
            return that.wrap;
        },
        /**
         * 只更新内容，目前在搜索的时候用，避免动画影响
         */
        refresh : function(){
            var that = this;
            if(that.wrap && that.wrap.isVisible()) {
                that.wrap.empty();
                var menulist = that.getMenuList();
                // 加到wrap里面去
                for (var i = 0; i < menulist.length; i++) {
                    if(i > 0) {
                        that.wrap.addChild(new shark.Seperator());
                    }
                    that.wrap.addChild(menulist[i]);
                }
                var settings = that.getSettings();
                // 需要重新定位
                shark.dock["dock"+settings.direction](
                    that.getTrigger(),
                    that.wrap.getEle(),
                    {
                        axis:settings.axis,
                        root:settings.root,
                        position:settings.position,
                        positionFix:settings.positionFix
                    }
                );
            }
        },
        isVisible : function(){
            var that = this;
            if(that.wrap && that.wrap.isVisible()) {
                return true;
            }
            return false;
        },
        getCtrlChildren : function(){
            return this.ctrlChildren;
        },
        /**
         * 生成menulist
         * @return {menulistArray} MenuList 的数组
         */
        getMenuList : function(){
            var that = this;
            var settings = that.getSettings();
            // 同时满足once要求
            if(settings.once !== false && !that.isDirty() && that.ctrlChildren) {
                return that.ctrlChildren;
            }
            
            that.clearCtrlItem();

            var data = that.getData();
            var ctrlChildren = [];
            // that.addChild(button);
            // 如果有组件格式的子节点,使用延迟生成策略
            // 向 childrenGenerator 传入 that的原因是
            // 组件延迟生成导致，在预先编写childrenGenerator的时候，拿不到
            // dropmenu的引用，无法对其操作
            if(typeof data.childrenGenerator == "function"){
                ctrlChildren = data.childrenGenerator(that);
            } else {
                // group的结构，应该是 {list : [], cssStyle : {}}
                var group = that.getMenuListData();
                

                // 有title的时候
                if(data.title) {
                    var title = new shark.MenuList({list :[]});
                    var titleItem = new shark.MyWidget('<div class="item-text">' + data.title + '</div>')
                    title.addChild(titleItem);
                    ctrlChildren.push(title);
                }

                // onclick
                for (var i = 0; i < group.length; i++) {
                    // ie67, 不设最小宽度
                    if(shark.detection.isIE6() || shark.detection.isIE7()) {
                        if(group[i].cssStyle && group[i].cssStyle.minWidth) {
                            delete group[i].cssStyle.minWidth;
                        }
                    } else {
                        if(shark.factory.isInstance(that.getTrigger(), 'Button')) {
                            var width = that.getTrigger().getWidth();
                            group[i].cssStyle = group[i].cssStyle || {};
                            if(!group[i].cssStyle.minWidth && width > 0){
                                group[i].cssStyle.minWidth = width + 'px';
                            }
                        }
                    }
                    var menulist = new shark.MenuList( group[i], settings);
                    ctrlChildren.push(menulist);
                }

                // 最后加的东西，类型需要是menulist
                if(typeof data.extraChildrenGenerator == 'function') {
                    ctrlChildren.push(data.extraChildrenGenerator());
                }
            }
            that.ctrlChildren = ctrlChildren;

            // 重新刷新过
            return ctrlChildren;
        },
        setCssStyle:function(){
            // 重载一下
        },
        /**
         * 获取menulist数据
         */
        getMenuListData : function(){
            var that = this;
            var data = that.getData();
            // group的结构，应该是 {list : [], cssStyle : {}}
            var group = [];
            var dataGen = null;
            if(typeof data.dataGenerator == "function"){
                dataGen = data.dataGenerator(that);
                if($.isArray(dataGen)) {
                    data.list = dataGen;
                } else if(dataGen.list) {
                    data.list = dataGen.list;
                    if(dataGen.cssStyle) {
                        data.cssStyle = dataGen.cssStyle;    
                    }
                    if(dataGen.isSelector) {
                        data.isSelector = dataGen.isSelector;
                    }
                    if(dataGen.isCheckbox) {
                        data.isCheckbox = dataGen.isCheckbox;
                    }
                } else if(dataGen.group) {
                    data.group = dataGen.group;
                }
                if(!data.title) {
                    data.title = dataGen.title;
                }
            }

            if(data.list) {
                // 只有一组数据
                group.push({list : data.list, cssStyle : data.cssStyle,
                    isSelector : data.isSelector, isCheckbox : data.isCheckbox});
            } 
            if(data.group) {
                group = group.concat(data.group);
            }
            // 重新处理过之后，取消dirty状态
            that.setDirty(false);            
            
            return group;
        },
        /**
         * 获取当前触发弹出层行为的按钮或者其他元素（自定义情况）
         * @author  hite
         * @version 1.0
         * @date    2013-05-24
         * @return  {Widget}   触发组件，如果是selector的情况，需要提供setText函数。
         */
        getTrigger:function(){
            return this._triggerEle;
        },
        /**
         * 设置触发按钮，如果是selector的情况，这个按钮需要提供setText函数。
         * @author  hite
         * @version 1.0
         * @date    2013-05-24
         * @param   {widget|object}   _ele 触发按钮，如果是selector的情况，这个按钮需要提供setText函数。
         */
        setTrigger:function(_ele){
            this._triggerEle =  _ele ;
        },
        ondomshow:function(){
            if(this.wrap){
                this.wrap.ondomshow();
            }
        },
        /**
         * 追加任意组件，到弹出层里，每两个组件之间自动添加分割线。
         * 当弹出层没有触发时不立即渲染，可以先添加到缓存里，等弹出层真正出现时，显示所有的子组件。<br/>
         * 这个机制提供了，当弹出层没弹出时，向弹出层里添加组件的功能。如果是弹出层已经被弹出时，执行此函数，之间渲染到弹出层，而不是在缓存里。
         * @author  hite
         * @version 1.0
         * @date    2013-05-24
         * @param   {Widget}   _o 组件实例
         * @private
         * @deprecated 使用extraChildrenGenerator
         */
        addCtrlItem:function(_o){
            throw new Error('DropMenu.addCtrlItem deprecated,使用 extraChildrenGenerator 替代');
        },
        removeCtrlItem:function(){
            //HITETODO 
        },
        clearCtrlItem:function(){
            if(this.ctrlChildren) {
                $.each(this.ctrlChildren,function(index,item){
                    item.destroy();
                });
                this.ctrlChildren.length = 0 ;
            }
        },
        /**
         * disable组件
         * @author  hite
         * @version 1.0
         * @date    2013-05-24
         */
        disable:function(){
            this.getTrigger().disable();
        },
        /**
         * enable组件
         * @author  hite
         * @version 1.0
         * @date    2013-05-24
         */
        enable:function(){
            this.getTrigger().enable();
        },
        isDirty:function(){
            return !!this._dirty;
        },
        /**
         * 手动将组件置为dirty状态。这样下次执行弹出层动作的时候会再次执行创建弹出层函数。
         * @author  hite
         * @version 1.0
         * @date    2013-05-24
         * @param   {boolean}   _dirty 是否状态已经变脏，true表示组件已经失效，需要重新绘制。
         */
        setDirty:function(_dirty){
            var that = this;
            if(this.hinger){
                this.hinger.setDirty(_dirty);
            }

            if(_dirty) {
                that.clearCtrlItem();
                that.ctrlChildren = null;
            }
            this._dirty = _dirty;
        },
        destroy:function(){
            var that = this;
            if(that.wrap){
                that.wrap.destroy();
                that.wrap = null;
            }
            // 销毁
            that.clearCtrlItem();
            if(that._triggerEle && shark.factory.isInstance(that._triggerEle, 'Widget')) {
                that._triggerEle.destroy();
            }
            that._triggerEle = null;
            that.parent();
        }
    });

    shark.factory.define("DropMenu",DropMenu);

}();

(function(){
    /**
     * @fileOverview 悬浮菜单按钮
     */
    /**
     * 悬浮时出现的按钮
     * @author  hite
     * @version 1.0
     * @date    2013-05-28
     * @class HoverMenu
     * @see PrimitiveDropMenu
     * @param   {object}   _element  触发悬浮的元素
     * @param   {object|function}   _target   悬浮之后，出现的浮层。详细见PrimitiveDropMenu的注释    
     * @param   {object}   _settings 行为参数，其他参数继承自PrimitiveDropMenu，详细见PrimitiveDropMenu的注释<br/>
     *                               {string}:hovermenu触发后的停靠的方向，支持H,V停靠，默认为H。详见@see Dock<br/>
     * @return  {PrimitiveDropMenu}             Hovermenu的一个实例
     */
    var HoverMenu = function(_element,_target,_settings){
        var settings = $.extend({
            triggerType : "hover",
            direction : "H"
        }, _settings);

        var dropMenu = new shark.PrimitiveDropMenu(
            {trigger : _element, target : _target}, settings
        );
        // 在new完毕之后主动show，执行get$Ele()函数；
        window.setTimeout(function(){
            dropMenu.show();
        },10);
        return dropMenu;
    };

    shark.factory.define("HoverMenu",HoverMenu);
})();




(function(){
    /**
     * @fileOverview 模仿右键菜单
     */
    /**
     * 右键菜单，默认为上下停靠。复用了dropmenu的功能。
     * 其中hingger使用contextMenuTrigger;
     * @author  hite        
     * @version 1.0
     * @date    2013-05-20
     * @extends {PrimitiveDropMenu}
     * @see PrimitiveDropMenu
     * @更一般的 trigger应该在这些具体的里面new，而不是在dropmenu中出现
     * @example
     * var contextMenu = new JY.ContextMenu(row,function(row){
     * }, {
     *           once : false,
     *           root : this._listContainer
     *       });
     * @class ContextMenu
     * @param   {Dom|jqueryObject}   _element  响应右键的区域
     * @param   {function|object}   _target   弹出的组件或者是dom节点，或者是返回dom节点的函数。详细函数见ContextMenuTrigger
     * 
     * @param   {object}   _settings 行为参数，默认参数包括,额外参数请参看<br/>
     *                               {string}:direction 表示停靠的 方向，默认为上下停靠。V表示上下，H表示左右<br/>
     *                               {object}root dock时候需要的容器，具体见@see dock
     *                               {boolean}:once是否只需要执行一次，以后都使用缓存。true表示每次都执行
     * @return  {ContextMenu}             一个特例化的dropmenu
     */
    var contextMenu = function(_element,_target,_settings){
        var settings = $.extend({
            triggerType : "contextMenu",
            direction : "V"
        }, _settings);
        
        var dropMenu = new shark.PrimitiveDropMenu({trigger : _element, target : _target},
            settings);
        // 在new完毕之后主动show，执行get$Ele()函数；
        // window.setTimeout(function(){
            dropMenu.show();
        // },10);
        return dropMenu;
    };

    shark.factory.define("ContextMenu",contextMenu);
})();



(function(){
    /**
    * @fileOverview 
    * 模拟的checkbox，这个checkbox，主要用于form中，表单提交的value。
    */
    var pCheckedSuffix = "-fullchk";

    var pBaseClass = 'icon-chks';
    var pClsPrefix = 'icon-chks';
    var pCheckSelector = '.js-check';
    var pCheckBoxTmpl = 
        '<div class="m-wrap"><div class="w-txticon f-ribs">\
            <a href="javascript:;" class="w-icon js-check <%if(this.checked){%><%=this.checkedClass%><%}%> <%= this.clsName || "" %>"></a>\
            <%if(this.name){%><span class="txt js-label"><%=shark.tool.escapeHTML(this.name)%></span><%}%>\
        </div></div>'

    var Checkbox = shark.factory.extend("Field",/** @lends Checkbox# */{
        /**
         * 使用数据创建最普通的checkbox。
         * @author  hite
         * @version 1.0
         * @date    2013-05-20
         * @example
         * var deleteMailChkbox = new JY.Checkbox({name:"同时删除已收取的邮件",value:true});
         * @constructs
         * @constructor
         * @extends {PrimitiveCheckbox}
         * @param   {object}   _data     数据源,数据格式见<br/>
         *                               {boolean}:checked checkbox是否选择，true表示选中<br/>
         *                               {name}:name 复选框后面的文案，支持html字符串<br/>
         *                               {object}:value 选中时代表的值<br/>
         *                               {object}:defaultValue 没有选中时代表的值<br/>
         *                               {string}:clsName 自定义的样式接口，添加在最外部
         * @param   {object}   _settings checkbox行为参数，包括<br/>
         *                               {function}:onclick checkbox点击事件
         */
        init:function(data, settings){
            var that = this;
            var data = $.extend({checked : false, name : '', value : 1, defaultValue : 0,
                 clsName : pBaseClass, clsPrefix : pClsPrefix,
                tmpl : pCheckBoxTmpl, checkSelector : pCheckSelector}, data);
            // 如果已经设置过，不会覆盖
            if(!data.checkedClass) {
                data.checkedClass = data.clsPrefix + pCheckedSuffix;
            }
            
            var settings = $.extend({onclick : function(check, value){
                // onclick
                },
                wrapSelector : '>:first',
                cssStyleSelector : {
                    maxWidth : '.js-label'
                }
            }, settings);
            
            this.parent(data, settings);
        },
        create : function () {
            var html = $.jqote(this.getData().tmpl, this.getData());
            return $(html);
        },
        oncreate : function () {
            var that = this;
            that.getEle(that.getData().checkSelector).click(function(evt){
                if(that.isDisabled()) {
                    return;
                }
                // 反选
                that.check(!that.isChecked());
            });
            that.getEle('.js-label').click(function(evt){
                if(that.isDisabled()) {
                    return;
                }
                // 反选
                that.check(!that.isChecked());
            });
        },
        /**
         * 反选
         * @param  {Boolean} checked 是否选中
         * @param {boolean} response 默认调用onclick
         */
        check : function (check, response) {
            var that = this;
            if(that.isDisabled()){
                return;
            }
            var data = that.getData();
            var checked = that.isChecked();
            if(!checked && check) {
                that.getEle(data.checkSelector).addClass(data.checkedClass);
                // check
                if(response !== false) {
                    that.getSettings().onclick(check, that.getValue());
                }
            } else if(checked && !check) {
                // uncheck
                that.getEle(data.checkSelector).removeClass(data.checkedClass);
                if(response !== false) {
                    that.getSettings().onclick(check, that.getValue());
                }
            }
        },

        /**
         * 是否选中
         * @return {Boolean} [description]
         */
        isChecked : function () {
            return this.getEle(this.getData().checkSelector).hasClass(this.getData().checkedClass);
        },
        /**
         * 获取当前值，如果选中了，返回当前选中的值，如果没有选中，返回没有选中的值
         * @return {oject} 当前状态
         */
        getValue : function () {
            return this.isChecked() ? this.getData().value : this.getData().defaultValue;
        },
        destroy:function(){
            this.parent();
        }
    });

    shark.factory.define( "Checkbox", Checkbox );

    /**
     * 复杂的checkbox的选中状态
     * @type {Object}
     */
    var pCheckState = { none: 0, half: 1, all: 2 };

    var ComplexCheckbox = shark.factory.extend("Checkbox",/** @lends ComplexCheckbox# */{

        /**
         * 组件初始化
         * @param  {object} data     
         * @param  {object} settings 
         * @return {void}          
         */
        init: function( data, settings ){
            var data = $.extend({}, data, 
                {halfCheckedClass:'icon-chkl-halfchk',checkedClass:'icon-chkl-fullchk'});
            var settings = $.extend({
                onclick : function(){
                // onclick
                }
            }, settings);
            
            this.parent(data, settings);
        },

        create: function () {
            var that = this;
            that.icon = new shark.IconLinkButton({
                icoClass: "icon-chkl"
            }, {
                onclick: function(){
                    var state = that.isChecked();
                    var dest = 0;

                    if( state == pCheckState.none ){
                        dest = pCheckState.all;
                    } else if ( state == pCheckState.half ){
                        dest = pCheckState.all;
                    } else if ( state == pCheckState.all ){
                        dest = pCheckState.none;
                    }
      
                    that.check( dest );
                }
            });
            return that.icon.getEle();
        },

        oncreate : function () {
           this.parent();
        },
        /**
         * 销毁组件
         * 包括内部引用的icon
         */
        destroy : function(){
            var that = this;
            if(that.icon) {
                that.icon.destroy();
                that.icon = null;
            }
            that.parent();
        },
        /**
         * 全选、不选、半选
         * @param  {number} check 
         * @return {void}       
         */
        check: function ( checkType, response ) {
            var that = this;
            var currentState = this.isChecked();

            if( checkType === currentState ){
                return;
            }
            var data = that.getData();
            
            var ele = that.getEle().find( '.w-clk span' );
            ele.removeClass(data.checkedClass).removeClass(data.halfCheckedClass);

            if( checkType == pCheckState.all ){
                ele.addClass( data.checkedClass );
            } else if ( checkType == pCheckState.half ) {
                ele.addClass( data.halfCheckedClass );
            }

            if( response !== false ){
                that.getSettings().onclick( checkType );
            }
        },

        /**
         * 获取check状态
         * @return {number} 
         */
        isChecked: function(){
            var ele = this.getEle().find( '.w-clk  span' );
            var checked = ele.hasClass( this.getData().checkedClass );
            if( checked ){
                return pCheckState.all;
            }

            var halfchecked = ele.hasClass( this.getData().halfCheckedClass );
            if( halfchecked ){
                return pCheckState.half;
            }

            return pCheckState.none;
        }

    });

    shark.factory.define("ComplexCheckbox", ComplexCheckbox);

})();


(function(){
    /**
    * @fileOverview 
    * 模拟的checkbox，这个checkbox，主要用于form中，表单提交的value。
    */
    var pCheckedSuffix = "-checked";
    // 禁用
    var pDisabledSuffix = "-disabled";
    var pBaseClass = 'icon-radio';
    var pClsPrefix = 'icon-radio';
    var pCheckSelector = '.js-check';
    var pCheckBoxTmpl = 
        '<div class="m-wrap">\
            <div class="w-txticon f-ribs">\
                <a href="javascript:;" class="w-icon js-check <%if(this.checked){%><%=this.checkedClass%><%}%> <%= this.clsName || "" %>"></a>\
                <%if(this.name){%><span class="txt js-label"><%=shark.tool.escapeHTML(this.name)%></span><%}%>\
            </div>\
        </div>'
    var Radio = shark.factory.extend("Field",/** @lends Radio# */{
        /**
         * 使用数据创建最普通的checkbox。
         * @author  hite
         * @version 1.0
         * @date    2013-05-20
         * @example
         * var deleteMailChkbox = new shark.Radio({name:"同时删除已收取的邮件",value:true});
         * @constructs
         * @constructor
         * @extends {PrimitiveCheckbox}
         * @param   {object}   _data     数据源,数据格式见<br/>
         *                               {boolean}:checked checkbox是否选择，true表示选中<br/>
         *                               {name}:name 复选框后面的文案，支持html字符串<br/>
         *                               {object}:value 选中时代表的值<br/>
         *                               {object}:defaultValue 没有选中时代表的值<br/>
         *                               {string}:clsName 自定义的样式接口，添加在最外部
         * @param   {object}   _settings checkbox行为参数，包括<br/>
         *                               {function}:onclick radio点击  funtion(check, value)
         */
        init:function(data, settings){
            var that = this;
            var data = $.extend({checked : false, name : '', value : 1, defaultValue : 0,
                 clsName : pBaseClass, clsPrefix : pClsPrefix, tmpl : pCheckBoxTmpl, checkSelector : pCheckSelector}, data);

            // 有设置过的不要覆盖
            if(!data.disabledClass) {
                data.disabledClass = data.clsPrefix + pDisabledSuffix;
            }
            if(!data.checkedClass) {
                data.checkedClass = data.clsPrefix + pCheckedSuffix;
            }
            
            var settings = $.extend({onclick : function(check, value){
                // onclick
                },
                wrapSelector : '>:first'
            }, settings);
            
            this.parent(data, settings);
        },
        create : function () {
            var html = $.jqote(this.getData().tmpl, this.getData());
            return $(html);
        },
        oncreate : function () {
            var that = this;
            that.getEle(that.getData().checkSelector).click(function(evt){
                if(that.isDisabled()) {
                    return;
                }
                // 选中
                that.check(true);
            });
            that.getEle('.js-label').click(function(evt){
                if(that.isDisabled()) {
                    return;
                }
                // 选中
                that.check(true);
            });
        },
        /**
         * 反选
         * @param  {object} checked description
         * @param {boolean} response 默认调用onclick
         * @return {object}         description
         */
        check : function (check, response) {
            var that = this;
            var data = that.getData();
            var settings = that.getSettings();

            var checked = that.isChecked();
            if(!checked && check) {
                that.getEle(data.checkSelector).addClass(data.checkedClass);
                // check
                if(response !== false) {
                    settings.onclick(check, that.getValue());
                }
                // 在分组中，通知其他的进行关闭
                if(that._notifyGroup) {
                    that._notifyGroup(that);
                }
            } else if(checked && !check) {
                // uncheck
                that.getEle(data.checkSelector).removeClass(data.checkedClass);
                if(response !== false) {
                    settings.onclick(check, that.getValue());
                }
            }
        },
        /**
         * 注册通知
         * @param {Function} callback description
         * @private
         */
        _addNotify : function(callback){
            var that = this;
            that._notifyGroup = callback;
        },
        /**
         * 是否选中
         * @return {Boolean} description
         */
        isChecked : function () {
            return this.getEle(this.getData().checkSelector).hasClass(this.getData().checkedClass);
        },
        /**
         * 获取当前值，如果选中了，返回当前选中的值，如果没有选中，返回没有选中的值
         * @return {object} description
         */
        getValue : function () {
            return this.isChecked() ? this.getData().value : this.getData().defaultValue;
        },
        destroy:function(){
            this.parent();
        }
    });

    shark.factory.define("Radio",Radio);
})();


(function() {
    /**
     * @fileOverview 上传进度组件
     */
    // var pTmpl = '<div class="m-wrap"><canvas width="<%=this.width || 30%>" height="<%=this.height || 30%>" class="js-canvas"></canvas></div>';
    var pTmpl = '<div class="m-wrap" title="<%=this.title||""%>"><a href="javascript:;" hidefocus="true" class="w-clk f-ribs w-clk-onlyicon">\
        <span class="w-icon-editor<%=this.size%> icon-editor<%=this.size%>-uploadsucc js-succ f-hide"></span>\
        <span class="w-icon-editor<%=this.size%> icon-editor<%=this.size%>-uploaderr js-error f-hide"></span>\
        <%if(this.supportCanvas){%>\
            <canvas width="<%=this.width || 30%>" height="<%=this.height || 30%>" class="js-canvas"></canvas>\
        <%}else{%>\
            <span class="ieuploading js-canvas"></span>\
        <%}%>\
        </a></div>';  

    var canvasHeight, canvasWidth;

    var degrees, new_degrees, difference, color, bgcolor, text;
    // 定时器

    var progress = shark.factory.extend("Widget", /** @lends Progress# */ {
        /**
         * Canvas实现的进度
         * @author  Len
         * @version 1.0
         * @date    2013-10-30
         * @constructs
         * @constructor
         * @extends {Widget}
         * @example
         *  progress = new shark.Progress(
                {
                    width: 30,
                    height: 30
                },{
                    color: "#15a311",
                    errorColor: "#d74b00",
                    lineWidth: 2,
                    radius: 10,
                    // counterclockwise: true,
                    bgcolor: "#cbcbcb",
                    completeColor: "#2078b6"
                    onclick:
                }
            );
         * @param   {object}   _data     数据源，数据结构如，<br/>
         * @param   {object}   _settings 参数，<br/>
         */
        init: function(_data, _settings) {
            // pDefaults不能改变
            var data = $.extend({
                width:30,
                height:30
            }, _data);
            var settings = $.extend({
                bgcolor : "#cbcbcb",
                color : "#15a311",
                errorColor : '#d74b00',
                radius : 10,
                lineWidth: 2,
                completeColor: "#2078b6"
            },_settings);
            this.animation_loop = null;
            this.parent(data, settings);
        },
        create: function() {
            var that = this;
            var settings = that.getSettings();
            var data = that.getData();
            var canvas = document.createElement("canvas");
            if(canvas.getContext){
                data.supportCanvas = true;
            }else{
                data.supportCanvas = false;
            }
            var html = $.jqote(pTmpl, data);
            return $(html);
        },
        oncreate: function() {
            this.parent();
            var that = this,
                settings = this.getSettings(),
                data = that.getData();
            var domNode = this.$domNode;
            domNode.click(function(event){
                return settings.onclick(event,that);
            });
            if(data.supportCanvas){
                    
                var canvas = domNode.find('canvas')[0];
                //canvas initialization
                that.ctx = canvas.getContext("2d");
                //dimensions
                canvasWidth = canvas.width;
                canvasHeight = canvas.height;
                //Variables initialization
                degrees = 0;
                new_degrees = 0;
                difference = 0;
                that.drawbg();
                if(settings.imageUrl){
                    var image = new Image();
                    image.src = settings.imageUrl;
                    image.onload = function(){
                        image.onload = null;
                        that.imageload = true;
                        that.drawImg();
                    }
                    that.image = image;
                }
                that.canvas = $(canvas);
            }else{
                that.canvas = that.getEle('.js-canvas');
            }
            that.errorIcon = that.getEle('.js-error');
            that.succIcon = that.getEle('.js-succ');
            
        },
        /**
         * 清理画布
         * @return {void} 
         */
        clearDraw: function(){
             var ctx = this.ctx;
            //Clear the canvas everytime a chart is drawn
            ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        },
        /**
         * 画背景
         * @return {void} 
         */
        drawbg: function(){
            var ctx = this.ctx, settings = this.getSettings();

            //Background 360 degree arc
            ctx.beginPath();
            ctx.strokeStyle = settings.bgcolor;
            ctx.lineWidth = settings.lineWidth;

            // 用一个中心点和半径，为一个画布的当前子路径添加一条弧线。
            // arc(x, y, radius, startAngle, endAngle, counterclockwise)
            ctx.arc(canvasWidth / 2, canvasHeight / 2, settings.radius,
                0, Math.PI * 2, settings.counterclockwise || false); //you can see the arc now
            ctx.stroke();
        },
        drawProgress: function(){
            var ctx = this.ctx, settings = this.getSettings();
            //gauge will be a simple arc
            //Angle in radians = angle in degrees * PI / 180
            var radians = degrees * Math.PI / 180;
            ctx.beginPath();
            // ctx.strokeStyle = this.isError ? settings.errorColor : settings.color;
            ctx.strokeStyle = settings.color;
            ctx.lineWidth = settings.lineWidth;
            //The arc starts from the rightmost end. If we deduct 90 degrees from the angles
            //the arc will start from the topmost end
            if(radians !== 0){
                // 弧度等于0的时候，起点和终点一样，会画一个圆。
                if(settings.counterclockwise){
                    ctx.arc(canvasWidth / 2, canvasHeight / 2, settings.radius, 0 + 270 * Math.PI / 180, radians + 270 * Math.PI / 180, settings.counterclockwise || false);
                }else{
                    ctx.arc(canvasWidth / 2, canvasHeight / 2, settings.radius, 0 - 90 * Math.PI / 180, radians - 90 * Math.PI / 180, settings.counterclockwise || false);
                }
            }
            //you can see the arc now
            ctx.stroke();
        },
        drawImg: function(){
            var ctx = this.ctx;
            if(this.image && this.imageload){
                ctx.drawImage(this.image, 0, 0);
            }
        },
        draw: function() {
            var that = this;
            shark.tool.show(that.canvas);
            shark.tool.hide(that.succIcon);
            shark.tool.hide(that.errorIcon);
            this.clearDraw();
            // 画背景
            this.drawbg();

            this.drawProgress();

            this.drawImg();
        },
        /**
         * 绘画完成
         * @return {void} 
         */
        drawComplete: function(){
            var that = this;
            degrees = 0;
            new_degrees = 0;
            difference = 0;
            var value = that.getValue();
            if(value.isError){
                shark.tool.hide(that.canvas);
                shark.tool.hide(that.succIcon);
                shark.tool.show(that.errorIcon);
            }else{
                that.succIcon.html(value.realTotal);
                shark.tool.hide(that.canvas);
                shark.tool.show(that.succIcon);
                shark.tool.hide(that.errorIcon);
            }
            return;
            
            var ctx = this.ctx, settings = this.getSettings();
            this.clearDraw();
            // 画圆并且填充
            ctx.beginPath();
            ctx.strokeStyle = settings.completeColor;
            ctx.lineWidth = 0;
            ctx.fillStyle= settings.completeColor;
            // 用一个中心点和半径，为一个画布的当前子路径添加一条弧线。
            // arc(x, y, radius, startAngle, endAngle, counterclockwise)
            ctx.arc(canvasWidth / 2, canvasHeight / 2, settings.radius, 0, Math.PI * 2, false); //you can see the arc now
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = "#fff";
            // ctx.font = "2px";
            var _total = this.value.realTotal || this.value.total;
            text = _total > 99 ? 99 : _total;
            //Lets center the text
            //deducting half of text width from position x
            text_width = ctx.measureText(text).width;
            //adding manual value to position y since the height of the text cannot
            //be measured easily. There are hacks but we will keep it manual for now.
            ctx.fillText(text, canvasWidth / 2 - text_width / 2 - 3, canvasHeight / 2 + 6);

        },
        calculate: function(degree) {
            var that = this;
            var data = that.getData();
            var value = that.getValue();
            if(data.supportCanvas){
                //Cancel any movement animation if a new chart is requested
                if (typeof that.animation_loop != undefined) clearInterval(that.animation_loop);

                //random degree from 0 to 360
                new_degrees = degree;
                difference = new_degrees - degrees;
                //This will animate the gauge to new positions
                //The animation will take 1 second
                //time for each frame is 1sec / difference in degrees
                that.animation_loop = setInterval(this.animate_to.bind(this), 1000 / difference);

            }else{
                if(value.isComplete){
                    if(value.isError){
                        shark.tool.hide(that.canvas);
                        shark.tool.hide(that.succIcon);
                        shark.tool.show(that.errorIcon);
                    }else{
                        that.succIcon.html(value.realTotal);
                        shark.tool.hide(that.canvas);
                        shark.tool.show(that.succIcon);
                        shark.tool.hide(that.errorIcon);
                    }
                }else{
                    shark.tool.show(that.canvas);
                    shark.tool.hide(that.succIcon);
                    shark.tool.hide(that.errorIcon);
                }
            }
        },

        //function to make the chart move to new degrees

        animate_to: function() {
            var that = this, value = that.getValue();
            //clear animation loop if degrees reaches to new_degrees
            if(value.isComplete){
                clearInterval(that.animation_loop);
                that.drawComplete();
                return;
            }
            if (degrees == new_degrees){
                clearInterval(that.animation_loop);
                if(new_degrees >= 360 || value.isComplete){
                    this.drawComplete();
                }
            }else{
                if (degrees < new_degrees){
                    degrees++;
                }else{
                    degrees--;
                }
                this.draw();
            }
        },

        /**
         * 设置进度
         * @param {Object} value {total:10, count: 2}
         */
        setValue: function(value) {
            var that = this;
            
            this.value = value;
            this.calculate(360 * (value.count / value.total));
        },
        /**
         * 设置完成进度
         * @param {string} total 完成量
         * @return {void} 
         */
        setFinal: function(total){
            var that = this;
            if(that.succIcon){
                that.succIcon.html(total);
            }
        },
        /**
         * 获取的当前打开状态
         * @author  hite
         * @version 1.0
         * @date    2013-05-28
         * @return  {boolean}   如果是打开返回true
         */
        getValue: function() {
            return this.value;
        },
        destroy: function() {
            var that = this;
            clearInterval(that.animation_loop);
            that.errorIcon = null;
            that.succIcon = null;
            that.canvas = null;
            that.ctx = null;
            that.parent();
        }

    });
    //
    shark.factory.define("Progress", progress);
    //

})();
(function() {
    /**
     * @fileOverview 文本容器
     */
    var pTmpl = '<div class="m-wrap <%=this.wrapClsName||""%>">\
                <div class="w-txticon f-ribs">\
                <% if(this.icoClass){%>\
                    <span class="<%=this.icoClass%>"></span>\
                <%}%>\
                <% if(this.text){%>\
                    <span class="txt js-text <%=this.textClsName||""%>"><%=shark.tool.escapeHTML(this.text)%></span>\
                <%}%>\
                <% if(this.texts && this.texts.length > 0){\
                    for (var i = 0; i < this.texts.length; i++) {%>\
                        <span class="txt js-text <%=this.textClsName||""%>"><%=shark.tool.escapeHTML(this.texts[i])%></span>\
                <%};\
                }%>\
                <% if(this.html){%>\
                    <span class="txt js-text <%=this.textClsName||""%>"><%=this.html%></span>\
                <%}%>\
                <% if(this.rightIcoClass){%>\
                    <span class="<%=this.rightIcoClass%>"></span>\
                <%}%>\
                </div>\
            </div>';
    // 默认选择器,空的时候，就是组件本身
    var pDefaultSettings = {
        cssStyleSelector : {
            // 字体大小
            "size" : '.js-text',
            // 字体颜色
            "color" : '.js-text',
            "weight" : '.js-text',
            "maxWidth" : '.js-text:first',
            // ie8下有bug，需要在wrap上加最大宽度
            "maxWrapWidth" : '',
            // 组件的大小
            "wrapsize" : ''
        }
    };
    var text = shark.factory.extend("Widget", /** @lends UnderLine# */ {
        /**
         * 下划线的容器
         * @author  Len
         * @version 1.0
         * @constructs
         * @constructor
         * @extends {Widget}
         * @date    2013-05-80
         * @param   {object}   data   数据
         */
        init: function(data, settings) {
            var that = this;
            var data = $.extend({tmpl : pTmpl}, data);
            var settings = $.extend({}, pDefaultSettings, settings);
            if(data.icoClass) {
                data.icoClass = shark.cssHelper.getPrefix(data.icoClass) + ' ' + data.icoClass;
            } 
            if(data.rightIcoClass) {
                data.rightIcoClass = shark.cssHelper.getPrefix(data.rightIcoClass) + ' ' + data.rightIcoClass;
            } 

            that.parent(data, settings);
        },
        /**
         * 容器
         * @return {dom} 容器
         */
        create: function() {
            var data = this.getData();
            var dom = $($.jqote(data.tmpl, data));
            if(data.title) {
                dom.find('.js-text').attr('title', data.title);
            }
            return dom;
        },
        setText: function(text) {
            var data = this.getData();
            this.getEle().find('.js-text').html(shark.tool.escapeHTML(text));
            data.text = text;
        },
        setHtml : function(html){
            var data = this.getData();
            this.getEle().find('.js-text').html(html);
            data.html = html;
        },
        getText: function() {
            return this.getData().text;
        },
        /** 
         * 默认把element加进去
         * @protected
         */
        oncreate: function() {
            var that = this;
            that.parent();
        }
    });
    //
    shark.factory.define("Text", text);

    var imptText = function(data, settings) {
        data.cssStyle = $.extend({
            color: 'impt'
        }, data.cssStyle || {});
        return new shark.Text(data, settings);
    }
    shark.factory.define("ImptText", imptText);
    
    var tipText = function(data, settings) {
         data.cssStyle = $.extend({
            color: 'tip'
        }, data.cssStyle || {});
        return new shark.Text(data, settings);
    }
    shark.factory.define("TipText", tipText);

    var errorText = function(data, settings) {
        data.cssStyle = $.extend({
            color: 'err'
        }, data.cssStyle || {});
        return new shark.Text(data, settings);
    }
    shark.factory.define("ErrorText", errorText);

    var assistText = function(data, settings) {
        data.cssStyle = $.extend({
            color: 'assist'
        }, data.cssStyle || {});
        return new shark.Text(data, settings);
    }
    shark.factory.define("AssistText", assistText);

})();

(function() {

    /**
     * @fileOverview 分隔符
     */

    var pTmpl = '<span class="w-hrzsplite"></span>';
    var Split = shark.factory.extend("Widget", /** @lends UnderLine# */ {
        /**
         * 分隔符
         *
         */
        init: function() {
            this.parent();
        },
        /**
         * 容器
         * @return {dom} 容器
         */
        create: function() {
            return $(pTmpl);
        }
    });
    shark.factory.define("Split", Split);
})();

!function(){
    /**
     * @fileOverview 列表的类，提供了：
     * <ol>
     * <li>全局菜单有关的事件消息</li>
     * <li>shift选择功能</li>
     * <li>hover和click事件</li>
     * </ol>
     */
    var List =  shark.factory.extend("Widget",/** @lends List# */{
        /**
         * 列表组件。目前只是给现有列表追加动作和行为，不生成组件结构的步骤。<br/>
         * 使用需要保证传入的第一个参数满足一下条件。
         * <ul>
         *  <li>checkbox的样式 :.chkbox</li>
         *  <li>checkbox选中的样式:.checked</li>
         *  <li>每一行的的class里需要包括 ：.js-row</li>
         * </ul>
         * <p style="font-size:14px;">使用的前提条件,待重构，如去掉MQ的机制，改为回调</p>
         * @todo 接口参数有点乱，待重写
         * @example
         * var listCtrl = that.listCtrl = new JY.List(that._listContainer,{
                clickable:".js-chkbox",
                oncheckboxclick:function(site){
                    that.changeTmpDataProvider(site);
                },
                onchecknone:function(site){
                    that.changeTmpDataProvider(site);
                },
                oncheckall:function(site){
                    that.changeTmpDataProvider(site);
                }
            });
         * @author  hite
         * @version 1.0
         * @date    2013-05-28
         * @constructor
         * @constructs
         * @extends {Widget}
         * @param   {object}   _list     包含有table的容器，最好是table的最小父节点.
         * @param   {object}   _settings 行为参数，包括<br/>
         *                 {boolean}  autoHover            列表是否支持hover改变样式的功能   <br/>
         *                 {string}  clickable             响应click行，选中的组件,是个表示选择器的字符串<br/>
         *                 {function}   oncheckall:function(){}     当列表全选的时的回调。<br/>
         *                 {function}   onchecknone:function(){}     当列表没有选中任何行时的回调。<br/>
         *                 {function}   oncheckboxclick:function(){} 当列表有行被选中的回调。<br/>
         *                 {string}   prefix                        hover，click等样式需要特定样式的时，在hover前的前缀<br/>
         */
        init:function(_list, _settings){
            this.ele = _list;
            this.settings = _settings ||{};
            this.parent();
            this.show();
        },
        create:function(){
            var context = $(this.ele);
            /**
             * 默认的settings参数
             * @name List#Settings
             * @property   {boolean}  autoHover            列表是否支持hover改变样式的功能,，默认true   
             * @property   {string}  clickable             响应click行，选中的组件,是个表示选择器的字符串，默认.chkbox。
             * @property   {function}   oncheckall:function(){}     当列表全选的时的回调。
             * @property   {function}   onchecknone:function(){}     当列表没有选中任何行时的回调。
             * @property   {function}   oncheckboxclick:function(){} 当列表有行被选中的回调。
             * @property   {string}   prefix                        hover，click等样式需要特定样式的时，在hover前的前缀。默认为空字符串
             */
            this.settings  = $.extend({
                autoHover: true,

                //是否开启上下滚动快捷键
                shortcut: false,

                //可滚动的容器，用于快捷键开启的时候上下滚动时使用
                scrollContainer: "",

                //上下滚动选中后回车所点击的元素选择
                shortcutClickable: "",

                clickable:".chkbox",// 响应click行，选中的组件
                onclick:function(){return true;}, //clickable点击后的处理，return false可以阻止选中
                oncheckall:function(){},//当全选时候的回调
                onchecknone:function(){},//当全不选的回调
                oncheckboxclick:function(){},//当点击checkbox的回调
                prefix : ''
            },this.settings);

            this._lastCheckState = "";
            return  $(context);
        },
        oncreate:function(_context){
            this._checkBoxMQ = $MQ.LISTCBCHG;
            // 防止多次初始化
            if(this.getEle().data("widgetListInited")=="true"){
                return false;           
            }
            this.getEle().data("widgetListInited","true");

            this.getEle().delegate('.js-chkbox', "mouseover", function(){
                $(this).addClass("hover");
            })

            this.getEle().delegate('.js-chkbox', "mouseout", function(){
                $(this).removeClass("hover");
            })

            //如果开启了快捷键，则绑定相关事件
            if( this.settings.shortcut ){
                this.bind();
            }
            //
            this.bindEvents();
        },
        // 在初始化的时候，也许不存在，而且每次获取时候，保存起来
        // 因为选择器有点耗时
        _getChkboxes:function(){
            // $Profiler.time( 'list.widget.getChkboxes' );
            if(!this._checkboxes){
                this._checkboxes = this.getEle().find(".js-chkbox");
            }
            // $Profiler.timeEnd( 'list.widget.getChkboxes' );
            return this._checkboxes;
        },

        /**
         * 绑定快捷键
         * @return {void} 
         */
        bind: function(){
            if( !this._createTime ){
                this._createTime = new Date().getTime();
            }
            shark.shortkey.bind("38", this.navUpRow.bind(this), "JY.LIST" + this._createTime );
            shark.shortkey.bind("40", this.navDownRow.bind(this), "JY.LIST" + this._createTime );
            shark.shortkey.bind("13", this.clickRow.bind(this), "JY.LIST" + this._createTime );
        },

        /**
         * 点击某行
         * @return {void} 
         */
        clickRow: function(){
            if( !this._lastHover || document.activeElement.tagName != "BODY" ){
                return;
            }

            if( this.settings.shortcutClickable ){
                this._lastHover.find( this.settings.shortcutClickable ).click();
            } else {
                this._lastHover.click();
            }
        },

        /**
         * 使用快捷键快速导航选中邮件，向上选择
         * @return {void} 
         */
        navUpRow: function(){
            var scrollElement = this.settings.scrollContainer || this.getEle();

            if( !this._lastHover ){
                this._lastHover = $( $( ".js-row", this.getEle() ).get(0) );
                $( $( ".js-row", this.getEle() ).get(0) ).addClass( this.settings.prefix + "hover" );

                if( this._lastHover.top > scrollElement.height() ){
                    scrollElement.animate({
                        scrollTop: 0
                    }, 200, "swing");
                }
            } else {
                $( this._lastHover ).removeClass( this.settings.prefix + "hover" );
                if( $( this._lastHover ).prev().size() ){
                    $( this._lastHover ).prev().addClass( this.settings.prefix + "hover" );
                    this._lastHover = $( this._lastHover ).prev();

                    var availHeight = this._lastHover.position().top;

                    if( availHeight < 150 && availHeight > 0 ){
                        scrollElement.animate({
                            scrollTop: scrollElement.scrollTop() - 250 + "px"
                        }, 300, "swing" )
                    }

                } else {
                    this._lastHover = null;
                }
            }
        },

        /**
         * 使用快捷键快速导航选中邮件，向下选择
         * @return {void} 
         */
        navDownRow: function(){
            var scrollElement = this.settings.scrollContainer || this.getEle();

            if( !this._lastHover ){
                this._lastHover = $( $( ".js-row", this.getEle() ).get(0) );
                $( $( ".js-row", this.getEle() ).get(0) ).addClass( this.settings.prefix + "hover" );

                scrollElement.animate({
                    scrollTop: 0
                }, 200, "swing");
            } else {
                $( this._lastHover ).removeClass( this.settings.prefix + "hover" );
                if( $( this._lastHover ).next().size() ){
                    $( this._lastHover ).next().addClass( this.settings.prefix + "hover" );
                    this._lastHover = $( this._lastHover ).next();

                    var availHeight = scrollElement.height() - this._lastHover.position().top  - this._lastHover.height();

                    if( availHeight < 50 && availHeight > 0 ){
                        scrollElement.animate({
                            scrollTop: scrollElement.scrollTop() + 150 + "px"
                        }, 300, "swing" )
                    }

                } else {
                    this._lastHover = null;
                }
            }
        },

        /**
         * 强制刷新checkboxes,在列表并不是一次性加载时使用。   
         * @author  hite
         * @version 1.0
         * @date    2013-05-28
         */
        refresh : function(){
            this._checkboxes = this.getEle().find(".js-chkbox");
        },
        // 发送选择状态的同事，修改标志位
        _sendNotice:function(_data){
            this._checkBoxMQ.notify(_data); 
            this._lastCheckState = _data.type;
        },
        /**
         * 获取符合过滤条件的checkbox对象的数组
         * @author  hite
         * @version 1.0
         * @date    2013-05-28
         * @param   {function}   _filter 过滤function，get只返回_filter(index,currentItem) 执行结果为true时的item.详见jquery的filterfunction定义。
         * @return  {array}      符合过滤条件的checkbox对象的数组
         */
        get:function(_filter){
            // $Profiler.time( 'list.widget.get' );
            var checkboxes = this._getChkboxes().filter(_filter);
            // $Profiler.timeEnd( 'list.widget.get' );
            return checkboxes;
        },
        /**
         * 模拟checkbox行为,手动选中。触发checkbox相应的通知
         * @author  hite
         * @version 1.0
         * @date    2013-05-28
         * @param   {function}   _filter 过滤function，get只返回_filter(currentItem) 执行结果为true时的item.详见jquery的filterfunction定义。
         */
        check:function(_filter){
            this._getChkboxes().each(function(index,item){
                if(typeof _filter == "function"){
                    var checked =  _filter(index,item);
                }else{
                    var checked = _filter;
                }
                this._checkCheckBox(item,checked);
            }.bind(this));
            // on checkbox change
            this.onCheckBoxChanged();
        },
        /**
         * 选中或者不选中当前行。模拟点击动作，触发checkbox相应的通知。
         * @author  hite
         * @version 1.0
         * @date    2013-05-28
         * @param   {object|DOM}   _ele 位于row中的元素，可以是任意的元素。
         */
        checkOneRow:function(_ele){
            var tr = this.getOneRow(_ele);
            var site = tr.find(".js-chkbox");
            var checked = site.hasClass("icon-chks-fullchk");
            // step1
            this._checkCheckBox(site,!checked);
            // step2
            this.onCheckBoxChanged();
        },
        /**
         * 获取当前checkbox所属的row元素
         * @author  hite
         * @version 1.0
         * @date    2013-05-28
         * @param   {dom}   _chk checkbox元素
         * @return  {object}        row元素
         */
        getOneRow:function(_chk){
            // $Profiler.time( 'list.widget.getOneRow' );
            var t = $(_chk).closest(".js-row");

            // $Profiler.timeEnd( 'list.widget.getOneRow' );
            return t;
        },
        // 在checkbox发生改变之后同步事件
        /**
         * @private
         */
        onCheckBoxChanged:function( sendNotice ){
            var domNode = this.getEle();
            var currentLen = domNode.find(".icon-chks-fullchk").length;
            var len = this._getChkboxes().length;
            var type = "default";
            if(currentLen==0){//  先判断是否为0，因为当当前文件夹为空时，len=currentLen，首先排除这种方法；
                type = "none";
                this.settings.onchecknone(domNode);
            }else if(len==currentLen){
                type = "all";
                this.settings.oncheckall(domNode);
            }
            //
            this.settings.oncheckboxclick(domNode);
            // 全部不选，每次都响应,TODO;
            if( "none"==type || type!=this._lastCheckState || sendNotice ){
                this._sendNotice({"type":type});
            }
            
            return true;
        },
        /**
         * 获取选中的记录或者没选中的记录
         * @author  hite
         * @version 1.0
         * @date    2012-4-24
         * @param   {boolean}    _checkedOrNot 选择的或者没选中的
         * @return  {array}                  _checkbox的数组
         */
        getCheckBox:function(_checkedOrNot){
            return this.get(function(index,item){
                if (_checkedOrNot) {
                    return $(item).is(".icon-chks-fullchk")
                }else{
                    return !$(item).is(".icon-chks-fullchk");
                }
            });
        },
        /**
         * 获取所有的checkbox
         * @author  hite
         * @version 1.0
         * @date    2013-05-28
         * @return  {array}   checkbox元素
         */
        getAll:function(){
            return this.get(function(index,item){
                return true;
            });
        },
        /**
         * 全部勾选，或者全部不勾选
         * @author  hite
         * @version 1.0
         * @date    2012-4-24
         * @param   {boolean}    _checked true表示全部勾选，false表示全部不勾选
         */
        checkAll:function(_checked){
            // var checkboxes = this._getChkboxes();
            // $Profiler.group( 'checkAll' );
            // this.check(_checked); // 672ms
            var container = this.getEle();
            if( _checked ) {
                container.find( '.js-row' ).addClass( this.settings.prefix + "selected" );
                container.find( '.js-chkbox' ).addClass( 'icon-chks-fullchk' );
            } else {
                container.find( '.js-row' ).removeClass( this.settings.prefix + "selected" );
                container.find( '.js-chkbox' ).removeClass( 'icon-chks-fullchk' );
            }
            this.onCheckBoxChanged();
            // $Profiler.groupEnd( 'checkAll' );
        },
        bindEvents:function(argument) {
            // body...
            this.bindShiftCheck();
            this.bindMsgListEvents();
        },
        // hover和click事件应该是公用的
        bindMsgListEvents:function(){
            /**
             * 因为jy4的checkbox是模拟的,也就是说，
             * 点击之后checkbox的check状态是不先变化，而是先响应click事件
             * 所有要先bindEvents，然后再是事件消息
             */
            var that = this;
            var settings = that.settings;
            var domNode = this.getEle();
            
            if(settings.autoHover){
                var hoverClass = that.settings.prefix + "hover";
                domNode.delegate(".js-row","mouseenter",function(){
                    that._lastHover = $(this);
                    $(this).addClass(hoverClass);
                    return true;
                }).delegate(".js-row","mouseleave",function(){
                    that._lastHover = null;
                    $(this).removeClass(hoverClass);
                    return true;
                });
            }
            // 自定义响应单选行的情况
            domNode.delegate(settings.clickable,"click",function(event){
                //传入onclick返回false可以阻止选中
                if(settings.onclick(that.getEle())){
                    that.checkOneRow(this);
                }
                return true;    
            });
            // 解决shift快捷键时，出现的select文本的情况
            if(shark.detection.firefox){
                domNode.find(settings.clickable).css("-moz-user-select","-moz-none");
            }else{
                domNode.delegate(settings.clickable,"selectstart",function(event){
                    return false;   
                });
            }
            domNode = null;
        },
        // 实现shift多选的功能，支持，逆选和顺序选择
        bindShiftCheck:function(){
            var that = this;
            that.getEle().delegate(that.settings.clickable,"click",function(event){
                var chkBoxes = that._getChkboxes();
                var site = $(this);
                if(site.hasClass(".js-chkbox")){
                    var curChkBox = this;
                }else{
                    var curChkBox = site.find(".js-chkbox").get(0);
                }
                var lastCheckBox = that._lassCheckedBox;
                if(lastCheckBox && event.shiftKey){
                    // 以上一次选择为准
                    var state = $(lastCheckBox).hasClass("icon-chks-fullchk");
                    var start = chkBoxes.index(lastCheckBox);
                    var end = chkBoxes.index(curChkBox);
                    
                    chkBoxes.each(function(index,item){
                        // 也许是逆序的
                        if(start>end){
                            //swtich 
                            if(index>end && index<=start){// 不需要处理最后一个，被点击的，在其它地方已经增加了监听；
                                that._checkCheckBox(item,state);
                            }
                        }else{
                            if(index>=start && index<end){// 不需要处理最后一个，被点击的，在其它地方已经增加了监听；
                                that._checkCheckBox(item,state);
                            }
                        }
                    });
                }
                //
                that._lassCheckedBox = curChkBox;
                //
                return true;
            });
        },
        // 模拟选中checkbox事件
        _checkCheckBox:function(item,state){
            // $Profiler.group( '#list.widget._checkCheckBox' );
            // $Profiler.time( 'list.widget._checkCheckBox' );
            var that = this,
                tr = this.getOneRow(item);
            if(state){
                //SNIPPET@@@
                $(item).addClass("icon-chks-fullchk");
                tr.addClass(that.settings.prefix + "selected");
            }else{
                $(item).removeClass("icon-chks-fullchk");
                tr.removeClass(that.settings.prefix + "selected");
            }
            // $Profiler.timeEnd( 'list.widget._checkCheckBox' );
            // $Profiler.groupEnd( '#list.widget._checkCheckBox' );
        },

        unbind: function(){
            shark.shortkey.unbind("38", null, "JY.LIST" + this._createTime );
            shark.shortkey.unbind("40", null, "JY.LIST" + this._createTime );
            shark.shortkey.unbind("13", null, "JY.LIST" + this._createTime );
        },

        destroy:function(){
            
            var that = this;
            if(that._checkboxes){
                // that._getChkboxes().remove();
                that._checkboxes = null;
            }

            if( that.settings.shortcut ){
                that.unbind();
            }

            that.settings.scrollContainer = null;
            that.settings = null;
            that._lastHover = null;
            that._checkBoxMQ = null;
            that.ele = null;
            // that.unbindKeyBoardEvents();
            // that.settings = null;
            that.parent();
            that.__settings = null;
            that.__data = null;
        }
    });

    shark.factory.define("List",List);
}();
(function() {
    /**
     * @fileOverview 基本的可点击的菜单
     */
    /**
     * menuitem 和样式相关的默认参数
     * @name PrimitiveMenu#DefaultClass
     * @property {string} activeClass 默认鼠标滑过的样式,active;
     * @property {string} hoverClass 默认hover的样式,menu-hover;
     * @property {string} selectedClass 默认选中时候的样式,menu-selected;
     */
    var pActiveClass = "active";
    var pFocusClass = "item-focus";
    var pSelectedClass = "item-selected";

    var PrimitiveMenu = shark.factory.extend("Widget", /**@lends PrimitiveMenu#*/ {
        /**
         * 菜单的基本要素，表示一个可操作的选项
         * @author  hite
         * @version 1.0
         * @date    2013-05-28
         * @constructs
         * @constructor
         * @extends {Widget}
         * @param   {object}   _data     dom节点，应该是可以独立存在的节点。样式和她所在的位置没关系。
         *                               element
         * @param   {object}   _settings 行为参数，包括<br/>
         *                               {function}:onclick 元素上点击事件的回调,详见events的注释<br/>
         */
        init: function(_data, _settings) {
            var data = $.extend({
                element: null
            }, _data);
            var settings = $.extend({
                onclick: function(event, ctrl) {
                    return true;
                }
            }, _settings);
            this.parent(data, settings);
        },
        create: function() {
            return $(this.getData().element);
        },
        oncreate: function() {
            var that = this;
            that.parent();
            var domNode = that.getEle();
            domNode.click(function(event) {
                /**
                 * 菜单项点击事件
                 * @event
                 * @name PrimitiveMenu#onclick
                 * @param {object} event 当前event对象
                 * @param {Widget} _ctrl 组件实例
                 * @return {boolean} 返回一个boolean值，返回false终止当前时间。
                 */
                // $Profiler.log('PrimitiveMenu.click');
                return that.getSettings().onclick(event, that);
            });

            // 增加键盘操作的focus
            domNode.find(".item").focus(function(evt) {
                that.focus();
            });
            domNode.find(".item").blur(function(evt) {
                that.focus();
            });
        },
        /**
         * hover的样式
         * @return {void}
         */
        focus: function() {
            var that = this;
            that.getEle().addClass(pFocusClass);
        },
        /**
         * 离开hover
         * @return {void}
         */
        blur: function() {
            var that = this;
            that.getEle().removeClass(pFocusClass);
        }
    });
    //
    shark.factory.define("PrimitiveMenu", PrimitiveMenu);
    //
    var pTmpl = '<a href="javascript:;" hidefocus="true" \
         class="item <%=this.clsName||"" %> <% if(this.hasMore){%>js-hovermenu-triggle<%}%>" \
         index="<%=this.index%>">\
            <% if(this.icoClass){%>\
                <span class="<%=this.icoClass%>"></span>\
            <%}%>\
            <% if(this.img){%>\
            <span class="item-img">\
                <img src="<%=this.img%>" alt="">\
            </span>\
            <%}%>\
            <span class="item-value"><%= this.name %></span>\
            <% if(this.hasMore){%>\
                <span class="w-icon icon-arrow-right"></span>\
            <%}%>\
        </a>';
    /**
     * menuitem 和结构相关的默认数据
     * @name PrimitiveMenu#DefaultData
     * @property {string} title tip的内容，默认""
     * @property {string} name 菜单的文案，默认""
     * @property {string} icoClass 图标的样式类，默认"";
     * @property {boolean} hasMore 是否还有级联菜单,，默认false
     */
    var pDefaults = {
        tmpl: pTmpl,
        title: "",
        name: "",
        icoClass: "",
        hasMore: false
    };
    var MenuItem = shark.factory.extend("PrimitiveMenu", /**@lends MenuItem# */ {
        /**
         * 使用数据创建一个menu菜单项。一般配合menulist使用。
         * <p>对于tip是否出现的逻辑：如果name本身字数超过了20，则出，否则不出现tips；</p>
         * @author  hite
         * @version 1.0
         * @date    2013-05-28
         * @constructor
         * @constructs
         * @extends {PrimitiveMenu}
         * @param   {object}   _data     数据源，格式为<br/>
         *                                {boolean}:selected 是否选中<br/>
         *                                {boolean}:disabled 是否disabled<br/>
         *                                {boolean}:focused 是否处于hover状态<br/>
         *                                {string}:clsName 自定义样式名<br/>
         *                                {string}:title tip的内容<br/>
         *                                {string}:name 菜单的文案<br/>
         *                                {string}:icoClass 图标的样式类<br/>
         *                                {boolean}:hasMore 是否还有级联菜单<br/>
         *                                {boolean}:isSelector 是否selector使用
         * @param   {object}   _settings 行为参数，包括<br/>
         *                               {function}:onhoverchange 当鼠标在菜单项上有移动时,详见events注释<br/>
         */
        init: function(_data, _settings) {
            // pDefaults不能改变
            var data = $.extend({}, pDefaults, _data);
            var settings = $.extend({}, _settings);
            if(data.icoClass) {
                data.icoClass = shark.cssHelper.getPrefix(data.icoClass) + ' ' + data.icoClass;
            } 

            this.parent(data, settings);
        },
        create : function(){
            var that = this;
            var data = that.getData();
            var html = $.jqote(data.tmpl, data);
            return $(html);
        },
        /**
         * 绑定事件
         * @return {void}
         */
        oncreate: function() {
            var that = this;
            that.parent();
            var data = that.getData();

            var domNode = that.getEle();
            // selector的时候才有 点击加上样式
            if (data.isSelector) {
                domNode.click(function(event) {
                    // $Profiler.log('MenuItem.click.select');

                    that.select();

                    return true;
                }.bind(that));
            }

            if (data.title) {
                domNode.attr('title', data.title);
            }
            // 选中的
            if (data.selected) {
                that.select();
            }
            if (data.focused) {
                that.focus();
            }
            if (data.disabled) {
                that.disable();
            }
            domNode.mouseenter(function(evt) {
                // 聚焦
                that.focus(evt);
                // 处理和外部组件的协同，如同一时间只容许一个hover效果等
                // 顺序要在前面
                return true;
            });
            domNode.mouseleave(function(evt) {
                // 处理和外部组件的协同，如同一时间只容许一个hover效果等
                // 顺序要在前面
                that.blur(evt);
                return true;
            });
        },
        // 
        autoTest: function() {
            var val = this.getValue();
            if (val != null && val.name != null) {
                return val.name;
            }
            return '';
        },
        /**
         * 获取当前组件的数据源
         * @author  hite
         * @version 1.0
         * @date    2013-05-28
         * @return  {object}   数据源
         */
        getValue: function() {
            return this.getData();
        },
        /**
         * 选择当前菜单项
         * @author  hite
         * @version 1.0
         * @date    2013-05-28
         */
        select: function() {
            // $Profiler.log('MenuItem.select');
            var that = this;
            that.getEle('.icon-blank').addClass('icon-selected-s').removeClass('icon-blank');
            // this.getEle().addClass(pSelectedClass);
        },
        /**
         * 判断是否处于选中状态
         * @author  hite
         * @version 1.0
         * @date    2013-05-28
         * @return  {boolean}   true表示选中；false表示没有
         */
        isSelected: function() {
            // 这里有个权衡，是拿样式来判断状态还是拿数据来判断状态的问题
            return this.getEle('.icon-selected-s').length > 0;
            // return this.getEle().hasClass(pSelectedClass);
        },
        /**
         * 取消选择当前菜单项
         * @author  hite
         * @version 1.0
         * @date    2013-05-28
         */
        unselect: function() {
            var that = this;
            that.getEle('.icon-selected-s').removeClass('icon-selected-s').addClass('icon-blank');
            // if (this.getData().icoClass) {
            //     this.getEle().removeClass(pSelectedClass);
            // }
        },
        /**
         * 判断是否处于hover状态
         * @author  hite
         * @version 1.0
         * @date    2013-05-28
         * @return  {boolean}   true表示处于hover状态；false表示没有处于hover状态
         */
        isFocus: function() {
            // 这里有个权衡，是拿样式来判断状态还是拿数据来判断状态的问题
            return this.getEle().hasClass(pFocusClass);
        },
        /**
         * hover的样式
         * @return {void}
         */
        focus: function(evt) {
            var that = this;
            if (!that.isFocus()) {
                if (that.getSettings().onhoverchange) {
                    // $Profiler.log('MenuItem.onhoverchange.in');
                    that.getSettings().onhoverchange(evt, {
                        type: "in"
                    }, that);
                }
                that.parent();
            }
        },
        /**
         * 离开hover
         * @return {void}
         */
        blur: function(evt) {
            var that = this;
            if (that.isFocus()) {
                if (that.getSettings().onhoverchange) {
                    // $Profiler.log('MenuItem.onhoverchange.out');
                    that.getSettings().onhoverchange(evt, {
                        type: "out"
                    }, that);
                }
                that.parent();
            }

        },
        destroy: function() {
            this.parent();
        }
    });


    shark.factory.define("MenuItem", MenuItem);
})();
(function() {
    /**
     * @fileOverview 分割线，用于形成分组
     * @type {String}
     */
    var pTmpl = '<div class="split" keepsite="true"><!----></div>';
    //
    var Sep = shark.factory.extend("Widget", /** @lends Seperator# */ {
        /**
         * 分割线组件，多用于多个相同组件并列的情况，如多个menulist在同一个popupwrap里。
         * @extends {Widget}
         * @constructor
         * @constructs
         * @example
         * new JY.Seperator();
         * @author  hite
         * @version 1.0
         * @date    2013-05-28
         */
        init: function(_settings) {
            this.parent({}, _settings);
        },
        getValue: function() {
            return {
                isSeperator: true
            };
        },
        create: function() {
            return $(pTmpl);
        }
    });

    shark.factory.define("Seperator", Sep);
})();


(function() {
    /**
     * @fileoverview 作为menuitem的容器。和menuitem配合使用
     * @type {String}
     */
    // var pTmpl = '<div class="m-menus <%=this.clsName||""%>"></div>';
    // <!-- 有选中图标时，添加类m-menu-icon -->\
    var pTmpl = '<div class="m-menu <%=this.clsName||""%>">\
                    <table class="tablein">\
                        <tbody>\
                        </tbody>\
                    </table>\
                </div>';
    // 需要添加的iconclass 
    var pIconClsName = "m-menu-icon";

    var pCheckState = {
        none: 0,
        half: 1,
        all: 2
    };
    // 滚动条延迟加载
    var pLazyLoad = {
        // 初始数量
        max : 20,
        // 后续加载数据
        step : 20
    };

    var MenuList = shark.factory.extend("Container", /** @lends MenuList#*/ {
        /**
         * 使用数据源创建一个菜单的列表，包含了hover，select等动作.
         * 目前支持的功能包括，
         * <ol>
         * <li>智能滚动条，让当前项始终在视线中间；</li>
         * <li>menulist内部滚动不影响外部的srcoll。</li>
         * </ol>
         * @author  hite
         * @version 1.0
         * @date    2013-05-28
         * @see  MenuItem
         * @see  Widget
         * @constructs
         * @constructor
         * @extends {Container}
         * @param   {object}   _data     数据源，数据结构包括<br/>
         *                               {object}:cssStyle 样式参数，详见@see Widget注释<br/>
         *                               {string}:clsName 自定义容器的样式<br/>
         *                               {array}:list menuitem的数据源的数组，详见@see MenuItem的注释<br/>
         *                               {boolean}:isSelector 是否是可选中的菜单<br/>
         * @param   {object}   _settings 行为参数，包括<br/>
         *                               {function}:onclick 菜单点击事件，详见MenuItem的events注释<br/>
         *                               {function}:onselectchange isSelector=true时有效。当选中项发生变化时的回调，详见events注释<br/>
         *                               {boolean}:lazyload 是否启用lazyload
         */
        init: function(_data, _settings) {
            var that = this;
            // pDefaults不能改变
            var data = $.extend({
                tmpl: pTmpl
            }, _data);
            var settings = $.extend({
                wrapSelector: '>.tablein>tbody',
                // 是否启动lazyload
                lazyload : true
            }, _settings);
            if(data.cssStyle) {
                if(!that.____maxHeight) {
                    if(data.cssStyle.maxHeight) {
                        that.____maxHeight = data.cssStyle.maxHeight;
                    }
                }
                if(shark.detection.isIE6()) {
                    // ie6下不设置最小宽度
                    data.cssStyle.minWidth = undefined;
                }
            }
            // selector做些特殊处理,不使用lazyload
            if (data.isSelector) {
                var clsName = data.clsName ? pIconClsName + ' ' + data.clsName : pIconClsName;
                data.clsName = clsName;
                // // 占位符 选中需要加上 icon-selected
                $.each(data.list, function(index, item) {
                    // 新的圆点图标样式 icon-selected-s
                    item.icoClass = "icon-blank"; // "icon-selected-s";
                });
                // 有onselectchange的时候
                if (settings.$onselectchange) {
                    settings.onclick = function(_evt, _ctrl) {
                        // $Profiler.log('MenuList.onclick, trigger onselectchange');
                        that.clearSelect();
                        /**
                         * isSelector情况下的事件
                         * @event
                         * @name MenuList#onselectchange
                         * @param {object} event 当前点击事件的event对象
                         * @param {Widget} _ctrl 当前组件对象
                         * @return {boolean} 返回false，true。false会中断onclick的回调
                         */
                        return settings.$onselectchange(_evt, _ctrl);
                    }
                }
            } else if (data.isCheckbox) {
                // selector做些特殊处理
                var clsName = data.clsName ? pIconClsName + ' ' + data.clsName : pIconClsName;
                data.clsName = clsName;
                // // 占位符 选中需要加上 icon-selected
                $.each(data.list, function(index, item) {
                    // 新的圆点图标样式 icon-selected-s
                    // halfchk 半选
                    // fullchk 全选
                    if (item.halfchk) {
                        item.icoClass = "icon-chks icon-chks-halfchk";
                    } else if (item.fullchk) {
                        item.icoClass = "icon-chks icon-chks-fullchk";
                    } else {
                        item.icoClass = "icon-chks";
                    }
                });
                // 有onselectchange的时候
                if (settings.$oncheckchange) {
                    settings.onclick = function(_evt, _ctrl) {
                        $Profiler.log('MenuList.onclick, trigger oncheckchange');
                        var ctrlData = _ctrl.getData();
                        var _checkState = pCheckState.none;
                        var icon = _ctrl.getEle('.icon-chks');
                        if (icon.hasClass('icon-chks-fullchk')) {
                            // 反选
                            icon.removeClass('icon-chks-fullchk');
                            _checkState = pCheckState.none;
                            ctrlData.fullchk = false;
                        } else {
                            // 半选和没有选，都变成全选
                            icon.removeClass('icon-chks-halfchk').addClass('icon-chks-fullchk');
                            _checkState = pCheckState.all;
                            ctrlData.fullchk = true;
                            ctrlData.halfchk = false;
                        }
                        /**
                         * isCheckbox情况下的事件
                         * @event
                         * @name MenuList#oncheckchange
                         * @param {object} event 当前点击事件的event对象
                         * @param {Widget} _ctrl 当前组件对象
                         * @param {number} _checkState 选中状态
                         * @return {boolean} 返回false，true。false会中断onclick的回调
                         */
                        return settings.$oncheckchange(_evt, _ctrl, _checkState);
                    }
                }
            } else {
                for (var i = 0; i < data.list.length; i++) {
                    // 有图标的
                    if (data.list[i].icoClass) {
                        var clsName = data.clsName ? pIconClsName + ' ' + data.clsName : pIconClsName;
                        data.clsName = clsName;
                        break;
                    }
                }
            }

            var html = $($.jqote(data.tmpl, data));
            that.parent(html, data, settings);
            // 当前进度
            that.__loadingCount = 0;
            that.update();
        },
        checkAll: function(isCheck) {
            var that = this;
            var data = that.getData();
            if (data.isCheckbox) {
                var chkboxs = that.getChildren();
                for(var i = 0, j = chkboxs.length; i < j; i++){
                    var chkbox = chkboxs[i];
                    var value = chkbox.getValue();
                    var icon = chkbox.getEle('.icon-chks');
                    if(isCheck){
                        if (!icon.hasClass('icon-chks-fullchk')) {
                            // 半选和没有选，都变成全选
                            icon.removeClass('icon-chks-halfchk').addClass('icon-chks-fullchk');
                            chkbox.getData().fullchk = true;
                            chkbox.getData().halfchk = false;
                        }
                    }else{
                        if (icon.hasClass('icon-chks-fullchk')) {
                            // 反选
                            icon.removeClass('icon-chks-fullchk');
                            chkbox.getData().fullchk = false;
                        }
                    }
                }
            }
        },
        /**
         * 获取check的数据
         */
        getAllCheckValue: function(){
            var that = this;
            var data = that.getData();
            var values = [];
            if (data.isCheckbox) {
                var chkboxs = that.getChildren();
                for(var i = 0, j = chkboxs.length; i < j; i++){
                    var chkbox = chkboxs[i];
                    var data = chkbox.getData();
                    values.push(data);
                }
            }
            return values;
        },
        /**
         * 清空当前所有选中的菜单项
         * @author  hite
         * @version 1.0
         * @date    2013-05-28
         */
        clearSelect: function() {
            $.each(this.getChildren(), function(index, item) {
                if (item.unselect) {
                    item.unselect();
                }
            });
        },
        /**
         * 选中列表中的某项，不支持多选。
         * @author  hite
         * @version 1.0
         * @date    2013-05-28
         * @param   {number}   _index 操作的位置，从0开始。
         */
        setSelectedIndex: function(_index) {
            $.each(this.getChildren(), function(index, menuitem) {
                if (index == _index) {
                    menuitem.select();
                } else {
                    menuitem.unselect();
                }
            });
        },
        /**
         * 更新接口，当数据源发生变化时候，手动调用此接口，刷新数据和显示。
         * @author  hite
         * @version 1.0
         * @date    2013-05-28
         */
        update: function() {
            var that = this;
            that.empty();
            //
            var data = that.getData();
            var dataList = data.list;
            // index标记
            that.__itemIndex = 0;
            if(data.isSelector || data.isCheckbox || !that.getSettings().lazyload) {
                // 不使用lazyload，因为需要显示选中项
                var maxLen = dataList.length;
            } else {
                var maxLen = Math.min(dataList.length, pLazyLoad.max);
            }
            for (var i = 0, index = 0; i < maxLen; i++) {
                var itemData = dataList[i];
                that._addItem(itemData);
            }
            // 更新已经加载的数量
            that.__loadingCount = maxLen;
        },
        /**
         * 添加item
         */
        _addItem : function(itemData) {
            var that = this;
            var data = that.getData();
            // 分隔符
            if (itemData.isSeperator) {
                that.addChild(new shark.Seperator());
            } else if (itemData.isText) {
                // 纯文本
                var textItem = new shark.MyWidget('<div class="item-text">' + itemData.name + '</div>');
                that.addChild(textItem);
            } else {
                itemData.index = that.__itemIndex;
                // 选中index
                itemData.isSelector = data.isSelector;
                // 普通的menuItem
                var menu = new shark.MenuItem(itemData, that.getSettings());
                // 为menulist里的menuitem增加getMenuList方法
                // @deprecated
                menu.getMenuList = function() {
                    return that;
                };
                that.addChild(menu);
                // 自增
                that.__itemIndex ++;
            }
        },
        ondomshow: function() {
            var that = this;
            var data = that.getData();
            // 需要设置高度
            var wrap = this.getEle();
            wrap.bind("mousewheel DOMMouseScroll", function(event) {
                // $Profiler.log('scroll');
                // 滚动一次不能超过一页
                event.preventDefault();

                var height = wrap.height();

                var nativeEvent = event.originalEvent;
                //浏览地图时，使用鼠标滚轮来放大和缩小。即用到了滚轮事件。
                // 这个事件在标准下和IE下是有区别的。firefox是按标准实现的,事件名为"DOMMouseScroll ",IE下采用的则是"mousewheel "。
                // 事件属性，IE是event.wheelDelta，Firefox是event.detail 属性的方向值也不一样，IE向前滚 > 0为120，相反在-120，Firefox向后滚 > 0为3，相反则-3。 
                if (shark.detection.isFirefox()) {
                    var delta = -nativeEvent.detail / 12;
                } else {
                    var delta = nativeEvent.wheelDelta / 120;
                }

                // 3,6,9
                wrap.scrollTop(wrap.scrollTop() - delta * (height/4));

            });
            if(that.__loadingCount < data.list.length) {
                wrap.bind('scroll', function(evt){
                    that._scrollLoad();
                });
            }

            // 滚动条滚动到合适的位置
            that.smartScroll(function(_menuitem) {
                if (_menuitem && typeof _menuitem.isSelected == 'function') {
                    return _menuitem.isSelected();
                } else {
                    return false;
                }
            });
        },
        /**
         * 滚动时候动态加载
         */
        _scrollLoad : function(){
            var that = this;
            if(that._scrollLoadTimeout) {
                clearTimeout(that._scrollLoadTimeout);
                that._scrollLoadTimeout = 0;
            }
            that._scrollLoadTimeout = setTimeout(function(){
                var wrap = that.getEle();
                var scrollTop = wrap.scrollTop();
                // $Profiler.log('scrollLoad：' + scrollTop);

                // 滚动到一定程度，再加载
                if(scrollTop + wrap.height() > (that.__loadingCount - 5) * 28) {
                    var data = that.getData();
                    var dataList = data.list;
                    var maxLen = Math.min(dataList.length, that.__loadingCount + pLazyLoad.step);
                    for (var i = that.__loadingCount; i < maxLen; i++) {
                        var itemData = dataList[i];
                        that._addItem(itemData);
                    }
                    // 更新数量
                    that.__loadingCount = maxLen;
                    if(that.__loadingCount == dataList.length) {
                        // unbind
                        wrap.unbind('scroll');
                    }
                }
            }, 50);
        },
        /**
         * 重写一下，需要计算
         */
        setCssStyle : function(){
            var that = this;
            var data = that.getData();

            // 保存起来
            var cssStyle = data.cssStyle;

            // 滚动条
            if (that.____maxHeight) {
                if(data.list.length * 28 > that.____maxHeight) {
                    // 确实超过了
                    that.getEle().addClass('m-menu-height');
                } else {
                    that.getEle().removeClass('m-menu-height');
                    // 不然不要设置了
                    cssStyle.maxHeight = 0;
                }

            }
            that.parent();
            
        },
        /**
         * 智能的滚动条，自动判断当前的选中或者hover的位置
         * @author  hite
         * @version 1.0
         * @private
         * @date    2013-04-23
         * @param   {function}   _equalFunc 判断是否是目标位置的函数，常见如当前选中，当前hover等
         *                                  参数:
         *                                      1 .menuitem组件
         */
        smartScroll: function(_equalFunc) {
            var that = this;
            if (that.getData().isSelector) {
                // 计算滚动位置
                window.setTimeout(function() {
                    var list = that.getChildren();
                    var index = 0;
                    for (var i = 0; i < list.length; i++) {
                        if (_equalFunc(list[i])) {
                            index = i;
                            break;
                        }
                    }
                    var item = list[index];
                    if(item){
                        var itemHeight = item.getEle().height();
                        var domNode = that.getEle();
                        var wrapHeight = domNode.height();
                        domNode.scrollTop(itemHeight * (index + 1) - wrapHeight / 2);
                    }

                    
                }, 5);
            }
        },
        destroy: function() {
            this.parent();
        }
    });
    shark.factory.define("MenuList", MenuList);
})();
(function() {
    /**
     * @fileOverview 日历类
     *
     * @class Calendar
     * @extends {Widget}
     * @author em91
     */
    var calendar = shark.factory.extend("Widget", /** @lends Calendar# */ {
        // 日期Widget
        _currentMonth: 0,
        _currentYear: 0,
        _currentDay: 0,
        _mode: {
            YEAR: 0,
            MONTH: 1
        },
        _currentMode: 0,
        _initialized: false,
        init: function(data, settings) {
            var that = this;
            var defaultData = {
                'format': 'yyyy-MM-dd',
                'date': new Date()
            };
            var defaultSetting = {
                callback: function() {}
            };

            that.parent($.extend(defaultData, data), $.extend(defaultSetting, settings));
        },
        /**
         * 创建日历容器DOM
         * @private
         * @return {Object}
         */
        create: function() {
            var that = this;
            
            return that.getSettings().trigger;
        },
        /**
         * 生成
         */
        oncreate: function() {
            var that = this;
            var days = shark.i18n.trans('week').split(',');
            var months = shark.i18n.trans('month').split(',');
            //容器、视图模版
            that._template = {
                container: '<div class="cld-hd">\
                            <div class="year">\
                                <div class="cld-prev">\
                                </div>\
                                <span class="js-toggle"></span>\
                                <div class="cld-next">\
                                </div>\
                            </div>\
                            <div class="week js-week">\
                                <div class="dt-line f-cb">\
                                    <div class="day">\
                                        <span>' + days[0] + '</span>\
                                    </div>\
                                    <div class="day">\
                                        <span>' + days[1] + '</span>\
                                    </div>\
                                    <div class="day">\
                                        <span>' + days[2] + '</span>\
                                    </div>\
                                    <div class="day">\
                                        <span>' + days[3] + '</span>\
                                    </div>\
                                    <div class="day">\
                                        <span>' + days[4] + '</span>\
                                    </div>\
                                    <div class="day">\
                                        <span>' + days[5] + '</span>\
                                    </div>\
                                    <div class="day">\
                                        <span>' + days[6] + '</span>\
                                    </div>\
                                </div>\
                            </div>\
                        </div>\
                        <div class="cld-bd">\
                        </div>',

                month: '<div class="cld-months js-months">\
                    <div class="mt-line f-cb">\
                        <div class="month">\
                            <a href="javascript:;" class="js-month" hidefocus="true">' + months[0] + '</a>\
                        </div>\
                        <div class="month">\
                            <a href="javascript:;" class="js-month" hidefocus="true">' + months[1] + '</a>\
                        </div>\
                        <div class="month">\
                            <a href="javascript:;" class="js-month" hidefocus="true">' + months[2] + '</a>\
                        </div>\
                    </div>\
                    <div class="mt-line f-cb">\
                        <div class="month">\
                            <a href="javascript:;" class="js-month" hidefocus="true">' + months[3] + '</a>\
                        </div>\
                        <div class="month">\
                            <a href="javascript:;" class="js-month" hidefocus="true">' + months[4] + '</a>\
                        </div>\
                        <div class="month">\
                            <a href="javascript:;" class="js-month" hidefocus="true">' + months[5] + '</a>\
                        </div>\
                    </div>\
                    <div class="mt-line f-cb">\
                        <div class="month">\
                            <a href="javascript:;" class="js-month" hidefocus="true">' + months[6] + '</a>\
                        </div>\
                        <div class="month">\
                            <a href="javascript:;" class="js-month" hidefocus="true">' + months[7] + '</a>\
                        </div>\
                        <div class="month">\
                            <a href="javascript:;" class="js-month" hidefocus="true">' + months[8] + '</a>\
                        </div>\
                    </div>\
                    <div class="mt-line f-cb">\
                        <div class="month">\
                            <a href="javascript:;" class="js-month" hidefocus="true">' + months[9] + '</a>\
                        </div>\
                        <div class="month">\
                            <a href="javascript:;" class="js-month" hidefocus="true">' + months[10] + '</a>\
                        </div>\
                        <div class="month">\
                            <a href="javascript:;" class="js-month" hidefocus="true">' + months[11] + '</a>\
                        </div>\
                    </div>\
                </div>',

                day: '<div class="cld-dates js-days">\
                <% for( var i = 0; i < 6; i++ ){ %>\
                    <div class="dt-line f-cb js-day-row">\
                        <% for( var j = 0; j < 7; j++ ){ %>\
                        <div class="day js-day">\
                        </div>\
                        <%}%>\
                    </div>\
                <% } %>\
                </div>'
            };
            var settings = that.getSettings();

            var trigger = settings.trigger;

            that.dropMenu = new shark.PrimitiveDropMenu({
                trigger: trigger,
                target: function() {
                    that.ppnl = new shark.PPnl({
                        clsName: 'm-ppnl-calendar'
                    });
                    that.ppnl.addChild(that._template.container);
                    that._initView();
                    return that.ppnl;
                }
            }, {
                axis : 'center'
            });
            that.dropMenu.show();
        },
        destroy : function(){
            var that = this;
            // 上一页，下一页
            if(that._prevBtn){
                that._prevBtn.destroy();
                that._prevBtn = null;
            }
            if(that._nextBtn){
                that._nextBtn.destroy();
                that._nextBtn = null;
            }

            if(that.dropMenu) {
                that.dropMenu.destroy();
                that.dropMenu = null;
            }
            if(that.ppnl){
                that.ppnl.destroy();
                that.ppnl = null;
            }
            
            that.parent();
        },
        close : function(){
            var that = this;
            if(that.dropMenu) {
                that.dropMenu.close();
            }
        },
        /**
         * 显示日历控件
         * @param  {Object} _settings 行为参数，包括<br/>
         *                  {string}:format  日期格式，时间格式： timestamp(时间戳int)/ yyyy-MM-dd / yyyy/MM/dd默认'yyyy-MM-dd'<br/>
         *                  {date}:date  选中的是日期 ，默认 new Date()<br/>
         *                  {function}:callback 点击某天之后的回调
         * @example
         *  $Calendar.show({
         *      format : 'timestamp',
         *      callback : this._getPageWithDate.bind(this)
         *  })
         *
         * @return {void}
         */
        _initView: function() {
            var that = this;
            if (that._initialized) {
                return;
            }
            that._initialized = true;

            that._prevBtn = new shark.IconLinkButton({
                icoClass: "icon-cldprev"
            }, {
                onclick: function() {
                    if (that._currentMode == that._mode.YEAR) {
                        that.goPrevYear();
                    } else if (that._currentMode == that._mode.MONTH) {
                        that.goPrevMonth();
                    }
                }
            });

            that.ppnl.getEle('.cld-prev').append(that._prevBtn.getEle());

            that._nextBtn = new shark.IconLinkButton({
                icoClass: "icon-cldnext"
            }, {
                onclick: function() {
                    if (that._currentMode == that._mode.YEAR) {
                        that.goNextYear();
                    } else if (that._currentMode == that._mode.MONTH) {
                        that.goNextMonth();
                    }
                }
            });

            that.ppnl.getEle('.cld-next').append(that._nextBtn.getEle());

            var date = that.getData().date;
            //默认显示“今天”
            that._currentYear = date.getFullYear();
            that._currentMonth = date.getMonth();
            that._currentDay = date.getDate();

            //默认显示月-日视图
            that._showDayView();

            that._initEvents();

        },

        /**
         * 初始化事件
         * @return {void}
         * @protected
         */
        _initEvents: function() {
            var that = this;

            //点击日历头部可以切换视图
            that.ppnl.getEle('.js-toggle').bind('click', function() {
                if (that._currentMode == that._mode.MONTH) {
                    that._showMonthView();
                }
            });
        },

        /**
         * 月-日视图
         * @return {void}
         * @protected
         */
        _showDayView: function() {
            var that = this;
            var dom = that.ppnl.getEle();
            //隐藏年视图
            shark.tool.hide($('.js-months', dom));
            shark.tool.show($('.js-week', dom));
            if ($('.js-days', dom).size() === 0) {
                var _days = shark.i18n.trans('week').split(",");
                $('.cld-bd', dom).append($.jqote(this._template.day, {
                    days: _days
                }));
            } else {
                shark.tool.show($('.js-days', dom));
                shark.tool.empty($('.js-day', dom));
            }

            //更新头部日期信息
            $('.js-toggle', dom).text(that._currentYear + '-' + (that._currentMonth + 1)).addClass('cld-month');

            var currentMonthDays = new Date(that._currentYear, that._currentMonth + 1, 0).getDate();
            var trs = new Array(6);
            var tds = $('.js-day', dom);

            //计算行数
            var margin = new Date(that._currentYear, that._currentMonth, 1).getDay();
            var rowCount = Math.ceil((margin + currentMonthDays) / 7);

            //隐藏多余的行
            $('.js-day-row', dom).each(function(index, item) {
                if (index > rowCount - 1) {
                    shark.tool.hide($(item));
                } else {
                    shark.tool.show($(item));
                }
            })

            for (var i = 1; i <= currentMonthDays; i++) {
                var date = new Date(that._currentYear, that._currentMonth, i);
                var day = date.getDay();

                var cssStyle = {};
                if (i == new Date().getDate() && (that._currentYear === new Date().getFullYear()) && (that._currentMonth === new Date().getMonth())) {
                    cssStyle = {
                        weight : 'bold',
                        color : 'tip'
                    };
                }

                var icon = new shark.LinkButton({
                    name: i,
                    cssStyle : cssStyle
                }, {
                    onclick: function(event) {
                        that._dateClicked.apply(that, [event]);
                    }.bind(that)
                });
                var pos = 7 * Math.floor((i + margin) % 7 === 0 ? (i + margin) / 7 - 1 : (i + margin) / 7) + day;
                tds.eq(pos).append(icon.getEle());

                //未来日期不可点击
                if (date.getTime() > new Date().getTime()) {
                    icon.disable();
                }
            }

            var date = new Date(that._currentYear, that._currentMonth + 1, 1);

            //不能切换到未来月份
            if (date.getTime() > new Date().getTime()) {
                that._nextBtn.disable();
            } else {
                that._nextBtn.enable();
            }

            shark.tool.show(dom);
            that._currentMode = that._mode.MONTH;
        },

        /**
         * 日期被选择
         * @param  {Event} evt
         * @return {void}
         * @protected
         */
        _dateClicked: function(evt) {
            var that = this;
            var target = $(evt.target);
            if (evt.target.tagName.toUpperCase() == 'A') {
                target = target.parent();
            }

            if (target.hasClass('disabled')) {
                return;
            }

            var day = target.text();
            if (day != '') {
                var date = new Date(that._currentYear, that._currentMonth, parseInt(day, 10));
                var result = that._formatDate(date.getTime(), that.getData().format);
                /**
                 * 点击之后的回调函数
                 * @name Calendar#callback
                 * @event
                 * @param {array} result 当前选中的日期
                 */
                that.getSettings().callback.apply(that, [result]);
            }
        },

        /**
         * 年-月视图
         * @return {void}
         * @protected
         */
        _showMonthView: function() {
            var that = this;
            var dom = that.ppnl.getEle();
            //隐藏月-日视图
            shark.tool.hide($('.js-days, .js-week', dom));

            if ($('.js-months', dom).size() === 0) {
                var _months = shark.i18n.trans('month').split(",");
                $('.cld-bd', dom).append($.jqote(that._template.month, {
                    months: _months
                }));

                //月份被点击
                $('.js-month', dom).bind('click', function(evt) {
                    var target = $(evt.target).closest('div');
                    if (target.hasClass('month-disabled')) {
                        return;
                    }

                    if (target.text() != '') {
                        that._currentMonth = parseInt(target.parent().index() * 3 + target.index() + 1, 10) - 1;
                        that._showDayView();
                    }
                }.bind(that));
            } else {
                shark.tool.show($('.js-months', dom));
                $('.js-month', dom).parent().removeClass('month-disabled');
            }

            //未到的年不可点击
            var tds = $('.js-month', dom);
            for (var i = 0; i < 12; i++) {
                var date = new Date(that._currentYear, i, 1);
                if (date.getTime() > new Date().getTime()) {
                    tds.eq(i).parent().addClass('month-disabled');
                }
                tds.eq(i).parent().removeClass('month-current');
                if (that._currentYear === new Date().getFullYear() && i == new Date().getMonth()) {
                    tds.eq(i).parent().addClass('month-current');
                }
            }

            $('.js-toggle', dom).text(shark.i18n.trans("year", that._currentYear)).removeClass('cld-month');;

            var date = new Date(that._currentYear + 1, 0, 1);
            if (date.getTime() > new Date().getTime()) {
                that._nextBtn.disable();
            } else {
                that._nextBtn.enable();
            }

            shark.tool.show(dom);
            that._currentMode = that._mode.YEAR;
        },

        /**
         * 下个月
         * @return {void}
         * @protected
         */
        goNextMonth: function() {
            var that = this;
            //未来的月份不可点击
            var date = new Date(that._currentYear, that._currentMonth + 1, 1);
            if (date.getTime() > new Date().getTime()) {
                return false;
            }

            that._currentMonth++;
            if (that._currentMonth > 11) {
                that._currentMonth = 0;
                that._currentYear++;
            }
            that._showDayView();
        },

        /**
         * 上个月
         * @return {void}
         * @protected
         */
        goPrevMonth: function() {
            var that = this;
            that._currentMonth--;
            if (that._currentMonth < 0) {
                that._currentMonth = 11;
                that._currentYear--;
            }
            that._showDayView();
        },

        /**
         * 上一年
         * @return {void}
         * @protected
         */
        goPrevYear: function() {
            this._currentYear--;
            this._showMonthView();
        },

        /**
         * 下一年
         * @return {void}
         * @protected
         */
        goNextYear: function() {
            var that = this;
            //未来的年份不可点击
            var date = new Date(that._currentYear + 1, 0, 1);
            if (date.getTime() > new Date().getTime()) {
                return false;
            }

            that._currentYear++;
            that._showMonthView();
        },

        /**
         * 格式化日期
         * @param  {Date/Int} value
         * @param  {String} fmt
         * @return {String/Int}
         * @protected
         */
        _formatDate: function(value, fmt) {
            if (typeof(value) == "number") {
                value = new Date(value);
            }

            if (fmt === 'timestamp') {
                return value.getTime();
            }

            var o = {
                "y+": value.getFullYear(), // 年份      
                "M+": value.getMonth() + 1, //月份        
                "d+": value.getDate(), //日        
                "h+": value.getHours() % 12 === 0 ? 12 : value.getHours() % 12, //小时        
                "H+": value.getHours(), //小时        
                "m+": value.getMinutes(), //分        
                "s+": value.getSeconds(), //秒          
                "S": value.getMilliseconds() //毫秒        
            };

            if (/(y+)/.test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (value.getFullYear() + "").substr(4 - RegExp.$1.length));
            }
            for (var k in o) {
                if (new RegExp("(" + k + ")").test(fmt)) {
                    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
                }
            }
            return fmt;
        }
    });

    shark.factory.define("Calendar", calendar);
})();
(function(){
	/**
	 * @fileOverview 滑动组件
	 */

	var pTmpl = '<div class="w-slide icon-normal-slide w-slide-<%if(this.on){%>on<%}else{%>off<%}%>">\
					<div class="wrapper icon-normal-slide-wrap js-wrapper">\
						<span class="w-icon-normal icon-normal-<%=this.icoClass%> js-slider"></span>\
					</div>\
				</div>';
	// 默认的组件数据
	var pDefaults = {
		clsName:"",
		icoClass:"time"
	};

	var pOnClass = 'w-slide-on';
	var pOffClass = 'w-slide-off';

	// TODO 未来的可配置
	// 拖拽长度
	var slideLength = 50;
	// 拖拽左边偏移量
	var leftOffset = 3;
	// 拖拽右边偏移量
	var rightOffset = -3;
	// 中间拖拽大小，初始化的时候用
	var sliderWidth;
	var Slider = shark.factory.extend("Widget",/** @lends Slider# */{
		/**
		 * 模拟动作按钮里的Slider
		 * @author  hite
		 * @version 1.0
		 * @date    2013-05-28
		 * @constructs
		 * @constructor
		 * @extends {Widget}
		 * @example
		 * var delaySlider = new JY.Slider({
				on : delay
			},{
				onSlider : function(event, _ctrl){
					var isON = _ctrl.getValue();
				}
			});
		 * @param   {object}   _data     数据源，数据结构如，<br/>
		 *                               {boolean}:on 当前是打开还是关闭<br/>
		 *                               {string}:icoClass 图标的样式
		 * @param   {object}   _settings 参数，<br/>
		 *                               {function}:onSlider 滑动时的回调,详见events注释
		 */
		init:function(_data, _settings){
			// pDefaults不能改变
			var data = $.extend({},pDefaults,_data);

			var settings = $.extend({
				/**
				 * 拖动时的回调
				 * @author  hite
				 * @version 1.0
				 * @date    2013-05-28
				 * @event
				 * @name Slider#onslide
				 * @todo onSlide改名为onslide
				 * @param   {Event}   event event对象
				 * @return  {boolean}         false
				 */
				onSlider:function(event){return true;}
			},_settings);
			this.parent(data, settings);
		},
		create:function(){
			var html = $.jqote(pTmpl, this.getData());
			return  $(html);
		},
		oncreate:function(){
			this.parent();
			var domNode = this.getEle();
			var that = this;
			var slider = domNode.find('.js-slider');
			var wrapper = domNode.find('.js-wrapper')
			that.slider = slider;
			that.wrapper = wrapper;
			domNode.click(function(event){
				if($(this).hasClass('js-slider')){
					return;
				}
				that.slider.unbind('mouseout');
				that.slider.unbind('mousemove');
				that.onSlider(event);
				event.stopPropagation();
				return true;
			});
			slider.bind('dragstart',function(event){
				event.preventDefault();
				event.stopPropagation();
				return false;
			});
			slider.click(function(event){
				event.stopPropagation();
			});
			slider.bind('mousedown', function(event){

				if(!sliderWidth){
					sliderWidth = slider.width();
				}
				that._downPointer = {x:event.pageX,y:event.pageY};
				that.lastPointer = null;
				// 记录当前鼠标位置，
				slider.bind('mousemove', that.slidermove.bind(that));
				slider.bind('mouseout', that.sliderout.bind(that));
			});
			slider.bind('mouseup', that.sliderup.bind(that));
		},
		sliderup : function(event){
			var that = this;
			var slider = that.slider;
			var outPointer = {x:event.pageX, y: event.pageY};
			that.slider.unbind('mouseout');
			that.slider.unbind('mousemove');

			var wrapperLeft = that.wrapper.width();
			wrapperLeft = parseInt(wrapperLeft);
			var on = that.getValue();
			if((wrapperLeft >= slideLength/2 && !on) || (wrapperLeft < slideLength/2 && on)){
				that.onSlider(event);
			}

			if(that._downPointer.x == outPointer.x){
				that.onSlider(event);
			}

			that.slider.css("left", '');
			that.wrapper.css("width", '');
			return false;
		},
		sliderout : function(event){
			var that = this;
			var outPointer = {x:event.pageX, y: event.pageY};
			var wrapperLeft = that.wrapper.width();
			wrapperLeft = parseInt(wrapperLeft);
			var on = that.getValue();
			if((wrapperLeft >= slideLength/2 && !on) || (wrapperLeft < slideLength/2 && on)){
				that.onSlider(event);
			}

			that.slider.unbind('mouseout');
			that.slider.unbind('mousemove');

			that.slider.css("left", '');
			that.wrapper.css("width", '');
			event.stopPropagation();
		},
		slidermove : function(event){
			//
			var that = this;

			// if(!this.isBegging()){
			// 	// this._lastPointer = {x:event.pageX,y:event.pageY};
			//  	return true;
			// }
			// // 标记为正在处理
			// this.setBegging(false);

			var nowPointer = {x:event.pageX, y: event.pageY};
			that.lastPointer = that.lastPointer || that._downPointer;
			var lastPointer = that.lastPointer;
			var sliderLeft = that.slider.css("left").replace('px','');
			var wrapperLeft = that.wrapper.css('width').replace('px','');
			sliderLeft = parseInt(sliderLeft);
			wrapperLeft = parseInt(wrapperLeft);

			if(wrapperLeft == 0){
				wrapperLeft = wrapperLeft + leftOffset + (sliderWidth/2);
			}else if(wrapperLeft == slideLength){
				wrapperLeft = wrapperLeft + rightOffset - sliderWidth/2;
			}
			
			sliderLeft += (nowPointer.x - lastPointer.x);
			wrapperLeft += (nowPointer.x - lastPointer.x);
			// $Profiler.log('sliderLeft : ' + sliderLeft + ', wrapperLeft : ' + wrapperLeft);
			// 因为拖拽的icon是占空间的，所以要减去所占空间
			if(sliderLeft < leftOffset || sliderLeft > (slideLength + rightOffset - sliderWidth)){
				return;
			}
			that.slider.css("left", sliderLeft + 'px');
			that.wrapper.css("width", wrapperLeft + 'px');
			that.lastPointer = nowPointer;

			// 标记为正在处理
			// this.setBegging(true);
		},
		onSlider : function(event){
			var that = this;
			var domNode = that.$domNode;
			that.slider.css("left", '');
			that.wrapper.css("width", '');
			domNode.toggleClass(pOnClass);
			domNode.toggleClass(pOffClass);
			return that.getSettings().onSlider(event,that);
		},
		/**
		 * 获取的当前打开状态
		 * @author  hite
		 * @version 1.0
		 * @date    2013-05-28
		 * @return  {boolean}   如果是打开返回true
		 */
		getValue:function(){
			return this.getEle().hasClass(pOnClass);
		},

		setBegging:function(_begin){
			this._begin = _begin;
		},
		isBegging:function(){
			return !!this._begin;
		},
		destroy:function(){
			this.parent();
		}

	});
	//
	shark.factory.define("Slider",Slider);
	//
	
})();

(function(){

    /**
     * @fileOverview checkbox组，内部子组件是checkbox
     */
    var pHoverClass = 'm-group-hover';
    var pGroupTmpl = 
            '<div class="m-group">\
                <div class="group-label js-group-label f-hide <%=this.labelClsName||""%>"></div>\
                <div class="group-action js-group-action f-hide">\
                </div>\
                <%if(this.hasMaxHeight) {%><div class="group-value <%=this.valueClsName||""%>">\
                    <div class="f-scroll-y js-group-value">\
                    </div>\
                </div>\
                <%} else {%>\
                <div class="group-value js-group-value <%=this.valueClsName||""%>">\
                </div>\
                <%}%>\
            </div>';
    var Group = shark.factory.extend("Container",/** @lends Group# */{
        /**
         * checkbox的容器组件。一般而言 checkboxgroup内部是标准的checkbox组件
         * 
         *
         * 
         * var typeCtrl = new JY.Group({
            list:[
                checkbox, checkbox, radio, radio
            ]
        });
         * @param   {object}   data     数据源，格式为<br/>
         *                     {boolean} data.supportHover 支持hover
         *                     {array||string} data.label 左边的组件列表
         *                     {array} data.list 组件列表，
         *                     {array} data.action 右边的组件列表
         *                     {string} data.labelClsName label的样式名称
         *                     {string} data.valueClsName value的自定义样式名称
         *                     {object} data.cssStyle {}
         * @param   {Object}   settings 行为参数，包括，<br/>
         *                              hasMaxHeight : {maxHeight}
         */
        init:function(data,settings){
            var that = this;
            
            var data = $.extend({label : [], list : [], 
                action : [], cssStyle : {}, tmpl : pGroupTmpl}, data);
            if(typeof data.label == 'string') {
                // 兼容
                data.label = [new shark.Text({text : data.label})];
            }
            var settings = $.extend({wrapSelector : '.js-group-value', cssStyle : {}}, settings) ;
            // 最大高度
            data.hasMaxHeight = settings.hasMaxHeight;
            var html = $.jqote(data.tmpl, data);
            that.parent($(html), data,settings);
        },
        oncreate : function () {
            var that = this;
            var data = that.getData();
            for(var i=0;i<data.list.length;i++){
                // 添加 组件到内部
                that.addChild(data.list[i]);
            }
            for(var i=0;i<data.label.length;i++){
                // 添加 组件到label容器
                that.addLabel(data.label[i]);
            }
            for(var i=0;i<data.action.length;i++){
                // 添加 组件到action容器
                that.addAction(data.action[i]);
            }

            // hover
            if(data.supportHover) {
                that.getEle().bind('mouseover', function(evt) {
                    $(this).addClass(pHoverClass);
                });

                that.getEle().bind('mouseleave', function(evt) {
                    $(this).removeClass(pHoverClass);
                });
            }
        },
        /**
         * 添加label
         * @param {Widget} label 左侧组件
         */
        addLabel : function(label){
            var that = this;
            var labelContainer = that.getEle('.js-group-label');
            labelContainer.removeClass('f-hide');
            labelContainer.append(label.getEle());
        },
        /**
         * 添加action
         * @param {Widget} action 右侧组件
         */
        addAction : function(action){
            var that = this;
            var actionContainer = that.getEle('.js-group-action');
            actionContainer.removeClass('f-hide');
            actionContainer.append(action.getEle());
        },
        /**
         * 获取值的集合
         * @return  {array}   值的集合
         */
        getValue:function(){
            var children = this.getChildren();
            return $.map(children,function(item,index){
                var v = item.getValue();
                return v;
            });
        },
        destroy:function(){
            var that = this;
            var data = that.getData();
            if(data && data.label) {
                for (var i = 0; i < data.label.length; i++) {
                    data.label[i].destroy();
                }
                data.label = null;
            }
            if(data && data.list) {
                for (var i = 0; i < data.list.length; i++) {
                    if(shark.factory.isInstance(data.list[i], 'Widget')){
                        data.list[i].destroy();
                    }
                };
                data.list = null;
            }
            if(data && data.action) {
                for (var i = 0; i < data.action.length; i++) {
                    data.action[i].destroy();
                };
                data.action = null;
            }
            that.parent();
        }
    });

    shark.factory.define("Group",Group);
})();

(function(){

    /**
     * @fileOverview checkbox组，内部子组件是checkbox
     */
    
    var CheckboxGroup = shark.factory.extend("Group",/** @lends CheckboxGroup# */{
        /**
         * checkbox的容器组件。一般而言 checkboxgroup内部是标准的checkbox组件
         * 
         * @author  hite
         * @version 1.0
         * @date    2013-05-20
         * @constructor
         * @constructs
         * @see Checkbox
         * @extends {Container}
         * @example
         * 
         * var typeCtrl = new JY.CheckBoxGroup({
            list:[
                {checked:true,name:"朋友",value:1},
                {checked:false,name:"同事",value:2},
                {checked:true,name:"陌生人",value:3}
            ]
        });
         * @param   {object}   data     数据源，格式为<br/>
         *                     {array} list checkbox的数组，详细数据格式见CheckBox的数据源，
         * @param   {Object}   settings checkbox的行为参数，包括，<br/>
         */
        init:function(data, settings){
            var that = this;
            var list = data.list;

            var data = $.extend({checkboxs : []}, data);
            var settings = $.extend({}, settings);
            that.parent(data, settings);
        },
        oncreate : function () {
            var that = this;
            var data = that.getData();
            for(var i=0;i<data.list.length;i++){
                // 添加 组件
                that.addCheckBox(data.list[i]);
            }
            
            for(var i=0;i<data.label.length;i++){
                // 添加 组件到label容器
                that.addLabel(data.label[i]);
            }
            for(var i=0;i<data.action.length;i++){
                // 添加 组件到action容器
                that.addAction(data.action[i]);
            }
        },
        /**
         * 添加checkbox
         */
        addCheckBox : function(checkbox){
            var that = this;
            var data = that.getData();

            var cb = new shark.Checkbox(checkbox,this.getSettings());
            
            data.checkboxs.push(cb);

            var widgets = checkbox.widgets;

            var hrz = new shark.HrzLine();

            hrz.addChild(cb);

            if(widgets && widgets.length > 0) {
                for (var j = 0; j < widgets.length; j++) {
                    hrz.addChild(widgets[j]);
                };
            } 

            that.addChild(hrz);
        },
        getCheckBoxes : function() {
            return this.getData().checkboxs;
        },
        /**
         * 获取值的集合
         * @return  {array}   值的集合
         */
        getValue:function(){
            var children = this.getData().checkboxs;
            return $.map(children,function(item,index){
                var v = item.getValue();
                return v;
            });
        },
        destroy : function(){
            var that = this;
            var data = that.getData();
            if(data && data.checkboxs) {
                for (var i = 0; i < data.checkboxs.length; i++) {
                    data.checkboxs[i].destroy();
                };
                data.checkboxs = null;
            }
            that.parent();
        }
    });
    shark.factory.define("CheckboxGroup",CheckboxGroup);
})();



(function(){

    /**
     * @fileOverview radio组，内部子组件是radio
     */
    // 默认纵向的
    var pDefaultSettings = {
    }
    var RadioGroup = shark.factory.extend("Group",/** @lends RadioGroup# */{
        /**
         * radio的容器组件。一般而言 radiogroup内部是标准的radio组件
         * 
         * 
         * var typeCtrl = new JY.RadioGroup({
            list:[
                {checked:true,name:"朋友",value:1},
                {checked:false,name:"同事",value:2},
                {checked:true,name:"陌生人",value:3}
            ]
        });
         * @param   {object}   data     数据源，格式为<br/>
         *                     {array} list radio的数组，详细数据格式见Radio的数据源，
         * @param   {Object}   settings radio的行为参数，包括，<br/>
         *                              {function}:onclick checkbox点击事件
         */
        init:function(data,settings){
            var that = this;            
            var data = $.extend({radios : [], childs : []}, data);

            that.parent(data, settings);
        },
        oncreate : function () {
            var that = this;
            var data = that.getData();
            for(var i=0;i<data.list.length;i++){
                // 添加 组件
                that.addRadio(data.list[i]);
            }
            
            for(var i=0;i<data.label.length;i++){
                // 添加 组件到label容器
                that.addLabel(data.label[i]);
            }
            for(var i=0;i<data.action.length;i++){
                // 添加 组件到action容器
                that.addAction(data.action[i]);
            }
        },
        /**
         * 添加checkbox
         */
        addRadio : function(checkbox){
            var that = this;
            var data = that.getData();

            var cb = new shark.Radio(checkbox,this.getSettings());

            cb._addNotify(that._uncheckOthers.bind(that));
            
            data.radios.push(cb);

            var widgets = checkbox.widgets;

            if(widgets && widgets.length > 0) {
                var hrz = new shark.HrzLine();

                hrz.addChild(cb);

                for (var j = 0; j < widgets.length; j++) {
                    hrz.addChild(widgets[j]);
                };

                that.addChild(hrz);
            } else {
                that.addChild(cb);
            }
        },
        /**
         * 取消选中其他的
         * @param  {Radio} radio [description]
         */
        _uncheckOthers : function(radio){
            // 选中了radio
            var children = this.getData().radios;
            for (var i = 0; i < children.length; i++) {
                var child = children[i];

                if(child != radio && child.isChecked()) {
                    // 反选选择
                    child.check(false);
                }
            };
        },
        /**
         * 选中的值
         * @return  {object}   选中的值
         */
        getValue:function(){
            var children = this.getData().radios;
            for (var i = 0; i < children.length; i++) {
                var child = children[i];
                if(child.isChecked()) {
                    return child.getValue();
                }
            };
        },
        destroy : function(){
            var that = this;
            var data = that.getData();
            if(data && data.radios) {
                for (var i = 0; i < data.radios.length; i++) {
                    data.radios[i].destroy();
                };
                data.radios = null;
            }
            that.parent();
        }
    });
    shark.factory.define("RadioGroup",RadioGroup);
})();


(function(){

    /**
     * @fileOverview edit组，内部子组件是tight input
     */
    var InputGroup = shark.factory.extend("Group",/** @lends InputGroup# */{
        /**
         * checkbox的容器组件。一般而言 checkboxgroup内部是标准的checkbox组件
         * 
         * @author  hite
         * @version 1.0
         * @date    2013-05-20
         * @constructor
         * @constructs
         * @see Checkbox
         * @extends {Container}
         * @example
         * 
         * var typeCtrl = new JY.InputGroup({
         *   group:[
         *       [
         *           {value:"", placeholder:"请输入1"},
         *           {value:"", placeholder:"请输入2"}
         *       ],
         *       [
         *           {value:"", placeholder:"请输入3"},
         *           {value:"", placeholder:"请输入4"},
         *           {value:"", placeholder:"请输入5"}
         *       ]
         *   ],
         *   list: [
         *       {value:"", placeholder:"请输入6"},
         *       {value:"", placeholder:"请输入7"}
         *   
         *   ]
         * });
         * @param   {object}   data     数据源，格式为<br/>
         *                     {array} data.group 多行的时候使用
         *                         
         *                         tightinput 的数组，详细数据格式见tightinput的数据源，
         *                     {array} data.list 单行的时候使用
         *                         tightinput 的数组，详细数据格式见tightinput的数据源，
         *                         
         * @param   {Object}   settings tightinput的行为参数，包括，<br/>
         *                              
         */
        init:function(data,settings){
            var that = this;
            if(data.list) {
                data.group = [data.list];
            }

            var lines = [];
            for (var i = 0; i < data.group.length; i++) {
                var list = data.group[i];
                var config = {};
                if(list.length ==1) {
                    // 只有一个input的时候，自适应
                    config.wrapClsName = 'm-wrap-iptauto';
                }
                var line = new shark.HrzLine();
                for (var j = 0; j < list.length; j++) {
                    var inputData = $.extend({}, config, list[j]);
                    line.addChild(new shark.TightInput(inputData, settings));
                };
                lines.push(line);
            };
            var data = $.extend({}, data);

            data.list = lines;

            that.parent(data, settings);
        },
        /**
         * 获取值的集合
         * @return  {array}   值的集合
         */
        getValue:function() {
            var children = this.getChildren();
            var values = [];
            for (var i = 0; i < children.length; i++) {
                var item = children[i];
                if(shark.factory.isInstance(item, 'HrzLine')) {
                    var children2 = item.getChildren();
                    for (var j = 0; j < children2.length; j++) {
                        values.push(children2[j].getValue());
                    }
                }
            }
            return values;
        },
        /**
         * 添加input
         * @param {Object} input 数据
         */
        addInput : function(input){
            var that = this;
            var ti = new shark.TightInput(input, that.settings);
            that.addChild(ti);
        }
    });
    shark.factory.define("InputGroup",InputGroup);
})();


(function(){

    /**
     * @fileOverview checkbox组，内部子组件是checkbox
     */
    var pVtcGroupTmpl = 
        '<div class="m-set <%=this.clsName || ""%>">\
            <div class="set-hd <%if(!this.header){%>f-hide<%}%>"><%=this.header%><span class="dot"></span></div>\
            <div class="set-bd">\
                <div class="tit f-hide js-vtc-group-tit"></div>\
                <div class="cnt js-vtc-group-value"></div>\
            </div>\
        </div>';
    var VtcGroup = shark.factory.extend("Container",/** @lends VtcGroup# */{
        /**
         * checkbox的容器组件。一般而言 checkboxgroup内部是标准的checkbox组件
         * 
         *
         * 
         * var typeCtrl = new JY.Group({
            list:[
                checkbox, checkbox, radio, radio
            ]
        });
         * @param   {object}   data     数据源，格式为<br/>
         *                     {array||string} data.label 左边的组件列表
         *                     {array} data.list 组件列表，
         *                     {array} data.action 右边的组件列表
         * @param   {Object}   settings 行为参数，包括，<br/>
         *                              hasMaxHeight : {maxHeight}
         */
        init:function(data,settings){
            var that = this;
            
            var data = $.extend({label : [], tit : [], tmpl : pVtcGroupTmpl}, data);
            if(typeof data.tit == 'string') {
                // 兼容
                data.tit = [new shark.Text({
                    text: data.tit,
                    cssStyle: {
                        color: 'assist'
                    }
                })];
            }
            var settings = $.extend({wrapSelector : '.js-vtc-group-value', 
                cssStyle : {}}, settings) ;
            var html = $.jqote(data.tmpl, data);
            that.parent($(html), data, settings);
        },
        oncreate : function () {
            var that = this;
            var data = that.getData();
            for(var i=0;i<data.list.length;i++){
                // 添加 组件到内部
                that.addChild(data.list[i]);
            }
            for(var i=0;i<data.tit.length;i++){
                // 添加 组件到label容器
                that.addTit(data.tit[i]);
            }
        },
        /**
         * 添加tit
         * @param {Widget} label 左侧组件
         */
        addTit : function(label){
            var that = this;
            var labelContainer = that.getEle('.js-vtc-group-tit');
            labelContainer.removeClass('f-hide');
            labelContainer.append(label.getEle());
        },
        /**
         * 获取值的集合
         * @return  {array}   值的集合
         */
        getValue:function(){
            var children = this.getChildren();
            return $.map(children,function(item,index){
                var v = item.getValue();
                return v;
            });
        },
        destroy:function(){
            this.parent();
        }
    });

    shark.factory.define("VtcGroup",VtcGroup);
})();


(function(){
    /**
     * @fileOverview dropmenu的动作类组件。主要提供点击类触发事件的响应动作。
     *  包括如何触发显示，如何显示，如何消失等内容。
     */

    /**
     * 默认的显示和隐藏方法。即元素原生的显示和隐藏。
     * @name Hinger#events
     * @property {function} hide 隐藏函数
     * @property {function} show 显示函数
     * @type {Object}
     */
    var pEvents = {
        // 默认清除其它的
        clearOther : true,
        hide:function(_wall,_door){
            _door.hide();
        },
        show:function(_wall,_door){
            _door.show();
        },
        dock : function(_wall, _door, settings){
            var direction = settings.direction || 'V';
            shark.dock['dock' + direction](_wall, _door, settings);
        }
    }
    var Hinger = shark.factory.extend("Component"/** @lends Hinger# */,{
        /**
         * <p>hinger的意思是 连接 门和墙的一种东西。墙是固定的接受点击，触发门相关动作。hinger表示墙接受触发之后和门之间的关系。
         * 因为门和墙之间的关系不仅仅是这个hinger咬合的关系，还可是hover，右键菜单等行为相关联。将他们分离是为更好的解耦，灵活的增加更多的行为</p>
         * 
         * 普通的下拉菜单的触发动作。
         * <p>hinger只管理触发的时机和触发的方式。不处理显示，隐藏，dock等的逻辑，因为这部分逻辑基本是一致的。所有hingger和hinger的子类</p>
         * @author  hite
         * @version 1.0
         * @date    2013-05-28
         * @history 2013-5-20:  增加了异步生成doorFunc的机制。
         * @constructor
         * @param   {object|DOM}   _wall     点击触发下拉的元素组件，通常是个按钮。    
         * @param   {function}   _doorFunc 点击触发元素之后，要产生组件的函数，这个函数返回一个组件，或者是一个dom节点，详见_doorFunc函数注释。
         * @param   {Object}   _settings 行为参数，<br/>
         *                               {function}:dock 类似从dropmenu这类显示组件传入的如何停靠_doorFunc刚刚产生的节点。<br/>
         *                               {function}:show 标示触发显示时，如何显示的回调。通常有一些动画，或者设置标记等操作<br/>
         *                               {function}:hide 标示触发消失时，如何消失的回调。通常有一些动画，或者清除标记，回收资源等操作，在全局clearpopup时也执行此函数<br/>
         *                               {boolean}:once 标示是否使用缓存。true表示只需要执行一次_doorFunc，下次触发显示时，直接使用缓存;false表示每次都生成新的door，同时清除掉上一次的door；<br/>
         *                               {boolean}:clearOther 是否要消除其它的，默认消除
         */
        init:function(_data, _settings){
            var that = this;
            var _wall = _data.trigger;
            var _doorFunc = _data.target;

            if(shark.factory.isInstance(_wall, 'Widget')) {
                _wall = _wall.getEle();
            } else {
                _wall = $(_wall);
            }

            // 处理这个wrap
            if(_wall.hasClass('m-wrap')) {
                _wall = _wall.find('>:first');
            }
            _data.trigger = _wall;
            _data.target = _doorFunc;
            var settings = $.extend({}, pEvents, _settings);
            // 如果是wrap的，获取wrap里面的最为触发
            
            that.parent(_data, settings);
            if(!settings.isHoverMenu && !settings.isContextMenu) {
                that.bindEvent();    
            }
        },
        bindEvent : function(){
            var that = this;
            var data = that.getData();
            var settings = that.getSettings();

            data.trigger.bind(settings.triggerType, function(event){
                if(event.type == "mousedown"  && event.which !== 1){
                    return true;
                }
                
                if(data.door && data.door.isVisible()){
                    // 第一次点击，应该弹出
                    that.hide();
                }else{
                    // 需要先clear，可以设置要不要clear
                    if(settings.clearOther) {
                        shark.popmenuHelper.clear();
                    }

                    window.setTimeout(function(){
                        // $Profiler.time('showDoor');
                        //  执行它需要有that.door的存在
                        var showDoorFunc = that.__showDoorFunc.bind(that);
                        // no2
                        if(data.door == null || that.isDirty() || settings.once == false){
                            if(data.door){
                                data.door.destroy();
                                data.door = null;
                            }
                            /**
                             * 生成被弹出层的函数，支持同步和异步两种方式
                             * 
                             * @event
                             * @example
                             * // 同步的例子
                             *  new PrimitiveDropMenu(ele,function(){return $(".cs-js")});
                             * //异步生成的例子;

                             * @name Hinger#eleGenerator
                             * @param {object} wall 传入当前触发弹出层显示的元素，通常是按钮。
                             * @return {function|Widget|object} 返回值可以是组件，也可以是一个functioin，<br/>
                             *         异步情况下返回function，这个function，接受一个callback回调。而这个callback回调接受一个参数，表示异步生成的组件或者dom元素。
                             *  
                             */
                            var desendant = data.target(that.wall);
                            if(typeof desendant == "function"){// 支持返回产生元素的函数，而不是直接返回元素
                                desendant(showDoorFunc);
                            }else{
                                showDoorFunc(desendant);
                            }
                        }else if(data.door){// 同步
                            showDoorFunc(data.door);
                        }
                        // $Profiler.timeEnd('showDoor');
                    }, 15);
                }
                return true;
            });
        },
        __showDoorFunc : function(_door){
            var that = this;
            var data = that.getData();
            var settings = that.getSettings();

            data.door = that._createDoor(_door);
            var doorEle = data.door.getEle();
            var trigger = data.trigger;
            settings.dock(trigger, doorEle, settings);
            
            shark.popmenuHelper.add(doorEle,{
                dismiss:function(){
                    that.hide(trigger, doorEle);

                    trigger = null;
                    doorEle = null;
                }
            });

            that.show();
        },
        /**
         * 执行hinger的隐藏，处理自己相关逻辑之后，调用settings里的hide
         * @author  hite
         * @version 1.0
         * @date    2013-05-28
         */
        hide:function(){
            var that = this;
            var data = that.getData();
            var settings = that.getSettings();

            that._selectTrigger(false);
            if(data.door){
                var oldDoor = data.door.getEle();
                if(that.isDirty() || settings.once == false){
                    if((oldDoor.hasClass('m-ppnl') || oldDoor.hasClass('m-menuwrap')) && settings.triggerType != 'search') {
                        oldDoor.removeClass('f-ani-ppnlmenu');
                        setTimeout(function(){
                            // $Profiler.debug('hide Door 0');
                            shark.factory.destroyInContainer(oldDoor);
                            if(data.door) {
                                data.door.destroy();
                                data.door = null;
                            }
                            settings.hide(data.trigger, oldDoor);
                        }, 200);
                    } else {
                        settings.hide(data.trigger, oldDoor);
                        // $Profiler.debug('hide Door 1');
                        shark.factory.destroyInContainer(oldDoor);
                        if(data.door) {
                            data.door.destroy();
                            data.door = null;
                        }
                    }
                } else {
                    if((oldDoor.hasClass('m-ppnl') || oldDoor.hasClass('m-menuwrap')) && settings.triggerType != 'search') {
                        oldDoor.removeClass('f-ani-ppnlmenu');
                        settings.hide(data.trigger, oldDoor);    
                    } else {
                        // $Profiler.debug('hide Door 3');
                        settings.hide(data.trigger,oldDoor);   
                    }
                }
            }
        },
        /**
         * 有下拉的时候，选中当前项
         * @param  {Boolean} isSelect [description]
         */
        _selectTrigger : function(isSelect) {
            var that = this;
            var trigger = that.getData().trigger;

            if(trigger.prop('tagName') === 'A') {
                var method = isSelect ? 'addClass': 'removeClass';
                // w-linkicon-selected w-clk-selected w-button-selected
                if(trigger.hasClass('w-button-select')) {
                    trigger[method]('w-button-select-selected');
                } else if(trigger.hasClass('w-clk')) {
                    trigger[method]('w-clk-selected');
                } else if(trigger.hasClass('w-linkicon')) {
                    trigger[method]('w-linkicon-selected');
                } else if(trigger.hasClass('w-button')) {
                    trigger[method]('w-button-selected');
                } else if(trigger.hasClass('item')) {
                    trigger[method]('item-selected');
                }
            }
        },
        /**
         * 执行hinger的显示，处理自己相关逻辑之后，调用settings里的show.
         * 其中包括doorCtrl的show方法。这样door元素和尺寸相关的逻辑得到执行。
         * @author  hite
         * @version 1.0
         * @date    2013-05-28
         */
        show:function(){
            // $Profiler.log('Hinger.show');
            var that = this;
            var data = that.getData();
            var settings = that.getSettings();
            that._selectTrigger(true);
            // 在show之前执行，尺寸相关的逻辑得到执行。这样在settings.show时候的dock位置才是正确的。
            if(that.door){
                that.door.show();
            }
            // 显示出来之后才能获取到尺寸
            if(data.door) {
                // 定位问题
                settings.show(data.docker || data.trigger, data.door.getEle(), settings);
                // 动画
                // .m-ppnl, .m-menuwrap
                if(data.door.getEle().hasClass('m-ppnl') || data.door.getEle().hasClass('m-menuwrap')) {
                    data.door.getEle().addClass('f-ani-ppnlmenu');
                }
            }
        },
        isDirty:function(){
            return !!this._dirty;
        },
        /**
         * 控制是否需要重构下拉菜单
         * @author  hite
         * @version 1.0
         * @date    2012-5-25
         * @param   {boolean}    _dirty 下拉菜单是否已经失效，true表示已经失效，false表示没有失效
         */
        setDirty:function(_dirty){
            var that = this;
            that._dirty = _dirty;
            if(_dirty) {
                var data = that.getData();
                if(data.door) {
                    data.door.destroy();
                    data.door = null;
                }
            }
        },
        /**
         * 根据当前获取到的_door，标准化_door的返回值
         * @author  hite
         * @version 1.0
         * @date    2013-05-28
         * @protected
         * @param   {object|Widget|String}   _door 当前被弹出的对象。
         * @return  {jqueryObject}         标准的jquery元素对象,为了兼容传入一些字符串的情况。
         */
        _createDoor:function(_door){
            var that = this;
            // 如果是组件
            if(shark.factory.isInstance(_door,'Widget')){
                return _door;
            }else {
                return new shark.MyWidget(_door);
            }
        },
        getDoor : function(){
            return this.getData().door.getEle();
        },
        destroy:function(){
            var that = this;
            var data = that.getData();
            if(data) {
                if(data.trigger){
                    data.trigger = null;
                }
                if(data.target) {
                    data.target = null;
                }
                if(data.door) {
                    data.door.destroy();
                    data.door = null;
                }
            }

            that.parent();
        }

    });
    //
    shark.factory.define("Hinger",Hinger);
})();



(function(){
    /**
     * @fileoverview 右键菜单的动作函数，和dropmenu需要配合使用
     * @type {String}
     */

    //
    var ContextMenuTrigger = shark.factory.extend("Hinger",/** @lends ContextMenuTrigger# */{
        /**
         *  提供右键行为的hingger类。基本行为是点击右键之后，触发弹出窗口，自动定位在合适的位置。<br/>
         *  在连续点击右键时，自动消失上一个。<br/>
         * @author  hite
         * @version 1.0
         * @date    2013-05-20
         * @constructor
         * @todo 定位不使用dockv，需要新增加一个以鼠标当前定位为基准的停靠。
         * @extends {Hinger}
         * @param   {object|jqueryObject}   _wall     响应右键的区域
         * @param   {object|function}   _doorFunc 要弹出的部分或者生成要弹出部分的的函数
         * @param   {object}   _settings 行为参数，详细参数见Hinger。包括<br/>
         *                               {object}:positionFix 对定位的修正，计算的标准是在右下时的偏移。<br/>
         *                               {boolean}:once 是否只需要生成一次
         */
        init:function(_data,_settings){
            var that = this;
            var settings = $.extend({isContextMenu : true}, _settings);
            
            that.parent(_data, settings);

            var trigger = that.getData().trigger;
            trigger.bind("mousedown",function(event){
                //do not use event.button (compatiable issues)
                // 需要判断右键
                // $Profiler.log('mouse: ' + event.which);
                if(event.which !== 3){
                    return true;
                }
                // 清空上一个
                shark.popmenuHelper.clear();
                
                // 需要处理滚动条
                // 当前相对定位的位置
                setTimeout(function(){
                     that._showContextMenu({
                        left:event.clientX,
                        top:event.clientY
                    }, event.target);
                });
               
                // event.stopPropagation();
                // event.preventDefault();
                return false;
            });
            trigger.bind("contextmenu", function(){
                return false;
            });
        },
        /**
         * 显示右键
         * @param  {{x,y}} _offset 相对于offsetparent的位置
         */
        _showContextMenu:function(_offset,_site){
            var that = this;
            var data = that.getData();
            var settings = that.getSettings();

            if( data.door==null || settings.once==false || that.isDirty()){
                if(data.door){
                    data.door.destroy();
                }
                /**
                 * 当点击右键，第一次初始化执行的函数。
                 * @event
                 * @name ContextMenuTrigger#eleGenerator
                 * @param {object} wall 当前响应右键的区域
                 * @param {object} site 点击事件发生地的target对象
                 * @return {Widget|object} 返回需要显示的dom后者组件
                 */
                data.door = that._createDoor(data.target(data.trigger,_site));
                data.door.getEle().bind("contextmenu",function(){
                    return false;
                });
            }
            // that.wall.connect(that.door);
            settings.dock(data.trigger,data.door.getEle(), settings);
            // 相对位置
            settings.position = _offset;

            that.show();
            //
            shark.popmenuHelper.add(data.door.getEle(),{
                dismiss:function(){
                    that.hide();
                }
            });
        }
    });
    shark.factory.define("ContextMenuTrigger",ContextMenuTrigger);
})();



(function(){

    /**
     * 显示和隐藏的延时，即触发显示条件之后多久出现；触发隐藏条件之后多久消失。
     * @name HoverTrigger#defaults
     * @property {number} showDelay 隐藏延时,默认500ms
     * @property {number} hideDelay 显示延时,默认500ms
     * @type {Object}
     */
    var pDefaults = {
        showDelay:500,
        hideDelay:500
    };
    var Hover = shark.factory.extend("Hinger",/** @lends HoverTrigger# */{
        /**
         * 悬浮动作触发弹出层的动作类。目前不支持代理的方式新建组件；
         * @author  hite
         * @version 1.0
         * @date    2013-05-28
         * @constructs
         * @constructor
         * @extends {Hinger}
         * @param   {object|DOM}   _wall     点击触发下拉的元素组件，通常是个按钮。    
         * @param   {function}   _doorFunc 点击触发元素之后，要产生组件的函数，这个函数返回一个组件，或者是一个dom节点，详见_doorFunc函数注释。
         * @param   {Object}   _settings 行为参数，dock,show,hide,once参数详见@see Hinger注释<br/>
         *                               {number}:hideDelay 隐藏延时,触发隐藏条件之后多久消失<br/>
         *                               {number}:showDelay 显示延时,触发显示条件之后多久出现<br/>
         */
        init:function(_data,_settings){
            var settings = $.extend({isHoverMenu : true}, pDefaults,_settings);

            var that = this;

            that.parent(_data, settings);

            that.bindEvent();
        },
        bindEvent : function(){
            var that = this;
            var data = that.getData();
            data.trigger.bind("mouseenter",function(event){
                that._onmouseenter(this,event);
                return true;
            });

            data.trigger.bind("mouseleave",function(event){
                that._onmouseleave(this,event);
                return true;
            });
        },
        _onmouseleave:function(){
            var that = this;
            // 清除掉enter的响应
            if(that._mouseenterTimer){
                window.clearTimeout(that._mouseenterTimer);
                that._mouseenterTimer = null;
            }
            if(!that._mouseleaveTimer) {
                that._mouseleaveTimer = window.setTimeout(function(){
                    that.hide();
                    //
                    that._mouseleaveTimer = null;
                },that.getSettings().hideDelay);
            }
        },
        _onmouseenter:function(){
            var that = this;
            var data = that.getData();
            var settings = that.getSettings();

            if(that._mouseenterTimer) {
                return ;
                // 已经在显示了
            }
            // 清除掉leave的响应
            if(that._mouseleaveTimer){
                window.clearTimeout(that._mouseleaveTimer);
                that._mouseleaveTimer = null;
            }

            // 已经在显示了
            if(data.door && data.door.isVisible()){
                return;
            }
            that._mouseenterTimer = window.setTimeout(function(){
                // 检查能不能显示
                if(typeof settings.onbeforeshow === 'function') {
                    if(!settings.onbeforeshow()) {
                        that.hide();
                        return;
                    }
                }
                if( data.door == null || settings.once==false || that.isDirty()){
                    if(data.door){
                        data.door.destroy();
                    }
                    data.door = that._createDoor(data.target(that.trigger));
                    data.door.getEle().css("position","absolute");
                }
                that.bindHoverMenuEvents(data.door.getEle());
                // that.wall.connect(that.door);
                settings.dock(data.trigger, data.door.getEle(), settings);
                //
                that.show();
                //
                that._mouseenterTimer = null;
            },settings.showDelay);
        },
        /**
         * 停止show出来
         */
        _stopShowingHoverMenu : function(){
            var that = this;
            if(that._mouseenterTimer){
                window.clearTimeout(that._mouseenterTimer);
                that._mouseenterTimer = null;
            }
        },
        hide : function(){
            // 阻止掉还没有show出来的玩意
            this._stopShowingHoverMenu();
            this.parent();
        },
        /**
         * @private
         */
        bindHoverMenuEvents:function(_door){
            if(_door.data("hovermenu_inited")) {
                return;
            }

            var that = this;
            //
            _door.bind("mouseenter",function(event){
                if(that._mouseleaveTimer){
                    window.clearTimeout(that._mouseleaveTimer);
                    that._mouseleaveTimer = null;
                }
                return true;
            });
            _door.bind("mouseleave",function(event){
                that._onmouseleave(this,event);
                return true;
            });
            _door.data("hovermenu_inited",true);
        }
    });
    shark.factory.define("HoverTrigger",Hover);
})();

(function(){
    /**
     * @fileoverview 普通附件，网盘附件，超大附件等附件的base结构
     * @type {String}
     */

    // 需要添加的iconclass 
    var bread = shark.factory.extend("Widget",/** @lends MenuList#*/{
        /**
         * 使用数据源创建一个菜单的列表，包含了hover，select等动作.
         * 目前支持的功能包括，
         * <ol>
         * <li>智能滚动条，让当前项始终在视线中间；</li>
         * <li>menulist内部滚动不影响外部的srcoll。</li>
         * </ol>
         * @author wuzifang@corp.netease.com
         * @param   {object}   _data     数据源，数据结构包括<br/>
         *                               @see pDefaultData
         *                              
         * @param   {object}   _settings 行为参数，包括<br/> @see pDefaultSettings
         * 
         *                               {function}:onclick 点击事件 onclick(path);
         * @return {dom} 组件实例
         */
        init:function(data, settings){
            var that = this;
            // <!-- 有选中图标时，添加类m-menu-icon -->\
            // m-file 上加 m-file-hover和 m-file-selected
            var pContainerTmpl = 
            '<div class="m-bread f-cb">\
                <%if(this.data.label){%><span class="tit"><%=this.data.label%></span><%}%>\
                <%\
                    if(this.data.hidePaths.length > 0){\
                %>\
                <a href="javascript:;" hidefocus="true" class="w-icon icon-more-s js-hide-folders" title="选择上一级"></a>\
                <span class="sep">&gt;</span>\
                <%}%>\
                <%\
                    var list = this.data.listPaths;\
                    for(var i=0; i< list.length; i++){\
                        var name = list[i].name;\
                        var showName = shark.detection.isIE6() ? shark.tool.cutOffStr(name, 14) : name;\
                        var path = list[i].path;\
                %>\
                    <% if(i != list.length - 1) {%>\
                       <a href="javascript:;" hidefocus="true" \
                        class="cnt js-folder" name="<%=path%>" title="<%=name%>"><%=showName%></a>\
                       <span class="sep">&gt;</span>\
                    <%} else {%>\
                        <span class="cnt"><%=showName%></span> \
                    <%}%>\
                <%}%>\
            </div>';

            var pDefaultData = {
                // id的path
                path : '',
                maxDepth : 3,
                label : ''
            };
            var pDefaultSettings = {
                pContainerTmpl : pContainerTmpl,
                // 获取路径对应的名称
                getPathName : function (pathId) {
                    return pathId;
                },
                onclick : function (path, fullPath) {
                    // 选择的path
                }
            };
            var data = $.extend({}, pDefaultData, data);
            var settings = $.extend({}, pDefaultSettings, settings);

            that.parent(data, settings);
        },
        /**
         * 更新目录
         */
        create : function(){
            var that = this;
            var data = that.getData();
            var settings = that.getSettings();

            var _path = data.path;
            // 计算当前的path
            // 隐藏的
            var hidePaths = [];
            // 显示的
            var listPaths = [];
            if(_path === '/') {
                listPaths.push({name : settings.getPathName('/'), path : '/'});
            } else {
                var ps = _path.split('/');
                
                for(var i=0;i<ps.length;i++) {
                    var name = settings.getPathName(ps[i] || '/');
                    var path = ps.slice(0, i + 1).join('/');
                    if(i == 0) {
                        name = settings.getPathName('/');
                        path = '/';
                    }
                    if(i < ps.length - data.maxDepth) {
                        hidePaths.push({name : name, path : path});
                    } else {
                        listPaths.push({name : name, path : path});
                    }
                }
            }

            var dom = $($.jqote(settings.pContainerTmpl,
             {data : {listPaths : listPaths, hidePaths : hidePaths, label : data.label}}));

            // 初始化dropmenu
            if(hidePaths.length > 0) {
                that._updateHidePaths(new shark.MyWidget(dom.find('.js-hide-folders')), hidePaths);
            }
            dom.delegate('.js-folder', 'click', function (evt) {
                var path = $(evt.target).attr('name');
                that._selectPath(path);
            })
            return dom;
        },
        _updateHidePaths : function(moreBtn, hidePaths){
            var that = this;
            if(that.hideMenu) {
                that.hideMenu.destroy();
                that.hideMenu = null;
            }
            if(hidePaths.length == 0) {
                return;
            }
            var moreDataProvider = {
                dataGenerator:function(_ctrl){
                    var list = [];
                    for(var i=0;i<hidePaths.length;i++) {
                        list.push({name : hidePaths[i].name, action : "changePath", value : hidePaths[i].path});
                    }
                    return list;
                }
            };

            that.hideMenu = new shark.DropMenu(moreDataProvider, 
            {
                trigger : moreBtn, 
                onclick : function(_evt, _ctrl){
                    var source = _ctrl.getValue();
                    var action = source.action;
                    switch(action){
                        case "changePath": // 切换
                            that._selectPath(source.value);
                            break;
                        default:
                            break;
                    }
                    that.hideMenu.close();
                    return true;
                }
            });
            that.hideMenu.show();
        },
        _selectPath : function (fullPath) {
            if(fullPath == '/') {
                var path = '/';
            } else {
                var paths = fullPath.split('/');
                var path = paths[paths.length - 1];
            }
            
            this.getSettings().onclick(path, fullPath);
        },
        destroy:function () {
            
            if(this.hideMenu) {
                this.hideMenu.destroy();
                this.hideMenu = null;
            }
            this.parent();
        }
    });
    shark.factory.define("Bread",bread);


})();
! function() {

    var Drag = shark.factory.extend("Widget", /** @lends DragSort# */ {
        _lastPointer: null,
        /**
         * 拖拽类，用于拖拽排序，如弹窗的拖动
         * @version 1.0
         * @date    2012-3-27
         * @constructor
         * @todo 支持代理模式，移动过程中以需框代替
         * @param {object} _data 数据
         *                       {dom} _data.trigger 响应拖动操作的部分,
         *                            当鼠标移动到这部分时，鼠标样式为可拖动。
         *                       {dom} _data.element
         *                            被拖动的元素，鼠标移动时，随着鼠标移动的部分
         *                       {dom} _data.container
         *                            被拖动的元素的移动范围
         *                       {string} _data.action
         *                            drag的类型
         * @param {object} _settings 拖动的行为参数，包含内容,<br/>
         *                           {function}:ondragstart 当拖动开始时，执行的回调，详见events注释<br/>
         *                           {function}:ondragmove 拖动移动中，执行的回调，详见events注释<br/>
         *                           {function}:ondragend 当拖动结束时，执行的回调，详见events注释<br/>
         */
        init: function(_data, _settings) {
            var that = this;
            var data = $.extend( {
                trigger: null,
                element: null,
                container : null,
                // 上下 row-resize 
                // 左右 col-resize
                // 移动 move
                // 普通的移动 move resize
                action : 'move',
                // 方向
                axis:'x y',
                // 鼠标样式
                cursor : 'move',
                // 移动的方向，是否支持
                // 
                key : ''
            }, _data);
            var settings = $.extend({
                ondragstart : function(event, ctrl){
                },
                ondragend : function(event, ctrl){
                },
                ondragmove : function(event, ctrl) {
                    // 移动中
                },
                onresize : function(event, ctrl){
                    // resize中
                }
            }, _settings);

            that.parent(data, settings);
            // 保存一下默认的cursor，需要恢复
            data.defaultCursor = that.getData().trigger.css('cursor');
            that.getData().trigger.css('cursor', data.cursor);

            data.trigger.bind("mousedown", $.proxy(that._dragStart, that));
        },
        _dragStart: function(event) {
            this._setBegging(true);
            this.getSettings().ondragstart(event,this);
            return false;
        },
        _dragEnd: function(event) {
            var that = this;
            this._setBegging(false);

            this.getSettings().ondragend(event,this);
            return true;
        },
        _dragMove: function(event) {
            var that = this;
            var data = that.getData();
            var element = that.getData().element;

            var pageX = event.pageX;
            var pageY = event.pageY;

            if (!that._isBegging()) {
                that._lastPointer = {
                    x: pageX,
                    y: pageY
                };
                return true;
            }

            if (that._lastPointer) {
                var distance = {
                    x: pageX - that._lastPointer.x,
                    y: pageY - that._lastPointer.y
                };

                if(data.action == 'move') {
                    var position = element.position();

                    if(data.axis.indexOf('x') != -1) {
                        var x =  position.left + distance.x;
                        element.css({
                            left: x
                        });
                    }
                    if(data.axis.indexOf('y') != -1) {
                        var y = position.top + distance.y;
                        element.css({
                            top: y
                        });
                    }
                    // 移动中
                    that.getSettings().ondragmove(event, that);
                } else if(data.action == 'resize') {
                    if(data.axis.indexOf('x') != -1) {
                        var x =  element.width() - distance.x;
                        element.width(x + 'px');
                    }
                    if(data.axis.indexOf('y') != -1) {
                        var y =  element.height() - distance.y;
                        element.height(y + 'px');
                    }
                    // 移动中
                    that.getSettings().onresize(event, that);
                }
            }
            that._lastPointer = {
                x: pageX,
                y: pageY
            };

            return false;
        },
        /**
         * 保存状态
         */
        _setBegging: function(_begin) {
            var that = this;
            that._begin = _begin;
            if(_begin) {
                that._bindContainer();
            } else {
                that._unbindContainer();
            }
        },
        _isBegging: function() {
            return !!this._begin;
        },
        destroy: function() {
            var that = this;
            // that._unbindContainer();
            var data = that.getData();
            data.trigger.unbind("mousedown", $.proxy(that._dragStart, that));
            that.parent();
        },
        /**
         * container上绑定
         */
        _bindContainer : function(){
            var that = this;
            var data = that.getData();
            data.container.bind("mousemove", $.proxy(that._dragMove, that));
            $(document.body).bind("mouseup mousedown mouseleave", $.proxy(that._dragEnd, that));
        },
        /**
         * container上解绑
         */
        _unbindContainer:function(){
            var that = this;
            var data = that.getData();
            data.trigger.css('cursor', data.defaultCursor);
            // data.trigger.unbind("mousedown", $.proxy(that._dragStart, that));
            data.container.unbind("mousemove", $.proxy(that._dragMove, that));
            $(document.body).unbind("mouseup mousedown mouseleave", $.proxy(that._dragEnd, that));
            // 重置一下
            that._lastPointer = null;
        }
    });

    shark.factory.define("Drag", Drag);
}();
(function(){

    /**
     * @fileOverview table组件
     * 
     */
    var table = shark.factory.extend("Container",/** @lends Table# */{
        /**
         * 下划线的容器
         * @author  Len
         * @version 1.0
         * @constructs
         * @constructor
         * @extends {Widget}
         * @date    2013-05-80
         * 
         * @param   {object}   data   
         *          {Array tbody} data.tbodys   
         *                 tbody.trs 
         *                     tbody.tr.tds
         *                         tbody.tr.td.clsName
         *                         tbody.tr.td.text
         *                         tbody.tr.td.widgets
         *          {Array col} data.cols  
         *                  col.type 
         *          {Array string} data.headers
         *             
         */
        init:function(data, settings){
            var data = $.extend({clsName : '', tbodys:[]}, data);
            var expr = new RegExp('>[ \t\r\n\v\f]*<', 'g');
            var settings = $.extend({}, settings);

            var pTmpl = '<table class="m-settable <%=this.clsName%>">\
                <%if(this.cols){%>\
                <colgroup>\
                    <%for(var i = 0, j = this.cols.length; i < j; i++){\
                        var col = this.cols[i];\
                    %>\
                    <col class="col col-<%=col.type%>">\
                    <%}%>\
                </colgroup>\
                <%}%>\
                <%if(this.headers){%>\
                <thead>\
                    <tr>\
                        <%for(var i = 0, j = this.headers.length; i < j; i++){\
                            var header = this.headers[i];\
                        %>\
                        <th>\
                            <div class="td <%=header.clsName||""%>"><%=header.text%></div>\
                        </th>\
                        <%}%>\
                    </tr>\
                </thead>\
                <%}%>\
                <%for(var i = 0, j = this.tbodys.length; i < j; i++){\
                    var tbody = this.tbodys[i];\
                %>\
                <tbody>\
                    <%  var trs = tbody.trs;\
                        for(var a = 0, b = trs.length; a < b; a++){\
                        var tr = trs[a];\
                    %>\
                        <tr class="js-<%=tr.type%> <%=tr.clsName || ""%>">\
                        <%  var tds = tr.tds;\
                            for(var x = 0, y = tds.length; x < y; x++){\
                            var td = tds[x];\
                        %>\
                            <td class="<%=td.tdClsName || ""%>">\
                                <div class="td <%=td.clsName||""%>">\
                                </div>\
                            </td>\
                        <%}%>\
                        </tr>\
                    <%}%>\
                </tbody>\
                <%}%>\
            </table>';
                            
            var html = $.jqote(pTmpl, data);
            html = html.replace(expr, '><');

            this.parent($(html), data, settings);
        },
        getTr: function(type){
            return this.getEle().find('.js-'+type);
        },
        removeTr: function(type){
            this.getTr(type).remove();
        },
        /**
         * 插入一行
         * @param  {Object} data     tr数据
         * @param  {Object} settings 配置数据，如插入位置 
         * @param {Number} settings.index 插入位置，默认最后一位
         * @param {String} settings.indexType 有type标记的tr也可以,插入到type前一行
         * @return {void}          
         */
        insertTr: function(data, settings){
            var pTableTr = '<tr class="js-<%=this.type%>">\
                <%  var tds = this.tds;\
                    for(var x = 0, y = tds.length; x < y; x++){\
                    var td = tds[x];\
                %>\
                    <td>\
                        <div class="td <%=td.clsName||""%>">\
                        </div>\
                    </td>\
                <%}%>\
                </tr>';
            var that = this, tr = $($.jqote(pTableTr, data));
            var indexTr;
            var tbody = this.getEle().find('tbody');
            settings = settings || {};
            if(settings.index || settings.index == 0){
                indexTr = $(tbody.find('tr')[settings.index]);
            }else if(settings.indexType){
                indexTr = this.getTr(settings.indexType);
            }
            if(indexTr && indexTr.length == 1){
                tr.insertBefore(indexTr);
            }else{
                tbody.append(tr);
            }

            that._appendTrWidget(data, tr);

        },
        /** 
         * 默认把element加进去
         * @protected
         */
        oncreate:function(){
            var that = this;
            var data = that.getData();
            var dom = that.getEle();

            var tbodys = dom.find('tbody');
            for(var i = 0, j = data.tbodys.length; i < j; i++){
                var tbody = data.tbodys[i];
                var trs = tbody.trs;
                var tbodyDom = $(tbodys.get(i));
                var trsDom = tbodyDom.find('tr');
                for(var a = 0, b = trs.length; a < b; a++){
                    var tr = trs[a];
                    var trDom = $(trsDom.get(a));
                    that._appendTrWidget(tr, trDom);
                }
            }
            that.parent();
        },
        /**
         * 往tr里面加入Widget
         * @param {Object} tr tr配置
         * @param {Element} trDom tr Dom节点
         * @return {void} 
         */
        _appendTrWidget: function(tr, trDom){
            var that = this;
            var tds = tr.tds;
            var tdsDom = trDom.find('td');
            for(var x = 0, y = tds.length; x < y; x++){
                var td = tds[x];
                var widgets = td.widgets;
                if(!widgets || widgets.length == 0){
                    td.widgets = [];
                    var text = new shark.Text({
                        html: td.text
                    });
                    td.widgets.push(text);
                    widgets = td.widgets;
                }
                var tdDom = $(tdsDom.get(x)).children().first();
                if(widgets){
                    for(var o = 0, p = widgets.length; o < p; o++){
                        var widget = widgets[o];
                        tdDom.append(widget.getEle());
                        that.__children.push(widget);
                    }
                }
            }
        },
        /**
         * 控制table里面的显示是否是disable或者enable状态
         * @param  {Object} param 参数
         * @param  {String} param.type 行类型参数
         * @param  {Number} param.index 行坐标
         * @param  {Number} param.tdIndex 列坐标
         * @param  {Boolean} param.disable 是否显示
         * @return {void}       
         */
        displayTr: function(param){
            var that = this,
                index = param.index,
                type = param.type,
                tdIndex = param.tdIndex,
                disable = param.disable,
                tbody, trs, tr;
            var data = that.getData();
            tbody = data.tbodys[0] || {};
            trs = tbody.trs || [];
            // 获取tr
            if(type){
                for(var i = 0, j = trs.length; i < j; i++){
                    var _tr = trs[i];
                    if(_tr.type == type){
                        tr = _tr;
                        break;
                    }
                }
            }else{
                tr = tbody.trs[index];
            }
            this._disableTr(tr, tdIndex, disable);
        },
        _disableTr: function(tr, tdIndex, disable){
            var that = this;
            
            if(tr){
                var tds = tr.tds;
                if(tdIndex || tdIndex === 0){
                    var td = tds[tdIndex];
                    var widgets = td.widgets || [];
                    for(var o = 0, p = widgets.length; o < p; o++){
                        var widget = widgets[o];
                        disable ? widget.disable() : widget.enable();
                    }
                }else{
                    for(var x = 0, y = tds.length; x < y; x++){
                        var td = tds[x];
                        var widgets = td.widgets || [];
                        for(var o = 0, p = widgets.length; o < p; o++){
                            var widget = widgets[o];
                            disable ? widget.disable() : widget.enable();
                        }
                    }
                }
            }
        }
    });
    //
    shark.factory.define("Table",table);

})();
shark.factory.define("TableEnhanced",

(function () {

	// 'use strict';

	var template =  '<table class="m-settable">' +
						'<colgroup></colgroup>' +
						'<thead></thead>' +
						'<tbody></tbody>' +
					'</table>';

	// 默认的单元格merger，直接返回key对应的数据
	var defaultMerger = function (key, data) {
		return {
			text: data[key] || ''
		};
	};

	// 默认设置，包含了示例数据（恩，构造函数里只需要这些参数就够了）
	var defaultSettings = {
		headers: [{				// 表头数据，key会作为merge时每一列的名字，value是表头文字
			key: 'name',
			value: '姓名'
		}, {
			key: 'age',
			value: '年龄'
		}],
		combineFirstTd: true,	// 是否合并首列（内容相同时合并）
		tableClass: 'm-settable-selfhelp m-settable-selfhelp-receive',
		rowMerger: defaultMerger
	};

	var tableEnhanced = {
		/**
		 * 构造函数，详细参数请参考defaultSettings。
		 * 如果data参数为空(null或者undefined），就只建立表头；
		 * 不为空时会执行一次refreshData来生成tbody中的内容（refreshData可以多次调用来刷新数据）
		 * @param {Object} data 数据
		 * @param {Object} settings 设置
		 */
		init: function (data, settings) {
			this.parent(
				$(template),
				data,
				$.extend({}, defaultSettings, settings)
			);

		},
		oncreate: function () {
			// 定义快捷变量引用
			this.table = this.getEle();
			var settings = this.getSettings();
			this.table.addClass(settings.tableClass);
			// 初始化colgroup
			this.initColgroups();
			// 初始化表头
			this.initHeaders();
			// 如果初始传入了数据，就立即刷新一次表格
			var data = this.getData();
			if (data) {
				this.refreshData(data);
			}
		},
		destroy : function() {
			this.table = null;
			this.recordTd = null;
			this.parent();
		},
		initColgroups: function () {
			var colgroup = this.table.find('colgroup');
			var settings = this.getSettings();
			$.each(settings.headers, function (i, header) {
				$('<col class="col">').addClass('col-' + header.key).appendTo(colgroup);
			});
		},
		initHeaders: function () {
			var thead = this.table.find('thead'),
				tr = '<tr>',
				ths = '';
				settings = this.getSettings();
			$.each(settings.headers, function (i, header) {
				ths += '<th><div class="td"></div></th>';
			});
			tr += ths + '</tr>';
			tr = $(tr);

			var cells = tr.find('.td');
			$.each(settings.headers, function (i, header) {
				$(cells[i]).text(header.value);
			});

			tr.appendTo(thead);
		},
		refreshData: function (data) {
			// 支持传defer或者数据
			var defered = data;
			if (defered.done) {
				defered.done(this.processData.bind(this));
			} else {
				// 不是defered对象，就直接作为数据处理
				this.processData(defered);
			}
		},
		processData: function (data) {
			// 数据处理分为2步：
			// 1 按照data的数量生成、显示、隐藏列表行
			this.generateRows(data);
			// 2 将数据填充到列表行中
			this.fillRows(data);
		},
		/**
		 * 按需生成tr，并进行必要的设置，不进行填充数据操作
		 * @param  {object} data description
		 * @return {object}      description
		 */
		generateRows: function (data) {
			var needRowsNum = 0,
				tbody = this.table.find('tbody'),
				haveRows = tbody.find('tr'),
				haveRowsNum = haveRows.length;
			// 由父类记录的data从数组转换为了对象，所以需要重新计算数据个数
			$.each (data, function (i, value) {
				needRowsNum++;
			});
			// 如果当前的rows不够，就生成一些空白的row来补齐；
			// 如果当前的rows多于数据需要，就隐藏掉多余的rows;
			// 同时要注意显示用到的rows
			haveRows.find('td:eq(0)').attr('rowspan', 1);
			if (needRowsNum > haveRowsNum) {
				for (var i=0; i<needRowsNum - haveRowsNum; i++) {
					tbody.append(this.generateRow());
				}
				shark.tool.show(haveRows);
			} else if (needRowsNum < haveRowsNum) {
				for (var i=0; i<needRowsNum; i++) {
					shark.tool.show($(haveRows.get(i)));
				}
				for (var i=needRowsNum; i<haveRowsNum; i++) {
					shark.tool.hide($(haveRows.get(i)));
				}
			} else {
				shark.tool.show(haveRows);
			}
		},
		generateRow: function () {
			var tr = '<tr>',
				tds = '';
			var settings = this.getSettings();
			$.each(settings.headers, function () {
				tds += '<td><div class="td"></div></td>';
			});
			tr += tds + '</tr>';
			return $(tr);
		},
		/**
		 * 从某个元素所在的行开始生成子行
		 * @param  {Dom} ele
		 * @param  {Array} data 用于填充子行的数据，数组中有几条数据就生成几行
		 * @return {void}
		 */
		insertEleSubRows: function (ele, data) {
			var index = this.getRowIndex(ele);
			if (index >=0) {
				this.insertSubRows(index, data);
			}
		},
		/**
		 * 获取某个元素所在行的序号，目前用于获取生成子行的位置
		 * @param  {object} ele description
		 * @return {object}     description
		 */
		getRowIndex: function (ele) {
			var haveRows = this.table.find('tbody>tr'),
				ret = -1;
			$.each(haveRows, function (i, row) {
				if ($(row).has(ele).length > 0) {
					ret = i;
					return false;
				}
			});
			return ret;
		},
		// 插入子行的实际操作方法，需要考虑合并首列的情况
		insertSubRows: function (index, data) {
			// 从指定index行开始加入子行
			var indexRow = this.table.find('tbody>tr:eq(' + index + ')');
			for (var i=data.length-1; i>=0; i--) {
				var d = data[i];
				var row = this.generateRow();
				shark.tool.hide(row.find('td:eq(0)'));
				row.addClass('js-sub');
				this.fillRow(row, d, true);
				indexRow.after(row);
			}
			// 向前找到该行对应的第一个合并行，将第一个td的rowspan加上当前添加的行数
			var firstTdRow = indexRow;
			var firstTd = firstTdRow.find('td:eq(0)');
			while (firstTd.is(':hidden') && index > 0) {
				firstTdRow = this.table.find('tbody>tr:eq(' + (--index) + ')');
				firstTd = firstTdRow.find('td:eq(0)');
			}
			firstTd.attr(
				'rowspan',
				parseInt(firstTd.attr('rowspan') || 1, 10) + data.length
			);
		},
		/**
		 * 从某个元素的位置开始删除子行
		 * @param  {Dom} ele
		 * @return {void}
		 */
		removeEleSubRows: function (ele) {
			var index = this.getRowIndex(ele);
			if (index >=0) {
				this.removeSubRows(index);
			}
		},
		// 删除子行的实际操作方法，需要考虑合并首列的情况
		removeSubRows: function (index) {
			// 删除从该行开始的所有子行
			var deletedNum = 0;
			var rows = this.table.find('tbody>tr');
			for (var i=index+1; i<rows.length; i++) {
				var row = $(rows.get(i));
				if (row.hasClass('js-sub')) {
					row.remove();
					deletedNum++;
				} else {
					break;
				}
			}
			// 向前找到该行对应的第一个整合行，将第一个td的rowspan减掉当前删除的行数
			var firstTdRow = this.table.find('tbody>tr:eq(' + index + ')');
			var firstTd = firstTdRow.find('td:eq(0)');
			while (firstTd.is(':hidden') && index > 0) {
				firstTdRow = this.table.find('tbody>tr:eq(' + (--index) + ')');
				firstTd = firstTdRow.find('td:eq(0)');
			}
			firstTd.attr(
				'rowspan',
				parseInt(firstTd.attr('rowspan') || 1, 10) - deletedNum
			);
		},
		/**
		 * 为表内的所有行填入数据（不包括子行）
		 * @param  {object} data description
		 * @return {object}      description
		 */
		fillRows: function (data) {
			var haveRows = this.table.find('tbody>tr');
			this.recordTd = null;	// 用于合并第一个td

			$.each(data, function (i, rowData) {
				var row = $(haveRows.get(i));
				this.fillRow(row, rowData);
			}.bind(this));
		},
		/**
		 * 将数据填入某一行，也就是调用merger填充行内的每一个cell(td>div)
		 * @param  {Dom}  row         需要填充数据的行
		 * @param  {Object}  data     要填充的数据
		 * @param  {Boolean} isSubRow 是否为子行，子行不需要进行首列合并，会在插入时自行处理
		 * @return {void}
		 */
		fillRow: function (row, data, isSubRow) {
			// 开始填充每一行，首先获取该行的数据和所有cell
			var cells = row.find('td>div');
			var settings = this.getSettings();
			$.each(cells, function (i, cell) {
				cell = $(cell);
				// 开始填充每一个cell，首先获取这个cell对应的key，然后获取merge后的值，
				// 最后根据该值的类型填充到cell中
				var headerKey = settings.headers[i].key;
				var mergeRet = settings.rowMerger(
					headerKey,
					data,
					isSubRow
				);
				// 清掉当前cell的内容
				shark.tool.empty(cell);
				// 加入td和tr样式类
				cell.parent().addClass(mergeRet.tdClass || '');
				$(row).addClass(mergeRet.trClass || '');
				// 返回的数据属性包括：
				// 1 dom: 返回的是一个原生dom或者jQuery对象
				// 2 widget: 返回的是一个组件
				// 2.1 widgetTitleSelector: selector字符串，用于选中widget生成的元素中需要添加title的元素
				// 3 text: 返回的是一段文字
				// 4 title: 布尔类型，是否需要加入title属性
				if (mergeRet.dom) {
					cell.append(mergeRet.dom);
				} else if (mergeRet.widget) {
					// 处理组件稍微麻烦些，首先将组件的dom元素插入
					cell.append(mergeRet.widget.getEle());
					// 如果含有需要填充title的widget，在这里进行处理
					if (mergeRet.widgetTitleSelector) {
						var w = cell.find(mergeRet.widgetTitleSelector);
						w.attr('title', $.trim(w.text()));
					}
					// 将组件加入__children，方便父类销毁
					this.__children.push(mergeRet.widget);
				} else {
					cell.text(mergeRet.text || '');
				}
				// 检查是否需要加入title
				if (mergeRet.title) {
					cell.parent().attr('title', cell.text().trim());
				}
				// 检查是否需要合并
				if (settings.combineFirstTd && !isSubRow) {
					if (i === 0) {
						if (this.recordTd && this.recordTd.text() && this.recordTd.text() == cell.parent().text()) {
							shark.tool.hide(cell.parent());
							var rowspan = parseInt(this.recordTd.attr('rowspan') || '1', 10);
							this.recordTd.attr('rowspan', rowspan + 1);
						} else {
							this.recordTd = cell.parent();
							shark.tool.show(this.recordTd);
						}
					}
				}
			}.bind(this));
		}
	};

	return shark.factory.extend('Container', tableEnhanced);

})()

);
(function(){
    /**
     * @fileOverview 颜色选择器
     * @class ColorPicker
     * @extends {Widget}
     * @author Len
     */
    
    var colorPicker = shark.factory.extend("Widget",/** @lends Calendar# */{
        init:function(_data, _settings){
            // pDefaults不能改变
            var data = $.extend({},_data);
            var settings = $.extend({}, _settings);
            
            this.parent(data, settings);
        },

        /**
         * 创建容器DOM
         * @private
         * @return {Object} 
         */
        create: function(){
            var pTmpl = '<div class="m-ppnl m-ppnl-editor m-ppnl-editor-color"><div class="ppnl-ct">\
            <div class="edui-colorpicker">\
                <div class="edui-colorpicker-topbar edui-clearfix">\
                    <div unselectable="on" class="edui-colorpicker-preview js-preview"></div>\
                    <div unselectable="on" class="edui-colorpicker-nocolor js-clear">清空颜色</div>\
                </div>\
                <table  class="edui-box" style="border-collapse: collapse;" cellspacing="0" cellpadding="0">\
                <tr style="border-bottom: 1px solid #ddd;font-size: 13px;line-height: 25px;color:#39C;padding-top: 2px"><td colspan="10">主题颜色</td></tr>\
                <tr class="edui-colorpicker-tablefirstrow" >\
                    <%  var COLORS = this.COLORS;\
                        for (var i=0; i<COLORS.length; i++) {\
                        if (i && i%10 === 0) {%>\
                            </tr><%if(i==60){%><tr style="border-bottom: 1px solid #ddd;font-size: 13px;line-height: 25px;color:#39C;"><td colspan="10">标准颜色</td></tr>\<%}else{}%><tr<%if(i==60){%> class="edui-colorpicker-tablefirstrow"<%}else{}%>>\
                        <%}%>\
                        <%if(i < 70){%><td style="padding: 0 2px;"><a hidefocus title="<%=COLORS[i]%>" href="javascript:;" unselectable="on" class="js-color edui-box edui-colorpicker-colorcell" \
                             data-color="#<%=COLORS[i]%>" \
                             style="display:block;background-color:#<%=COLORS[i]%>;border:solid #ccc;\
                            <%if(i<10 || i>=60){%>border-width:1px;<%}else{%>\
                                <%if(i>=10&&i<20){%>border-width:1px 1px 0 1px;<%}else{%>\
                                border-width:0 1px 0 1px;<%}}%>"></a></td>\
                        <%}\
                    }%>\
                </tr></table></div></div></div>';
            /**
             * 颜色配置
             * @type {Array}
             */
            var COLORS = (
                'ffffff,000000,eeece1,1f497d,4f81bd,c0504d,9bbb59,8064a2,4bacc6,f79646,' +
                'f2f2f2,7f7f7f,ddd9c3,c6d9f0,dbe5f1,f2dcdb,ebf1dd,e5e0ec,dbeef3,fdeada,' +
                'd8d8d8,595959,c4bd97,8db3e2,b8cce4,e5b9b7,d7e3bc,ccc1d9,b7dde8,fbd5b5,' +
                'bfbfbf,3f3f3f,938953,548dd4,95b3d7,d99694,c3d69b,b2a2c7,92cddc,fac08f,' +
                'a5a5a5,262626,494429,17365d,366092,953734,76923c,5f497a,31859b,e36c09,' +
                '7f7f7f,0c0c0c,1d1b10,0f243e,244061,632423,4f6128,3f3151,205867,974806,' +
                'c00000,ff0000,ffc000,ffff00,92d050,00b050,00b0f0,0070c0,002060,7030a0,').split(',');
            var html = $.jqote(pTmpl, {COLORS: COLORS});
            return $(html);
        },

        /**
         * @return {void}           
         */
        oncreate: function(_settings){
            this._initEvents();
        },
        _initEvents: function(){
            var that = this, dom = that.getEle(), settings = that.getSettings();
            dom.delegate('.js-color', 'mouseenter', function(evt){
                var target = $(evt.target);
                var color = target.attr('data-color');
                that.getEle('.js-preview').css('backgroundColor', color);
                if(settings.onhoverchange){
                    settings.onhoverchange(evt, {type:"in", color:color}, that);
                }
            });
            dom.delegate('.js-color', 'mouseleave', function(evt){
                var oldColor = that.__defaultColor;
                that.getEle('.js-preview').css('backgroundColor', oldColor);
                if(settings.onhoverchange){
                    var target = $(evt.target);
                    settings.onhoverchange(evt, {type:"out", color: target.attr('data-color')}, that);
                }
            });
            dom.delegate('.js-color', 'click', function(evt){
                var oldColor = that.__defaultColor;
                var target = $(evt.target);
                that.__defaultColor = target.attr('data-color');
                if(settings.onclick){
                    settings.onclick(that);
                }
                if(settings.onColorChange && oldColor != that.__defaultColor){
                    settings.onclick(that, oldColor);
                }
            });
            // 清空颜色
            dom.delegate('.js-clear', 'click', function(evt){
                if(settings.onclear){
                    settings.onclear(that);
                }
            });
        },

        getColor: function(){
            return this.__defaultColor;
        },

        setColor: function(color){
            this.__defaultColor = color;
            this.getEle('.js-preview').css('backgroundColor', color);
        },

        /**
         * 清理控件
         * @return {void}       
         */
        clear: function(){
            this.getEle().undelegate('mouseleave mouseenter click');
            this.getEle().remove();
        }
    });

    shark.factory.define("ColorPicker", colorPicker);
})();
!function(){
    /**
     * @fileOverview 可自动联想的输入组件,匹配项为动态产生。
     * @todo 应该扩展为适用于其他列表的提示，不限于邮箱地址
     */
    /**
     * focus的样式
     * @type {String}
     */
    var pFocusClass = 'item-focus';
    // 传入的数据结构：{list:[],xx:xx,xx:22}
    var AutoComplete = shark.factory.extend("Widget",/** @lends AutoComplete# */{
        /**
         * 自动联想弹出层
         * 
         * @extends {Widget}
         * @example
         *  var autocomplete = new shark.AutoComplete({
                inputer : input,
                onclick : function(_evt, _val){
                    // 点击
                },
                onvaluechange : function(_val, callback){
                    if(_val == '') {
                        callback({groups:[]});
                        return;
                    }
                    var list = [];
                    for (var i = 0; i < 6; i++) {
                        list.push({name : '名称' + i, value : { name : '名称' + i, value : 'name1'}});
                    };
                    
                    var list2 = [];
                    for (var i = 0; i < 6; i++) {
                        list2.push({name : '第二个' + i, value : { name : '名称' + i, value : 'name1'}});
                    };
                    var data = {autoFocus : true, title : '名称title', groups:[list, list2]};
                    callback(data);
                }
            });
            autocomplete.show();
         *
         * @param   {object}   _data 参数行为,<br/>
         *                               {object}:cssStyle:{}
         * @param   {object}   _settings 参数行为,<br/>
         *                               {object}:inputer 触发联想的输入框<br/>
         *                               {object}:root 触发输入框停靠的root，见@see root参数<br/>
         *                               {function}:onclick 在后续列表上点击时候的回调。
         *                               {function}:onvaluechange 输入内容有修改的时候的回调。
         *                                   onvaluechange(keyword, callback);
         *                                       callback(data);
         *                                       data = {
         *                                           autoFocus : true, 
         *                                           title : '名称title', 
         *                                           group:[list, list2]
         *                                       };
         *                                       list = [
         *                                           {name : '', value : {}}
         *                                       ]
         */
        init:function(_data, _settings){
            var that = this;
            var data = $.extend({
                    maxHeight : 200
                }, _data);
            // 设置最小宽度为root的宽度
            var settings = $.extend({
                onmousedown : function(){
                },
                onmouseup : function(){
                },
                axis:'left'
            }, _settings);
            
            that.parent(data, settings);
        },
        create:function(){
            var that = this;
            return that.getSettings().inputer;
        },
        destroy : function() {
            var that = this;
            if(that.wrap) {
                that.wrap.destroy();
                that.wrap = null;
            }
            that.parent();
        },
        /**
         * 绑定事件
         * @return {void} 
         */
        oncreate:function(){
            var that = this;
            var settings = that.getSettings();
            that.getEle().mousedown(function(event){
                // 聚焦的时候，显示
                that.__keyup(0);
                event.stopPropagation();
            });
            // input组件
            that.getEle().keyup(function(event){
                var keyCode = event.keyCode;
                return that.__keyup(keyCode);
            });
            // input组件
            that.getEle().keydown(function(event){
                var keyCode = event.keyCode;
                return that.__keydown(keyCode);
            });
            // 为下拉菜单增加快捷键，避免鼠标的hover和快捷钱的hover同时存在
            // 不能重复绑定
            that.wrap = new shark.DropMenu({ dataGenerator : function(){
                return that.__resultData;
            }}, {
                trigger : settings.inputer,
                triggerType : 'search',
                onpopshow : function(){
                    that.wrap.getDoor().bind('mousedown', function(e){
                        settings.onmousedown();
                        return false;
                    });
                    that.wrap.getDoor().bind('mouseup', function(e){
                        settings.onmouseup();
                        return false;
                    });
                },
                onclick : function(_evt, _ctrl){
                    settings.onclick(_evt, _ctrl.getValue());
                    that.hideList();
                },
                once : false
            });
            that.wrap.show();
        },
        __keydown : function(keyCode){
            var that = this;
            // 上下快捷键，回车确定
            // Up Arrow 38 ,Down Arrow 40，Enter 13
            if(that.wrap && that.wrap.isVisible()){
                // 在连续快捷键中，缓存提高性能
                switch(keyCode) {
                    case 27:
                        // Escape
                        that.hideList();
                        return false;
                        break;
                    case 38:
                        that.mList = that.getMList();
                        // Up Arrow
                        that.selectItem(-1);
                        return false;
                        break;
                    case 40:
                        that.mList = that.getMList();
                        // Down Arrow
                        that.selectItem(1);
                        return false;
                        break;
                    case 9:
                        // Tab
                    case 13:
                        that.mList = that.getMList();
                        // Enter
                        if(that.mList) {
                            var scrollDiv = that.mList.getEle();
                            var table = scrollDiv.children('table');
                            var selectedItem = table.find('a.' + pFocusClass);
                            if(selectedItem.length > 0) {
                                // 触发点击操作
                                selectedItem.first().trigger('click');
                            }

                            // 隐藏
                            that.hideList();
                            return false;
                        }
                        break;
                }
            }
            return true;
        },
        __keyup : function(keyCode){
            var that = this;

            switch(keyCode) {
                // Escape 27, Up Arrow 38 ,Down Arrow 40，Enter 13
                case 27:
                case 38:
                case 40:
                    return false;
            }
            // 回车
            if(keyCode === 9 || keyCode === 13) {
                if(that.wrap && that.wrap.isVisible()){
                    // 在连续快捷键中，缓存提高性能
                    return false;
                } else {
                    // that.getSettings().onclick(event, null);
                    return true;
                }
            }

            // 其他情况更新的下拉框
            // TODO 排除控制字符
            var val = that.getEle().val();
            that.search(val);
            return true;
        },
        search : function(val){
            var that = this;
            that.__searchTimeout = -1;

            if(val == that.__lastKey) {
                that.showList();
            } else {
                that.getSettings().onvaluechange(val, function(data){
                    that.__lastKey = val;
                    that.__resultData = data;
                    that.showList();
                });
            }
            // }, 50);
            
        },
        getMList : function(){
            var that = this;
            var index = 0;
            if(that.__resultData.title) {
                index = 1;
            }
            if(that.wrap && that.wrap.getCtrlChildren()) {
                return that.wrap.getCtrlChildren()[index];
            }
            return null;
        },

        /**
         * 加减num
         * @param  {number} num 增加或者减少的量
         * @return {void}     
         */
        selectItem : function(num){
            var that = this;
            var settings = that.getSettings();
            if(that.mList) {
                var scrollDiv = that.mList.getEle();
                var table = scrollDiv.children('table');
                var selectedItem = table.find('a.' + pFocusClass);

                var maxIndex = parseInt(table.find('a.item:last').attr('index'), 10);
                if(selectedItem.length == 0) {
                    var nextIndex = 0;
                } else {
                    var currentIndex = parseInt(selectedItem.attr('index'), 10);

                    var nextIndex = currentIndex + num;
                    if(nextIndex < 0 || nextIndex > maxIndex) {
                        // 忽略
                        return;
                    }
                    selectedItem.removeClass(pFocusClass);
                }

                // 新的item
                selectedItem = table.find('a.item[index="' + nextIndex + '"]');
                if(!selectedItem || selectedItem.length === 0) {
                    return;
                }
                selectedItem.addClass(pFocusClass);

                var scrollTop = scrollDiv.scrollTop();
                var offsetTop = selectedItem.position().top;

                var clientHeight = scrollDiv.height();

                var itemHeight = selectedItem.height();

                var heightStep = itemHeight * 3;
                // 增加的
                if(num > 0) {
                    if(offsetTop > clientHeight - itemHeight) {
                        // 向下滚
                        scrollDiv.scrollTop(scrollTop + heightStep);
                    }
                } else if(num < 0){
                    // 向上滚
                    if(offsetTop < itemHeight * 2) {
                        scrollDiv.scrollTop(scrollTop - heightStep);
                    }
                }
            }
        },
        /**
         * 显示列表
         * @param  {object} data 数据
         *                       data.group [list1,list2]
         *                       data.title 说明性的提示语
         *                       data.autoFocus 是否默认选中第一条
         *                       data.hasIcon 是否有icon
         * @return {void}      
         */
        showList : function(){
            var that = this;

            var group = that.__resultData.group;

            if(!that.__resultData || !group || group.length == 0) {
                that.hideList();
                return;
            }
            var num = 0;
            for (var i = 0; i < group.length; i++) {
                num += group[i].list.length;
            };
            // 没有实际内容
            if(num == 0) {
                that.hideList();
                return;
            }
            var settings = that.getSettings();
            // var iconClsName = data.hasIcon ? "m-menu-icon" : null;
            // 从无到有，需要有动画，后面就没有了
            // var animated = true;
            // if(that.wrap && that.wrap.isVisible()) {
            //     animated = false;
            // }
            // 设置高宽
            that.__resultData.group[0].cssStyle = {maxHeight : that.getData().maxHeight};
            // 最小宽度为输入框的宽度
            if(!shark.detection.isIE6() && !shark.detection.isIE7()) {
                that.__resultData.group[0].cssStyle.minWidth = settings.inputer.width();
            }

            that.wrap.show();

            // 触发一下点击事件
            if(!that.wrap.isVisible()) {
                settings.inputer.trigger('search');
            } else {
                that.wrap.refresh();
            }

            if(that.__resultData.autoFocus) {
                // 自动聚焦
                if(that.__selectTimeout) {
                    clearTimeout(that.__selectTimeout);
                    that.__selectTimeout = 0;
                }
                that.__selectTimeout = setTimeout(function(){
                    that.mList = that.getMList();
                    if(that.mList.isVisible()) {
                        that.selectItem(1);    
                    }
                }, 50);
                
            }
        },
        /**
         * 隐藏
         * @return {void} 
         */
        hideList : function(){
            var that = this;
            if(that.wrap) {
                that.wrap.close();
                // that.wrap = null;
            }
        }
    });

    shark.factory.define("AutoComplete",AutoComplete);
}();


(function(){
    /**
     * @fileOverview 基础的按钮组件，包括使用现有dom节点和使用数据源创建标准按钮2种方式。
     */
    var pWrapTmpl = '<div>\
        <div class="m-search <%=this.clsName%>"></div>\
        <%if(this.hasBg) {%><div class="w-searchbg js-search-bg"></div><%}%>\
        </div>';

    var pLoadingClass = "-loading";
    var pFocusClass = "-focus";
    
    var Search = shark.factory.extend("Container",/** @lends Search# */{
        /**
         * 搜索框
         * @author  hite
         * @version 1.0
         * @constructs
         * @constructor
         * @extends {Widget}
         * @date    2013-05-80
         * @param   {html/dom/jqueryObject}   _button   要赋予button行为的dom元素
         * 
         * @param   {object}   _settings 行为参数，包括<br/>
         *                               {function}:onclick button的onclick事件<br/>
         *                               {string}:clsPrefix 对不同的按钮允许在对外层增加一个className来定制此组件。<br/>
         */
        init:function(_data, _settings){
            /**
             * 当前保有事件的dom元素
             * @property {object} ele description
             */
            var data = $.extend({
                clsName : 'm-search',
                // 是否有bg
                hasBg : false
            }, _data);

            data.loadingClass = data.clsName + pLoadingClass;
            data.focusClass = data.clsName + pFocusClass;
            var settings = $.extend({
                wrapTmpl : pWrapTmpl,
                // 默认是第一个子节点，因为有wrap
                wrapSelector : '>:first',
                // 高级搜索
                hasAdvSearch : false,
                // 有清除按钮
                hasClose : false,
                onclick:function(action, value){
                    return true;
                }
            }, _settings);

            var wrap = $($.jqote(settings.wrapTmpl, data));
            this.parent(wrap, data, settings);
        },
        /** 
         * 
         * @protected
         */
        oncreate:function(){
            var that = this;
            this.parent();
            var data = that.getData();
            var settings = that.getSettings();
            var domNode = that.getEle(settings.wrapSelector);

            // 添加元素
            that._input = new shark.TightInput({value : data.value,
                placeholder : data.placeholder
            }, {
                onfocus : function(){
                    that.focus();
                    if(that._input.getValue()!='') {
                        if(that._enterBtn) {
                            that._enterBtn.getEle().show();
                        }
                    }
                },
                onblur : function(){
                    setTimeout(function(){
                        that.blur();
                        if(that._enterBtn) {
                            that._enterBtn.getEle().hide();
                        }
                    }, 100);

                }, 
                onenter : function(){
                    // 回车了
                    that._triggerAction('search');
                },
                onkeyup : function(val, ctrl){
                    if(that.__searchTimeout) {
                        clearTimeout(that.__searchTimeout);
                    }
                    that.__searchTimeout = setTimeout(function(){
                        // $Profiler.log('search: ' + val);
                        that.__searchTimeout = null;
                        if(val == '') {
                            if(that._closeBtn) {
                                that._closeBtn.getEle().hide();
                                // 直接搜索
                                that._triggerAction('search');
                            }
                            if(that._enterBtn) {
                                that._enterBtn.getEle().hide();
                            }
                        } else {
                            if(that._closeBtn) {
                                that._closeBtn.getEle().show();
                                // 直接搜索
                                that._triggerAction('search');
                            }
                            if(that._enterBtn) {
                                that._enterBtn.getEle().show();
                            }
                        }
                    }, 300);
                }
            });

            that.addChild(that._input);

            // 左侧的图标
            that.addChild(new shark.Text({icoClass:'icon-search', wrapClsName:'m-wrap-abssearch'}));
            that.addChild(new shark.Text({icoClass:'icon-loading', wrapClsName:'m-wrap-absloading'}));

            // 右侧的按钮
            if(settings.hasAdvSearch) {
                that.addChild(new shark.Link({icoClass:'icon-advancesch', wrapClsName:'m-wrap-absadvancesch'}, {
                    onclick : function(){
                        that._triggerAction('advsearch');
                    }
                }));
            }
            
            if(settings.hasClose) {
                // 清除内容
                that._closeBtn = new shark.Link({icoClass:'icon-close', wrapClsName:'m-wrap-absclose'}, {
                    onclick : function(){
                        that._input.setValue('');
                        that._triggerAction('clear');
                    }
                });

                that.addChild(that._closeBtn);
            } else {
                that._enterBtn = new shark.Link({icoClass:'icon-entersch', wrapClsName:'m-wrap-absentersch'}, {
                    onclick : function(){
                        that._triggerAction('search');
                    }
                });
                that.addChild(that._enterBtn);
            }
            
            // 绑定
            // 
        },
        getInput : function(){
            return this._input.getInput();
        },
        setValue : function(_val){
            this._input.setValue(_val);
        },
        getValue : function(){
            return this._input.getValue();
        },
        _triggerAction : function(action){
            var that = this;
            var value = that._input.getValue();
            that.getSettings().onclick(action, value);
        },
        /**
         * 聚焦
         * @return {void}        
         */
        focus: function(){
            var that = this;
            that.getEle(that.getSettings().wrapSelector).addClass(that.getData().focusClass);
            that.getEle('.js-search-bg').addClass('w-searchbg-focus');
        },
        /**
         * 失去焦点
         * @return {Boolean} 
         */
        blur: function(){
            var that = this;
            that.getEle(that.getSettings().wrapSelector).removeClass(that.getData().focusClass);
            that.getEle('.js-search-bg').removeClass('w-searchbg-focus');
        },
        onblur : function() {
            var that = this;
            setTimeout(function(){
                // blur掉，不要search了
                if(that.__searchTimeout) {
                    clearTimeout(that.__searchTimeout);
                }
                that._input.blur();
                that.blur();
            }, 50);
        },
        /**
         * 
         * @return {void} 
         */
        startSearch : function(){
            var that = this;
            that.getEle(that.getSettings().wrapSelector).addClass(that.getData().loadingClass);
        },
        /**
         * 
         * @return {void} 
         */
        searchComplete : function(){
            var that = this;
            that.getEle(that.getSettings().wrapSelector).removeClass(that.getData().loadingClass);
        },
        /**
         * destroy
         * @return {object} description
         */
        destroy : function() {
            var that = this;
            that._enterBtn = null;
            that._closeBtn = null;
            that._input = null;
            that.parent();
        }
    });
    //
    shark.factory.define("Search",Search);

})();
! function() {
    /**
     * @fileOverview 对原生seletor的模拟,目前只考虑只有一个select分组的情况
     *
     */
    var Selector = shark.factory.extend("DropMenu", /** @lends Selector# */ {
        /**
         * 模拟的select组件。提供了和原生select类似的组件
         * @author  hite
         * @version 1.0
         * @date    2013-05-28
         * @constructor
         * @constructs
         * @extends {DropMenu}
         * @param   {object}   _data     数据源，数据结构继承自@see DropMenu,如下<br/>
         *                               {string}:btnClsName 标准按钮的自定义样式<br/>
         *                               {string}:name 按钮的文案<br/>
         *                               {string}:value 当前选中值<br/>
         *                               {object}:btnCssStyle 按钮的样式
         *                               {object}:cssStyle 其中关于宽的加在dropmenu上，关于高的加在各自的menulist上<br/>
         *                               {array}:list 下拉选项的数组，数据结构详见@see MenuItem<br/>
         *                               {function}:extraChildren 除了标准的下拉选项之外如果还需要其他项（如新建文件夹按钮），则使用此函数生成，
         *                               组件会自动将data.list生成的组件合并一起做完下拉菜单，详见events注释。<br/>
         * @param   {object}   _settings 参数包括，继承自@see DropMenu,<br/>
         *                               {object}:trigger 如果传入了trigger使用参数里的trigger，如果没有，使用默认的splitSelect组件<br/>
         *                               {function} onchange 当点击了下拉选项时的回调，模拟了select的onchange事件。详见events注释。<br/>
         *                               {function} onhoverchange hover有变化
         */
        init: function(_data, _settings) {
            var that = this;
            var settings = $.extend({
                equals : function(val1, val2){
                    if(val1 == val2) {
                        return true;
                    }
                    if(val1 && typeof val1.value != 'undefined') {
                        val1 = val1.value;
                    }
                    if(val2 && typeof val2.value != 'undefined') {
                        val2 = val2.value;
                    }
                    return val1 == val2;
                }
            }, _settings);
            var data = $.extend({autoSelect : true}, _data);
            // 支持自定义的 selector行为
            if (settings.trigger == null) {
                var BtnClz = data.isClk ? shark.SelectorLinkButton : shark.SelectorButton;
                // 这个按钮和普通的drop按钮不一致
                var button = new BtnClz({
                    cssStyle: data.btnCssStyle,
                    name: data.name
                }, {
                    clsPrefix: data.btnClsName
                });

                // @modifyed by zhuxiaohua 2014/02/26 添加ontriggerclick的支持
                button._getButton().click(function(_evt){
                    if (settings.ontriggerclick) {
                        settings.ontriggerclick(_evt);
                    }
                });

                settings.trigger = button;
            }
            // menulist
            settings.$onselectchange = function(_evt, _ctrl) {
                // 获取当前的选择数据,
                // menulist 向selector同步
                that._itemValue = _ctrl.getValue();
                //
                that._syncTxt(that._itemValue);
                if (settings.onchange) {
                    /**
                     * 当选项变化时，执行的回调
                     * @event
                     * @name Selector#onchange
                     * @example
                     * onchange:function(_event,_ctrl){
                    }
                     * @param {Event} _evt event对象
                     * @param {Widget} _ctrl 当前Selector组件实例
                     */
                    settings.onchange(_evt, _ctrl);
                }
                that.close();
            };
            // 是selector
            data.isSelector = true;
            that.parent(data, settings);
            // 选中的那个的
        },
        oncreate: function() {
            var that = this;
            that.parent();
            var data = that.getData();
            // 第一个选中的
            that._itemValue = that._getSelectedValue();
            // 选中当前项目
            if(that._itemValue) {
                that._syncTxt(that._itemValue);
            } else {
                that._syncTxt({name : '请选择'});
            }
        },
        /**
         * 选中该次序的的值，同时修改selected的样式。
         * 暂时不考虑多个select分组的情况;
         * @author  hite
         * @version 1.0
         * @date    2013-02-19
         * @param   {number}   _index 顺序值，从0开始。
         */
        setSelectedIndex: function(_index) {
            // 去修改数据源就可以了。
            var that = this;
            var lists = that.getMenuListData();
            for (var i = 0; i < lists.length; i++) {
                var list = lists[i].list;
                for (var j = 0; j < list.length; j++) {
                    if (_index == i * lists.length + j) {
                        that.setValue(list[j]);
                        return;
                    }
                }
            }
        },
        /**
         * 获取选中的
         * @return {object} description
         */
        _getSelectedValue: function() {
            var that = this;
            var lists = that.getMenuListData();
            for (var i = 0; i < lists.length; i++) {
                var list = lists[i].list;
                for (var j = 0; j < list.length; j++) {
                    if (list[j].selected) {
                        return list[j];
                    }
                }
            }
            if(that.getData().autoSelect) {
                return lists[0].list[0];
            }
        },
        /**
         * 修改了当前选中值，同时修改按钮文案，标记数据源为dirty，下次打开时会重新使用数据渲染。
         * @author  hite
         * @version 1.0
         * @date    2013-05-28
         * @param   {object}   _value 数据源项,可以是完整的item如{name:11,value:22},也可以是只有value的对象，如{value:22}
         */
        setValue: function(_value) {
            var that = this;
            var key = _value;
            var lists = that.getMenuList();
            var settings = that.getSettings();
            for (var i = 0; i < lists.length; i++) {
                var list = lists[i];
                var items = list.getChildren();
                var clear = true;
                for (var j = 0; j < items.length; j++) {
                    var item = items[j];
                    var value = item.getValue();
                    if(value.isSeperator === true){
                        // 如果是分隔符continue
                        continue;
                    }
                    // 增加外部比较
                    if (settings.equals(value.value, key)) {
                        that._selectItem(item, list);
                        clear = false;
                        return;
                    }
                }
                if (clear) {
                    list.clearSelect();
                    that._itemValue = {};
                }
            }
        },
        /**
         * 清理selector的选中状态
         * @return {void} 
         */
        clearSelect: function() {
            var that = this;
            var lists = that.getMenuList();
            for (var i = 0; i < lists.length; i++) {
                var list = lists[i];
                list.clearSelect();
            }
            that._itemValue = {};
        },
        /**
         * 选中
         * @param  {object} item description
         * @return {object}      description
         */
        _selectItem: function(item, list) {
            var that = this;

            if (item.select) {
                var value = item.getValue();
                that._itemValue = value;
                if (list.clearSelect) {
                    list.clearSelect();
                }
                item.select();
                // 更新选中的样式
                that._syncTxt(that._itemValue);
            }
        },
        /**
         * 修改button的值，同时修改item的选中状态
         * @param  {object} _value description
         * @return {object}        description
         */
        _syncTxt: function(_value) {
            var that = this;
            // 如果button按钮已经在页面上
            var trigger = this.getTrigger();
            that._itemValue  = _value;
            if (trigger && _value) {
                var txt = _value.name;
                if (typeof this.getSettings().formatTxt == "function") {
                    txt = this.getSettings().formatTxt(txt);
                }
                if (trigger.setText) {
                    trigger.setText(txt);
                }
            }
        },
        /**
         * 获取当前选中值，不特殊处理.value属性
         * @author  hite
         * @version 1.0
         * @date    2013-05-28
         * @return  {object}   当前选中值
         */
        getValue: function() {
            return this._itemValue;
        },
        /**
         * 激活当前组件
         * @param {boolean} isActive 是否激活
         * @return {object} description
         */
        active : function(isActive) {
            this.getTrigger().active(isActive);
        }
    });

    shark.factory.define("Selector", Selector);

}();
!function(){
    /**
     * @fileOverview 
     * 内部提示的input框组件。 
     * 标题和输入框在一起，在一个输入框内部
     */
    var pDefaultData = {
        format : 'datetime',
        tipformat : ''
    };
    var DateSelector = shark.factory.extend("Field", /**@lends DateSelector# */{
        /**
         * 使用已有的dom生成，Selector组件；
         * @author  hite
         * @version 1.0
         * @date    2012-4-18
         * @constructor
         * @extends {Field}
         * @param   {object}    data  带label的输入框,需要在特殊的节点上有对应的class属性
         *                            {date} date : 时间
         *                            {boolean} hasNone: 是否有空选
         *                            {string} format : date  datetime  time
         *                            {string} tipformat : 本邮件将于{0}发送到对方邮箱
         *                            {dom} tipcontainer : tip容器
         * @param   {object}    settings 行为参数
         *                               onchange 有修改了
         */
        init:function(data, settings){
            var that = this;
            var data = $.extend({}, pDefaultData, data);

            var settings = $.extend({onchange : function(){}, maxHeight : 115},settings);
            that.parent(data, settings);
        },
        create:function(){
            var that = this;
            var data = that.getData();
            var settings = that.getSettings();

            var container = new shark.HrzLine();
            var maxHeight = settings.maxHeight;

            // 时间
            var date = data.date || new Date();
            var currentDate = new Date();
            // 根据不同的配置，加入不同的内容
            if(data.format == 'date' || data.format == 'datetime') {
                // 年
                var year = date.getFullYear();
                var currentYear = currentDate.getFullYear();
                var startYear = year > currentYear ? currentYear : year;
                var endYear = year > (currentYear+10) ? year+1 : currentYear+11
                var years = [];
                if(data.hasNone){
                    years.push({name: '--', value: 'none'});
                }
                for(var i=startYear; i<endYear; i++) {
                    years.push({name : shark.i18n.trans('year', i), value : i});
                }
                that._yearSelect = new shark.Selector({
                    fixWidth : true,
                    list :years, cssStyle : {maxHeight : maxHeight}}, {
                        onchange : function(_evt, _ctrl){
                            var _year = _ctrl.getValue().value;
                            var selectIndex = 0;
                            if(data.hasNone){
                                if(_year !== 'none'){
                                    selectIndex = 1;
                                }
                            }
                            that._monthSelect.setDirty(true);
                            // 有变化,月日重置
                            that._monthSelect.setSelectedIndex(selectIndex);
                            // 有变化,月日重置
                            that._dateSelect.setDirty(true);
                            that._dateSelect.setSelectedIndex(selectIndex);
                            that._updateTip();
                        }.bind(that)
                });
                container.addChild(that._yearSelect);
                if(data.date){
                    that._yearSelect.setValue(year);
                }else{
                    that._yearSelect.setSelectedIndex(0);
                }

                that._monthSelect = new shark.Selector({
                    fixWidth : true,
                    dataGenerator : function(){
                        // 月
                        var mArr = shark.i18n.trans('month').split(',');
                        var months = [];
                        if(data.hasNone){
                            months.push({name: '--', value: 'none'});
                        }
                        for(var i=0;i<mArr.length;i++) {
                            months.push({name : mArr[i], value : i});
                        }
                        return months;
                    }, cssStyle : {maxHeight : maxHeight}},  {
                    onchange : function(_evt,_ctrl){
                        var _month = _ctrl.getValue().value;
                        if(data.hasNone){
                            if(_month === 'none'){
                                // 有变化,月日重置
                                that._yearSelect.setSelectedIndex(0);
                                // 有变化,月日重置
                                that._dateSelect.setDirty(true);
                                that._dateSelect.setSelectedIndex(0);
                                that._updateTip();
                            }else{
                                var _year = that._yearSelect.getValue().value;
                                if(_year === 'none'){
                                    // 之前有选中none
                                    that._yearSelect.setSelectedIndex(1);
                                    that._dateSelect.setDirty(true);
                                    that._dateSelect.setSelectedIndex(1);
                                }else{
                                    // 有变化,日重置
                                    that._dateSelect.setDirty(true);
                                    that._dateSelect.setSelectedIndex(1);
                                }
                                that._updateTip();
                            }
                        }else{
                            // 有变化,日重置
                            that._dateSelect.setDirty(true);
                            that._dateSelect.setSelectedIndex(0);
                            that._updateTip();
                        }
                    }.bind(that)});
                container.addChild(that._monthSelect);
                if(data.date){
                    var index = date.getMonth();
                    if(data.hasNone){
                        index++;
                    }
                    that._monthSelect.setSelectedIndex(index);
                }else{
                    that._monthSelect.setSelectedIndex(0);
                }

                var day = date.getDate();

                var month = date.getMonth();
                // 日
                that.days = that.getDayList(year, month);
                that._dateSelect = new shark.Selector({
                    dataGenerator :function(){
                        var year = that._yearSelect.getValue().value;
                        var month = that._monthSelect.getValue().value;
                        that.days = that.getDayList(year, month);
                        return that.days;    
                }, fixWidth : true, cssStyle : {maxHeight : maxHeight}}, {
                    onchange : function(_evt,_ctrl){
                        var _day = _ctrl.getValue().value;
                        if(data.hasNone){
                            if(_day === 'none'){
                                // 有变化,月日重置
                                that._yearSelect.setSelectedIndex(0);
                                that._monthSelect.setSelectedIndex(0);
                                // 有变化,月日重置
                                that._dateSelect.setDirty(true);
                                that._dateSelect.setSelectedIndex(0);
                                that._updateTip();
                            }else{
                                var _year = that._yearSelect.getValue().value;
                                if(_year === 'none'){
                                    // 之前有选中none
                                    that._yearSelect.setSelectedIndex(1);
                                    that._monthSelect.setSelectedIndex(1);
                                }
                                that._updateTip();
                            }
                        }else{
                            that._updateTip();
                        }
                    }.bind(that)
                });
                container.addChild(that._dateSelect);
                if(data.date){
                    var index = day;
                    if(data.hasNone){
                        index++;
                    }
                    that._dateSelect.setSelectedIndex(index - 1);
                }else{
                    that._dateSelect.setSelectedIndex(0);
                }
                

                // 更新tip
            } 
            if(data.format == 'time' || data.format == 'datetime') {
                var hour = date.getHours();
                var hours = [];
                if(data.hasNone){
                    hours.push({name: '--', value: 'none'});
                }
                for(var i=0; i<24; i++) {
                    hours.push({name : shark.i18n.trans('hour', i), value : i, selected : hour == i});
                }
                that._hourSelect = new shark.Selector({fixWidth : true, list :hours,  cssStyle : {maxHeight : 115}},  {
                      onchange : function(_evt,_ctrl){
                            that._updateTip();
                        }.bind(that)});
                container.addChild(that._hourSelect);
                // 分
                var minute = date.getMinutes();
                var minutes = [];
                if(data.hasNone){
                    minutes.push({name: '--', value: 'none'});
                }
                for(var i=0; i<60; i++) {
                    minutes.push({name : shark.i18n.trans('minute', i), value : i, selected : minute == i});
                }    
                that._minuteSelect = new shark.Selector({fixWidth : true, list :minutes,  cssStyle : {maxHeight : 115}}, {
                    onchange : function(_evt,_ctrl){
                        that._updateTip();
                    }.bind(that)});
                container.addChild(that._minuteSelect);
            }
            that._container = container;
            return container.getEle();
        },
        oncreate:function(){
            var that = this;
            // 默认提示
            that._updateTip();
        },
        /**
         * 新的日期的列表
         */
        getDayList : function(_year, _month) {
            var that = this;
            var data = that.getData();
            var year = _year;
            var month = _month;
            var dateSize = 0;

            // 2月
            if(month == 1) {
                // 闰年
                if(year % 4 == 0) {
                    dateSize = 29
                }else {
                    dateSize = 28;
                }
            } else {
                if(month <= 6 && month % 2 == 0 || month >= 7 && month % 2 == 1 || month === 'none') {
                    dateSize = 31;
                } else {
                    dateSize = 30;
                }
            }
            
            // 更新
            var list = [];
            if(data.hasNone){
                list.push({name: '--', value: 'none'});
            }
            for(var i=1; i<=dateSize; i++) {
                list.push({name : shark.i18n.trans('day', i), value : i});
            }
        
            return list;
        },
        /**
         * 获取提示内容
         * @param {string} tipformat tip格式
         * @return {string} 提示内容默认使用 data.tipformat
         * @public
         */
        getTip : function(tipformat){
            var that = this;
            var data = that.getData();
            tipformat = tipformat || data.tipformat;
            var date = that.getValue();
            var tip = that._getDateTip(date, data.format);
            var txt = shark.tool.format(tipformat, '&nbsp;<strong>' + tip + '</strong>&nbsp;');
            return txt;
        },
        /**
         * 转换时间为提示内容
         * @param  {Date} date 需要转换的时间
         * @param {string} format 格式 date, datetime, time, 默认datetime
         * @return {string}  提示内容
         */
        _getDateTip: function(date, format) {
            var format = format || 'datetime';
            var schedule = date.getTime();
            var now = new Date();
            now.setHours(0, 0, 0, 0);

            var sText = '';
            if(format == 'date' || format == 'datetime') {
                var nYear = date.getFullYear();
                var nMonth = date.getMonth();
                var nWeek = now.getDay();
                var nDay = date.getDate();
                // 最后星期日
                if (nWeek == 0) {
                    nWeek = 7;
                }
                var nDiff = parseInt((schedule - now.getTime()) / (1000 * 60 * 60 * 24));
                //  "日,一,二,三,四,五,六"
                var aWeek = shark.i18n.trans('week').split(",");
                //["日","一","二","三","四","五","六"];
                switch (nDiff) {
                    case -2:
                        // "前天"
                        sText = shark.i18n.trans('date_qiantian');
                        break;
                    case -1:
                        // "昨天"
                        sText = shark.i18n.trans('date_zuotian');
                        break;
                    case 0:
                        // "今天"
                        sText = shark.i18n.trans('date_jintian');
                        break;
                    case 1:
                        //"明天"
                        sText = shark.i18n.trans('date_mingtian');
                        break;
                    case 2:
                        // "后天"
                        sText = shark.i18n.trans('date_houtian');
                        break;
                    default:
                        if (shark.config.hl !== 'en_US') {
                            // 英文不要有这个描述了
                            // 当前选择时间星期几
                            var sWeek = aWeek[date.getDay()];
                            if ((1 - nWeek) <= nDiff && nDiff <= (7 - nWeek)) {
                                // 本周优先
                                sText = "本周" + sWeek;
                            } else if ((7 - nWeek) < nDiff && nDiff <= (14 - nWeek)) {
                                // 下周
                                sText = "下周" + sWeek;
                            } else if ((-7 - nWeek) < nDiff && nDiff < (1 - nWeek)) {
                                // 上周
                                sText = "上周" + sWeek;
                            } else {
                                // 传统表示法
                                if (nYear != now.getFullYear()) {
                                    sText = nYear + "年";
                                }
                                if (nYear == now.getFullYear() && date.getMonth() == now.getMonth()) {
                                    sText += "本月";
                                } else {
                                    var mons = "1月,2月,3月,4月,5月,6月,7月,8月,9月,10月,11月,12月".split(',');
                                    sText += mons[nMonth];
                                }
                                sText += nDay + "日周" + sWeek;
                            }
                        } else {
                            sText += nYear + '-' + (nMonth + 1) + '-' + nDay;
                        }
                        break;
                }
            }

            var sTime = '';
            if(format == 'time' || format == 'datetime') {
                // 小时
                var nHour = date.getHours();
                // 分
                var nMinute = date.getMinutes();
                // time
                if (shark.config.hl != 'en_US') {
                    // 英文不要有这个描述了
                    if (nHour < 6) {
                        //"凌晨"
                        sTime = shark.i18n.trans('date_linceng');
                    } else if (nHour < 11 || (nHour == 11 && nMinute < 30)) {
                        // "早上"
                        sTime = shark.i18n.trans('date_zaoshang');
                    } else if (nHour < 13 || (nHour == 13 && nMinute < 30)) {
                        // "中午";
                        sTime = shark.i18n.trans('date_zhongwu');
                    } else if (nHour < 18) {
                        // "下午";
                        sTime = shark.i18n.trans('date_xiawu');
                    } else if (nHour < 24) {
                        // "晚上";
                        sTime = shark.i18n.trans('date_wanshang');
                    }
                }
                if (shark.config.hl === 'en_US') {
                    sText += ' ';
                }
                sTime += nHour + ":";
                if (nMinute < 10) {
                    sTime += "0";
                }
                sTime += nMinute;
            }

            if(format == 'date') {
                return sText;
            } else if(format == 'time') {
                return sTime;
            } else if(format == 'datetime') {
                return sText + sTime;
            }
        },
        /**
         * 更新提示内容
         * @private
         */
        _updateTip : function(){
            var that = this;
            var data = that.getData();
            if(data.tipcontainer) {
                that._text = new shark.Text({html : that.getTip()});
                data.tipcontainer.empty().html(that._text.getEle());
            }
            // 有修改了
            that.getSettings().onchange(that.getValue());
        },
        show : function(){
            var that = this;
            var data = that.getData();
            if(data.tipcontainer) {
                data.tipcontainer.show();
            }
            that.parent();
        },
        hide : function(){
            var that = this;
            var data = that.getData();
            if(data.tipcontainer) {
                shark.tool.hide(data.tipcontainer);
            }
            that.parent();
        },
        /**
         * 获取input的value值
         * @author  hite
         * @version 1.0
         * @date    2013-05-28
         * @return  {string}   input的value值
         */
        getValue:function(){
            var that = this;
            var year = that._yearSelect ? that._yearSelect.getValue().value : 0;
            var month = that._monthSelect ? that._monthSelect.getValue().value : 0;
            var day = that._dateSelect ? that._dateSelect.getValue().value : 0;
            var hour = that._hourSelect ? that._hourSelect.getValue().value : 0;
            var minute = that._minuteSelect ? that._minuteSelect.getValue().value : 0;
            if(year === 'none' || (that.getData().hasNone && year === 0)){
                return null;
            }
            var date = new Date( year, month, day, hour, minute, 0  );
            return date;
        },
        /**
         * 设置input的value值
         * @author  hite
         * @version 1.0
         * @date    2013-05-28
         * @param   {string}   _value 需要设置input的value值
         * 
         */
        setValue:function(date){
            var that = this;
            var scheduleDate = new Date(parseInt(date, 10));
            // 年
            that._yearSelect && that._yearSelect.setValue(date.getFullYear());
            // 月
            that._monthSelect && that._monthSelect.setValue(date.getMonth());
            // 日
            that._dateSelect && that._dateSelect.setValue(date.getDate());
            // 时
            that._hourSelect && that._hourSelect.setValue(date.getHours());
            // 分
            that._minuteSelect && that._minuteSelect.setValue(date.getMinutes());
            
            that._updateTip();
        },
        destroy : function(){
            var that = this;

            if(that._yearSelect){
                that._yearSelect.destroy();
                that._yearSelect = null;
            }
            if(that._monthSelect){
                that._monthSelect.destroy();
                that._monthSelect = null;
            }
            if(that._dateSelect){
                that._dateSelect.destroy();
                that._dateSelect = null;
            }
            if(that._hourSelect){
                that._hourSelect.destroy();
                that._hourSelect = null;
            }
            if(that._minuteSelect){
                that._minuteSelect.destroy();
                that._minuteSelect = null;
            }
            if(that._container){
                that._container.destroy();
                that._container = null;
            }
            if(that._text) {
                that._text.destroy();
                that._text = null;
            }
            that.parent();
        }
    });

    shark.factory.define("DateSelector",DateSelector);


}();


!function(){
    /**
     * @fileOverview 对原生seletor的模拟,目前只考虑只有一个select分组的情况
     * 
     */
    var CheckDropMenu = shark.factory.extend("DropMenu",/** @lends Selector# */{
        /**
         * 模拟的select组件。提供了和原生select类似的组件
         * @author  hite
         * @version 1.0
         * @date    2013-05-28
         * @constructor
         * @constructs
         * @extends {DropMenu}
         * @param   {object}   _data     数据源，数据结构继承自@see DropMenu,如下<br/>
         *                               {string}:btnClsName 标准按钮的自定义样式<br/>
         *                               {string}:name 按钮的文案<br/>
         *                               {string}:value 当前选中值<br/>
         *                               {object}:cssStyle 其中关于宽的加在dropmenu上，关于高的加在各自的menulist上<br/>
         *                               {array}:list 下拉选项的数组，数据结构详见@see MenuItem<br/>
         *                               {function}:extraChildren 除了标准的下拉选项之外如果还需要其他项（如新建文件夹按钮），则使用此函数生成，
         *                               组件会自动将data.list生成的组件合并一起做完下拉菜单，详见events注释。<br/>
         * @param   {object}   _settings 参数包括，继承自@see DropMenu,<br/>
         *                               {object}:trigger 如果传入了trigger使用参数里的trigger，如果没有，使用默认的splitButton组件<br/>
         */
        init:function(_data,_settings){
            var that = this;
            var data = $.extend({}, _data);

            var settings = $.extend({}, _settings);
            // menulist
            settings.$oncheckchange = function(_evt,_ctrl, _checkState){
                // 获取当前的选择数据,
                if(settings.onchange){
                    /**
                     * 当选项变化时，执行的回调
                     * @event
                     * @name Selector#onchange
                     * @example
                     * onchange:function(_event,_ctrl){
                    }
                     * @param {Event} _evt event对象
                     * @param {Widget} _ctrl 当前Selector组件实例
                     * @param {number} _checkState 选中状态
                     */
                    settings.onchange(_evt,_ctrl, _checkState);
                }
            };
            // 是checkbox
            data.isCheckbox = true;
            that.parent(data,settings);
        },
        /**
         * 获取所有选择列表
         */
        getAllCheckValue : function(){
            var that = this;
            var menulists = that.getMenuList();
            for (var i = 0; i < menulists.length; i++) {
                // 找到那个数据
                if(menulists[i].getData().isCheckbox){
                    return menulists[i].getAllCheckValue();
                }
            };
            return [];
        },
        oncreate : function(){
            var that = this;
            that.parent();
        }
    });

    shark.factory.define("CheckDropMenu",CheckDropMenu);

}();
(function() {
    /**
     * @fileOverview 弹窗类，包括基础弹窗和标准弹窗
     */
    //
    /**
     * 弹窗类，单例模式，
     * <br/>内置了拖拽和esc快捷键关闭.默认居中显示
     * 主函数 .show(html);关闭使用.clos()
     *
     * @todo 居中显示不随着窗口缩放变化.
     * @type {Object}
     */
    var pBaseTmpl =
        '<div class="m-overlay <%if(this.animate){%>m-overlay-ani<%}%> <%=this.dialogClsName%>">\
            <div class="w-mask <%if(this.animate){%>w-mask-ani<%}%> js-mask"></div>\
            <div class="overlay-container f-scroll-y <%if(this.animate){%>overlay-container-ani<%}%> f-tlbr js-overlay-container">\
                <div class="m-popwin <%=this.clsName || ""%> js-w-dialog-body">\
                    <%if(this.useHeader) {%>\
                    <div class="popwin-hd js-w-dialog-head">\
                    </div>\
                    <%}%>\
                    <div class="popwin-bd js-w-dialog-content">\
                    </div>\
                    <%if(this.useFooter) {%>\
                    <div class="popwin-ft <%=this.footClsName||""%> js-w-dialog-footer">\
                        <div class="popwin-ft-txt js-w-dialog-foot-txt">\
                        </div>\
                        <div class="popwin-ft-act m-hrz js-w-dialog-actionbar">\
                        </div>\
                    </div>\
                    <%}%>\
                </div>\
            </div>\
        </div>',
        pContainerHtml = '<div id="widgetDialogContainer"></div>';
    /**
     * 基本模板参数，默认参数
     * @name BaseDialog#defaultSettings
     * @readOnly
     * @property {string} clsName 弹窗样式，默认无自定义样式.
     * @property {string} footClsName 底部样式，默认无
     * @property {boolean} animate 是否使用动画，默认使用。
     * @property {boolean} userHeader 是否使用弹窗头，默认使用。
     * @property {boolean} useFooter 是否使用弹窗底部，默认不使用。
     * @property {boolean} supportEsc 是否支持esc
     * @property {boolean} autoFocus 当弹窗内容区有input元素时，是否自动focus。默认自动focus。
     * @property {boolean} autoSelect 当弹窗内容区有input元素时，是否自动选中文本。默认false。
     *
     * @property {boolean} supportSubmit 是否支持回车提交。默认支持。
     * @type {Number}
     */
    var pDefault = {
        useHeader: true,
        useFooter: true,
        animate: true,
        footClsName: '',
        clsName: '',
        dialogClsName: '',
        supportEsc: true,
        autoFocus: true,
        autoSelect: false,
        supportSubmit: true
    },
        pEvents = {
            title: '提示'
        };

    // 默认的弹窗位置偏移，包括 z-index;
    // pZIndexStep 为每次 修改zindex和top,left的步进
    /**
     * 多级弹窗时候的参数步进默认值
     * @name BaseDialog#defaultOffset
     * @readOnly
     * @property {number} zindex 弹窗默认的zindex 130.
     * @property {number} offset 多级弹窗时候，下级zindex的步进，比上一个多20的步进
     * @type {Number}
     */
    var pZindex = 130,
        pZIndexStep = 20;
    var pDialogContainer = null;
    //
    var BaseDialog = shark.factory.extend("Container", /** @lends BaseDialog# */ {
        /**
         * 基础弹窗类，只有标题和内容区，并且提供若干基本操作。
         *  <ol>
         *      <li>esc关闭操作，最小化,最大化</li>
         *      <li>设置footer内容</li>
         *      <li>标题栏可拖动</li>
         *  </ol>
         * @example
         * that.uploadDialogBox = new JY.BaseDialog({
         *       useFoot: false,
         *       clsName : 'w-netfile-upload'
         *   });
         * @author  hite
         * @constructs
         * @constructor
         * @extends {Container}
         * @version 1.0
         * @date    2013-05-24
         * @param   {Object}   _data     控制弹窗显示的数据，包括参数有<br/>
         *                               {string}:dialogClsName 控制整个弹窗的自定义样式，包括遮罩。一般不建议使用<br/>
         *                               {string}:clsName 自定义对话框的样式，通常来限定宽度和内部输入框的个性样式<br/>
         *                               {boolean}:supportMini 支持最小化
         *                               {boolean}:animate 是否启用动画 默认true
         *
         * @param   {object}   _settings 弹窗行为控制参数，整体参数，<br/>
         *                               场景是，如果这个弹窗要show多次不同内容，但是cssStyle都参数基本相同的时候。包括<br/>
         *                               {object}:cssStyle 直接使用css参数来控制对话框最外层的样式<br/>
         *                               {string|object|jquerObject}:footer 弹窗底部的内容<br/>
         *                               {function}:onclose 当执行对话框的关闭操作的时候的回调，通常会做些内部组件的关闭操作。
         *                               {function}:onmini 执行最小化的时候
         *                               
         */
        init: function(_data, _settings) {
            var that = this;
            var data = $.extend({}, pDefault, _data);
            var settings = $.extend({onmini : function(){}}, pEvents, _settings);

            var html = $.jqote(pBaseTmpl, data);
            that._prepare();
            // TODO 效率低，考虑放到真正show的时候去做
            that.parent($(html), data, settings);
        },
        /**
         * 一些和dom结构有关的事件.包括点击x关闭；esc键关闭。
         * @author  hite
         * @protected
         * @version 1.0
         * @date    2012-07-02
         */
        oncreate: function() {
            var that = this;
            var domNode = that.getEle();

            var hrz = new shark.HrzLine();
            that.titleEle = new shark.Text({
                html: that.getSettings().title,
                cssStyle: {
                    size: 'middle'
                }
            });
            hrz.addChild(that.titleEle);
            hrz.addChild(new shark.Link({
                icoClass: 'icon-close-pop',
                wrapClsName: 'm-wrap-right'
            }, {
                onclick: function() {
                    that.close();
                }
            }));

            if (that.getData().supportMini) {
                that.__miniBtn = new shark.Link({
                    icoClass: 'icon-minimize-pop',
                    // title: '最小化',
                    wrapClsName: 'm-wrap-right'
                }, {
                    onclick: function() {
                        that.getSettings().onmini();
                    }
                });
                hrz.addChild(that.__miniBtn);
            }
            that.getHeader().append(hrz.getEle());
            that.headerHrz = hrz;
            pDialogContainer.append(domNode);
        },
        _prepare: function() {
            if (pDialogContainer == null) {
                $(document.body).append(pContainerHtml);
                //
                pDialogContainer = $("#widgetDialogContainer");
            }
        },
        /**
         * 弹窗窗口，内容高度自适应，宽度可以通过cssStyle接口或者是clsName这样的接口来控制。
         * @example .show("<hr/>");
         * @author  hite
         * @version 1.0
         * @date    2012-3-27
         * @param   {string|jqueryObject}  _html     html代码片段,可以在传入show方法的时候，相关的事件就已经绑定。<br/>
         *                                           也可以在onpopshow里初始化。这样加快弹窗显示的速度。
         * @param   {object}  _settings 控制弹窗的参数，单独的参数，每次show时特殊指定不同cssStyle参数,覆盖在init时候传入的参数。相关参数包括:<br/>
         *                              {object}:cssStyle 直接使用css参数来控制对话框最外层的样式<br/>
         *                              {string|object|jquerObject}:footer 弹窗底部的内容<br/>
         *                              {function}:onclose 弹窗关闭时的<br/>
         * @return  {object}            当前显示的弹窗对象
         */
        show: function(_html, _settings) {
            var that = this;
            var data = that.getData();
            var settings = that.getSettings();
            // 设置settings
            $.extend(settings, _settings);
            that.setSettings(settings);

            that.getMask().show();

            // 加正文内容
            that.addContent(_html);

            if (settings.footer) {
                this.setFooter(settings.footer);
            }

            that.restore();
            // null,表明是window
            shark.dock.dockIn(that.getBody(), {
                position: "middle,center"
            });
            // 拖拽
            that.draggable();
            // 绑定快捷键esc
            if (data.supportEsc) {
                shark.shortkey.bind("esc", function() {
                    var win = shark.popwinHelper.peek();
                    if (win) {
                        win.close();
                    }
                });
            }
            // 默认支持回车提交
            if (data.supportSubmit) {
                that.getContent().delegate("input:visible", "keydown", function(e) {
                    if (e.keyCode == 13) {
                        if (typeof settings.onok == "function" && settings.onok(that)) {
                            that.close();
                        }
                    }
                });
            }
            // 自动聚焦
            if (data.autoFocus || data.autoSelect) {
                setTimeout(function() {
                    that.focusInput();

                    // 自动选中
                    if (data.autoSelect) {
                        that.selectInput();
                    }
                }, 50);
            }

            // 显示完成的时候执行
            if (typeof settings.onpopshow == "function") {
                settings.onpopshow(this);
            }
            // $(document).bind('keyup', pEscFunc);
        },
        /**
         * 更新层级
         * @return {void}
         */
        _updateLayer: function() {
            var domNode = this.getEle();
            var zindex = pZindex += pZIndexStep;
            domNode.css("z-index", zindex);
        },
        /**
         * 恢复层级
         * @return {void}
         */
        _recoverLayer: function() {
            pZindex -= pZIndexStep;
        },
        // 目前可能只有弹窗
        draggable: function() {
            this.dragSort = new shark.Drag({
                trigger : this.getHeader(),
                element: this.getBody(),
                container: $(document.body)
            });
        },
        /**
         * 为setFooter设置内容
         * @author  hite
         * @version 1.0
         * @date    2012-6-25
         * @param   {Object|string}    _html 填充的html或者是字符串，也行有事件；
         */
        setFooter: function(_html) {
            var footer = this.getEle(".js-w-dialog-footer .js-w-dialog-foot-txt");
            shark.tool.empty(footer);
            shark.factory.appendContents(footer, _html);
        },
        /**
         * 修改弹出层上部分的标题。注意不是弹出层的标题框的文案，而是内部的内容区的标题。
         * @author  hite
         * @version 1.0
         * @date    2013-05-24
         * @param   {string}   _title 标题
         */
        setTitle: function(_title) {
            if (_title) {
                this.titleEle.setText(_title);
            }
        },
        /**
         * 获取body
         * @return {dom} body
         */
        getBody: function() {
            var that = this;
            if (!that._body) {
                that._body = that.getEle(".js-w-dialog-body");
            }
            return that._body;
        },
        /**
         * 获取遮罩
         * @return {dom} 遮罩
         */
        getMask: function() {
            var that = this;
            if (!that._mask) {
                that._mask = that.getEle(">.js-mask");
            }
            return that._mask;
        },
        /**
         * 获取遮罩
         * @return {dom} 遮罩
         */
        getOverlayContainer: function() {
            var that = this;
            if (!that._overlay_container) {
                that._overlay_container = that.getEle(">.js-overlay-container");
            }
            return that._overlay_container;
        },
        /**
         * 获取内容区
         * @return {dom} 内容区
         */
        getContent: function() {
            var that = this;
            if (!that._content) {
                that._content = that.getBody().children(".js-w-dialog-content");
            }
            return that._content;
        },
        /**
         * 添加内容
         */
        addContent: function(html) {
            var that = this;
            if ($.isArray(html)) {
                for (var i = 0; i < html.length; i++) {
                    if (html[i] && html[i].getEle) {
                        that.getContent().append(html[i].getEle());
                    } else {
                        that.getContent().append(html[i]);
                    }
                };
            } else {
                if (html && html.getEle) {
                    that.getContent().append(html.getEle());
                } else {
                    that.getContent().append(html);
                }
            }

        },
        /**
         * 获取头部区
         * @return {dom} 头部区
         */
        getHeader: function() {
            var that = this;
            if (!that._head) {
                that._head = that.getBody().children('.js-w-dialog-head');
            }
            return that._head;
        },
        /**
         * 获取工具栏
         * @return {Container} 工具栏容器
         */
        getActionBar: function() {
            var that = this;
            if (!that._actionbar) {
                that._actionbar = new shark.Container(that.getBody().find('>.js-w-dialog-footer>.js-w-dialog-actionbar'));
            }
            return that._actionbar;
        },
        /**
         * 只有actionbar是组件，其他都是普通的 对象<br/>
         * 在重置actionbar的时候，会清空上一次的按钮。
         * @author  hite
         * @version 1.0
         * @date    2013-02-19
         * @param   {type}   _btns 按钮组件的数组
         */
        setActionBar: function(_btns) {
            var that = this;
            if (_btns.length > 0) {
                var actionbar = that.getActionBar();
                actionbar.empty();
                $.each(_btns, function(index, item) {
                    actionbar.addChild(item)
                });
            }
        },
        /* 默认选择第一个input，使自动focus；
         * @author  hite
         * @version 1.0
         * @protected
         * @date    2012-5-30
         * @return  {void}     无返回值
         */
        focusInput: function() {
            var that = this;
            var input = that.getContent().find("input:visible");
            if (input.length > 0) {
                input.first().focus();
            }
        },
        /**
         * 默认选择第一个input，使自动select；
         * @author  hite
         * @protected
         * @version 1.0
         * @date    2012-5-30
         * @return  {void}     无返回值
         */
        selectInput: function() {
            this.getContent().find("input:visible").first().select();
        },
        /**
         * 最小化弹窗，如果传入了参数，则不使用默认的最小化机制（.hide()）
         * @author  hite
         * @version 1.0
         * @date    2013-05-24
         * @param   {function}   _manipulate 最小化的具体实现方式，在文件上传那里不能使用hide来最小化，而是设置宽度为0的方式；
         */
        mini: function(_manipulate) {
            var that = this;
            // esc快捷键
            // $(document).unbind('keyup', pEscFunc);
            // 启用快捷键
            shark.shortkey.unbind("esc", function() {
                shark.popwinHelper.peek().close();
            });
            // 恢复层级
            that._recoverLayer();
            // 可能在 非当前状态下被mini
            if(that.getData().animate){
                that.getEle().addClass('f-ani-overlay');
                // 动画结束的时候，再移除样式
                setTimeout(function() {
                    that.getMask().removeClass('f-ani-mask');
                    that.getOverlayContainer().removeClass('f-ani-bouncein');
                }, 200);
            }
            that.setVisible(false);
            //
            that.setMiniState(true);

            shark.popwinHelper.pop(that);
            var later = that.getData().animate? 150:0;
            setTimeout(function(){
                if (typeof _manipulate === "function") {
                    _manipulate();
                } else {
                    shark.tool.hide(that.getEle());
                }
            }, later);
            
            
        },
        /**
         * 获取最小化按钮
         */
        getMiniButton : function() {
            return this.__miniBtn;
        },
        /**
         * 还原最小化弹窗，如果传入了参数，则不使用默认的还原最小化机制（.show()）
         * @author  hite
         * @version 1.0
         * @date    2013-05-24
         * @param   {function}   _manipulate 还原最小化的具体实现方式，在文件上传那里不能使用show来还原最小化，而是还原宽度的方式；
         */
        restore: function(_manipulate) {
            var that = this;
            // 禁用快捷键
            shark.popwinHelper.push(this);
            if(that.getData().animate){
                // 动画相关，显示的时候需要处理
                that.getEle().removeClass('f-ani-overlay');
            }
            that.getMask().addClass('f-ani-mask');
            that.getOverlayContainer().addClass('f-ani-bouncein');
            if (typeof _manipulate === "function") {
                _manipulate();
            } else {
                this.getEle().show();
            }
            this.setVisible(true);
            //
            this._updateLayer();

            this.setMiniState(false);
        },
        /**
         * @deprecated 不推荐使用。推荐在具体模块使用原始的mini，传入一个function来实现。
         *
         * @date    2013-03-08
         */
        uploadMini: function() {
            var that = this;
            that.mini(function() {
                that.getEle().css('width', '0');
            });
        },
        /**
         *  @deprecated 不推荐使用。推荐在具体模块使用原始的mini，传入一个function来实现。
         *
         * @date    2013-03-08
         */
        uploadRestore: function() {
            var that = this;
            that.restore(function() {
                that.getEle().css('width', '100%');
            });
        },
        setMiniState: function(_mini) {
            this._miniState = !! _mini;
        },
        /**
         * 获取当前最小化状态，而不是去探测dom是否visible
         * @author  hite
         * @version 1.0
         * @date    2013-05-24
         */
        isMini: function() {
            return this._miniState;
        },
        /**
         * 关闭弹窗。如果onclose回调返回false，中断此次关闭行为<br/>
         * 首先会执行onclose方法；然后最小化；销毁默认组件；执行destory方法，
         * @author  hite
         * @version 1.0
         * @date    2013-02-19
         */
        close: function() {
            var that = this;
            var settings = that.getSettings();
            if (typeof settings.onclose == "function") {
                if (settings.onclose(this) == false) {
                    return;
                }
            }
            this.mini(function(){
                that.setMiniState(false);

                if(that.getData().animate){
                    setTimeout(function(){
                        if(that.dragSort){
                            // 拖拽
                            that.dragSort.destroy();
                        }
                        that.destroy();
                    }, 150);
                } else {
                    if(that.dragSort){
                        // 拖拽
                        that.dragSort.destroy();
                    }

                    that.destroy();
                }
            });
        },
        destroy: function() {
            var that = this;
            // 清除引用。
            if(that.headerHrz){
                that.headerHrz.destroy();
                that.headerHrz = null;
            }
            if(that.titleEle){
                that.titleEle.destroy();
                that.titleEle = null;
            }
            if(that.__miniBtn){
                that.__miniBtn = null;
            }
            if(that._body){
                that._body = null;
            }
            if(that._mask){
                that._mask = null;
            }
            if(that._overlay_container){
                that._overlay_container = null;
            }
            if(that._content){
                that._content = null;
            }
            if(that._head){
                that._head = null;
            }
            if(that._actionbar){
                that._actionbar.destroy();
                that._actionbar = null;
            }
            if(that.__btns) {
                for (var i = 0; i < that.__btns.length; i++) {
                    that.__btns[i].destroy();
                }
                that.__btns.length = 0;
            }

            if(that.ok){
                that.ok = null;
            }
            if(that.cancel){
                that.cancel = null;
            }
            if(that.__wrap){
                that.__wrap = null;
            }

            if(that.dragSort) {
                that.dragSort.destroy();
                that.dragSort = null;
            }
            that.parent();
        }
    });
    shark.factory.define("BaseDialog", BaseDialog);

    var DialogBox = shark.factory.extend("BaseDialog", /** @lends DialogBox# */ {
        /**
         * 标准的对话框,包含基本的两个按钮操作.和基本弹窗的行为@see BaseDialog;
         * @constructor
         * @constructs
         * @extends {BaseDialog}
         * @example
         * var alert = new JY.DialogBox({
                    clsName:"m-popwin-psc m-popwin-psc-mother",
                    dialogClsName:"m-overlay-mother",
                    useHeader:false
                });
         * @author  hite
         * @version 1.0
         * @date    2013-05-24
         * @param   {object}   _data     弹窗数据源,同@see BaseDialog#data参数
         * @param   {object}   _settings 弹出框行为参数，继承@see BaseDialog;
         */
        init: function(_data, _settings) {
            /**
             * 基本模板参数，默认参数
             * @name DialogBox#defaultSettings
             * @readOnly
             * @property {string} clsName 弹窗样式，默认"",无自定义样式.
             * @property {boolean} useHeader 是否使用弹窗头，默认true,使用。
             * @property {boolean} useFooter 是否使用弹窗底部，默认true,使用。
             * @type {Number}
             */
            var data = $.extend({
                useHeader: true,
                useFooter: true,
                clsName: ""
            }, _data);

            this.parent(data, _settings);
        },
        /**
         * 弹窗窗口，内容高度自适应，
         * 推荐bind事件之后，再show出来；
         * @example .show("<hr/>");
         * @author  hite
         * @version 1.0
         * @date    2012-3-27
         * @param   {string/domObject/jqueryObject}  _html     html代码片段,dom原生对象，或者jquery，容许保留事件
         * @param   {object}  _settings 控制弹窗的参数，具体参数如下:（部分参数继承自@see BaseDialog ）<br/>
         *                    {string}:title  默认"",弹窗最上部分的提示<br/>
         *                    {string}:errorTip 默认"",错误提示，位置在左下<br/>
         *                    {boolean}:autoFocus 默认为true,// 如果弹窗里有input，那么默认显示的时候，第一个input自动focus；<br/>
         *                    {function}:onok 点击确定按钮时的回调，详细参数见events部分注释<br/>
         *                    {function}:oncancel 点击取消按钮时的回调，详细参数见events部分注释<br/>
         *                    {function}:buttonsGenerator 容许自定义按钮区域的按钮动作和数量种类，默认为"确定"和"取消"两个按钮，详细参数见events部分注释<br/>
         *                    {function}:onpopshow 当弹窗真正渲染出来的时候，执行的回调，因为有些dom操作必须要visible的时候，如focus等；<br/>
         *                    {function}:onclose 销毁的时候会处理的函数
         * @return  {object}            当前显示的弹窗对象
         */
        show: function(_html, _settings) {
            var that = this;
            /**
             * 标准对话框的默认参数
             * @name DialogBox#defaultSettings
             * @property {boolean} useOk 是否使用ok按钮，默认使用
             * @property {boolean} useCancel 是否使用cancel按钮，默认使用
             * @property {string} okTxt 默认ok按钮的文案——确定
             * @property {string} cancelTxt 默认cancel按钮的文案——取消
             * @type {type}
             */
            var pDefaultSettings = {
                useOk: true,
                useCancel: true,
                okTxt: shark.i18n.trans("dialogbox_ok"),
                cancelTxt: shark.i18n.trans("dialogbox_cancel"),
                onok: function() {
                    return true;
                }
            };
            var settings = $.extend({}, pDefaultSettings, _settings);
            // 临时容器

            var dom = that.getEle();
            // 内容区，显示出来,然后就可以执行和尺寸相关的处理了。
            that.parent(_html, settings);
            // 标题
            if (settings.title) {
                that.setTitle(settings.title);
            }

            if (settings.errorTip) {
                that.setErrorTip(settings.errorTip);
            }
            // 生成工具按钮
            var btns = [];
            if (typeof settings.buttonsGenerator == "function") {
                /**
                 * 按钮的生成器。如果需要对按钮区域的按钮自定义，则提供此函数。
                 * @name DialogBox#buttonGenerator
                 * @event
                 * 
                 * @param {Widget} _ctrl 当前弹窗，传入此函数的入参。
                 * @return {array} buttons 要填充到按钮区的button数组。显示的次序按照数组的顺序。
                 */
                btns = settings.buttonsGenerator(this);
            } else {
                // 
                if (settings.useOk) {
                    that.ok = new shark.OKButton({
                        name: settings.okTxt
                    }, {
                        onclick: function(_ctrl) {
                            /**
                             * 点击确定时候执行的回调。
                             * @name DialogBox#onok
                             * @event
                             * @example
                             * onok:function(ctrl){
                             *      //
                             *      var formData =that._getPopAccountForm(ctrl.getEle());
                             *      //
                             *      if(!$Email.isValid(formData.userName.trim())){
                             *          html.find(".js-passport .js-error").html('<span class="f-txt-err">' + "请正确填写代收帐号地址。" + '</span>').show();
                             *          return false;
                             *      }
                             *  }
                             * @param {Widget} _ctrl 当前弹窗，传入此函数的入参。
                             * @return {boolean} trueOrfalase 返回false表示不要关闭弹窗；返回true表示要关闭弹窗。<br/>
                             *                                返回false的情况，多见于onok里有异步请求，当请求返回符合成功的条件的时候，手动调用.close方法来关闭弹窗。
                             */
                            if (typeof settings.onok == "function" && settings.onok(that)) {
                                that.close();
                            }
                        }
                    });
                    btns.push(that.ok);
                }
                if (settings.useCancel) {
                    that.cancel = new shark.CancelButton({
                        name: settings.cancelTxt
                    }, {
                        onclick: function(_ctrl) {
                            /**
                             * 点击取消时候执行的回调
                             * @name DialogBox#oncancel
                             * @event
                             * @return {boolean} trueOrfalase 返回false表示不要关闭弹窗；返回true表示要关闭弹窗。<br/>
                             */
                            if (typeof settings.oncancel == "function" && settings.oncancel() === false) {
                                return;
                            }
                            that.close();
                        }
                    });
                    btns.push(that.cancel);
                }
            }
            //
            that.setActionBar(btns);
            // 

            that.__btns = btns;
            return this;
        },
        /**
         * 返回按钮列表
         * @return {Array} [description]
         */
        getButtons : function(){
            return this.__btns;
        },
        /**
         * 设置弹窗左下部分的错误提示信息。如果参数是null，则隐藏此区域<br/>
         * <b>errortip和infotip可以共存，infotip在errortip之前</b>
         * @author  hite
         * @version 1.0
         * @date    2013-05-24
         * @param   {string|jqueryObject}   _html 要显示的内容，可以包含动作
         */
        setErrorTip: function(_html) {
            //
            if (this.errorTip == null) {

            }

        },
        close: function() {
            this.parent();
        }

    });
    shark.factory.define("DialogBox", DialogBox);

    var Prompt = shark.factory.extend("DialogBox", /** @lends Prompt# */ {
        /**
         * 内置prompt提示弹框
         * @example .show({title:"",label:""});
         * @author  hite
         * @version 1.0
         * @constructs
         * @constructor
         * @extends {DialogBox}
         * @date    2012-5-15
         * @param   {object}    _settings 输入提示框参数，部分参数继承@see DialogBox
         *                      {string}:title 最上面显示的粗体文本
         *                      {string}:label 文本框前面的提示性
         *                      {string}:infoTip 提示语
         *                      {string}:placeholder
         *                      {string}:inputValue  输入框的预值
         *                      {boolean}:autoSelect 是否自动选中
         *                      {string}:inputType 文本框的类型，默认为text，个别地方需要密码输入框等
         */
        show: function(_settings) {
            var settings = $.extend({
                title: "",
                label: "",
                autoSelect: true,
                infoTip: ''
            }, _settings);
            var oldOnOk = settings.onok;

            var input = new shark.TightInput({
                label: settings.label,
                type: settings.inputType,
                placeholder: settings.placeholder,
                value: settings.inputValue
            });
            settings.onok = function(data) {
                return oldOnOk(input.getValue());
            }
            this.setInput(input);

            this.parent(input, settings);
            // 添加
            if (settings.infoTip) {
                this.addContent(settings.infoTip);
            }
        },
        /**
         * 获取当前input组件实例
         * @author  hite
         * @version 1.0
         * @date    2012-5-30
         * @return  {object}    tightinput组件
         */
        getInput: function() {
            return this._inputer;
        },
        setInput: function(_input) {
            this._inputer = _input;
        },
        close: function() {
            this.parent();
            this._inputer.destroy();
        }
    });

    shark.factory.define("Prompt", Prompt);
})();
! function() {
    var pTmpl = '<div class="m-toolbar <%=this.clsName||""%> f-cb"></div>';
    /**
     * @fileOverview
     * toolbar全局工具栏只负责模块切换和是否有选择时候的显示隐藏；
     * <br/>控件样式，和点击之后的动作由具体模块负责
     * @type {Object}
     */
    var Toolbar = shark.factory.extend("Container", /**@lends Toolbar# */ {
        /**
         * 工具栏组件
         * @author  hite
         * @version 1.0
         * @date    2013-05-28
         * @constructor
         * @constructs
         * @extends {Container}
         * @param   {object}   data 参数，包括<br/>
         *                               {string} clsName 样式名
         */
        init: function(data, settings) {
            var that = this;
            var data = $.extend({}, data);
            var settings = $.extend({}, settings);
            var html = $($.jqote(pTmpl, data));
            that.parent(html, data, settings);
        },
        /**
         * 隐藏
         */
        hide: function() {
            this.parent();
        },
        /**
         * 显示
         */
        show: function() {
            this.parent();
        },
        /**
         * 更新某个模块的工具栏
         * @example .update
         * @author  hite
         * @version 1.0
         * @date    2012-5-2
         * @todo  支持数组，
         * @param   {object}  btnList 需要更新的组件集合。也可以是对象.
         */
        update: function(btnList, notEmpty) {
            var that = this;
            if(!notEmpty){
                that.empty();
            }
            // 从左往右
            var leftBtns = btnList.left;
            if (leftBtns) {
                for (var i = 0; i < leftBtns.length; i++) {
                    var btnContainer = new shark.Container('<div class="tb-item"></div>');
                    var btns = $.makeArray(leftBtns[i]);
                    for (var j = 0; j < btns.length; j++) {
                        btnContainer.addChild(btns[j]);
                    };

                    that.addChild(btnContainer);
                }
            }

            // 从左往右，隐藏的button，for显示的动画
            var groupBtns = btnList.group;
            if (groupBtns) {
                var groupContainer = new shark.Container('<div class="tb-item-ani"></div>');
                that.groupContainer = groupContainer;
                for (var i = 0; i < groupBtns.length; i++) {
                    var btnContainer = new shark.Container('<div class="tb-item"></div>')
                    var btns = $.makeArray(groupBtns[i]);
                    for (var j = 0; j < btns.length; j++) {
                        btnContainer.addChild(btns[j]);
                    };
                    groupContainer.addChild(btnContainer);
                }
                that.addChild(groupContainer);
            }

            // 靠右排列的
            var rightBtns = btnList.right;
            if (rightBtns) {
                var rightContainer = new shark.Container('<div class="tb-right"></div>');
                for (var i = 0; i < rightBtns.length; i++) {
                    var btnContainer = new shark.Container('<div class="tb-item"></div>')
                    var btns = $.makeArray(rightBtns[i]);
                    for (var j = 0; j < btns.length; j++) {
                        btnContainer.addChild(btns[j]);
                    };
                    rightContainer.addChild(btnContainer);
                }
                that.addChild(rightContainer);
            }
        },
        showGroup: function() {
            var that = this;
            if(that.groupContainer){
                that.groupContainer.getEle().addClass('f-ani-tbitem');
            }
        },
        hideGroup: function() {
            var that = this;
            if(that.groupContainer){
                that.groupContainer.getEle().removeClass('f-ani-tbitem');
            }
        },
        destroy: function() {
            var that = this;
            that.groupContainer = null;
            that.parent();
        }
    });

    shark.factory.define("Toolbar", Toolbar);
}();

(function(){

    /**
     * @fileOverview hoverlist
     */
    // 容器模版
    var pHoverListTmpl = 
            '<ul class="m-hoverlist <%=this.clsName%>">\
            </ul>';
    // hover 样式
    var pHoverClass = 'hl-item-hover';
    // 选中
    var pSelectedClass = 'hl-item-selected';
    // 右边定位的样式
    var pActionClass = 'm-hrz-abs';
    // 行模版
    var pItemTmpl = '<li class="hl-item"></li>';
    // 分隔符
    var pSplitTmpl = '<li class="w-splite <%=this.clsName%>"></li>';
    var HoverList = shark.factory.extend("Container",/** @lends HoverList# */{
        /**
         * 构造函数
         * @param  {object} data    数据
         *                          {Array} list
         *                              参见 addItem
         *                              
         * @param  {object} settings 
         *                         {function} onclick 点击
         *                         {function} onhoverchange hover
         *                           
         */
        init : function(data, settings){
            // data, hoverActions
            var data = $.extend({list : [], 
                actionClsName : pActionClass, 
                tmpl : pHoverListTmpl,
                selectedClass : pSelectedClass,
                hoverClass : pHoverClass
            }, data);
            var settings = $.extend({
                sortable : false,
                // 是否单选
                singleselect : false,
                onclick : function(){},
                onhoverchange : null
            }, settings);

            var html = $($.jqote(data.tmpl, data));
            if(!data.selectedClass) {
                // 没有实际的selectedclass的需要时候
                data.selectedClass = 'js-selectedClass';
            }

            this.parent(html, data, settings);

            for (var i = 0; i < data.list.length; i++) {
                this._addItem(data.list[i]);
            };
        },
        oncreate : function(){
            var that = this;
            that.parent();

            // 初始化排序
            if(that.getSettings().sortable) {
                var dom = that.getEle();

                dom.delegate('.hl-item', 'mousedown', function(evt){
                    that._dragStart(evt);
                    
                    that.__movingElement = $(evt.currentTarget);

                    var position = that.__movingElement.position();
                    
                    if(that.__movingElement.index() === that.getEle().children().length - 1) {
                        that.__mtElement = that.__movingElement.prev();
                        that.__mtElement.addClass('hl-item-mb');
                    } else {
                        that.__mtElement = that.__movingElement.next();
                        that.__mtElement.addClass('hl-item-mt');
                    }

                    // 后加动画 f-ani-hl , 避免抖动
                    setTimeout(function(){
                        dom.find('.hl-item').addClass('f-ani-hl');
                    }, 100);
                    
                    that.__movingElement.addClass('hl-item-move');
                    that.__movingElement.css('top', position.top + 'px');

                    return false;
                });
            }
        },
        _dragStart: function(event) {
            // $Profiler.log('dragstart');
            this._setBegging(true);
            
            return false;
        },
        _dragEnd: function(event) {
            var that = this;
            // $Profiler.log('dragend');
            this._setBegging(false);
            
            return false;
        },
        _dragMove: function(event) {
            var that = this;
            var element = that.__movingElement;

            var pageX = event.pageX;
            var pageY = event.pageY;

            if (!that._isBegging()) {
                that._lastPointer = {
                    x: pageX,
                    y: pageY
                };
                return true;
            }

            if (that._lastPointer) {
                var distance = {
                    x: pageX - that._lastPointer.x,
                    y: pageY - that._lastPointer.y
                };

                that.__scrollContainer = shark.dock.getScrollContainer(that.getEle());


                var position = element.position();

                var y = position.top + distance.y;
                element.css({
                    top: y
                });
// 滚动需要
                // if(y + element.height() * 2 > that.getEle().parent().height()) {
                //     var added = 15;
                //    //that.__scrollContainer.scrollTop((that.__scrollContainer.scrollTop() + added) );
                    
                // }
                
                // 检查到那里了
                var items = that.getEle().children('.hl-item');
                for (var i = 0; i < items.length; i++) {
                    var item = $(items[i]);
                    if(!item.hasClass('hl-item-move')) {
                        var itemTop = item.position().top ;
                        
                        var itemHeight = item.height();
                        // console.log('y: ' + y + ', itemTop:' + itemTop + ', itemBottom:' + (itemTop + itemHeight));
                        if( y > itemTop - itemHeight && y < itemTop + itemHeight) {
                            
                            if(that.__mtElement) {
                                that.__mtElement.removeClass('hl-item-mb hl-item-mt');
                            }

                            if(i == items.length - 1) {
                                if(y > itemTop + itemHeight/2) {
                                    item.addClass('hl-item-mb');
                                } else {
                                    item.addClass('hl-item-mt');
                                }
                            } else {
                                item.addClass('hl-item-mt');
                            }
                            
                            that.__mtElement = item;
                            break;
                        }
                    }
                };

                
            }
            that._lastPointer = {
                x: pageX,
                y: pageY
            };

            
            return false;
        },
        /**
         * 保存状态
         */
        _setBegging: function(_begin) {
            var that = this;
            that._begin = _begin;
            if(_begin) {
                that._bindContainer();
            } else {
                that._unbindContainer();
            }
        },
        _isBegging: function() {
            return !!this._begin;
        },
        /**
         * container上绑定
         */
        _bindContainer : function(){
            var that = this;
            that.getEle().bind("mousemove", $.proxy(that._dragMove, that));
            $(document.body).bind("mouseup mousedown mouseleave", $.proxy(that._dragEnd, that));
        },
        /**
         * container上解绑
         */
        _unbindContainer:function(){
            var that = this;
            // 取消
            // 移动一下
            // 
            if(that.__mtElement.hasClass('hl-item-mt')) {
                that.__mtElement.before(that.__movingElement);
            } else if(that.__mtElement.hasClass('hl-item-mb')) {
                that.__mtElement.after(that.__movingElement);
            }

            that.getEle().unbind("mousemove", $.proxy(that._dragMove, that));
            $(document.body).unbind("mouseup mousedown mouseleave", $.proxy(that._dragEnd, that));
            // 重置一下
            that.__movingElement.removeClass('hl-item-move');
            that.__movingElement.css('top', '');
            that.__movingElement = null;

            that.__mtElement.removeClass('hl-item-mt hl-item-mb');
            // 去掉动画
            that.getEle().find('.hl-item').removeClass('f-ani-hl');

            that._lastPointer = null;
        },
        /**
         * 添加一条item
         * @param {object} hoverItem 数据
         * @param {boolean} isSeperator 是否是分割线
         * @param {string} clsName 分割线样式
         * @param {string|array|widget|dom} hoverItem.data         数据，放在坐标依次排列
         * @param {object} hoverItem.value value，在回调中使用
         * @param {boolean} hoverItem.disabled 是否禁用
         * @param {object} hoverItem.selectable selectable，是否支持选中
         * @param {array|widget} hoverItem.hoverActions actions
         * @param {string} hoverItem.clsName 
         */
        _addItem : function(hoverItem){
            var that = this;
            var data = that.getData();
            var itemData = hoverItem.data, 
                hoverActions = hoverItem.hoverActions,
                value = hoverItem.value, 
                selectable = hoverItem.selectable,
                disabled = hoverItem.disabled,
                selected = hoverItem.selected, 
                hover = ((typeof hoverItem.hover == 'boolean') ? hoverItem.hover : true),
                isSeperator = hoverItem.isSeperator,
                icoClass = hoverItem.icoClass,
                // 显示title
                title = hoverItem.title,
                // class
                clsName = hoverItem.clsName,
                // 是否用hrz wrap
                nowrap = hoverItem.nowrap,
                key = hoverItem.key;

            if(isSeperator) {
                that.addChild(new shark.MyWidget($($.jqote(pSplitTmpl, hoverItem))));
                return;
            }
            var itemWrap = $(pItemTmpl);
            if(clsName) {
                itemWrap.addClass(clsName);
            }
            var wrap = new shark.Container(itemWrap);
            // checkbox
            var checkbox = null;
            if(itemData) {
                itemData = $.makeArray(itemData);
                // 左边的
                if(itemData.length > 0) {
                    if(nowrap) {
                        var hrz = wrap;
                    } else {
                        var hrz = new shark.HrzLine();
                        wrap.addChild(hrz);
                    }

                    for (var i = 0; i < itemData.length; i++) {
                        var item = itemData[i];
                        if(typeof item == 'string') {
                            // 图标
                            hrz.addChild(new shark.Text({text : item, icoClass : icoClass}));
                        } else if(shark.factory.isInstance(item, 'Widget')){
                            hrz.addChild(item);
                            if(shark.factory.isInstance(item, 'Checkbox')){
                                checkbox = item;
                            }
                        } else {
                            hrz.addChild(new shark.MyWidget(item));
                        }
                    };

                    if(title) {
                        hrz.getEle().attr('title', title);
                    }
                }
            }

            if(hoverActions) {
                hoverActions = $.makeArray(hoverActions);
                if(hoverActions.length > 0) {
                    var hrz = new shark.HrzLine({clsName : that.getData().actionClsName});
                    for (var i = 0; i < hoverActions.length; i++) {
                        var item = hoverActions[i];

                        if(shark.factory.isInstance(item, 'Widget')){
                            hrz.addChild(item);
                        } else {
                            throw new Error('only widget supported');
                        }
                    };
                    wrap.addChild(hrz);
                }
            }
            if(key) {
                wrap.getEle().attr('name', key);
            }
            that.addChild(wrap);

            // 禁用了
            if(disabled) {
                wrap.disable();
                return;
            }
            if(hover) {
                var hoverClass = data.hoverClass;
                if(hoverClass) {
                    itemWrap.hover(function(evt){
                        $(evt.currentTarget).addClass(hoverClass);
                        // 返回组件
                    }, function(evt){
                        var ele = $(evt.currentTarget);
                        // 标记离开的时候是不是要去掉hover状态
                        if(!ele.data('onpopshow')) {
                            ele.removeClass(hoverClass);
                            // 返回组件
                        }
                    });
                }
                var onhoverchange = that.getSettings().onhoverchange;
                if(onhoverchange) {
                    itemWrap.hover(function(evt){
                        // 返回组件
                        onhoverchange(evt, {type : 'in', value : value}, that);
                    }, function(evt){
                        var ele = $(evt.currentTarget);
                        // 标记离开的时候是不是要去掉hover状态
                        if(!ele.data('onpopshow')) {
                            // 返回组件
                            onhoverchange(evt, {type : 'out', value : value}, that);
                        }
                    });
                }
            }
            // 点击事件
            itemWrap.bind('click', function(evt){
                var selected = false;
                if(selectable) {
                    if(itemWrap.hasClass(data.selectedClass)) {
                        itemWrap.removeClass(data.selectedClass);
                        // 反选
                    } else {
                        // 如果是支持singleselect的,反选其它的
                        if(that.getSettings().singleselect) {
                            itemWrap.siblings('.' + data.selectedClass).removeClass(data.selectedClass);
                        }
                        itemWrap.addClass(data.selectedClass);
                        selected = true;
                    }
                    
                    // 选中里面的checkbox
                    if(checkbox) {
                        checkbox.check(selected);
                    }
                }
                that.getSettings().onclick(evt, value, selected);
            });

            if(selected) {
                itemWrap.trigger('click');
            }
        },
        addItem: function(hoverItem){
            this._addItem(hoverItem);
            this.getData().list.push(hoverItem);
        },
        /**
         * 排序
         */
        getSortedDataList : function() {
            var that = this;
            var children = that.getEle().find('.hl-item');
            var list = [];

            var oldList = that.getData().list;
            var map = [];
            for (var i = 0; i < oldList.length; i++) {
                map[oldList[i].key] = oldList[i];
            }
            for (var i = 0; i < children.length; i++) {
                list.push(map[$(children[i]).attr('name')]);
            }
            return list;
        },
        clearItem : function(){
            this.empty();
            this.getData().list.length = 0;
        },
        getChildByKey : function(key){
            var children = this.getChildren();
            for(var i = 0, j = children.length; i < j; i++){
                var item = children[i].getEle();
                if(item.attr('name') == key) {
                    return children[i];
                }
            }
            return null;
        },
        /**
         * 获取当前选中的items
         */
        getSelectedItems : function() {
            var that = this;
            var data = that.getData();
            var list = data.list;
            var children = that.getChildren();
            var selected = [];
            for(var i = 0, j = children.length; i < j; i++){
                var item = children[i].getEle();
                if(item.hasClass(data.selectedClass)) {
                    selected.push(list[i].value);
                }
            }
            return selected;
        },
        getItemByKey : function(key){
            var children = this.getChildren();
            for(var i = 0, j = children.length; i < j; i++){
                var item = children[i].getEle();
                if(item.attr('name') == key) {
                    return item;
                }
            }
            return null;
        },
        removeItemByKey: function(key){
            var list = this.getData().list;
            var index;
            var children = this.getChildren();
            for(var i = 0, j = list.length; i < j; i++){
                var item = list[i];
                var itemKey = item.key;
                if(itemKey == key){
                    index = i;
                    list.splice(i, 1);
                    var child = children[i];
                    if(child){
                        child.destroy();
                    }
                    children.splice(i, 1);
                    // 找到之后删除
                    break;
                }
            }

        },
        removeItem: function(value){
            var list = this.getData().list;
            var index;
            var children = this.getChildren();
            for(var i = 0, j = list.length; i < j; i++){
                var item = list[i];
                var itemValue = item.value;
                // 如果是对象，使用value来判断
                if(typeof itemValue == 'object') {
                    itemValue = itemValue.value;
                }
                if(typeof value == 'object') {
                    value = value.value;
                }
                if(itemValue == value){
                    index = i;
                    list.splice(i, 1);
                    var child = children[i];
                    if(child){
                        child.destroy();
                    }
                    children.splice(i, 1);
                    // 找到之后删除
                    break;
                }
            }

        },
        scrollBottom: function(){
            var that = this;
            var ele = that.getEle();
            ele.scrollTop(ele[0].scrollHeight);
        }
    });

    shark.factory.define("HoverList",HoverList);
})();

!function(){
    /**
     * @fileOverview 浮层的容器
     * @type {type}
     */
    var pTmpl = 
        '<div class="m-ppnl <%=this.hasArrow?"m-ppnl-hasarrow":""%> <%=this.clsName||""%>">\
            <div class="ppnl-ct js-ppnl-ct">\
                <%if(this.hasArrow){%>\
                <div class="w-arrow w-arrow-<%=this.arrow%> js-arrow">\
                    <div class="arrow-bdc"></div>\
                    <div class="arrow-bgc"></div>\
                </div>\
                <%}%>\
            </div>\
            <%if(this.closeable){%>\
                <div class="ppnl-act js-ppnl-act"><!-- -->\
                </div>\
            <%}%>\
        </div>'; 
    // ie6下空节点会产生额外的空隙，默认节点内容是‘html的注释符’即可消除空隙（20140102 Cc） 
    var PPnl = shark.factory.extend("Container",/** @lends PopupWrap# */{
        /**
         * 弹出层的容器，包含有动画和尺寸控制。
         * 子节点可以是任意组件和节点。
         * 其它接口详见@see Container
         * @author  hite
         * @version 1.0
         * @date    2013-05-28
         * @extends {Container}
         * @constructor
         * @param   {object}   _data 数据源,数据结构。<br/>
         *                           {string}:clsName 自定义样式名
         *                           {boolean}:hasArrow 是否有箭头 默认false
         *                           {string}:arrow 箭头方向 默认up
         *                           {boolean}:closeable 是否关闭 默认false
         */
        init:function(data, settings){
            var that = this;

            var data = $.extend({
                clsName : '',
                // 是否有箭头
                hasArrow:false,
                // 箭头方向
                arrow : 'up',
                // 是否有关闭按钮
                closeable : false
            },data);

            var settings = $.extend({wrapSelector : '>.js-ppnl-ct'},settings);
            var dom = $($.jqote(pTmpl, data));

            that.parent(dom, data, settings);
        },
        oncreate : function(){
            var that = this;
            that.parent();
            var data = that.getData();

            if(data.closeable) {
                that._close = new shark.Link({icoClass:'icon-close-pop', title : '关闭'}, {onclick : function(evt, ctrl){
                    // 销毁
                    that.destroy();
                }});
                that.getEle('>.js-ppnl-act').append(that._close.getEle());
            }
        },
        /**
         * 获取箭头对象
         * @return {object} description
         */
        getArrow : function(){
            return this.getEle('>.js-ppnl-ct>.js-arrow:first');
        },
        /**
         * destroy
         * @return {object} description
         */
        destroy : function(){
            var that = this;
            if(that._close) {
                that._close.destroy();
                that._close = null;
            }
            that.parent();
        }
    });

    shark.factory.define("PPnl",PPnl);
}();
!function(){
    /**
     * 显示停留的时间
     * @type {object}
     */
    var pDurationTime = {
        // 有操作的时候
        action : 20 * 1000,
        // 无操作，或者只有撤销
        normal : 5 * 1000,
        // 被替换的时候，最少保留时间
        min : 2 * 1000,
        // 出错的时候的时间
        // 错误提示，30秒
        error : 30 * 1000,
        // 淡出时间
        clear : 200
    };
    // 显示的样式
    var pShowClsName = 'm-hrz-notice-show';

    var pClsName = {
        loading : 'm-hrz-notice f-bg-loading m-hrz-notice-loading',
        error : 'm-hrz-notice f-bg-err',
        success : 'm-hrz-notice f-bg-succ',
        warn : 'm-hrz-notice f-bg-warn'
    }

    // 按钮列表
    // actions : {name : '撤销', action : 'revoke'}
    // revoketrue的时候，默认加上撤销
    var pDefaultData = {
        icoClass : '',
        // 状态
        status : '',
        html : '',
        type : 'success',
        time : pDurationTime,
        createTime : 0,
        // 消失时间
        duration : 0
    }
    var pDefaultSettings = {
        actions : [],
        revoke : false,
        onclick : function(linkName){

        },
        onclear : function(){

        }
    }
    /**
     * @fileOverview 提示组件，出现位置在最上面中间和右上角部分。
     * 在屏幕上方居中显示的操作提示，不需要手动关闭。默认时延3s;
     * 内置有3种提示；
     *      1.成功.showSucc();
     *      2.失败.showError();
     *      3.提示.showInfo();
     * 并且内置了提示排队功能
     * @type {Object}
     */
    
    var MsgBox  = shark.factory.extend("Container", /** @lends MsgBox# */{
        /**
         * 屏幕上方的提示
         * @author  hite
         * @version 1.0
         * @date    2013-05-28
         * @constructs
         * @constructor
         * @extends {Widget}
         * $MsgBox.showError('加载失败，请稍后再试');
         * @param   {string}   _data      内容
         *                                type error, success, warn
         *                                参见 pDurationTime
         * @param   {object}   _settings 行为参数，包括<br/>
         *                               {number}：duration 显示的停留时间，默认3s <br/>
         *                               {number}：later 显示淡出的时间，默认200ms <br/>
         */
        init:function(_data, _settings){
            var that = this;
            var data = $.extend({}, pDefaultData, _data);
            data.createTime = new Date().getTime();
            var settings = $.extend({}, pDefaultSettings, _settings);

            if(!data.duration) {
                if(data.type == 'error') {
                    data.duration = data.time.error;
                } else {
                    // 有操作
                    if(settings.actions.length > 0) {
                        data.duration = data.time.action;
                    } else {
                        data.duration = data.time.normal;
                    }
                }
            }
            data.clsName = pClsName[data.type] || '';
            var dom = $('<div class="m-hrz f-cb ' + data.clsName + '"></div>');
            that.parent(dom, data, settings);
        },

        oncreate : function(){
            var that = this;
            var data = that.getData();
            var settings = that.getSettings();

            var text = new shark.Text({cssStyle:{wrapsize:'small'}, icoClass : data.icoClass, html : data.html});

            that.addChild(text);

            // 撤销，加到按钮里面去
            if(settings.revoke) {
                var actions = settings.actions.concat([{name : shark.i18n.trans('revoke'), action : 'revoke'}]);
            } else {
                var actions = settings.actions;
            }
            for (var i = 0; i < actions.length; i++) {
                var link = new shark.Link({cssStyle:{wrapsize:'small'}, name : actions[i].name, action : actions[i].action}, {
                    onclick : function( evt, btn ){
                        var btnData = btn.getData();
                        settings.onclick(btnData, that);
                    }
                });
                that.addChild(link);
            };

            that.parent();
        },
        show : function(){
            var that = this;
            if(that.getData().status == 'hide') {
                return;
            }
            that.parent();
            // 显示状态
            that.getData().status = 'show';
            var ele = that.getEle();
            // 先显示再加样式
            ele.show();
            setTimeout(function(){
                ele.addClass(pShowClsName);
                // 定位一下
                if(that.getData().type != 'loading')
                    shark.dock.dockIn(ele, {dock:ele.parent()})
            }, 0);
            
            // 消失
            var duration = that.getData().duration;
            if(duration > 0) {
                that._clearTimeout = setTimeout(function(){
                    that._clearTimeout = -1;
                    // 隐藏
                    var onclear = that.getSettings().onclear;
                    that.hide(function(){
                        // 自动结束的时候的
                        if(onclear) {
                            // 消失后
                            onclear();
                        }
                    });
                }, duration);
            }
        },
        hide : function(callback){
            var that = this;

            if(that.getData().status == 'hide') {
                return;
            }
            // 隐藏过之后，不再显示
            that.getData().status = 'hide';
            if(that._clearTimeout){
                clearTimeout(that._clearTimeout);
            }
            var ele = that.getEle();
            ele.removeClass(pShowClsName);
            setTimeout(function(){
                that.destroy();

                // 回调函数
                if(callback) {
                    callback();
                }
            }, that.getData().time.clear);
        },
        destroy : function(){
            var that = this;
            if(that._clearTimeout){
                clearTimeout(that._clearTimeout);
            }
            that.parent();
        },
        /**
         * 显示状态
         * @return {object} description
         */
        getStatus : function(){
            return this.getData().status;
        },
        /**
         * 创建时间
         * @return {object} description
         */
        getCreateTime : function(){
            return this.getData().createTime;
        }
    });

    shark.factory.define("MsgBox",MsgBox);
    
    // 错误提示
    var errorMsg = function(_data,_settings){
        _data = $.extend({type : 'error'}, _data);
        return new MsgBox($.extend({}, _data),$.extend({}, _settings));
    };
    shark.factory.define("ErrorMsg",errorMsg);

    // 成功提示
    var successMsg = function(_data,_settings){
        _data = $.extend({type : 'success'}, _data);
        return new MsgBox($.extend({}, _data),$.extend({}, _settings));
    };
    shark.factory.define("SuccessMsg",successMsg);

    // 警告
    var warnMsg = function(_data,_settings){
        _data = $.extend({type : 'warn'}, _data);
        return new MsgBox($.extend({}, _data),$.extend({}, _settings));
    };
    shark.factory.define("WarnMsg",warnMsg);

    // 加载中
    var loadingMsg = function(_data,_settings){
        _data = $.extend({type : 'loading', icoClass : 'icon-loading', html : shark.i18n.trans('loading')}, _data);
        return new MsgBox($.extend({duration : 60000}, _data),$.extend({}, _settings));
    };
    shark.factory.define("LoadingMsg",loadingMsg);
}();
! function() {
    var pImgTmpl = '<%if(this.dataType == "picture"){%>\
                <div class="m-imgprev f-tlbr">\
                    <div class="imgprev-wrap js-imgwrap">\
                        <div class="imgprev-img js-img-container">\
                            <img src="<%=this.imgUrl%>" style="visibility:hidden" alt="" class="js-previewImg">\
                        </div>\
                    </div>\
                    <div class="size js-percent">\
                        <div class="w-mask"></div>\
                        <div class="txt js-txt">100%</div>\
                    </div>\
                    <div class="name js-name"></div>\
                    <div class="toolbar js-preview-toolbar">\
                    </div>\
                </div>\
                <%} else if(this.dataType == "iframe"){%>\
                <div class="f-tlbr">\
                    <iframe class="js-iframe" allowTransparency="true" frameborder="0" src="<%=this.src%>" style="position: absolute; "></iframe>\
                </div>\
                <%} else if("postcard"){%>\
                    <div class="f-tlbr"></div>\
                <%}%>';

    var pDefaultData = {
        name: '',
        size: 0,
        imgUrl: '',
        // 预览类型
        dataType: 'picture'
    };


    var InnerPreview = shark.factory.extend("Widget", {

        /**
         * 初始化preview
         * @param  {object} data     {clsName}
         * @param  {object} settings {onclose, onpopshow}
         * @return {void}
         */
        init: function(data, settings) {
            var that = this;
            var data = $.extend({}, pDefaultData, data);
            var settings = $.extend({}, settings);
            that.parent(data, settings);
            // 保存标准身高
            // that.originalHeight
            // that.originalWidth

        },
        create: function() {
            var that = this;
            var data = that.getData();
            var settings = that.getSettings();
            // 新手引导直接返回内容。
            if(data.dataType == 'guide'){
                return data.content;
            }

            var dom = $($.jqote(pImgTmpl, data));
            if(data.dataType === 'postcard'){
                var defer = $.Deferred();
                defer.done(function(src){
                    that.getParent().setBackgroudImg(src);
                });
                settings.getPostcard(dom, data, defer);
            }
            return dom;
        },
        oncreate: function() {
            var that = this;

            var data = that.getData();
            var settings = that.getSettings();

            if (data.dataType == 'picture') {
                that._showImg();

                var domNode = that.getEle();
                // 支持鼠标滚轮事件,firefox使用DOMMouseScroll 
                domNode.bind("mousewheel DOMMouseScroll", function(event) {
                    // 如果是正在加载的时候，不容许zoom。
                    if (that.previewImg.css("visibility") == 'hidden') {
                        return;
                    }
                    var nativeEvent = event.originalEvent;
                    //浏览地图时，使用鼠标滚轮来放大和缩小。即用到了滚轮事件。
                    // 这个事件在标准下和IE下是有区别的。firefox是按标准实现的,事件名为"DOMMouseScroll ",IE下采用的则是"mousewheel "。
                    // 事件属性，IE是event.wheelDelta，Firefox是event.detail 属性的方向值也不一样，IE向前滚 > 0为120，相反在-120，Firefox向后滚 > 0为3，相反则-3。 
                    if (shark.detection.isFirefox()) {
                        var delta = -nativeEvent.detail;
                    } else {
                        var delta = nativeEvent.wheelDelta;
                    }
                    if (delta > 0) {
                        var scale = that.currentScale + settings.step;
                    } else if (delta < 0) {
                        var scale = that.currentScale - settings.step;
                    } else if (delta == 0) {
                        var scale = that.currentScale;
                    }

                    // 经过放大缩小的
                    that.__autoResizeScale = false;

                    that._zoom(scale, true);
                    return false;
                });
                // 移动到下面的时候，显示工具栏
                that.getEle().bind('mousemove', function(evt){
                    var height = that.getEle().height();
                    if(evt.clientY > height * 0.7) {
                        that._showToolbar();
                    } else {
                        that._hideToolbar();
                    }
                });

            } else if (data.dataType == 'iframe') {
                that._cssIframe();
            }
        },
        _showToolbar : function(){
            var that = this;
            if(!that.toolbar) {
                that._updateToolbar();
                that.getEle('.js-name').html(shark.tool.escapeHTML(that.getData().name));
            }
            shark.tool.show(that.getEle('.js-name'));
            that.toolbar.show();
        },
        _hideToolbar : function(){
            var that = this;
            shark.tool.hide(that.getEle('.js-name'));
            if(that.toolbar) {
                that.toolbar.hide();
            }
        },
        _cssIframe: function() {
            var that = this;
            var iframe = that.getEle('.js-iframe');
            // 屏幕的高宽
            var win = shark.dock.getWinSize();
            // 高度，宽度，top left

            var css = {
                top: '5px',
                width: '750px',
                height: (win.height - 15) + 'px',
                left: (win.width - 750) / 2 + 'px'
            };
            iframe.css(css);
        },
        _updateToolbar: function() {
            var that = this;
            if (that.toolbar) {
                that.toolbar.destroy();
            }
            that.toolbar = new shark.Toolbar({
                clsName: 'm-toolbar-btngroup'
            });
            var btns = [];
            if (that.__autoResizeScale) {
                btns.push({
                    //  '实际大小'
                    name: shark.i18n.trans('preview_real'),
                    value: 'original'
                });
            } else {
                btns.push({
                    // '自适应'
                    name: shark.i18n.trans('preview_auto'),
                    value: 'auto'
                });
            }

            btns = btns.concat([{
                // '旋转'
                name: shark.i18n.trans('preview_rotate'),
                value: 'rotate'
            }, {
                // '下载'
                name: shark.i18n.trans('preview_down'),
                value: 'download'
            }, {
                // '发送'
                name: shark.i18n.trans('preview_send'),
                value: 'send'
            }, {
                // '新窗口打开'
                name: shark.i18n.trans('preview_newwin'),
                value: 'open'
            }]);
            var list = [];
            for (var i = 0; i < btns.length; i++) {
                list.push(new shark.Button(btns[i], {
                    onclick: function(evt, ctrl) {
                        that._triggerToolbar(evt, ctrl);
                        return false;
                    }
                }));
            };
            that.toolbar.update({
                left: [list]
            });
            that.getEle('.js-preview-toolbar').append(that.toolbar.getEle());
        },
        _triggerToolbar: function(evt, ctrl) {
            var that = this;
            var value = ctrl.getValue();
            switch (value.value) {
                case 'auto':
                    var wrap = that.getEle('.js-imgwrap');
                    wrap.css('top', '');
                    wrap.css('left', '');
                    // 自适应
                    that.__autoResizeScale = false;

                    var scale = that._getAutoResizeScale();
                    that._zoom(scale, true);
                    // 修改为原图'原图'
                    ctrl.setText(shark.i18n.trans('preview_original'));
                    ctrl.getValue().value = 'original';
                    break;
                case 'original':
                    that.__autoResizeScale = false;
                    var wrap = that.getEle('.js-imgwrap');
                    wrap.css('top', '');
                    wrap.css('left', '');
                    // 原图
                    that._zoom(1, true);

                    that.currentRotate = 0;
                    // 恢复
                    that._rotate(that.currentRotate);

                    ctrl.setText(shark.i18n.trans('preview_auto'));
                    ctrl.getValue().value = 'auto';
                    break;
                case 'rotate':
                    // 旋转
                    that.currentRotate++;

                    that._rotate(that.currentRotate);
                    break;
                case 'send':
                case 'download':
                    that.getSettings().onclick(value.value, that.getData());
                    break;
                case 'open':
                    // 新窗口打开
                    var newWin = window.open($URL.contextPath + '/html/blank.html', 'readinblank_' + new Date().getTime());

                    var container = '<div style="text-align: center;padding: 10px 20px;"><img src="' + that.getData().imgUrl + '"/></div>';
                    //              //写成一行
                    newWin.document.write(container);
                    newWin.document.close();
                    break;
            }

        },
        /**
         * 旋转图片,ie下使用滤镜，其他浏览器使用transform 样式
         *
         * @author  hite
         * @version 1.0
         * @date    2012-12-17
         * @param   {number}   _delta 旋转的变化值
         * @return  {void}          无
         */
        _rotate: function(rotate) {
            var that = this;
            var img = this.previewImg;
            // var rotate = (1+rotate)%4;
            // ie 9 以下使用滤镜
            var rotate = (rotate) % 4;
            if (shark.detection.isIE678()) {
                // 需要重新定位img的位置，按照左上角旋转
                img.get(0).style.filter = "progid:DXImageTransform.Microsoft.BasicImage(rotation=" + rotate + ")";
                if (rotate % 2 == 1) {
                    var width = img.width();
                    var height = img.height();
                    var h = (width - height) / 2;
                    var w = (height - width) / 2;
                } else {
                    var h = 0;
                    var w = 0;
                }
                img.css({
                    position: "relative",
                    left: w,
                    top: h
                });
            } else {
                img.css({
                    '-webkit-animation-name': 'none',
                    '-moz-animation-name': 'none',
                    '-ms-animation-name': 'none',
                    'animation-name': 'none',
                    "-webkit-transform": " rotate(" + rotate * 90 + "deg)",
                    "-moz-transform": "rotate(" + rotate * 90 + "deg)",
                    "-o-transform": "rotate(" + rotate * 90 + "deg)",
                    "transform": "rotate(" + rotate * 90 + "deg)"
                });
            }
        },
        /**
         * 缩放
         * @param  {number} scale 原图基础上的比例
         * @return {object}       description
         */
        _zoom: function(scale, passRotate) {
            var that = this;
            var settings = that.getSettings();
            if (scale > settings.max || scale < settings.min) {
                return;
            }
            that.currentScale = scale;
            var width = that.originalWidth * scale;
            var height = that.originalHeight * scale;

            that.previewImg.width(width);
            that.previewImg.height(height);
            // 修改margin-top
            var wrap = that.getEle('.js-imgwrap');
            wrap.css('margin-top', (-height / 2) + 'px');

            var win = shark.dock.getWinSize()
            if (win.width < width) {
                wrap.css('margin-left', ((win.width - width) / 2) + 'px');
            }
            //
            that.previewImg.parent().width(width);
            that.previewImg.parent().height(height);

            // percent
            var percent = that.getEle('.js-percent');
            shark.tool.show(percent);
            percent.find('.js-txt').html(parseInt(100 * scale) + '%');
            if (that.percentTimeout) {
                clearTimeout(that.percentTimeout);
            }

            that.percentTimeout = setTimeout(function() {
                that.percentTimeout = null;
                shark.tool.hide(percent);
            }, 500);

            if (that._dragSort) {
                that._dragSort.destroy();
                that._dragSort = null;
            }
            // 超过大小的时候，出移动
            if (width > win.width || height > win.height) {
                var wrap = that.getEle('.js-imgwrap');
                that._dragSort = new shark.Drag({
                    trigger : wrap,
                    element: wrap,
                    container:$(document.body)
                });
            }
        },
        /**
         * 自适应大小
         * @return {object} description
         */
        _getAutoResizeScale: function() {
            var that = this;
            var win = shark.dock.getWinSize();
            // 空出按钮的位置
            var maxWidthPercent = win.width / (win.width - 120 * 2);
            var maxHeightPercent = 1.2;

            var imgWidth = that.originalWidth; // that.previewImg.width();
            var imgHeight = that.originalHeight; // that.previewImg.height();

            // 自适应
            if (that.currentRotate % 2 == 0) {
                var scale = Math.max(imgWidth / win.width * maxWidthPercent, imgHeight / win.height * maxHeightPercent);
            } else {
                // 旋转了之后的自适应需要切换
                var scale = Math.max(imgHeight / win.width * maxWidthPercent, imgWidth / win.height * maxHeightPercent);
            }

            return 1 / scale;
        },
        /**
         * 显示图片
         * @param  {object} index description
         * @return {object}       description
         */
        _showImg: function() {
            var that = this;
            that.previewImg = that.getEle('.js-previewImg');
            // percent
            var percent = that.getEle('.js-percent');
            shark.tool.show(percent);
            var progress = 0;
            var progressText = percent.find('.js-txt');
            var loadingInterval = setInterval(function(){
                if(progress >= 99) {
                    clearInterval(loadingInterval);
                    return;
                } else if(progress >= 90) {
                    progress += 0.2;
                } else if(progress >= 70) {
                    progress += 0.5;
                } else if(progress >= 50) {
                    progress += 2;
                } else {
                    progress += 5;
                }
                // 加载中
                progressText.html(shark.i18n.trans('loading')+ ' ' + parseInt(progress) + '%');
            }, 200);
            
            that.previewImg.bind('error', function(){
                clearInterval(loadingInterval);
                shark.tool.show(percent); // '图片加载失败'
                percent.find('.js-txt').html(shark.i18n.trans('preview_error'));
            });
            that.previewImg.bind('load', function() {
                // 显示                
                that.previewImg.css("visibility", "visible");

                // 正在加载
                that.originalWidth = that.previewImg.width();
                that.originalHeight = that.previewImg.height();

                // $Profiler.log('loaded img size : ' + that.originalWidth + '*' + that.originalHeight);
                // 当前的scale
                that.currentScale = 1;
                // 当前的旋转
                that.currentRotate = 0;

                var scale = that._getAutoResizeScale();
                // 初始的时候，放大就不要了
                if (scale < 1) {
                    that.__autoResizeScale = true;
                    that._zoom(scale, true);
                } else {
                    // 原图
                    that.__autoResizeScale = false;
                    that._zoom(1, true);
                }
                // 不用默认出工具栏
                clearInterval(loadingInterval);
            });
        },
        show: function() {
            var that = this;
            that.parent();
        },
        close: function() {
            var that = this;
            that.destroy();
        },
        /**
         * 销毁
         * @return {object} description
         */
        destroy: function() {
            var that = this;
            if (that.toolbar) {
                that.toolbar.destroy();
                that.toolbar = null;
            }
            if (that._dragSort) {
                that._dragSort.destroy();
                that._dragSort = null;
            }
            that.parent();
        }
    });

    shark.factory.define("InnerPreview", InnerPreview);
}();


! function() {
    // 图片预览模块 -->\
    // 说明：为了保证图片始终居中，imgprev-wrap的margin-top始终为图片高度的一半的负值 -->
    var pPreviewHtml = '<div class="m-overlay <%if(this.animate){%>m-overlay-ani<%}%> <%=this.clsName%>">\
            <%if(this.hasBackgroundImg){%>\
            <div class="bg-psc">\
                <img src="" class="js-mask-img">\
            </div>\
            <%}%>\
            <div class="w-mask <%if(this.animate){%>w-mask-ani<%}%> js-mask"></div>\
            <div class="overlay-container f-tlbr <%if(this.animate){%>overlay-container-ani<%}%> <%=this.overlayClsName%> js-overlay-container" style="<%=this.overlayStyle%>">\
                <%if(this.hasClose){%>\
                <a href="javascript:;" hidefocus="true" class="w-icon icon-preview-close js-close"></a>\
                <%}%>\
                <%if(this.hasPageCtrl){%>\
                <div class="pagectrl js-pagectrl">\
                    <a href="javascript:;" hidefocus="true" class="w-icon-normal icon-normal-preview-prev js-prev"></a>\
                    <a href="javascript:;" hidefocus="true" class="w-icon-normal icon-normal-preview-next js-next"></a>\
                </div>\
                <%}%>\
            </div>\
    </div>';


    var pDefaultData = {
        animate: false,
        blankClose: false,
        hasBackgroundImg: false,
        hasClose: true,
        hasPageCtrl: true,
        // shortkey: true,
        overlayStyle: '',
        // 图片列表
        list: [],
        // 当前第几个
        index: 0,
        // 预览类型
        dataType: 'picture',
        clsName: ''
    };

    var pDefaultSetting = {
        min: 0.19,
        max: 5.01,
        step: 0.1,
        onclick: function(action, data) {

        }
    };
    var Preview = shark.factory.extend("Container", {

        /**
         * 初始化preview
         * @param  {object} data     {clsName}
         * @param  {object} settings {onclose, onpopshow}
         * @return {void}
         */
        init: function(data, settings) {
            var that = this;
            var data = $.extend({}, pDefaultData, data);
            var settings = $.extend({}, pDefaultSetting, settings);
            var dom = $($.jqote(pPreviewHtml, data));
            that.parent(dom, data, settings);
            // 保存标准身高
            // that.originalHeight
            // that.originalWidth
            that.__innerElements = [];
        },
        oncreate: function() {
            var that = this;

            var data = that.getData();
            var settings = that.getSettings();
            that.pagectrl = that.getEle('.js-pagectrl');
            that._showInner(data.index);

            //that._prepareInner(data.index - 1);
            // shark.shortkey.unbind(shark.shortkey.LEFT, function() {
            //     // 前一个
            //     settings.onclick('prev', data.list[that.currentIndex]);

            //     that._showInner(that.currentIndex - 1);
            // }, that.getID());

            that.getEle('.js-prev').bind('click', function(evt) {
                // 前一个
                settings.onclick('prev', data.list[that.currentIndex]);

                that._showInner(that.currentIndex - 1);

                that._checkBtns();
                return false;
            });
            // shark.shortkey.unbind(shark.shortkey.RIGHT, function() {
            //     // 前一个
            //     settings.onclick('prev', data.list[that.currentIndex]);

            //     that._showInner(that.currentIndex - 1);
            // }, that.getID());
            that.getEle('.js-next').bind('click', function(evt) {
                // 后一封
                settings.onclick('next', data.list[that.currentIndex]);

                that._showInner(that.currentIndex + 1);

                that._checkBtns();
                return false;
            });

            that.getEle('.js-close').bind('click', function(evt) {

                that.destroy();
                return false;
            });
            // 弹窗背景图
            if(data.hasBackgroundImg){
                var img = that.getEle('.js-mask-img');
                img.bind('load', that.backgroundLoad.bind(that));
                img.attr('src', data.backgroundImg)
            }
            // 初始化的时候设置
            that._checkBtns();
            if(data.dataType === 'picture' || data.dataType === 'iframe' || data.blankClose){
                // 延迟绑定，防止双击的时候无操作到就关闭了
                setTimeout(function() {
                    // 空白处关闭
                    that.getEle().bind('click', function(evt) {
                        if(evt.target.tagName != "IMG") {
                            that.destroy();
                        }

                        return false;
                    });    
                }, 500);
            }

            shark.shortkey.activate(that.getID());
            // #157598:明信片弹出层支持快捷键左右切换
            // if(data.dataType != 'postcard') {
                shark.shortkey.bind("right", function(){
                    that.getEle('.js-next').trigger('click');
                });
                shark.shortkey.bind("left", function(){
                    that.getEle('.js-prev').trigger('click');
                });
            // }

            shark.popwinHelper.push(that);
        },
        /**
         * 隐藏切换按钮
         * @return {void} 
         */
        hidePageCtrl: function(){
            var that = this;
            shark.tool.hide(that.pagectrl);
        },
        /**
         * 显示切换按钮
         * @return {void} 
         */
        showPageCtrl: function(){
            var that = this;
            shark.tool.show(that.pagectrl);
        },
        setBackgroudImg: function(imgUrl){
            var that = this;
            var img = that.getEle('.js-mask-img');
            img.removeClass('f-ani-pscbg');
            img.attr('src', imgUrl);
        },
        /**
         * 背景图片加载后加上透明度
         * @return {void} 
         */
        backgroundLoad: function(event){
            var that = this;
            var target = $(event.target);
            var settings = that.getSettings();
            var timeout = 300;
            if(!settings.notfirstShow){
                timeout = 0;
                settings.notfirstShow = true;
            }
            // window.setTimeout(function(){
            // 解决抖动问题，先去掉渐隐渐现
            target.addClass('f-ani-pscbg');
            // },timeout);
            // $Profiler.info('onload' + new Date().getTime());
        },
        _checkBtns : function() {
            var that = this;
            var data = that.getData();
            var total = data.list.length;

            if(that.currentIndex <= 0) {
                // 禁用
                that.getEle('.js-prev').addClass('icon-normal-preview-prev-disabled');
            } else {
                that.getEle('.js-prev').removeClass('icon-normal-preview-prev-disabled');
            }
            if(that.currentIndex >= total - 1) {
                that.getEle('.js-next').addClass('icon-normal-preview-next-disabled');
            } else {
                that.getEle('.js-next').removeClass('icon-normal-preview-next-disabled');
            }
        },
        /**
         * 准备好图片
         * @param  {object} index description
         * @return {object}       description
         */
        _prepareInner : function(index){
            var that = this;
            var data = that.getData();
            if (index < 0 || index >= data.list.length) {
                return;
            }
            
            if (!that.__innerElements[index]) {
                // 屏幕
                var win = shark.dock.getWinSize();

                var imgData = data.list[index];
                // 数据类型
                imgData.dataType = data.dataType;
                var settings = that.getSettings();

                var innerPreview = new shark.InnerPreview(imgData, settings);
                that.prepend('.js-overlay-container', innerPreview);
                innerPreview.setParent(that);
                that.__innerElements[index] = innerPreview;

                var leftPos = '';
                if (index > that.currentIndex) {
                    // 往右的
                    leftPos = win.width + 'px';
                } else {
                    leftPos = '-' + win.width + 'px';
                }
                innerPreview.getEle().css({'left': leftPos, 'opacity': 0});
            }

        },
        _showInner: function(index) {
            var that = this;
            var data = that.getData();
            if (index < 0 || index >= data.list.length) {
                return;
            }
            var settings = that.getSettings();

            var lastIndex = that.currentIndex;

            that.currentIndex = index;
            var leftPos = '';
            // 屏幕
            var win = shark.dock.getWinSize();
            if (that.currentIndex > lastIndex) {
                // 往右的
                leftPos = '-=' + win.width;
            } else {
                leftPos = '+=' + win.width;
            }
            // debugger;
            if (!that.__innerElements[that.currentIndex]) {
                var imgData = data.list[that.currentIndex];
                // 数据类型
                imgData.dataType = data.dataType;

                var innerPreview = new shark.InnerPreview($.extend({isSwitch: true}, imgData), settings);
                that.prepend('.js-overlay-container', innerPreview);

                that.__innerElements[that.currentIndex] = innerPreview;
                innerPreview.show();
            } else {
                var preview = that.__innerElements[that.currentIndex];

                preview.show();

                // 进来的
                preview.getEle().animate({
                    opacity: 1,
                    left: leftPos
                }, 400, 'easeOutCubic', function() {

                });
                if(data.dataType == 'postcard'){

                    var itemData = data.list[that.currentIndex];
                    if(itemData.template){
                        that.setBackgroudImg(itemData.template.templateBackPicUrl);
                    }
                }
            }
            


            if (typeof lastIndex != 'undefined') {
                var lastPreview = that.__innerElements[lastIndex];
                // 消失的
                lastPreview.getEle().animate({
                    opacity: 0,
                    left: leftPos
                }, 400, 'easeOutCubic', function() {
                    lastPreview.hide();
                });
            }

            setTimeout(function(){
                that._prepareInner(that.currentIndex + 1);
                that._prepareInner(that.currentIndex - 1);
            }, 500);
        },
        /**
         * 获取当前的index
         * @return {number} currentIndex
         */
        getCurrentIndex: function(){
            return this.currentIndex;
        },
        /**
         * 添加数据,往前面
         */
        addListBefore: function(list) {
            var that = this;
            var data = that.getData();

            data.list = list.concat(data.list);
            that.setData(data);
            // index 变化
            that.currentIndex += list.length;
        },
        /**
         * 添加数据,往前面
         */
        addListAfter: function(list) {
            var that = this;
            var data = that.getData();

            data.list = data.list.concat(list);
            that.setData(data);
            // 不用变位置
        },
        show: function() {
            var that = this;
            that.parent();
            var data = that.getData();
            // 加到
            $(document.body).append(that.getEle());
            // 加上动画
            // 
            window.setTimeout(function(){
                var maskClass = 'f-ani-mask';
                if(data.dataType === 'postcard'){
                    maskClass = 'f-ani-pscmask';
                }
                that.getEle('.js-mask').addClass(maskClass);
                that.getEle('.js-overlay-container').addClass('f-ani-bouncein');
            },0);
        },
        /**
         * 关闭
         * @return {object} description
         */
        close: function() {
            var that = this;

            that.destroy();
        },

        destroy: function() {
            var that = this, settings = that.getSettings();
            if(settings && settings.onclose){
                settings.onclose();
            }
            that.pagectrl = null;
            for(var key in that.__innerElements) {
                that.__innerElements[key].destroy();
            }
            that.__innerElements.length = 0;

            shark.shortkey.deactivate(that.getID());
            that.parent();
        }
    });

    shark.factory.define("Preview", Preview);
}();

!function(){
    /**
     * @fileOverview 分页组件；
     *      显示部分为当前记录此项，
     *      上一页、下一页的翻页条，
     *      <b>不支持直接跳转到某页</b>
     *      <B color="red">下标是从0开始的</B>
     *      
     * @type {type}
     */

    // 选择页码的select
    var pSelectPageClass = 'w-clk-select-page';
    // 上一页的样式
    var pPrevClass = 'icon-prev';
    // 下一页的样式
    var pNextClass = 'icon-next';
    // 两个翻页按钮的容器
    var pageCtrlTmpl = '<div class="m-pagectrl f-ribs"></div>';
    /**
     * 组件默认的数据
     * @name PageMan#defaults
     * @property {string} page 当前第几页
     * @type {Object}
     */
    var pDefaults = {
        page:0
    };
    /**
     * 组件默认的上下页翻页动作
     * @name PageMan#defaultEvent
     * @property {function} onprevclick 点击上一封的回调，参数为当前页码
     * @property {function} onnextclick 点击下一封的回调，参数为当前页码
     * @type {Object}
     */
    var pDefaultEvent = {
        //当点击上一个按钮时，触发事件，入参数为当前的index
        //当点击下一个按钮时，触发事件，入参数为当前的index
    };
    //
    var PageMan = shark.factory.extend("Widget",/** @lends PageMan# */{
        /**
         * 分页组件，支持多种位置的分页。
         * @author  hite
         * @version 1.0
         * @date    2013-05-28
         * @constructor
         * @constructs
         * @extends {Widget}
         * @example
         * var pageInfo = {
            pageSize: this._module.pageSize,
            page: this._module.page,
            total: this._module.total,
            metric: "个"
        }
        ctrls.pageMan = new JY.PageMan(pageInfo, {
            onprevclick: function(_page){
                $Hash.changeHash({
                    page: --_page
                });
            },
            onnextclick: function(_page){
                $Hash.changeHash({
                    page: ++_page
                });
            }
        });
         * @param   {object}   _data 数据源。<br/>
         *                                {number}:pageSize 分页数<br/>
         *                                {number}:page当前页<br/>
         *                                {number}:total 分页总数，<br/>
         * @param   {object}    _settings   事件对象
         *                            onpagechange(page) 选择页面 传递当前页码
         */
        init:function(_data, _settings){
            var that = this;
            // $Profiler.log('PageMan.init', _data, _settings);
            that.data = $.extend({},pDefaults,_data);
            
            // pDefaults不能改变
            that.settings = $.extend({},pDefaultEvent,_settings);
            // 检查参数
            shark.checkNumber(that.data.pageSize, 'data.pageSize');
            shark.checkNumber(that.data.page, 'data.page');
            shark.checkNumber(that.data.total, 'data.total');
            shark.checkFunction(that.settings.onpagechange, 'settings.onpagechange');
            // 当前页码
            that.initPage();
            //
            that.parent(that.data, that.settings);
        },
        create:function(){
            // 翻页按钮的容器
            return $(pageCtrlTmpl);
        },
        oncreate:function(){
            var that = this;


            this.prev = new shark.IconLinkButton({icoClass: pPrevClass}, {onclick:function(){
                that.pageChange(that.current - 1);
            }});
            var preEle = this.prev.getEle();
            // preEle.addClass('f-fl');
            // @modify by CC. 2013/12/30 改为inline-block且父节点文字居中，这样可以不用算宽度

            this.next = new shark.IconLinkButton({icoClass: pNextClass}, {onclick:function(){
                that.pageChange(that.current + 1);
            }});
            var nextEle = this.next.getEle();
            // nextEle.addClass('f-fr');
            // @modify by CC. 2013/12/30 改为inline-block且父节点文字居中，这样可以不用算宽度

            var ele = this.getEle();
            ele.append(preEle);
            ele.append(nextEle);

            // 初始化按钮状态
            that.pageChange(that.current);
        },
        /**
         * 获取翻页按钮
         * @return {Dom} 两个翻页按钮在一起的
         */
        getPageButton : function(){
            return this;
        },
        /**
         * 获取翻页的选择框
         * @return {Dom} 翻页的选择框
         */
        getPageSelect : function(){
            var that = this;
            // 是否有select
            if(!that.pageSelect) {
                // 初始化各部分
                var list = [];
                var currentName = '';
                for (var i = 0; i <= this.maxPageNo; i++) {
                    var name = (i + 1) + '/' + (this.maxPageNo + 1);
                    list.push({
                        name : name,
                        value : {page : i},
                        icoClass : ((i == that.current) ? 'icon-selected-s' : 'icon-blank')
                    });
                    if(i == that.current) {
                        currentName = name;
                    }
                };
                var trigger = new shark.SelectorLinkButton({name : currentName, clsName : pSelectPageClass})
                that.pageSelect = new shark.DropMenu({
                    list : list,
                    cssStyle : {maxHeight : 200}
                }, {
                    trigger : trigger,
                    onclick : function(_evt,_ctrl){
                        // 使用 setSelectedIndex，有有时会导致，销毁当前的ctrl
                        var val = _ctrl.getValue().value;
                        that.pageSelect.close();
                        // 切换
                        that.pageChange(val.page);
                    }
                });
            }
            return this.pageSelect;
        },
        /**
         * 生成正确的pageNo和maxPageNo,跳转到指定页码
         * <B color="red">下标是从0开始的</B>
         * @param  {number} page 跳转的目标页码
         */
        initPage:function(){
            var that = this;
            var pageNo = that.data.page;
            var maxPageNo = Math.ceil(that.data.total/that.data.pageSize)-1;
            if(maxPageNo<0){
                maxPageNo = 0;  
            }
            if(pageNo<0){
                pageNo = 0;
            }else if(pageNo>maxPageNo){
                pageNo = maxPageNo;
            }
            // 设置当前页码
            that.current = pageNo;
            that.maxPageNo = maxPageNo;
        },
        /**
         * 根据正确的pageNO渲染正确的dom结构
         * @author  hite
         * @version 1.0
         * @private
         * @date    2013-01-23
         * @private
         * @param   {type}   _pageNo 当前页码
         */
        pageChange:function(_pageNo){
            var that = this;
            var prev = that.prev,
                next = that.next,
                maxPageNo = that.maxPageNo;
            // $Profiler.log('page change: (' + that.current + '->' + _pageNo + ') max:' + maxPageNo);

            // 禁止向前
            if(that.current == 0) {
                prev.disable();
            } else {
                prev.enable();
            }
            // 禁止向后按钮
            if(that.current == maxPageNo) {
                next.disable();
            } else {
                next.enable();
            }
            var changed = that.current != _pageNo;
            // 更新
            if(changed) {
                // 页面切换跳转
                // $Profiler.log('fire onpagechange: ' + _pageNo);
                that.settings.onpagechange(_pageNo);
            }
            
        },
        destroy:function(){
            var that = this;
            if(that.prev) {
                that.prev.destroy();
                that.prev = null;
            }
            if(that.next) {
                that.next.destroy();
                that.next = null;
            }
            if(that.pageSelect) {
                that.pageSelect.destroy();
                that.pageSelect = null;
            }

            that.parent();
        }
    });
    
    shark.factory.define("PageMan",PageMan);
}();