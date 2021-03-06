import React, {Component} from 'react';

import bulletTrain from './bullet-train';
const environmentID = "QjgYur4LQTwe5HpvbvhpzK";

//Define default flags

export default class App extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            isLoading: true,
            logs: []
        };
    }

    componentWillMount() {
        const {handleFlags, handleFlagsError} = this;
        bulletTrain.init({
            environmentID,
            onChange: handleFlags,
            onError: handleFlagsError,
            defaultFlags: {
                default_feature: true,
                font_size: 12,
            }
        });
        bulletTrain.startListening(2000)

    }

    logout = () => {
        bulletTrain.logout();
        this.forceUpdate();
    };

    login = () => {
        bulletTrain.identify("bullet_train_sample_user");
        this.forceUpdate();
    };

    render() {

        const fontSize = parseInt(bulletTrain.getValue("font_size"));
        const {isLoading, logs} = this.state;
        return isLoading ? <div>Loading</div> : (
            <div>
                <h2>{environmentID}</h2>
                <p style={{fontSize}}>
                    {JSON.stringify(bulletTrain.flags)}
                </p>
                <h3>
                    Events
                </h3>
                {bulletTrain.identity ? (
                    <button onClick={this.logout}>
                        logout
                    </button>
                ) : <button onClick={this.login}>
                    Login as sample user
                </button>}
                {logs.map(({timestamp, data, params, oldData},i) => (
                    <p key={i}>
                        {timestamp}: {data} {params} {oldData}
                    </p>
                ))}
            </div>
        );
    }

    handleFlags = (oldFlags, params) => {
        this.setState({
            ...params,
            isLoading: false,
            logs: [{
                timestamp: new Date().toDateString(),
                params: JSON.stringify(params),
                oldData: JSON.stringify(oldFlags),
                data: JSON.stringify(bulletTrain.getAllFlags())
            }].concat(this.state.logs)
        });
    };
    handleFlagsError = (data) => {

    };


}
