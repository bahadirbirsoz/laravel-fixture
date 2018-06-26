var app = {

    events: null,

    loading: {
        show: function () {
            document.getElementById('loading').style.display = 'block';
        },
        hide: function () {
            document.getElementById('loading').style.display = 'none';
        }
    },
    load: function (tagName, data) {
        //sweetAlert("Oops...", "Something went wrong!", "error");
        app.unload();
        console.log("page loaded: ", tagName);
        var elem = document.createElement(tagName);
        document.getElementById("page").appendChild(elem);
        $(window).unbind("scroll");
        $('html,body').scrollTop(0);
        try {
            riot.mount(elem, {data: data});
        } catch (e) {
            console.error("Cannot mount", tagName, e);
        }
    },
    route: [
        {
            menu: true,
            url: '#clinic-info',
            load: function () {
                ibh.clinic.get(app.user.clinic_id).then(function (data) {
                    app.load("clinic-info", data);

                });
            }
        },
        {
            menu: true,
            url: '#clinic/*',
            load: function (cid) {
                ibh.clinic.get(cid).then(function (data) {
                    app.load("clinic-info", data);

                });
            }
        },

        {
            menu: true,
            url: '#clinic/*/users',
            load: function (cid) {
                ibh.clinic.get(cid).then(function (cdata) {
                    ibh.clinic.users(cid).then(function (udata) {
                        app.load("clinic-users", {clinic: cdata, users: udata});

                    });
                });
            }
        },
        {
            menu: true,
            url: '#clinic/*/edit',
            load: function (cid) {
                ibh.clinic.get(cid).then(function (cdata) {
                    app.load("clinic-edit", cdata);
                });
            }
        },
        {
            menu: true,
            url: '#*',
            load: function (tag) {
                app.load(tag);
            }
        },
        {
            menu: true,
            url: '#patient/*',
            load: function (patientId, subTag) {
                app.loadPatient(patientId).then(function () {
                    app.load("patient-" + "timeline");
                });
            }
        },
        {
            menu: true,
            url: '#*/*',
            load: function (tag, arg) {
                app.load(tag, arg);
            }
        },
        {
            menu: true,
            url: '#patient/*/*',
            load: function (patientId, subTag) {
                app.loadPatient(patientId).then(function () {
                    app.load("patient-" + subTag);
                });
            }
        },
        {
            menu: true,
            url: '#patient/*/compliant/*',
            load: function (patientId, subTag) {
                app.loadPatient(patientId).then(function () {
                    app.load("patient-compliant", subTag);
                });

            }
        },
        {
            menu: true,
            url: '#patient/*/diagnose/add',
            load: function (patientId) {
                app.loadPatient(patientId).then(function () {
                    app.load("patient-diagnose-form", {diagnoseNo: false});
                });

            }
        },
        {
            menu: true,
            url: '#patient/*/diagnose/edit/*',
            load: function (patientId, diagnoseNo) {
                app.loadPatient(patientId).then(function () {
                    app.load("patient-diagnose-form", {diagnoseNo: diagnoseNo});
                });

            }
        },
        {
            menu: true,
            url: '#patient/*/visit/*/*',
            load: function (patientId, visitNo, subTag) {
                app.loadPatient(patientId).then(function () {
                    app.currentVisitKey = visitNo;
                    app.currentVisit = app.patient.visits[visitNo];
                    app.load("patient-visit", {tag: subTag});
                });

            }
        },
        {
            menu: true,
            url: '#patient/*/visit/*/*/*',
            load: function (patientId, visitNo, subTag, part) {
                app.loadPatient(patientId).then(function () {
                    app.currentVisitKey = visitNo;
                    app.currentVisit = app.patient.visits[visitNo];
                    app.load("patient-visit", {tag: subTag, arg: part});
                });

            }
        },
        {
            menu: true,
            url: '#patient/*/visit/*',
            load: function (patientId, visitNo) {
                app.currentVisitKey = visitNo;
                app.currentVisit = app.patient.visits[visitNo];
                app.load("patient-visit", {tag: "general"});
            }
        },

        {
            menu: false,
            url: "#/",
            load: function () {
                //window.location = '#giris'
            }
        }
    ],
    currentPage: false,

    err: function (msg) {
        if (typeof msg === "string") {
            app.swal(msg, "error");
        } else {
            app.swal(msg.message, "error");
        }
    }

    ,
    scc: function (msg) {
        if (typeof msg == "undefined") {
            msg = {message: "İşlem Başarıyla Tamamlandı"};
        }
        app.swal(msg.message, "success");
    },
    swal: function (msg, type) {
        var message = msg;
        if (typeof msg === "object") {
            message = '';
            msg.error.forEach(function (item) {
                message += item.message + "\n";
            });
        }
        sweetAlert("", message, type);
    },

    init: function () {
        function events() {
            riot.observable(this);
        }

        app.events = new events();

        /*app.auth.check().then(function (data) {
            app.user = data;
            app.events.trigger('login');
            if (window.location.hash == "") {
                window.location = "#dashboard";
            }
            riot.update();
        }).catch(function () {
            window.location = "#giris";
            riot.update();
        });*/
        var r = route.create();

        app.route.forEach(function (route) {
            r(route.url.substr(1), route.load);
        });
        //app.modal.bind();
    }

    ,

    _page: null,

    page: function () {
        if (app._page === null) {
            app._page = document.getElementById("page");
            if (app._page === null) {
                console.error("#page element cannot be found");
            }
        }
        return app._page;
    },
    unload: function () {
        console.log(app.page().children.length);
        var count = app.page().children.length;
        for (var i = count; i > 0; i--) {
            console.log("in while", "unmount", app.page().children[i - 1]._tag);
            app.page().children[i - 1]._tag.unmount();
        }
    }

};

