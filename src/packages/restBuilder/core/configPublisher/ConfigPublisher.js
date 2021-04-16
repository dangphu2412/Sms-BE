/**
 * @notes
 - Add an instance which contain receive method()
 - When we finish config and call publish it will send all the data to listeners
 */
export class ConfigPublisher {
    context = null;

    listListener = [];

    addListener(listener) {
        this.listListener.push(listener);
        return this;
    }

    config(config) {
        this.context = config;
        this.publish();
        return this;
    }

    publish() {
        this.listListener.forEach(item => {
            item.receive(this.context);
        });
        return this;
    }
}
