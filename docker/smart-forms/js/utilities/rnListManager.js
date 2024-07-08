function RNListManager($list,options)
{
    this.$List=$list;
    if(options==null)
        options={
            Items:[]
        };

    this.SelectedItem=null;
    if(typeof options.Items=='undefined')
        options.Items=[];

    if(typeof options.ItemCreated=='undefined')
    {
        options.ItemCreated=function(item){};
    }

    if(typeof options.ItemSelected=='undefined')
    {
        options.ItemSelected=function(item){};
    }

    if(typeof options.Clear=='undefined')
    {
        options.Clear=function(){};
    }

    if(typeof options.ItemUpdated=='undefined')
        options.ItemUpdated=function(item){};

    if(typeof options.CreationLabel=='undefined')
        this.CreationLabel='Click here to create a new item';
    else
        this.CreationLabel=options.CreationLabel;

    this.FireItemCreated=options.ItemCreated;
    this.FireItemSelected=options.ItemSelected;
    this.FireItemUpdated=options.ItemUpdated;
    this.FireClear=options.Clear;

    this.Items=options.Items;
    this.InitializeList();

}

RNListManager.prototype.InitializeList=function()
{
    this.$List.empty();
    this.$List.addClass('list-group').addClass('rnListManager');
    for(var i=0;i<this.Items.length;i++)
    {
        this.AddItemToUIList(this.Items[i]);
    }
    this.AddCreateItemButton();
    /*this.CreateItem('test');
    this.CreateItem('test2');*/
};

RNListManager.prototype.AddCreateItemButton=function()
{
    var $createItem=rnJQuery('<a href="#" class="list-group-item rnListCreateButton" ><span style="color:green" class="glyphicon glyphicon-plus"></span>'+this.CreationLabel+'</a>');
    var self=this;
    $createItem.click(function(){self.StartEdition(rnJQuery(this),null)});//it is important to pass this instead of $createItem
    this.$List.append($createItem);
};

RNListManager.prototype.CreateItem=function(itemName)
{
    var createdItem={
        Name:itemName,
        Id:this.GetNextId()
    };
    this.Items.push(createdItem);
    var $createdItem=this.AddItemToUIList(createdItem,null);
    if(this.SelectedItem!=null)
    {
        this.FireItemUpdated(this.SelectedItem);
        this.SelectedItem=null;
    }
    this.FireItemCreated(createdItem);
    $createdItem.click();
    return createdItem;
};

RNListManager.prototype.SelectItem=function(item)
{
    var index=this.Items.indexOf(item);
    if(index>=0)
    {
        this.$List.find('.rnListManagerItemSelected').removeClass('rnListManagerItemSelected');
        this.$List.find('a:nth-child('+(index+1)+')').addClass('rnListManagerItemSelected');
        this.InternalFireItemSelected(item);
    }

};

RNListManager.prototype.GetItems=function()
{
    this.Commit();
    return this.Items;
};

RNListManager.prototype.InternalFireItemSelected=function(item)
{
    if(this.SelectedItem!=null)
    {
        this.FireItemUpdated(this.SelectedItem);
    }
    this.FireItemSelected(item);
    this.SelectedItem=item;
};

RNListManager.prototype.Commit=function()
{
    if(this.SelectedItem!=null)
    {
        this.FireItemUpdated(this.SelectedItem);
    }
};

RNListManager.prototype.AddItem=function(item)
{
    if(typeof item.Id=='undefined')
        item.Id=this.GetNextId();

    this.Items.push(item);
    var $container=rnJQuery('<div></div>');
    if(this.$List.find('.rnListCreateButton').length>0)
        this.$List.find('.rnListCreateButton').before($container);
    else
        this.$List.append($container);
    var $createdItem=this.AddItemToUIList(item,$container);
    $createdItem.click();
    return item;
};

