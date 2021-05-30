import React from 'react';
import Scene from './three/ThreeScene';
import '../index.scss';

class App extends React.Component {
    render() {
        return (
            <div>
                <Scene/>
            </div>
        )
    }
}

export default App;