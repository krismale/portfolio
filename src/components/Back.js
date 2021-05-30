import React from 'react';
import {connect} from 'react-redux';
import {goBack} from '../actions';
import {animQueue, addAnim, popAnim} from '../three/threeAnim';

const onClick = (props) => {
    if(animQueue["moveCam"]) {
        popAnim("moveCam");
        props.camera.lerpAlpha = 0;
    }
    addAnim("moveCam", (delta) => {
        if(props.camera.moveToTarget(props.scene.camPos['initPos'], 0.4 * delta)) {
            popAnim("moveCam");
        }
    })
    props.goBack();
}
const BackBtn = (props) => {
    return (
        <div className="overlayBtn">
            <button className="ui labeled icon primary huge sticky button" onClick={(e) => {onClick(props)}}>
            <i className="angle left icon"></i>
                Back
            </button>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {scene: state.scene};
}
export default connect(mapStateToProps, {goBack})(BackBtn);