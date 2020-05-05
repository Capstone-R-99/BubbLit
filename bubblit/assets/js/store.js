import { createStore } from 'redux'
import socket from './Component/socket'

function GetRoomById(roomList, roomId) {
    var findLambda = (room) => {
        return room.id == roomId
    };

    return roomList.find(findLambda);
}

export default createStore(function (state, action) {
    if (state === undefined) {
        state = {
            // 초기화할때 소켓을 생성만 해둠, 밑에 ENTER_CHAT 이벤트때 전달받은 세부 정보로 소켓을 connect함
            socket: socket,
            // 채널은 아래의 'ENTER_CHAT' dispatch때 생성해줌
            channel: '',
            mode: 'lobby',
            userName: 'kynel',

            // { id: 0, title: '1st Room', host: 'kynel', isPrivate: 'O', limit: 10, current: 6 },
            roomList: [],
            current_room_id: 0, 

            //ChatModule
            contents: [[], [], [], [], [], []],
            participants: [],
        }
        return state;
    }
    if (action.type === 'ENTER_CHAT') {
        // 아래 코드에서 socket을 연결시키고, 방에 들어감과 동시에 channel에 접속시켜준다.
        // socket component 에서도 connect 하는데,,, 두번 해주는거같음. 방 전환할때 꼭 필요한지 확인 필요.
        state.socket.connect();
        var room = GetRoomById(state.roomList, action.room_id)
        return {
            ...state,
            current_room_id: action.room_id,
            mode: room.title,
            channel: state.socket.channel('room:' + room.id, { nickname: state.userName })
        }
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
