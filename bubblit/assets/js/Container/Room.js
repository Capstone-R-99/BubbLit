import Room from '../Component/Room'
import { connect } from 'react-redux'

function mapReduxStateToReactProps(state) {
    return {
        chatRoom: state.chatRoom,
        chatDB: state.chatDB,
        channel: state.channel,
        userName: state.userName,
        history: state.history,
        current_room_id: state.current_room_id,
        roomInfo: state.roomInfo,
        userId: state.userId
    }
}

function mapReduxDispatchToReactProps(dispatch) {
    return {
        exitRoom: function () {
            dispatch({ type: 'EXIT' });
        },
        enterRoom: function (room_id) {
            dispatch({ type: 'ENTER_ROOM', room_id: room_id })
        },
        setHistory: function (payload) {
            dispatch({ type: 'SET_HISTORY', history: payload })
        },
        addMessage: function (user_id, body) {
            dispatch({
                type: 'ADD_MESSAGE',
                user_id: user_id,
                body: body,
            })
        },
        initializeRoomHistory: function (payload) {
            dispatch({
                type: 'INITIALIZE_ROOM_INFO',
                bubble_history: payload['bubble_history'],
                room_users: payload['room_users'],
                tab_action_history: payload['tab_action_history'],
                users: payload['users'],
                room_title: payload['room_title'],
                host_user: payload['host_user']
            });
        },
        userJoin: function (user_id, user_name) {
            dispatch({ type: 'USER_JOIN', user_id: user_id, user_name: user_name })
        },
        userQuit: function (user_id) {
            dispatch({ type: 'USER_QUIT', user_id: user_id })
        },
        updatePresences: function (presences) {
            dispatch({ type: 'PRESENCE_UPDATE', presences: presences })
        }

    }
}

export default connect(mapReduxStateToReactProps, mapReduxDispatchToReactProps)(Room);