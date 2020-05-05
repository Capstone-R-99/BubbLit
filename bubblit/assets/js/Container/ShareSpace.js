import ShareSpace from '../Component/ShareSpace'
import { connect } from 'react-redux'

function mapReduxStateToReactProps(state) {
    return {
        current_room_id: state.current_room_id,
        channel: state.channel
    }
}

function mapReduxDispatchToReactProps(dispatch) {
    return {
        // enterRoom: function (room_id) {
        //     dispatch({ type: 'ENTER_CHAT', room_id: room_id })
        // },
    }
}

export default connect(mapReduxStateToReactProps, mapReduxDispatchToReactProps)(ShareSpace);