import _ from 'lodash';

const spinner = {
    created(){
        this.counter = new Counter();
    },
    methods: {
        start(name){
            this.counter.increment(name);
            this[name] = true;
        },
        stop(name){
            this.counter.decrement(name);
            if(this.counter.value(name) === 0){
                this[name] = false;
            }
        }
    }
};
class Counter{
    constructor(){
        this.counters = {};
    }

    increment(name){
        if(! _.has(this.counters, name)){
            this.counters[name] = 0;
        }
        this.counters[name] = this.counters[name] + 1;
        return this;
    }

    decrement(name){
        if(! _.has(this.counters, name) || this.counters[name] === 0){
            this.counters[name] = 0;
            return this;
        }
        this.counters[name] = this.counters[name] - 1;
    }

    value(name){
        return this.counters[name];
    }
}


export default spinner;
