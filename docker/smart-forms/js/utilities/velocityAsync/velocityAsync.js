rnJQuery.fn.velocityAsync=function(params,duration,easing)
{
    self=this;
    return new Promise(function(resolve){
        rnJQuery(self).velocity(params,duration,easing,resolve);
    });
};