RNListManager.prototype.AddItemToUIList=function(item,container)
{
    var $item=rnJQuery( '<a href="#" class="list-group-item" >'+RedNaoEscapeHtml(item.Name)+
                                        '<span class="glyphicon glyphicon-pencil rnListItemUpdate" title="Update" style="float:right;;margin-left:5px;display: none;" ></span>' +
                                        '<span class="glyphicon glyphicon-trash rnListItemDelete" title="Delete" style="float:right;display: none;"></span>' +
                        '</a>');
    var self=this;

    var $updateButton=$item.find('.rnListItemUpdate');
    $updateButton.mouseenter(function(){$updateButton.css('color','red');})
                 .mouseleave(function(){$updateButton.css('color','#555')})
                 .click(function(e){
                     e.stopPropagation();
                     self.StartEdition($item,item);
                 });

    var $deleteButton=$item.find('.rnListItemDelete');
    $deleteButton.mouseenter(function(){$deleteButton.css('color','red');})
                 .mouseleave(function(){$deleteButton.css('color','#555')})
                 .click(function(e){
                            e.stopPropagation();
                            rnJQuery.RNGetConfirmationDialog().ShowConfirmation(
                                '<span class="glyphicon glyphicon-trash"></span>Deleting '+RedNaoEscapeHtml(item.Name),'Are you sure you want to delete '+RedNaoEscapeHtml(item.Name)+'?',
                                function(){
                                    var itemIndex=self.Items.indexOf(item);
                                    self.Items.splice(itemIndex,1);
                                    $item.remove();
                                    if(item==self.SelectedItem)
                                    {
                                        self.SelectedItem=null;
                                        self.FireClear();
                                    }

                                });
                        });
    $item.mouseenter(function()
    {
        $item.find('.rnListItemUpdate,.rnListItemDelete').css('display','inline');
    });

    $item.mouseleave(function()
    {
        $item.find('.rnListItemUpdate,.rnListItemDelete').css('display','none');
    });

    $item.click(function(){
        self.$List.find('.rnListManagerItemSelected').removeClass('rnListManagerItemSelected');
        $item.addClass('rnListManagerItemSelected');
        self.InternalFireItemSelected(item);

    });

    if(container==null)
        this.$List.append($item);
    else{
        container.replaceWith($item);
    }

    return $item;
};

RNListManager.prototype.GetNextId=function()
{
    var maxId=0;
    for(var i=0;i<this.Items.length;i++)
        if(maxId<parseInt(this.Items[i].Id))
            maxId=this.Items[i].Id;

    return maxId+1;
};

RNListManager.prototype.StartEdition=function($container,currentItem)
{
    $originalContent=$container.clone(true,true);
    var $editContent=rnJQuery( '' +
        '<div class="list-group-item">' +
            '<input type="text" style="width: 90%;" value="'+(currentItem!=null?RedNaoEscapeHtml(currentItem.Name):'')+'"/>' +
            '<div style="width: 10%;display: inline">' +
                '<a href="#" class="sfAccept" title="Accept"><span class="glyphicon glyphicon-ok" style="color: green;margin-left:2px;"></span></a>' +
                '<a href="#" class="sfCancel" title="Cancel"><span class="glyphicon glyphicon-remove" style="color: red;margin-left:2px;"></span></a>' +
            '</div>' +
        '</div>');

    $container.replaceWith($editContent);
    $editContent.find('input').focus();
    $editContent.find('.sfCancel').click(function(e)
                                        {
                                            if(currentItem==null)
                                            {
                                                e.preventDefault();
                                                $editContent.replaceWith($originalContent);
                                            }else
                                            {
                                                self.AddItemToUIList(currentItem,$editContent);
                                            }
                                        });

    var self=this;
    $editContent.find('input').keypress(function(e)
    {
        if(e.which == 13) {
            $editContent.find('.sfAccept').click();
        }
    });
    $editContent.find('.sfAccept').click(function(e)
                                            {
                                                e.preventDefault();
                                                var selectedName=$editContent.find('input').val();
                                                if(rnJQuery.trim(selectedName)=='')
                                                    return;
                                                if(self.DoesNameAlreadyExists(selectedName,currentItem))
                                                    return;

                                                if(currentItem==null)
                                                {
                                                    $editContent.remove();
                                                    self.CreateItem(selectedName);
                                                    self.AddCreateItemButton();
                                                }else{
                                                    currentItem.Name=selectedName;
                                                    self.AddItemToUIList(currentItem,$editContent);
                                                }

                                            });
};

RNListManager.prototype.DoesNameAlreadyExists=function(itemName,editedItem)
{
    for(var i=0;i<this.Items.length;i++)
        if(this.Items[i].Name==itemName&&this.Items[i]!=editedItem)
            return true;

    return false;
};

rnJQuery.fn.RNList=function(options)
{
    return new RNListManager(this,options);
};