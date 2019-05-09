class EventEmitter {
    eventMap: {
        [prop: string]: Function[]
    }

    constructor() {
        this.eventMap = {}
    }

    on(event: string, cb: Function) {
        if (!this.eventMap[event]) {
            this.eventMap[event] = []
        }

        this.eventMap[event].push(cb)
    }

    emit(event: string, params: any) {
        if (!Array.isArray(this.eventMap[event])) {
            return
        }

        this.eventMap[event].forEach((handler: Function) => {
            handler.call(this, params)
        })
    }

}

export default EventEmitter
