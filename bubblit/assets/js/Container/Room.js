import Room from '../Component/Room'
import { connect } from 'react-redux'

function mapReduxStateToReactProps(state) {
    return {
        chatRoom: state.chatRoom,
        chatDB: state.chatDB
    }
}

function mapReduxDispatchToReactProps(dispatch) {
    return {
        onClick: function (data, id, time) {
            dispatch({ type: 'CHAT', data: data, id: id, time: time });
        },
        exitRoom: function () {
            dispatch({ type: 'EXIT' });
        }
    }
}

export default connect(mapReduxStateToReactProps, mapReduxDispatchToReactProps)(Room);