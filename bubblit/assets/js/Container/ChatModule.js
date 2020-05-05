import ChatModule from '../Component/ChatModule'
import { connect } from 'react-redux'

function mapReduxStateToReactProps(state) {
    return {
        channel: state.channel,
        userName: state.userName,
        users: state.users,
        contents: state.contents,
        participants: state.participants,
    }
}

function mapReduxDispatchToReactProps(dispatch) {
    return {
        sendChanges: function (changes) {
            dispatch({ type: 'CHAT', contents: changes.contents, participants: changes.participants, users: changes.users })
        },
        exitRoom: function (channel) {
            //channel.push('new_msg', { body: '테스트 메세지임니담' });
            channel.leave().receive('ok', () => alert('left channel'));
            dispatch({ type: 'EXIT' })
        },
        sendChat: function (channel, msg) {
            channel.push('new_msg', { body: msg });
        }
    }
}

export default connect(mapReduxStateToReactProps, mapReduxDispatchToReactProps)(ChatModule);