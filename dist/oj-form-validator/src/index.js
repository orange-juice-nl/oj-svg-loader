"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
require("oj-event");
var oj_component_1 = require("oj-component");
var oj_ajax_1 = require("oj-ajax");
var oj_utils_1 = require("oj-utils");
var FormValidator = /** @class */ (function (_super) {
    __extends(FormValidator, _super);
    function FormValidator(root, options) {
        var _this = _super.call(this, "form-validator", root, options) || this;
        _this.inputs = [];
        return _this;
    }
    FormValidator.mount = function (options) {
        return oj_component_1.default.getRoots("form:not([data-form-validator=\"loaded\"])").map(function (x) { return new FormValidator(x, options); });
    };
    FormValidator.prototype.initialize = function () {
        var _this = this;
        this.handleInputElements();
        this.submitButton = this.root.querySelector('button[type="submit"], .submit');
        if (this.submitButton)
            this.submitButton.on(["click.form-validator." + this.id, "touchend.form-validator." + this.id], function (e) {
                e.preventDefault();
                e.stopPropagation();
                var valid = _this.validateForm();
                if (valid && _this.post) {
                    oj_ajax_1.postForm(_this.root.getAttribute("data-ajax-url") || _this.root.getAttribute("action"), _this.root)
                        .then(function (response) {
                        var elements = _this.handlePostResponse(response);
                        _this.emit("post", { form: _this.root, response: response, elements: elements });
                    })
                        .catch(function (error) {
                        console.error(error);
                        _this.emit("post", { form: _this.root, error: error });
                    });
                }
            });
    };
    FormValidator.prototype.validateForm = function () {
        var _this = this;
        var valid = true;
        var errors = [];
        this.inputs.forEach(function (input) {
            input.valid = _this.validate(input);
            _this.emit("change", { form: _this.root, input: input, valid: input.valid });
            if (!input.valid) {
                valid = false;
                if (input.error)
                    errors.push(input.error);
            }
        });
        this.emit("change", { form: this.root, inputs: this.inputs, valid: valid });
        return valid;
    };
    FormValidator.prototype.validate = function (input) {
        if (input.element.type === "text" || input.element.type === "password" || input.element.type === "email" || input.element.type === "url") {
            var value = input.element.value.trim();
            var required = input.element.getAttribute("data-val-required");
            if (value.length < 1 && required) {
                input.error = required;
                return false;
            }
            var equalToSelector = input.element.getAttribute("data-val-equalto-other");
            if (equalToSelector) {
                var eq = document.querySelector(equalToSelector);
                if (!eq) {
                    input.error = "No element found for " + equalToSelector;
                    return false;
                }
                if (input.element.value.length > 0 && input.element.value !== eq.value) {
                    input.error = input.element.getAttribute("data-val-equalto");
                    return false;
                }
            }
            var regex = input.element.getAttribute("data-val-regex-pattern");
            if (regex && !RegExp(regex).test(value)) {
                input.error = input.element.getAttribute("data-val-regex");
                return false;
            }
            var minLength = input.element.getAttribute("data-val-minlength-min");
            if (minLength && value.length < parseFloat(minLength)) {
                input.error = input.element.getAttribute("data-val-minlength");
                return false;
            }
            var maxLength = input.element.getAttribute("data-val-maxlength-max");
            if (maxLength && value.length > parseFloat(maxLength)) {
                input.error = input.element.getAttribute("data-val-maxlength");
                return false;
            }
            var email = input.element.getAttribute("data-val-email");
            if (email && !/(.+)@(.+){2,}\.(.+){2,}/.test(value)) {
                input.error = input.element.getAttribute("data-val-email");
                return false;
            }
        }
        else if (input.element.type === "checkbox") {
            var value = input.element.checked;
            var required = input.element.getAttribute("data-val-required");
            if (value === undefined && required) {
                input.error = required;
                return false;
            }
            var requiredChecked = input.element.getAttribute("data-val-checkrequired");
            if (value !== true && requiredChecked) {
                input.error = requiredChecked;
                return false;
            }
        }
        delete input.error;
        return true;
    };
    FormValidator.prototype.handleInputElements = function () {
        var _this = this;
        this.inputs = Array.from(this.root.querySelectorAll('input')).map(function (element) {
            var input = { element: element };
            input.element.on("change.form-validator." + _this.id, function (e) {
                if (!_this.handleChanges(input))
                    input.element.on("keyup.form-validator." + _this.id, function (e) { return _this.handleChanges(input); });
                else
                    input.element.off("keyup.form-validator." + _this.id);
            });
            return input;
        });
    };
    FormValidator.prototype.handleChanges = function (input) {
        input.valid = this.validate(input);
        this.emit("change", { form: this.root, input: input, valid: input.valid });
        return input.valid;
    };
    FormValidator.prototype.handlePostResponse = function (response) {
        var _this = this;
        debugger;
        var json;
        try {
            json = JSON.parse(response);
            if (!json.views)
                json = undefined;
        }
        catch (err) {
            json = undefined;
        }
        if (typeof json === "object") {
            return json.views.map(function (_a) {
                var html = _a.html;
                return _this.handlePostResponse(html);
            });
        }
        else {
            var el = oj_utils_1.replaceElement(response);
            if (!document.body.contains(this.root))
                this.remount();
            return el;
        }
    };
    return FormValidator;
}(oj_component_1.default));
exports.default = FormValidator;
