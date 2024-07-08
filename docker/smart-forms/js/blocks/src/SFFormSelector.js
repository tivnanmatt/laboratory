"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let React = wp.element;
require("./SFFormSelector.css");
const { createElement } = wp.element;
const { registerBlockType } = wp.blocks;
const { InspectorControls } = wp.editor;
const { SelectControl, ToggleControl, PanelBody, ServerSideRender, Placeholder, Spinner } = wp.components;
registerBlockType('smartforms/sfform-selector', {
    title: "Smart Forms",
    description: "Add a form to your page",
    icon: 'welcome-add-page',
    keywords: [('form')],
    category: 'widgets',
    attributes: {
        formId: {
            type: 'string',
        }
    },
    edit(props) {
        return React.createElement(FormPreview, { formId: props.attributes.formId, setAttributes: props.setAttributes });
    },
    save() {
        return null;
    },
});
class FormPreview extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            status: this.GetStatus(props, ''),
            formId: props.formId
        };
    }
    GetStatus(props, formId) {
        if (props.formId == '' || props.formId == null || props.formId == '0')
            return 'empty';
        if (props.formId != formId)
            return 'loading';
        return 'loaded';
    }
    render() {
        return [
            React.createElement(InspectorControls, { key: "smartforms-selector" },
                React.createElement(PanelBody, { title: 'Smart Forms Configuration' },
                    React.createElement(SelectControl, { label: "Please select a form", value: this.props.formId, options: [{ label: 'Please select a form', value: '' }].concat(smartformsblockvars.forms), onChange: (e) => this.formChanged(e) }))),
            React.createElement(Placeholder, { key: 'smartforms-placeholder', className: 'smartforms-block-panel' },
                React.createElement("img", { src: smartformsblockvars.rootUrl + 'images/logo_block.png' }),
                React.createElement(SelectControl, { style: { width: '100%' }, placeholder: 'Select a form', label: "", value: this.props.formId, options: [{ label: 'Please select a form', value: '' }].concat(smartformsblockvars.forms), onChange: (e) => this.formChanged(e) }))
        ];
    }
    formChanged(value) {
        this.props.setAttributes({ formId: value });
    }
    FormSelected() {
        alert('form Selected');
    }
    IframeLoaded(node) {
        console.log(node);
    }
    GetFormPlaceholder() {
        if (this.state.status == "loading" || this.state.status == 'loaded') {
            return ([
                this.state.status == 'loading' &&
                    React.createElement(Placeholder, { key: 'smartforms-placeholder', className: 'smartforms-block-panel' },
                        React.createElement("div", { style: { display: 'flex', flexDirection: 'column', alignItems: 'center' } },
                            React.createElement(Spinner, null),
                            React.createElement("h2", { style: { margin: 5 } }, "Loading form please wait..."))),
                React.createElement("iframe", { style: { visibility: this.state.status == 'loading' ? 'collapse' : 'visible' }, "data-formId": this.state.formId, ref: (node) => this.IframeComponentLoaded(node), src: ajaxurl + '?action=rednao_smart_forms_block_preview&nonce=' + smartformsblockvars.nonce + '&formid=' + this.props.formId })
            ]);
        }
    }
    IframeComponentLoaded(node) {
        if (node == null)
            return;
        node.addEventListener('load', () => {
            if (this.state.formId == node.getAttribute('data-formId')) {
                this.setState({
                    status: 'loaded'
                });
            }
        });
    }
}
//# sourceMappingURL=SFFormSelector.js.map