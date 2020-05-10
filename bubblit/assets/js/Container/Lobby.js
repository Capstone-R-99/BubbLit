import Lobby from '../Component/Lobby'
import { connect } from 'react-redux'

function mapReduxStateToReactProps(state) {
    return {
        roomList: state.roomList,
        userName: state.userName
    }
}

function mapReduxDispatchToReactProps(dispatch) {
    return {
        enterRoom: function (room_id) {
            dispatch({ type: 'ENTER_CHAT', room_id: room_id })
        },
        refreshRoomList: function (room_list) {
            dispatch({ type: 'REFRESH_ROOM_LIST', room_list: room_list })
        },
        setUserName: function (userName) {
            dispatch({ type: 'SET_USER_NAME', userName: userName })
        }
    }
}

export default connect(mapReduxStateToReactProps, mapReduxDispatchToReactProps)(Lobby);