/* Simple wrapper around IPython kernel call
**
** Example:
**   require('ipython_kernel_call').call("python code", success_cb, error_cb);
*/
define(function(require) {
    "use strict";

    var IPython = require('base/js/namespace');
    var $ = require('jquery');

    var dolog = function(name) {
        console.log(name + ":", arguments);
    }

    var _handle_reply = function(success_cb, error_cb, msg) {
        if (msg.msg_type == "error") {
            if (error_cb)
                error_cb(msg);
            else
                console.log("ipython.call error:", msg.content.ename, ":", msg.content.evalue);
        }
        else if (msg.msg_type == "execute_result") {
            if (success_cb)
                success_cb(msg);
        }
        else {
            console.log("ipython.call unhandled message type:", msg.msg_type);
        }
    }

    //success_cb and error_cb will be called with a msg argument
    //useful fields:
    //   success : msg.content.data
    //   error   : msg.content.{ename,evalue}
    // kernel is optional
    var ipython_call = function(code, success_cb, error_cb, kernel) {
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
        try {
          if (!kernel)
            kernel = IPython.notebook.session.kernel;
          kernel.execute(code, cbs, { silent: false } );
        } catch (err) {
          error_cb( { msg_type: "error",
                      content: {
                        ename: "KernelError",
                        evalue: err,
                        traceback: ""
                      }
                    });
        }
    };

    return { 'call' : ipython_call };

});
