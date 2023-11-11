import Sidebar from "../sidebar"
import ChatArea from "./chat_area"

const ChatContainer = () => {

    return (
        <section className="chat-container main-section">
            <Sidebar />
            <ChatArea />
        </section>
    )
}

export default ChatContainer