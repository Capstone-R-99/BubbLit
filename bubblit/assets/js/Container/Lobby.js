import Lobby from '../Component/Lobby'
import { connect } from 'react-redux'

function mapReduxStateToReactProps(state) {
    return {
        roomList: state.roomList
    }
}

function mapReduxDispatchToReactProps(dispatch) {
    return {
        enterRoom: function (title, roomlist) {
            dispatch({ type: 'ENTER_CHAT', title: title, roomlist: roomlist })
        refreshRoomList: function (room_list) {
            dispatch({ type: 'REFRESH_ROOM_LIST', room_list: room_list })
        }
    }
}

export default connect(mapReduxStateToReactProps, mapReduxDispatchToReactProps)(Lobby);