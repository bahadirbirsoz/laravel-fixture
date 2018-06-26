var rest = {
    get: function (url) {
        return this.xhr(url, 'GET', {});
    }
    , post: function (url, data) {
        return this.xhr(url, 'POST', data);
    }
    , put: function (url, data) {
        return this.xhr(url, 'PUT', data);
    }
    , delete: function (url) {
        return this.xhr(url, 'DELETE', {});
    }
    , xhr: function (url, method, data) {

        return new Promise(function (resolve, reject) {
            try {
                var xhr;
                xhr = new XMLHttpRequest();
                xhr.open(method, url, true);
                //xhr.setRequestHeader('Authorization', 'Basic ' + app.auth.get());
                xhr.setRequestHeader("Content-type", "application/json");
                xhr.send(JSON.stringify(data));
                xhr.addEventListener("readystatechange", function (e) {
                    if (xhr.readyState === 4) {
                        
                        var response = JSON.parse(xhr.responseText);
                        if (xhr.status === 200) {
                            if (response.status === "success") {
                                return resolve(response.data);
                            } else {
                                return reject(response);
                            }
                        } else {
                            return reject(response);
                        }
                    }
                }, false);
            } catch (err) {
                return reject(err);
            }
        });
    }
};