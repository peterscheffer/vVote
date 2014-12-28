/**
 * JsInject - Dependency Injection library.  From http://code.google.com/p/jsinject/
 * 
 */

JsInject = {};

JsInject.Container = function() { 
    this.serviceEntries = [];
    this.disposables = [];
};

JsInject.Container.prototype.Resolve = function(name, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9)
{
    return this.ResolveInternal(name, true, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9);
};

JsInject.Container.prototype.TryResolve = function(name, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9) 
{
    return this.ResolveInternal(name, false, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9);
};

JsInject.Container.prototype.RegisterInternal = function(name, factory, scope, owner) 
{
    if(this.RegisteredInternal(name))
    {
        throw "Factory with name '" + name + "' alredy registered";
    }
    
    this.serviceEntries[name] = {factory: factory, scope: scope, owner: owner, instance: null};
};

JsInject.Container.prototype.Dispose = function(name) 
{
    for (var x in this.disposables)
    {
        var obj = this.disposables[x];
        
        obj.Dispose();
    }
};

JsInject.Container.prototype.ResolveInternal = function(name, throwIfNotRegistered, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9) {
    if(!this.RegisteredInternal(name))
    {
        if(throwIfNotRegistered)
        {
            throw "Factory with name '" + name + "' is not registered";
        }
        else
        {
            return null;
        }
    }
    
    var entry = this.serviceEntries[name];  
    
    if(entry.scope === "container")
    {
        if(entry.instance === null)
        {
            entry.instance = this.CreateInstanceInternal(entry.factory, entry.owner, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9);
        }
        
        return entry.instance;
    }

    return this.CreateInstanceInternal(entry.factory, entry.owner, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9);
};

JsInject.Container.prototype.CreateInstanceInternal = function(factory, owner, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9) 
{
    var instance = factory(this, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9);
    
    if(owner === "container" && typeof(instance.Dispose) === "function")
    {
        this.disposables.push(instance);
    }
    
    return instance;
};

JsInject.Container.prototype.RegisteredInternal = function(name) 
{
	return this.serviceEntries[name] !== undefined;
};

// Factory registration
JsInject.Registration = function(name, factory) 
{ 
    this.name = name;
    this.factory = factory;
    this.scope = "none";
    this.owner = "consumer";
};

JsInject.Registration.prototype.Reused = function() 
{
    this.scope = "container";
    this.Owned();
    
    return this;
};

JsInject.Registration.prototype.Owned = function() 
{
    this.owner = "container";
    
    return this;
};

// Container Builder
JsInject.ContainerBuilder = function() { 
    this.registrations = [];
};

JsInject.ContainerBuilder.prototype.Register = function(name, factory) 
{
    var registration = new JsInject.Registration(name, factory);
    
    this.registrations.push(registration);
    
    return registration;
};

JsInject.ContainerBuilder.prototype.Create = function() 
{
    var container = new JsInject.Container();
    
    for (var x in this.registrations)
    {
        var registration = this.registrations[x];
        
        container.RegisterInternal(registration.name, registration.factory, registration.scope, registration.owner);
    }
    
    return container;
};