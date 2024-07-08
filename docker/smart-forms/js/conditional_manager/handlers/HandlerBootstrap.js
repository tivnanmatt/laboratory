require('./SfConditionalHandlerBase');
require('./SfShowConditionalHandler');
require('./SfMkFieldInvalidHandler');
require('./SfShowStepHandler');
var SmartFormsConditionalHandlerArray = [];
function SmartFormsGetConditionalHandlerByType(handlerId, options) {
    var handlers = SmartFormsGetConditionalHandlerArray();
    for (var i = 0; i < handlers.length; i++) {
        if (handlers[i].id == handlerId) {
            return handlers[i].create(options);
        }
    }
    throw ('Invalid handler');
}
function SmartFormsGetConditionalHandlerArray() {
    SmartFormsConditionalHandlerArray = [
        { Label: "Show fields depending on a condition", id: "SfShowConditionalHandler", create: function (options) { return new SfShowConditionalHandler(options); }, ShouldShow: function (builder) { return true; } },
        { Label: "Make fields invalid depending on a condition", id: "SfMkFieldInvalidHandler", create: function (options) { return new SfMkFieldInvalidHandler(options); }, ShouldShow: function (builder) { return true; } },
        { Label: "Show a multiple step tab depending on a condition", id: "SfShowStepHandler", create: function (options) { return new SfShowStepHandler(options); }, ShouldShow: function (builder) { return builder.FormType == "sec"; } },
    ];
    return SmartFormsConditionalHandlerArray;
}
function SmartFormsCalculateCondition(condition, values, instance, current) {
    if (current === void 0) { current = null; }
    var compiledCondition = condition.CompiledCondition;
    if (typeof condition.Mode != 'undefined' && condition.Mode == 'Formula')
        compiledCondition = condition.Formula.CompiledFormula;
    var Remote = null;
    if (instance == null)
        Remote = new SmartFormsRemote();
    else
        Remote = instance.GetRemote();
    condition = new Function('formData,Remote,current', 'return ' + compiledCondition);
    return condition(values, Remote, current != null ? current : (instance == null ? null : instance.FormElement));
}
RedNaoEventManager.Subscribe('CalculateCondition', function (data) { return SmartFormsCalculateCondition(data.Condition, data.Values, data.Instance, data.Current != null ? data.Current : null); });
window.SmartFormsGetConditionalHandlerByType = SmartFormsGetConditionalHandlerByType;
window.SmartFormsGetConditionalHandlerArray = SmartFormsGetConditionalHandlerArray;
window.SmartFormsCalculateCondition = SmartFormsCalculateCondition;
//# sourceMappingURL=HandlerBootstrap.js.map