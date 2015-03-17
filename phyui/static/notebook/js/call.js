"use strict";

define(function(require) {

    var IPython = require('base/js/namespace');
    var $ = require('jquery');

    var dolog = function(name) {
        console.log(name + ":", arguments);
    }

    var _handle_reply = function(success_cb, error_cb, msg) {
        if (error_cb && msg.content.msg_type == "error")
            error_cb(msg);
        else if (success_cb)
            success_cb(msg);
    }

    //success_cb and error_cb will be called with a msg argument
    //useful fields:
    //   success : msg.content.data
    //   error   : msg.content.{ename,evalue}
    var ipython_call = function(code, success_cb, error_cb) {
        var cbs = {
            shell : {
                reply : dolog.bind(undefined, 'reply'),
                payload : {
                    set_next_input : dolog.bind(undefined, 'set_next_input'),
                    page : dolog.bind(undefined, 'page'),
                }
            },
            iopub : {
                output : _handle_reply.bind(undefined, success_cb, error_cb),
                clear_output : dolog.bind(undefined, 'clear_output'),
            },
            //input : dolog.bind(undefined, 'input'),
        };

        IPython.notebook.session.kernel.execute(code, cbs, { silent: false } );
    };

    return { 'ipython_call' : ipython_call };

});
