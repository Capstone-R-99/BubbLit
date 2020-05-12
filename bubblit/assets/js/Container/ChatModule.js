import ChatModule from '../Component/ChatModule'
import { connect } from 'react-redux'

function mapReduxStateToReactProps(state) {
    return {
        channel: state.channel,
        userName: state.userName,
        users: state.users,
        contents: state.contents,
        participants: state.participants,
        history: state.history,
        current_room_id: state.current_room_id
    }
}

function mapReduxDispatchToReactProps(dispatch) {
    return {
        sendChanges: function (changes) {
            dispatch({ type: 'CHAT', contents: changes.contents, participants: changes.participants, users: changes.users })
        },
        exitRoom: function (channel) {
            //channel.push('new_msg', { body: '테스트 메세지임니담' });
            // ok일때는 정상적으로 끝난 거니까 놔두고, 에러일때만 콘솔로그 띄우도록 했음. 
            channel.leave().receive('error', () => console.log('error occured!'));
            dispatch({ type: 'EXIT' })
        },
        sendChat: function (channel, msg) {
            channel.push('new_msg', { body: msg });
        },
        setHistory: function (history) {
            dispatch({ type: 'SET_HISTORY', history: history });
        },
        appendHistory: function (new_history) {
            dispatch({ type: 'INSERT_HISTORY', history: new_history });
        },
        enterRoom: function (room_id) {
            dispatch({ type: 'ENTER_CHAT', room_id: room_id })
        }
    }
}

export default connect(mapReduxStateToReactProps, mapReduxDispatchToReactProps)(ChatModule);