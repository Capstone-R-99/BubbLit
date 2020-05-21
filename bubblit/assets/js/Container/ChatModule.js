import ChatModule from '../Component/ChatModule'
import { connect } from 'react-redux'

function mapReduxStateToReactProps(state) {
    return {
        channel: state.channel,
        userName: state.userName,
        history: state.history,
        current_room_id: state.current_room_id,
        roomInfo: state.roomInfo,
    }
}

function mapReduxDispatchToReactProps(dispatch) {
    return {
        exitRoom: function (channel) {
            //channel.push('new_msg', { body: '테스트 메세지임니담' });
            // ok일때는 정상적으로 끝난 거니까 놔두고, 에러일때만 콘솔로그 띄우도록 했음. 
            channel.leave().receive('error', () => console.log('error occured!'));
            dispatch({ type: 'EXIT' })
        },
        sendChat: function (channel, msg) {
            channel.push('new_msg', { body: msg });
        },
        appendHistory: function (new_history) {
            dispatch({ type: 'INSERT_HISTORY', history: new_history });
        },
        setHistory: function (payload) {
            dispatch({ type: 'SET_HISTORY', history: payload })
        },

        // 리팩토링된 함수
        addMessage: function (user_id, body) {
            dispatch({
                type: 'ADD_MESSAGE',
                user_id: user_id,
                body: body,
            })
        },
        userJoin: function (user_id, user_name) {
            dispatch({ type: 'USER_JOIN', user_id: user_id, user_name: user_name })
        },

    }
}

export default connect(mapReduxStateToReactProps, mapReduxDispatchToReactProps)(ChatModule);