import { createStore } from 'redux'
import socket from './Component/socket'

function concatToRoomUsers(roomUsers, user_id) {
    let notInRoomUsers = (roomUsers.includes(user_id) == false);

    if (notInRoomUsers) {
        console.log("new room user", user_id, "added for", roomUsers)
        return roomUsers.concat(user_id)
    }

    return roomUsers
}

function addMessageInChanges(changes, user_id, msg) {
    let find_user_id = (element) => {
        return element == user_id
    }

    if (msg == null) {
        return;
    }
    let user_idx = changes.participants.findIndex(find_user_id)
    let modified_contents = changes.contents;

    if (modified_contents[user_idx] == undefined) {
        console.log("ignore no participants msg", user_id, msg)
        return;
    }
    changes.contents[user_idx] = modified_contents[user_idx].concat(msg)

    return changes;
}

function addMessageInBubbleHistory(bubble_history, bubble_log) {
    let user_id = bubble_log.user_id

    if (user_id in bubble_history === false) {
        bubble_history[user_id] = [];
    }

    bubble_history[user_id] = bubble_history[user_id].concat(bubble_log);
}

const default_socket = socket;

const init_state = {
    // 초기화할때 소켓을 생성만 해둠, 밑에 SET_ROOM_ID 이벤트때 전달받은 세부 정보로 소켓을 connect함
    socket: default_socket,
    // 채널은 아래의 'SET_ROOM_ID' dispatch때 생성해줌
    channel: '',
    userName: '',
    userId: 0,
    roomList: [],
    current_room_id: 0,
    users: '',
    //ChatModule
    history: {},
    contents: [[], [], [], [], [], []],
    participants: [],

    //리팩토링 완료되면 밑의 history 사용
    roomInfo: {
        bubble_history: [],
        tab_action_history: [],
        room_users: [], // 방에 현재 들어와 있는 유저들의 목록
        users: [], // 방에 들어온 적이 있는(지금 방에서 없을수도 있음)
        room_title: '',
        chat_timeline: [], // bubble_history -> 시간순 정렬, ShareSpace의 LogPannel로 전달됨
        host_user: ''
    },
}

//리팩토링 이후 삭제
const room_init_state = {
    current_room_id: 0,
    history: {},

    //
    contents: [[], [], [], [], [], []],
    participants: []
}

export default createStore(function (state, action) {
    if (state === undefined) {
        return { ...init_state };
    }
    if (action.type === 'SET_ROOM_ID') {
        // 아래 코드에서 socket을 연결시키고, 방에 들어감과 동시에 channel에 접속시켜준다.
        state = { ...state, ...room_init_state }
        state.socket.connect();
        return {
            ...state,
            current_room_id: action.room_id,
        }
    }
    if (action.type === 'ENTER_ROOM') {
        return {
            ...state,
            channel: state.socket.channel('room:' + action.room_id, { nickname: state.userName })
        }
    }
    if (action.type === 'REFRESH_ROOM_LIST') {
        //channel 구독해지 및 state 초기화
        return { ...state, roomList: action.room_list }
    }
    if (action.type === 'EXIT') {
        //channel 구독해지 및 state 초기화
        state.channel.leave()
        return { ...state, contents: [[], [], [], [], []], participants: [] }
    }
    if (action.type === 'SET_HISTORY') {
        //history 값을 변경
        return { ...state, history: action.history }
    }

    if (action.type === 'SET_USER_DATA') {
        return { ...state, userName: action.userName, userId: action.userId }
    }

    // 리팩토링됨
    if (action.type === 'ADD_MESSAGE') {
        let bubble_history = state.roomInfo.bubble_history;
        let chat_timeline = state.roomInfo.chat_timeline;
        let currentTime = new Date().toISOString();
        // [TODO] 여기에는 시간정보가 없어서, 갱신 불가능.
        // 백엔드에서 시간 정보를 받아오지 않고, 내가 받은 시점 기준으로 시간을 넣어준다.
        let new_bubble_log = { user_id: action.user_id, content: action.body, inserted_at: currentTime }

        addMessageInBubbleHistory(bubble_history, new_bubble_log)

        // roomInfo.chat_timeline에 최근 메세지를 넣어줌()
        chat_timeline = chat_timeline.concat(new_bubble_log);

        return { ...state, roomInfo: { ...state.roomInfo, bubble_history: bubble_history, chat_timeline: chat_timeline } }
    }

    if (action.type === 'INITIALIZE_ROOM_INFO') {
        let modifiedRoomInfo = {};
        let init_bubble_history = {};

        action.bubble_history.forEach(element => {
            addMessageInBubbleHistory(init_bubble_history, element)
        })
        console.log('방정보받은거')
        console.dir(action)
        modifiedRoomInfo.bubble_history = init_bubble_history;
        modifiedRoomInfo.tab_action_history = action.tab_action_history;
        modifiedRoomInfo.room_users = action.room_users;
        modifiedRoomInfo.users = action.users;
        modifiedRoomInfo.room_title = action.room_title;
        modifiedRoomInfo.chat_timeline = action.bubble_history.reverse(); //로그 기능에서 사용을 위해 reverse 해줌
        modifiedRoomInfo.host_user = action.host_user

        return { ...state, roomInfo: modifiedRoomInfo }
    }
    if (action.type === 'USER_JOIN') {
        let users = { ...state.roomInfo.users }
        users[action.user_id] = { id: action.user_id, name: action.user_name };

        let room_users = concatToRoomUsers(state.roomInfo.room_users, action.user_id)

        return {
            ...state, roomInfo: {
                ...state.roomInfo, users: users, room_users: room_users
            }
        }
    }


}, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