var alert = function (msg) {
    app.err(msg);
}

String.prototype.asDateTime = function () {
    return this.substr(8, 2) + '/' + this.substr(5, 2) + '/' + this.substr(0, 4) + ' ' + this.substr(11, 5);
}
String.prototype.asDate = function () {
    return this.substr(8, 2) + '/' + this.substr(5, 2) + '/' + this.substr(0, 4);
}

$.fn.serializeObject = function () {
    var res = {};
    $(this).serializeArray().forEach(function (obj) {
        res[obj.name] = obj.value;
    });
    return res;
};

$.fn.serializeObject = function () {
    var res = {};
    var frm = $(this);
    $(this).serializeArray().forEach(function (obj) {
        switch (true) {
            case frm.find("[name='" + obj.name + "']").first().attr('type') === "checkbox":
            case frm.find("[name='" + obj.name + "']").first().attr('multiple') !== undefined:
                if (typeof res[obj.name] === "undefined") {
                    res[obj.name] = [];
                }
                res[obj.name].push(obj.value);
                break;
            default:
                res[obj.name] = obj.value;
                break;
        }
    });
    return res;
};
$(document).ready(function () {
    $(".modal-body").height(($(window.parent.document).height() - 200) + "px");
    window.onresize = function (event) {
        $(".modal-body").height(($(window.parent.document).height() - 200) + "px");
    };
});


$.fn.setVals = function (data) {
    console.log("SETVALS ", data);
    var frm = $(this);
    return new Promise(function (s, f) {
        if (typeof data === "undefined" || data === null) {
            return;
        }
        Object.keys(data).forEach(function (key) {
            var inp = frm.find("[name='" + key + "']");

            console.log();
            switch (true) {
                case inp.prop('tagName') === "SELECT" && typeof inp.attr('multiple') != "undefined" :
                    data[key].forEach(function (k2) {
                        inp.find("option[value='" + k2 + "']")[0].selected = true;
                        inp.trigger('change');
                    });

                    break;
                case typeof $(inp).data('daterangepicker') != "undefined":
                    inp.val(data[key]).trigger('change');
                    $(inp).data('daterangepicker').setStartDate(data[key]);
                    break;
                case typeof data[key].push === "function": // is array
                    data[key].forEach(function (k2) {
                        frm.find("[name='" + key + "'][value='" + k2 + "']").prop('checked', true).trigger('change').onOff();
                    });

                    break;
                case inp.first().attr('type') === "radio":
                case inp.first().attr('type') === "checkbox":

                    frm.find("[name='" + key + "'][value='" + data[key] + "']").prop('checked', true).trigger('change').onOff();
                    break;
                case inp.prop('tagName') === "SELECT":
                    app.fill(inp.first()[0]).then(function () {
                        inp.val(data[key]).trigger('change').onOff();
                    });

                    break;
                case $(inp).hasClass("input-tags"):
                    var arr = data[key].split(",");
                    arr.forEach(function (val) {
                        $(inp).tagsinput('add', val);
                    });


                    break;
                default :

                    inp.val(data[key]).trigger('change');
                    break;
            }
        });
        return s();
    });
};
$.fn.disForm = function () {
    var form = this;

    form.find('label').addClass('form-control-static');
    form.find('.input-group').removeClass('input-group');
    form.find('.input-group-addon')
        .removeClass('input-group-addon')
        .removeClass('pull-left')
        .removeClass('pull-right');

    form.find('.form-group').removeClass('form-group').addClass('row');
    form.find('input,select,textarea').each(function () {
        var val = $(this).val();
        if ($(this).prop('tagName') === "SELECT") {
            $(this).select2('destroy');
        }
        if ($(this).attr('type') === "radio") {
            if (!$(this).is('checked')) {
                $(this).parent().remove();
            }
        }
        $(this).after($('<span />').text($(this).val()));
        $(this).parent().addClass('form-control-static');
        $(this).remove();
    });
    $(form).find("*").removeAttr('id');
};

$.fn.tooltip = function () {
    var content = $(this).data('tooltip');
};

$.fn.remount = function () {
    $.each(this, function (index, item) {
        item._tag.remount();
    });
};

$.fn.mount = function (tagName, args) {
    if (typeof args == "undefined") {
        args = null;
    }
    var elem = document.createElement(tagName);
    this.append(elem);
    try {
        riot.mount(elem, args);
    } catch (e) {
        console.error("Cannot mount", tagName, e);
    }

};

$.fn.onOff = function () {
    var target = this;
    switch (true) {
        case target.attr('type') === "checkbox":
            if (target.prop('checked')) {
                $("#" + target.data("onoff")).show();
            } else {
                $("#" + target.data("onoff")).hide();
            }
            break;
        case target.attr('type') === "radio":
            $("input[type='radio'][name='" + target.attr('name') + "']").each(function () {
                var onoff = $(this).data('onoff');
                if (typeof onoff !== "undefined") {
                    if ($(this).prop('checked')) {
                        $("#" + onoff).show();
                    } else {
                        $("#" + onoff).hide();
                    }
                }
            });
            break;
        case target.prop('tagName') === "SELECT":
            var on = false;
            target.find('option').each(function (index, elem) {

                var onoff = $(this).data('onoff');

                if (typeof onoff !== "undefined") {
                    if (target[0].selectedIndex === index) {
                        on = "#" + onoff;
                    }
                    $("#" + onoff).hide();
                }
                if (on) {
                    $(on).show();
                }
            });
            break;

    }
}