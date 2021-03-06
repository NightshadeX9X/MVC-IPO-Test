var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import Events from "../util/Events.js";
var InputModalElement = /** @class */ (function (_super) {
    __extends(InputModalElement, _super);
    function InputModalElement() {
        var _this = _super.call(this) || this;
        _this.evtHandler = new Events.Handler();
        _this.valueIsValid = false;
        _this.value = "";
        _this.initShadowRoot();
        _this.initEvents();
        _this.regex = new RegExp(_this.getAttribute('regex') || "", _this.getAttribute('regex-flags') || "");
        return _this;
    }
    InputModalElement.prototype.checkIfInputValid = function (value) {
        var _a;
        if (value === void 0) { value = ""; }
        var input = (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector('input');
        this.value = value;
        this.valueIsValid = this.regex.test(this.value);
        if (this.valueIsValid) {
            input.setAttribute('data-valid', 'data-valid');
        }
        else {
            input.removeAttribute('data-valid');
        }
    };
    InputModalElement.prototype.connectedCallback = function () {
        var _a;
        this.checkIfInputValid();
        var input = (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector('input');
        input === null || input === void 0 ? void 0 : input.focus();
    };
    InputModalElement.prototype.initShadowRoot = function () {
        this.attachShadow({ mode: 'open' });
        if (!this.shadowRoot)
            return;
        var styleEl = document.createElement('link');
        styleEl.setAttribute('rel', 'stylesheet');
        styleEl.setAttribute('href', "/css/InputModal.css");
        this.shadowRoot.appendChild(styleEl);
        this.shadowRoot.innerHTML += "\n\t\t<div class=\"container\">\n\t\t\t<h2 id=\"question\">" + this.innerHTML + "</h2>\n\t\t\t<input type=\"text\" id=\"input\" maxlength=\"14\" spellCheck=\"false\">\n\t\t\t<div class=\"buttons\">\n\t\t\t\t<button class=\"btn btn-clear\">Clear</button>\n\t\t\t\t<button class=\"btn btn-confirm\">Confirm</button>\n\t\t\t</div>\n\t\t</div>\n\t\t\n\t\t";
    };
    Object.defineProperty(InputModalElement.prototype, "container", {
        get: function () {
            var _a;
            return (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector('.container');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(InputModalElement.prototype, "width", {
        get: function () {
            return Number(this.container.style.width.slice(0, -2));
        },
        set: function (width) {
            this.container.style.width = width + "px";
        },
        enumerable: false,
        configurable: true
    });
    InputModalElement.prototype.initEvents = function () {
        var _this = this;
        if (!this.shadowRoot)
            return;
        var btnClear = this.shadowRoot.querySelector('.btn-clear');
        var btnConfirm = this.shadowRoot.querySelector('.btn-confirm');
        var input = this.shadowRoot.querySelector('input');
        if (btnClear) {
            btnClear.addEventListener('click', function (e) {
                _this.evtHandler.dispatchEvent('clear');
            });
            this.evtHandler.addEventListener('clear', function () {
                if (input) {
                    input.value = "";
                    input.focus();
                }
            });
        }
        if (btnConfirm) {
            btnConfirm.addEventListener('click', function (e) {
                if (!_this.shadowRoot)
                    return;
                var value = (input === null || input === void 0 ? void 0 : input.value) || "";
                _this.evtHandler.dispatchEvent('confirm', value);
            });
        }
        if (input) {
            input.addEventListener('input', function (e) {
                _this.evtHandler.dispatchEvent('change', input.value);
            });
            this.evtHandler.addEventListener('change', function (value) {
                _this.checkIfInputValid(value);
            });
        }
    };
    return InputModalElement;
}(HTMLElement));
export default InputModalElement;
window.customElements.define('input-modal', InputModalElement);
