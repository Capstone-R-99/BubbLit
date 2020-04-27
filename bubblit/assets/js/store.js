import { createStore } from 'redux'
import { Socket } from 'phoenix'
export default createStore(function (state, action) {
    if (state === undefined) {
        state = {
            // 초기화할때 소켓을 생성만 해둠, 밑에 ENTER_CHAT 이벤트때 전달받은 세부 정보로 소켓을 connect함
            socket: new Socket('/socket', { params: { token: window.userToken } }),
            // 채널은 아래의 'ENTER_CHAT' dispatch때 생성해줌
            channel: '',
            mode: 'lobby',
            userName: 'kynel',

            roomList: [
                { id: 0, title: '1st Room', host: 'kynel', isPrivate: 'O', limit: 10, current: 6 },
                { id: 1, title: '2st Room', host: 'REA', isPrivate: 'X', limit: 12, current: 2 },
                { id: 2, title: '3st Room', host: 'Ano', isPrivate: 'O', limit: 3, current: 3 },
                { id: 3, title: '4st Room', host: 'kynel', isPrivate: 'X', limit: 2, current: 2 },
                { id: 4, title: '5st Room', host: 'REA', isPrivate: 'X', limit: 3, current: 1 },
            ],

            //ChatModule
            contents: [[], [], [], [], [], []],
            participants: [],
        }
        return state;
    }
    if (action.type === 'ENTER_CHAT') {
        // 아래 코드에서 socket을 연결시키고, 방에 들어감과 동시에 channel에 접속시켜준다.
        state.socket.connect();
        return { ...state, roomList: action.roomlist, mode: action.title, channel: state.socket.channel('room:' + action.title, { nickname: state.userName }) }
    }
    if (action.type === 'CHAT') {
        return { ...state, contents: action.contents, participants: action.participants }
    }
    if (action.type === 'REFRESH_ROOM_LIST') {
        //channel 구독해지 및 state 초기화
        return { ...state, roomList: action.room_list }
    }
    if (action.type === 'EXIT') {
        //channel 구독해지 및 state 초기화
        return { ...state, mode: 'lobby', channel: '', contents: [[], [], [], [], []], participants: [] }
    }
}, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
