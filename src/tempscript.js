var x
console.log(x)
addStuff(x,5);
x = {test:'this'};
addStuff(x,10);
x = [{test:'map',ramp:'cap'}];
addStuff(x,15);

function addStuff(item, adding){
    if(typeof item === 'undefined'){
        console.log('it is empty')

    } else if (item.length){
        console.log('it is a list ')

    } else {
        console.log('it is an object ')

    }
}