declare let wp:any;
declare let smartformsblockvars;
let React=wp.element;
import './SFFormSelector.css';
const { createElement } = wp.element;
const { registerBlockType } = wp.blocks;
const { InspectorControls } = wp.editor;
const { SelectControl, ToggleControl, PanelBody, ServerSideRender, Placeholder,Spinner } = wp.components;
registerBlockType( 'smartforms/sfform-selector', {
    title: "Smart Forms",
    description: "Add a form to your page",
    icon: 'welcome-add-page',
    keywords: [ ( 'form' ) ],
    category: 'widgets',
    attributes: {
        formId: {
            type: 'string',
        }
    },
    edit( props ) {
       return React.createElement(FormPreview,{formId:props.attributes.formId,setAttributes:props.setAttributes})

    },
    save() {
        return null;
    },
} );

class FormPreview extends React.Component<any,any>{
    public props:{formId:any,setAttributes:(object:any)=>void};
    public context:any;
    public state:{
        status:'empty'|'loading'|'loaded'
        formId:string;
    };


    constructor(props:any,context:any){
        super(props,context);

        this.state={
            status:this.GetStatus(props,''),
            formId:props.formId
        }



    }

    public GetStatus(props:any,formId:string):'empty'|'loading'|'loaded'{
        if(props.formId==''||props.formId==null||props.formId=='0')
            return 'empty';

        if(props.formId!=formId)
            return 'loading';

        return 'loaded';
    }

    public render(){
        return[
            <InspectorControls key="smartforms-selector">
                <PanelBody title={ 'Smart Forms Configuration' }>
                    <SelectControl
                        label={ "Please select a form" }
                        value={ this.props.formId }
                        options={[{label:'Please select a form',value:''}].concat(smartformsblockvars.forms)}
                        onChange={(e)=>this.formChanged(e)}
                    />
                </PanelBody>
            </InspectorControls>,

            <Placeholder key={'smartforms-placeholder'} className={'smartforms-block-panel'}>
                <img src={smartformsblockvars.rootUrl+'images/logo_block.png'}/>
                <SelectControl
                    style={{width:'100%'}}
                    placeholder={'Select a form'}
                    label={ "" }
                    value={ this.props.formId }
                    options={ [{label:'Please select a form',value:''}].concat(smartformsblockvars.forms)}
                    onChange={ (e)=>this.formChanged(e)}
                />
            </Placeholder>



        ]
    }

    public formChanged(value)
    {
        this.props.setAttributes({formId:value});
    }


    private FormSelected() {
        alert('form Selected');
    }

    private IframeLoaded(node) {
        console.log(node)
    }

    private GetFormPlaceholder() {
        if(this.state.status=="loading"||this.state.status=='loaded')
        {
            return (
                [
                    this.state.status=='loading'&&
                <Placeholder key={'smartforms-placeholder'} className={'smartforms-block-panel'}>
                    <div style={{display:'flex',flexDirection:'column',alignItems:'center'}}>
                        <Spinner/>
                        <h2 style={{margin:5}}>Loading form please wait...</h2>
                    </div>
                </Placeholder>,
                    <iframe style={{visibility:this.state.status=='loading'?'collapse':'visible'}} data-formId={this.state.formId} ref={(node)=>this.IframeComponentLoaded(node)} src={ajaxurl+'?action=rednao_smart_forms_block_preview&nonce='+smartformsblockvars.nonce+'&formid='+this.props.formId}></iframe>
                ]

            )
        }
    }

    private IframeComponentLoaded(node: HTMLIFrameElement) {
        if(node==null)
            return;
        node.addEventListener('load',()=>{
            if(this.state.formId==node.getAttribute('data-formId'))
            {
                this.setState({
                    status:'loaded'
                })
            }
        });
    }
}

declare let ajaxurl;
